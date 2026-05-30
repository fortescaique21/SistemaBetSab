import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { 
  Shield, 
  Save, 
  RotateCcw, 
  Palette, 
  FileText, 
  Globe, 
  Check, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export function AdminPanel() {
  const { settings, updateSiteSettings, resetColorsToDefault, error } = useSiteSettings();

  // Estados locais para formulário
  const [siteName, setSiteName] = useState(settings.site_name);
  const [welcomeTitle, setWelcomeTitle] = useState(settings.welcome_title);
  const [welcomeDesc, setWelcomeDesc] = useState(settings.welcome_desc);
  const [footerText, setFooterText] = useState(settings.footer_text);
  const [defaultTheme, setDefaultTheme] = useState(settings.theme);
  const [defaultLanguage, setDefaultLanguage] = useState(settings.language);

  // Cores Tema Escuro
  const [violetDark, setVioletDark] = useState(settings.accent_violet_dark);
  const [cyanDark, setCyanDark] = useState(settings.accent_cyan_dark);
  const [greenDark, setGreenDark] = useState(settings.accent_green_dark);
  const [redDark, setRedDark] = useState(settings.accent_red_dark);

  // Cores Tema Claro
  const [violetLight, setVioletLight] = useState(settings.accent_violet_light);
  const [cyanLight, setCyanLight] = useState(settings.accent_cyan_light);
  const [greenLight, setGreenLight] = useState(settings.accent_green_light);
  const [redLight, setRedLight] = useState(settings.accent_red_light);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sincronizar estados locais se as configurações do Supabase mudarem (sincronismo real-time)
  useEffect(() => {
    setSiteName(settings.site_name);
    setWelcomeTitle(settings.welcome_title);
    setWelcomeDesc(settings.welcome_desc);
    setFooterText(settings.footer_text);
    setDefaultTheme(settings.theme);
    setDefaultLanguage(settings.language);

    setVioletDark(settings.accent_violet_dark);
    setCyanDark(settings.accent_cyan_dark);
    setGreenDark(settings.accent_green_dark);
    setRedDark(settings.accent_red_dark);

    setVioletLight(settings.accent_violet_light);
    setCyanLight(settings.accent_cyan_light);
    setGreenLight(settings.accent_green_light);
    setRedLight(settings.accent_red_light);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const success = await updateSiteSettings({
      site_name: siteName,
      welcome_title: welcomeTitle,
      welcome_desc: welcomeDesc,
      footer_text: footerText,
      theme: defaultTheme,
      language: defaultLanguage,
      accent_violet_dark: violetDark,
      accent_cyan_dark: cyanDark,
      accent_green_dark: greenDark,
      accent_red_dark: redDark,
      accent_violet_light: violetLight,
      accent_cyan_light: cyanLight,
      accent_green_light: greenLight,
      accent_red_light: redLight,
    });

    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleResetColors = async () => {
    if (window.confirm('Tem certeza de que deseja redefinir todas as cores para as configurações originais da BetMind AI?')) {
      setSaving(true);
      const success = await resetColorsToDefault();
      setSaving(false);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={36} color="var(--accent-violet)" />
            Painel Administrativo
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Gerencie e personalize o tema, cores, textos e preferências gerais do site de forma global no Supabase.
          </p>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-red)',
          borderRadius: '12px',
          color: 'var(--accent-red)'
        }}>
          <AlertTriangle size={20} />
          <span><strong>Erro ao salvar:</strong> {error}</span>
        </div>
      )}

      {saveSuccess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--accent-green)',
          borderRadius: '12px',
          color: 'var(--accent-green)',
          animation: 'fadeIn 0.3s'
        }}>
          <Check size={20} />
          <span>Configurações salvas e aplicadas em tempo real com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Seção 1: Textos Gerais */}
        <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            Textos do Portal
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Nome do Site</label>
              <input 
                type="text" 
                value={siteName} 
                onChange={(e) => setSiteName(e.target.value)} 
                className="input-premium" 
                required 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Rodapé do Site</label>
              <input 
                type="text" 
                value={footerText} 
                onChange={(e) => setFooterText(e.target.value)} 
                className="input-premium" 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Título do Dashboard (Boas-vindas)</label>
            <input 
              type="text" 
              value={welcomeTitle} 
              onChange={(e) => setWelcomeTitle(e.target.value)} 
              className="input-premium" 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Descrição do Dashboard</label>
            <textarea 
              value={welcomeDesc} 
              onChange={(e) => setWelcomeDesc(e.target.value)} 
              className="input-premium" 
              rows={3} 
              style={{ resize: 'vertical' }}
              required 
            />
          </div>
        </div>

        {/* Seção 2: Preferências Gerais */}
        <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--accent-green)" />
            Preferências Gerais do Site
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Tema Padrão do Site</label>
              <select 
                value={defaultTheme} 
                onChange={(e) => setDefaultTheme(e.target.value as 'dark'|'light')} 
                className="input-premium"
              >
                <option value="dark">Escuro (Dark Mode)</option>
                <option value="light">Claro (Light Mode)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Idioma Padrão</label>
              <select 
                value={defaultLanguage} 
                onChange={(e) => setDefaultLanguage(e.target.value)} 
                className="input-premium"
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 3: Cores dos Temas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
          
          {/* Cores Tema Escuro */}
          <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--accent-violet)" />
              Paleta de Cores - Tema Escuro
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Violeta</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={violetDark} onChange={(e) => setVioletDark(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={violetDark} onChange={(e) => setVioletDark(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Cyan</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={cyanDark} onChange={(e) => setCyanDark(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={cyanDark} onChange={(e) => setCyanDark(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Verde</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={greenDark} onChange={(e) => setGreenDark(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={greenDark} onChange={(e) => setGreenDark(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Vermelho</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={redDark} onChange={(e) => setRedDark(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={redDark} onChange={(e) => setRedDark(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Cores Tema Claro */}
          <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--accent-red)" />
              Paleta de Cores - Tema Claro
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Violeta</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={violetLight} onChange={(e) => setVioletLight(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={violetLight} onChange={(e) => setVioletLight(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Cyan</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={cyanLight} onChange={(e) => setCyanLight(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={cyanLight} onChange={(e) => setCyanLight(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Verde</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={greenLight} onChange={(e) => setGreenLight(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={greenLight} onChange={(e) => setGreenLight(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destaque Vermelho</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={redLight} onChange={(e) => setRedLight(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                  <input type="text" value={redLight} onChange={(e) => setRedLight(e.target.value)} className="input-premium" style={{ fontFamily: 'monospace' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button 
            type="button" 
            onClick={handleResetColors}
            disabled={saving}
            className="btn-premium btn-secondary" 
            style={{ padding: '14px 28px' }}
          >
            <RotateCcw size={20} />
            Redefinir Cores Padrão
          </button>
          
          <button 
            type="submit" 
            disabled={saving}
            className="btn-premium" 
            style={{ padding: '14px 36px', minWidth: '220px' }}
          >
            {saving ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Salvando no Supabase...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
