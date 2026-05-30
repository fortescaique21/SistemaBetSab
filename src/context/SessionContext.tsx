import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next'; // i18n hooks

export interface AnalysisResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  bestBet: { market: string; confidence: number };
  doubleChance: { market: string; confidence: number };
  markdownStats: string;
  createdAt: number;
}

export interface SessionSettings {
  theme: 'dark' | 'light';
  language: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  sessionStart: number;
}

interface SessionContextData {
  user: UserProfile;
  settings: SessionSettings;
  analyses: AnalysisResult[];
  favorites: string[];
  addAnalysis: (analysis: Omit<AnalysisResult, 'id' | 'createdAt'>) => Promise<string | undefined>;
  removeAnalysis: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  clearFavorites: () => Promise<void>;
  updateSettings: (newSettings: Partial<SessionSettings>) => Promise<void>;
  resetSession: () => void; 
}

const SessionContext = createContext<SessionContextData | undefined>(undefined);

const AVATAR_URLS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi'
];

// Helper para detectar tema do sistema
const getSystemTheme = (): 'dark' | 'light' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark'; // Padrão
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const [user] = useState<UserProfile>(() => {
    let localUserId = localStorage.getItem('sistemabet_user_id');
    if (!localUserId) {
      localUserId = crypto.randomUUID();
      localStorage.setItem('sistemabet_user_id', localUserId);
    }
    
    return {
      id: localUserId,
      name: `User_${localUserId.substring(0, 4)}`,
      avatarUrl: AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)],
      sessionStart: Date.now()
    };
  });

  const [settings, setSettings] = useState<SessionSettings>({
    theme: (localStorage.getItem('theme_pref') as 'dark'|'light') || getSystemTheme(),
    language: localStorage.getItem('i18nextLng') || 'pt-BR'
  });

  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. CARREGAR DADOS DO SUPABASE NO INÍCIO E SOBRESCREVER LOCAIS
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: settingsData } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsData) {
          const loadedTheme = settingsData.theme || settings.theme;
          const loadedLang = settingsData.language || settings.language;
          
          setSettings({
            theme: loadedTheme,
            language: loadedLang
          });

          // Sincronizar com sistema e dom local
          localStorage.setItem('theme_pref', loadedTheme);
          i18n.changeLanguage(loadedLang);

          if (settingsData.favorites) {
            setFavorites(settingsData.favorites);
          }
        }

        const { data: analysisData } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('createdAt', { ascending: false });

        if (analysisData && analysisData.length > 0) {
          const formatted = analysisData.map(row => ({
            id: row.id,
            homeTeam: row.homeTeam,
            awayTeam: row.awayTeam,
            bestBet: typeof row.bestBet === 'string' ? JSON.parse(row.bestBet) : row.bestBet,
            doubleChance: typeof row.doubleChance === 'string' ? JSON.parse(row.doubleChance) : row.doubleChance,
            markdownStats: row.markdownStats,
            createdAt: row.createdAt
          }));
          setAnalyses(formatted);
        }
      } catch (e) {
        console.error("Erro ao carregar Supabase. Usando Local/Defaults.");
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, [user.id, i18n]);

  // 2. APLICAR TEMA NO DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('theme_pref', settings.theme); // Salva para boot imediato
  }, [settings.theme]);

  // AÇÕES QUE SALVAM NO SUPABASE EM TEMPO REAL
  const addAnalysis = async (data: Omit<AnalysisResult, 'id' | 'createdAt'>) => {
    const newId = crypto.randomUUID();
    const newAnalysis: AnalysisResult = {
      ...data,
      id: newId,
      createdAt: Date.now()
    };
    
    setAnalyses(prev => [newAnalysis, ...prev]);

    try {
      await supabase.from('analyses').insert([{
        id: newId,
        user_id: user.id,
        homeTeam: newAnalysis.homeTeam,
        awayTeam: newAnalysis.awayTeam,
        bestBet: newAnalysis.bestBet,
        doubleChance: newAnalysis.doubleChance,
        markdownStats: newAnalysis.markdownStats,
        createdAt: newAnalysis.createdAt
      }]);
    } catch(err) {}
    
    return newId;
  };

  const removeAnalysis = async (id: string) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
    
    if (favorites.includes(id)) {
      const newFavs = favorites.filter(f => f !== id);
      setFavorites(newFavs);
      await saveFavorites(newFavs);
    }
    
    try {
      await supabase.from('analyses').delete().eq('id', id);
    } catch(e) {}
  };

  const toggleFavorite = async (id: string) => {
    let newFavorites: string[];
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fId => fId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };
  
  const saveFavorites = async (favArray: string[]) => {
    try {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        favorites: favArray,
        theme: settings.theme,
        language: settings.language
      }, { onConflict: 'user_id' });
    } catch(e) {}
  };

  const clearHistory = async () => {
    setAnalyses([]);
    setFavorites([]);
    try {
      await supabase.from('user_settings').update({ favorites: [] }).eq('user_id', user.id);
      await supabase.from('analyses').delete().eq('user_id', user.id);
    } catch(e) {}
  };

  const clearFavorites = async () => {
    setFavorites([]);
    await saveFavorites([]);
  };

  const updateSettings = async (partial: Partial<SessionSettings>) => {
    const nextSettings = { ...settings, ...partial };
    setSettings(nextSettings);
    
    // Troca idioma imediatamente no frontend
    if (partial.language) {
      i18n.changeLanguage(partial.language);
    }
    
    try {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        theme: nextSettings.theme,
        language: nextSettings.language,
        favorites: favorites
      }, { onConflict: 'user_id' });
    } catch(e) {
      console.warn("Não foi possivel salvar no Supabase as definições");
    }
  };

  const resetSession = () => {
    localStorage.removeItem('sistemabet_user_id');
    window.location.reload();
  };

  if (!isLoaded) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sincronizando Sessão...</div>;
  }

  return (
    <SessionContext.Provider value={{
      user,
      settings,
      analyses,
      favorites,
      addAnalysis,
      removeAnalysis,
      toggleFavorite,
      clearHistory,
      clearFavorites,
      updateSettings,
      resetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
