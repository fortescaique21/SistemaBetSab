import { useSession } from '../context/SessionContext';
import { Star, StarOff, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Favorites() {
  const { analyses, favorites, toggleFavorite, clearFavorites } = useSession();

  const favoriteAnalyses = analyses.filter(a => favorites.includes(a.id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Star size={32} color="var(--accent-green)" fill="var(--accent-green)" />
            Favoritos da Sessão
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Seus prognósticos favoritos mantidos apenas durante o uso atual da aplicação.
          </p>
        </div>
        
        {favoriteAnalyses.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar seus favoritos desta sessão?')) {
                clearFavorites();
              }
            }}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <StarOff size={18} /> Limpar Favoritos
          </button>
        )}
      </div>

      {favoriteAnalyses.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
          <Star size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px' }}>Nenhum Favorito</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Marque o ícone de estrela nas análises geradas pela IA para salvá-las aqui.</p>
          <Link to="/history" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Ver Histórico</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {favoriteAnalyses.map(analysis => (
            <div key={analysis.id} className="glass table-row-hover" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>
                  {analysis.homeTeam} x {analysis.awayTeam}
                </h4>
                <button 
                  onClick={() => toggleFavorite(analysis.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }}
                  title="Remover dos favoritos"
                >
                  <Star size={20} fill="var(--accent-green)" />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                <div style={{ padding: '12px', background: 'rgba(0, 255, 135, 0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} color="var(--accent-green)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Melhor Aposta</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{analysis.bestBet.market}</span>
                </div>

                <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={16} color="var(--accent-violet)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dupla Chance</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{analysis.doubleChance.market}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
