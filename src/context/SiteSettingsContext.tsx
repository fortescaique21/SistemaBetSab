import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export interface SiteSettings {
  id: string;
  theme: 'dark' | 'light';
  language: string;
  site_name: string;
  welcome_title: string;
  welcome_desc: string;
  accent_violet_dark: string;
  accent_cyan_dark: string;
  accent_green_dark: string;
  accent_red_dark: string;
  accent_violet_light: string;
  accent_cyan_light: string;
  accent_green_light: string;
  accent_red_light: string;
  maintenance_mode: boolean;
  footer_text: string;
}

interface SiteSettingsContextData {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  updateSiteSettings: (partial: Partial<SiteSettings>) => Promise<boolean>;
  resetColorsToDefault: () => Promise<boolean>;
}

const SiteSettingsContext = createContext<SiteSettingsContextData | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'global',
  theme: 'dark',
  language: 'pt-BR',
  site_name: 'BetMind AI',
  welcome_title: 'Bem-vindo ao seu Workspace',
  welcome_desc: 'Este é um ambiente temporário. Nenhum dado é salvo no banco de dados e tudo será limpo ao final da sua sessão. Utilize a Inteligência Artificial estrategicamente.',
  accent_violet_dark: '#8b5cf6',
  accent_cyan_dark: '#00f0ff',
  accent_green_dark: '#00ff87',
  accent_red_dark: '#ff3366',
  accent_violet_light: '#7c3aed',
  accent_cyan_light: '#06b6d4',
  accent_green_light: '#10b981',
  accent_red_light: '#ef4444',
  maintenance_mode: false,
  footer_text: '© 2026 BetMind AI. Todos os direitos reservados.',
};

export function applySiteStyles(settings: SiteSettings) {
  const isDark = settings.theme === 'dark';
  
  // Obter cores dependendo do tema ativo
  const violet = isDark ? settings.accent_violet_dark : settings.accent_violet_light;
  const cyan = isDark ? settings.accent_cyan_dark : settings.accent_cyan_light;
  const green = isDark ? settings.accent_green_dark : settings.accent_green_light;
  const red = isDark ? settings.accent_red_dark : settings.accent_red_light;
  
  const root = document.documentElement;
  
  // Set theme data attribute
  root.setAttribute('data-theme', settings.theme);
  
  // Set colors variables
  root.style.setProperty('--accent-violet', violet);
  root.style.setProperty('--accent-cyan', cyan);
  root.style.setProperty('--accent-green', green);
  root.style.setProperty('--accent-red', red);
  
  // Set glows variables
  root.style.setProperty('--glow-1', `${violet}${isDark ? '14' : '0d'}`); // 14 -> 8% alpha no dark, 0d -> 5% alpha no light
  root.style.setProperty('--glow-2', `${cyan}${isDark ? '0f' : '0d'}`);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // 1. Carregar configurações do Supabase
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error: fetchError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          const merged = { ...DEFAULT_SETTINGS, ...data };
          setSettings(merged);
          applySiteStyles(merged);
          
          // Sincronizar o idioma do i18n se fornecido
          if (merged.language) {
            i18n.changeLanguage(merged.language);
          }
        }
      } catch (err: any) {
        console.error('Falha ao carregar configurações gerais do Supabase:', err.message);
        setError(err.message || 'Erro ao carregar configurações.');
        // Aplicar estilos padrões caso falhe
        applySiteStyles(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [i18n]);

  // 2. Escutar mudanças em tempo real no Supabase
  useEffect(() => {
    const channel = supabase
      .channel('realtime_site_settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'id=eq.global',
        },
        (payload) => {
          if (payload.new) {
            const updated = { ...DEFAULT_SETTINGS, ...payload.new } as SiteSettings;
            setSettings(updated);
            applySiteStyles(updated);
            
            if (updated.language) {
              i18n.changeLanguage(updated.language);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n]);

  // 3. Atualizar configurações no Supabase
  const updateSiteSettings = async (partial: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const nextSettings = { ...settings, ...partial };
      // Atualizar localmente primeiro para resposta visual instantânea (optimistic UI)
      setSettings(nextSettings);
      applySiteStyles(nextSettings);
      
      if (partial.language) {
        i18n.changeLanguage(partial.language);
      }

      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          ...partial,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar configurações no Supabase:', err.message);
      setError(err.message || 'Erro ao atualizar.');
      return false;
    }
  };

  // 4. Resetar cores aos valores padrão
  const resetColorsToDefault = async (): Promise<boolean> => {
    const defaults = {
      accent_violet_dark: DEFAULT_SETTINGS.accent_violet_dark,
      accent_cyan_dark: DEFAULT_SETTINGS.accent_cyan_dark,
      accent_green_dark: DEFAULT_SETTINGS.accent_green_dark,
      accent_red_dark: DEFAULT_SETTINGS.accent_red_dark,
      accent_violet_light: DEFAULT_SETTINGS.accent_violet_light,
      accent_cyan_light: DEFAULT_SETTINGS.accent_cyan_light,
      accent_green_light: DEFAULT_SETTINGS.accent_green_light,
      accent_red_light: DEFAULT_SETTINGS.accent_red_light,
    };
    return updateSiteSettings(defaults);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSiteSettings,
        resetColorsToDefault,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
