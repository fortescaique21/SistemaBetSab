import { useSession } from '../context/SessionContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Bot, Star, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { analyses, favorites } = useSession();
  const { settings } = useSiteSettings();

  const lastAnalysis = analyses.length > 0 ? analyses[0] : null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Salutation Card */}
      <div 
        className="glass" 
        style={{ 
          padding: '40px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, rgba(26, 29, 38, 0.8) 0%, rgba(139, 92, 246, 0.15) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>
            {settings.welcome_title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
            {settings.welcome_desc}
          </p>
        </div>
        <Link to="/analise-ia" style={{ textDecoration: 'none' }}>
          <button className="btn-premium" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            <Bot size={24} /> Nova Análise IA
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
            <Activity size={32} color="var(--accent-violet)" />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>Análises Geradas</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '2.4rem', color: 'var(--text-primary)' }}>{analyses.length}</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(0, 255, 135, 0.1)', borderRadius: '12px' }}>
            <Star size={32} color="var(--accent-green)" />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>Marcados como Favoritos</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '2.4rem', color: 'var(--text-primary)' }}>{favorites.length}</h3>
          </div>
        </div>
      </div>

      {/* Last Analysis Preview */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Última Análise <ArrowRight size={18} color="var(--text-secondary)"/>
        </h3>
        
        {lastAnalysis ? (
          <div className="glass table-row-hover" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>
                {lastAnalysis.homeTeam} x {lastAnalysis.awayTeam}
              </h4>
              <span className="badge badge-green">Atual</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Melhor Aposta</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{lastAnalysis.bestBet.market}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dupla Chance</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{lastAnalysis.doubleChance.market}</p>
              </div>
            </div>
            <Link to="/history" style={{ display: 'inline-block', marginTop: '20px', color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              Ver histórico completo →
            </Link>
          </div>
        ) : (
          <div className="glass" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <Bot size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Nenhuma análise gerada nesta sessão ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
