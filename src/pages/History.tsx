import { useSession } from '../context/SessionContext';
import { History as HistoryIcon, Trash2, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function History() {
  const { analyses, removeAnalysis, clearHistory } = useSession();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HistoryIcon size={32} color="var(--accent-violet)" />
            Histórico da Sessão
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Listagem de análises geradas durante a sessão atual. Serão removidas ao reiniciar.
          </p>
        </div>
        
        {analyses.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja apagar todo o histórico gerado nesta sessão?')) {
                clearHistory();
              }
            }}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', color: 'var(--accent-red)', borderColor: 'rgba(255, 51, 102, 0.3)', background: 'rgba(255, 51, 102, 0.05)', cursor: 'pointer' }}
          >
            <Trash2 size={18} /> Limpar Tudo
          </button>
        )}
      </div>

      {analyses.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
          <HistoryIcon size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px' }}>Nenhuma Análise Encontrada</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Você ainda não gerou prognósticos de IA nesta sessão.</p>
          <Link to="/analise-ia" style={{ textDecoration: 'none' }}>
            <button className="btn-premium">Nova Análise</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {analyses.map(analysis => (
            <div key={analysis.id} className="glass table-row-hover" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {analysis.homeTeam} x {analysis.awayTeam}
                </h4>
                <button 
                  onClick={() => removeAnalysis(analysis.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0, 255, 135, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-green)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Award size={16} color="var(--accent-green)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Melhor Aposta</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{analysis.bestBet.market}</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.9rem' }}>{analysis.bestBet.confidence}%</span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {new Date(analysis.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
