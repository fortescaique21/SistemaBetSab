import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Bot, 
  History, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Shield
} from 'lucide-react';

export function Layout() {
  const { user, resetSession, settings, updateSettings } = useSession();
  const { settings: siteSettings } = useSiteSettings();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [onlineTime, setOnlineTime] = useState('00:00');

  // Calcular tempo online
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - user.sessionStart) / 1000);
      const m = Math.floor(diff / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setOnlineTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [user.sessionStart]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const nextLang = () => {
    const map: Record<string, string> = { 'pt-BR': 'en', 'en': 'es', 'es': 'pt-BR' };
    updateSettings({ language: map[settings.language] || 'pt-BR' });
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('layout.dashboard') },
    { to: '/analise-ia', icon: Bot, label: t('layout.ia_prognostics') },
    { to: '/history', icon: History, label: t('layout.history') },
    { to: '/favorites', icon: Star, label: t('layout.favorites') },
    { to: '/settings', icon: Settings, label: t('layout.settings') },
    { to: '/admin', icon: Shield, label: 'Painel Admin' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: isSidebarOpen ? 0 : '-280px',
          height: '100vh',
          width: '280px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          backdropFilter: 'blur(20px)',
          transition: 'left 0.3s ease',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="sidebar-desktop"
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{siteSettings.site_name}</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Workspace
            </span>
          </div>
          <button 
            className="mobile-only"
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>



        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              style={({isActive}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
                borderLeft: isActive ? '4px solid var(--accent-violet)' : '4px solid transparent'
              })}
            >
              <item.icon size={20} color={location.pathname === item.to ? 'var(--accent-violet)' : 'currentColor'} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Canto Inferior da Sidebar */}
        <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => {
              if(window.confirm('Isto limpará todos os dados da sessão atual. Deseja continuar?')) {
                resetSession();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent-red)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              width: '100%',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={20} />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: '0',
          minHeight: '100vh'
        }}
        className="main-content-wrapper"
      >
        {/* Header Superior com Tema e Idiomas */}
        <header style={{ 
          height: '80px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'var(--bg-base)',
          opacity: 0.95,
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-only"
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <Menu size={20} />
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)'}}></span>
              {t('layout.active_session')}: {onlineTime}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Controles Globais (Tema e Idioma) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
              <button 
                onClick={nextLang}
                title="Trocar Idioma"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '50px',
                  textAlign: 'center'
                }}
              >
                {settings.language.substring(0, 2).toUpperCase()}
              </button>
              
              <button 
                onClick={toggleTheme}
                title="Trocar Tema"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>

            {/* Perfil */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('layout.temporary_workspace')}</p>
              </div>
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-input)' }}
              />
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer style={{ 
            maxWidth: '1200px', 
            margin: '40px auto 0', 
            width: '100%', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--border-color)', 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem' 
          }}>
            {siteSettings.footer_text}
          </footer>
        </main>
      </div>
      
      <style>{`
        .mobile-only { display: none; }
        @media (min-width: 1024px) {
          .sidebar-desktop { left: 0 !important; }
          .main-content-wrapper { margin-left: 280px !important; }
        }
        @media (max-width: 1023px) {
          .mobile-only { display: block; }
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}
