import { useState } from 'react';
import { Bot, Swords, TrendingUp, ShieldAlert, Award, Star } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export function IAAnalysis() {
  const { addAnalysis, toggleFavorite, favorites } = useSession();
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);

  // Buscar do contexto o currentAnalysis
  const { analyses } = useSession();
  const result = analyses.find(a => a.id === currentAnalysisId);
  const isFavorite = result ? favorites.includes(result.id) : false;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return;

    setLoading(true);
    setCurrentAnalysisId(null);

    // Mock Backend Delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Resultado Fictício
    const mockData = {
      homeTeam,
      awayTeam,
      bestBet: {
        market: 'Over 1.5 gols',
        confidence: 84
      },
      doubleChance: {
        market: `${homeTeam} ou Empate`,
        confidence: 78
      },
      markdownStats: `
### Resumo da Partida
**${homeTeam} vs ${awayTeam}**

**🏆 Análise dos Times**
A equipe do **${homeTeam}** (mandante) apresenta um forte poderio ofensivo em casa nos últimos 5 jogos.
O **${awayTeam}** vem de uma sequência de 2 vitórias consistentes fora de casa.

### 🎯 Prognósticos Recomendados
| Mercado | Probabilidade | Confiança | Justificativa |
|---|---|---|---|
| Resultado Final | 45% ${homeTeam} | Média | O fator casa favorece. |
| Over 1.5 Gols | 84% | Alta | Ambos os times têm históricos de over. |

> **Gestão de Risco:** Recomendamos a aposta em **Over 1.5 Gols** como *Conservadora*.
      `
    };

    const newId = await addAnalysis(mockData);
    if (newId) {
      setCurrentAnalysisId(newId);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '0 0 40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <Bot size={36} color="var(--accent-green)" />
          <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0 }}>
            IA de Prognósticos
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Análises estatísticas atualizadas, formadas por Inteligência Artificial
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Formulário de Input */}
        <section className="glass animate-fade-in" style={{ padding: '32px', borderRadius: '16px' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Time Mandante</label>
                <input 
                  type="text" 
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="Ex: Flamengo"
                  className="input-premium"
                  style={{ textAlign: 'center', fontSize: '1.2rem', padding: '16px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Swords size={24} color="var(--text-secondary)" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Time Visitante</label>
                <input 
                  type="text" 
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="Ex: Palmeiras"
                  className="input-premium"
                  style={{ textAlign: 'center', fontSize: '1.2rem', padding: '16px' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-premium" 
              disabled={loading || !homeTeam || !awayTeam}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '12px' }}
            >
              {loading ? 'Processando algoritmos da IA...' : '🎯 Gerar Análise Completa'}
            </button>
          </form>
        </section>

        {loading && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {/* Skeleton Loading Premium */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="glass" style={{ height: '140px', borderRadius: '16px', background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }}></div>
                <div className="glass" style={{ height: '140px', borderRadius: '16px', background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }}></div>
             </div>
             <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
          </div>
        )}

        {/* Resultados */}
        {result && !loading && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button 
                 onClick={() => toggleFavorite(result.id)}
                 className="btn-secondary glass"
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer' }}
               >
                 <Star size={20} fill={isFavorite ? 'var(--accent-green)' : 'transparent'} color={isFavorite ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                 {isFavorite ? 'Salvo nos Favoritos' : 'Salvar Favorito'}
               </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div className="glass" style={{ padding: '24px', borderRadius: '16px', borderLeft: '4px solid var(--accent-green)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Award size={20} color="var(--accent-green)" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Melhor Aposta</h3>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{result.bestBet.market}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Confiança: <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{result.bestBet.confidence}%</span>
                </p>
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: '16px', borderLeft: '4px solid var(--accent-violet)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ShieldAlert size={20} color="var(--accent-violet)" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Dupla Chance Segura</h3>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{result.doubleChance.market}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Confiança: <span style={{ color: 'var(--accent-violet)', fontWeight: 'bold' }}>{result.doubleChance.confidence}%</span>
                </p>
              </div>
            </div>

            {/* Markdown Viewer */}
            <div className="glass markdown-container" style={{ padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <TrendingUp size={24} color="var(--text-primary)" />
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Análise Completa</h2>
               </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {result.markdownStats.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) return <h3 key={i} style={{ color: '#fff', marginTop: '24px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                   if (line.startsWith('|')) {
                    const columns = line.split('|').filter(Boolean).map(c => c.trim());
                    if (columns[0] === '---') return null; 
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '12px', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                        {columns.map((col, j) => <span key={j} style={{ fontWeight: i === 0 ? 'bold' : 'normal', color: i === 0 ? '#fff' : 'inherit' }}>{col}</span>)}
                      </div>
                    );
                  }
                  if (line.startsWith('> ')) {
                     return <div key={i} style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--accent-green)', marginTop: '24px', borderRadius: '0 8px 8px 0' }}>💡 {line.replace('> ', '').replace(/\*\*/g, '')}</div>
                  }
                  return <p key={i} style={{ minHeight: line.trim() === '' ? '12px' : 'auto' }}>{line.replace(/\*\*/g, '')}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
