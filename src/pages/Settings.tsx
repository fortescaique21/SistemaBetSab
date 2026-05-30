import { useSession } from '../context/SessionContext';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Moon, Sun, Globe } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, user } = useSession();
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingsIcon size={32} color="var(--text-primary)" />
          {t('layout.settings')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          {t('layout.temporary_workspace')} <strong>{user.name}</strong>.
        </p>
      </div>

      <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '12px' }}>
              {settings.theme === 'dark' ? <Moon size={24} color="var(--accent-violet)"/> : <Sun size={24} color="#f59e0b"/>}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{t('theme.title')}</h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('theme.desc')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.1)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => updateSettings({ theme: 'light' })}
              style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: settings.theme === 'light' ? 'var(--text-primary)' : 'transparent', color: settings.theme === 'light' ? 'var(--bg-base)' : 'var(--text-secondary)', fontWeight: 'bold' }}
            >
              {t('theme.light')}
            </button>
            <button 
              onClick={() => updateSettings({ theme: 'dark' })}
              style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: settings.theme === 'dark' ? 'var(--text-primary)' : 'transparent', color: settings.theme === 'dark' ? 'var(--bg-base)' : 'var(--text-secondary)', fontWeight: 'bold' }}
            >
              {t('theme.dark')}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '12px' }}>
              <Globe size={24} color="var(--accent-cyan)"/>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{t('lang.title')}</h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('lang.desc')}</p>
            </div>
          </div>
          <div>
            <select 
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="input-premium"
              style={{ width: '150px' }}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
