import React from 'react';
import type { Bet } from './BetList';

interface AnalyticsProps {
  bets: Bet[];
  bancaInicial: number;
}

export const Analytics: React.FC<AnalyticsProps> = ({ bets, bancaInicial }) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Calcular lucros/perdas por esporte
  const esportesStats: { [key: string]: { lucro: number; total: number } } = {};
  
  // Inicializar esportes conhecidos
  ['Futebol', 'Basquete', 'Tênis', 'E-sports', 'Outros'].forEach(e => {
    esportesStats[e] = { lucro: 0, total: 0 };
  });

  bets.forEach(bet => {
    let retorno = 0;
    if (bet.status === 'Green') {
      retorno = bet.valor * (bet.odd - 1);
    } else if (bet.status === 'Red') {
      retorno = -bet.valor;
    }

    if (!esportesStats[bet.esporte]) {
      esportesStats[bet.esporte] = { lucro: 0, total: 0 };
    }
    
    esportesStats[bet.esporte].lucro += retorno;
    esportesStats[bet.esporte].total += 1;
  });

  // Calcular pontos para o gráfico de evolução de banca (somente apostas resolvidas Green/Red)
  const apostasResolvidas = [...bets]
    .filter(b => b.status === 'Green' || b.status === 'Red')
    // Ordenar por data ou id de criação (considerando ordem sequencial)
    .reverse(); // Assume que as novas são inseridas no topo, então revertemos para ordem cronológica

  let saldoAtual = bancaInicial;
  const historicoSaldo = [bancaInicial];
  
  apostasResolvidas.forEach(bet => {
    if (bet.status === 'Green') {
      saldoAtual += bet.valor * (bet.odd - 1);
    } else if (bet.status === 'Red') {
      saldoAtual -= bet.valor;
    }
    historicoSaldo.push(saldoAtual);
  });

  // Gerar coordenadas para o gráfico de linha SVG
  const width = 500;
  const height = 180;
  const padding = 20;
  
  const minSaldo = Math.min(...historicoSaldo);
  const maxSaldo = Math.max(...historicoSaldo);
  const rangeSaldo = maxSaldo - minSaldo === 0 ? 100 : maxSaldo - minSaldo;
  
  // Adiciona margem de segurança no topo e fundo do gráfico
  const yMin = minSaldo - rangeSaldo * 0.1;
  const yMax = maxSaldo + rangeSaldo * 0.1;
  const yRange = yMax - yMin;

  const pontosSVG = historicoSaldo.map((val, idx) => {
    const x = padding + (idx / (historicoSaldo.length - 1 || 1)) * (width - padding * 2);
    // Inverter Y porque no SVG o 0 fica no topo
    const y = height - padding - ((val - yMin) / yRange) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Gerar área preenchida abaixo da linha
  const areaPontosSVG = historicoSaldo.length > 0 
    ? `${padding},${height - padding} ${pontosSVG} ${width - padding},${height - padding}`
    : '';

  return (
    <div 
      className="glass animate-fade-in"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%'
      }}
    >
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--accent-violet)', fontSize: '1.4rem' }}>📈</span>
        Análise & Desempenho
      </h3>

      {/* Gráfico de Evolução da Banca */}
      <div>
        <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '14px', fontWeight: '500' }}>
          Evolução da Banca (R$)
        </h4>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-violet)"/>
                <stop offset="100%" stopColor="var(--accent-cyan)"/>
              </linearGradient>
            </defs>

            {/* Linhas de Grade de Fundo */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

            {historicoSaldo.length > 1 ? (
              <>
                {/* Área preenchida com gradiente */}
                <polygon points={areaPontosSVG} fill="url(#areaGradient)" />
                
                {/* Linha da Evolução */}
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  points={pontosSVG}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0px 4px 8px rgba(139, 92, 246, 0.3))' }}
                />

                {/* Marcador do último ponto */}
                {historicoSaldo.map((val, idx) => {
                  const x = padding + (idx / (historicoSaldo.length - 1)) * (width - padding * 2);
                  const y = height - padding - ((val - yMin) / yRange) * (height - padding * 2);
                  
                  // Apenas desenha ponto para o primeiro e o último para ficar clean, ou todos se houver poucos
                  if (idx === 0 || idx === historicoSaldo.length - 1 || historicoSaldo.length < 8) {
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="6" fill="#08090d" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                        <text 
                          x={x} 
                          y={y - 10} 
                          fill="var(--text-primary)" 
                          fontSize="9" 
                          fontWeight="bold"
                          textAnchor="middle"
                          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        >
                          {formatarMoeda(val).replace(',00', '')}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}
              </>
            ) : (
              <text x={width / 2} y={height / 2} fill="var(--text-muted)" fontSize="14" textAnchor="middle">
                Registre palpites para ver a evolução da banca.
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Lucro/Perda por Esporte */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Lucro Líquido por Esporte
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.entries(esportesStats).map(([esporte, stats]) => {
            const isPositivo = stats.lucro >= 0;
            // Achar o valor máximo para normalizar o tamanho da barra
            const maxLucroAbs = Math.max(...Object.values(esportesStats).map(s => Math.abs(s.lucro)), 100);
            const larguraPercent = Math.min((Math.abs(stats.lucro) / maxLucroAbs) * 100, 100);

            return (
              <div key={esporte} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {esporte === 'Futebol' && '⚽'}
                    {esporte === 'Basquete' && '🏀'}
                    {esporte === 'Tênis' && '🎾'}
                    {esporte === 'E-sports' && '🎮'}
                    {esporte === 'Outros' && '🎲'}
                    {esporte}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({stats.total} bets)</span>
                  </span>
                  <span style={{ fontWeight: '600', color: stats.lucro > 0 ? 'var(--accent-green)' : stats.lucro < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    {stats.lucro > 0 ? `+${formatarMoeda(stats.lucro)}` : formatarMoeda(stats.lucro)}
                  </span>
                </div>
                
                {/* Barra de Progresso Customizada com Gradiente de Direção */}
                <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                  {stats.lucro !== 0 && (
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${larguraPercent}%`, 
                        background: isPositivo 
                          ? 'linear-gradient(90deg, rgba(0, 255, 135, 0.4), var(--accent-green))' 
                          : 'linear-gradient(90deg, rgba(255, 51, 102, 0.4), var(--accent-red))', 
                        borderRadius: '4px',
                        boxShadow: isPositivo 
                          ? '0 0 8px rgba(0, 255, 135, 0.3)' 
                          : '0 0 8px rgba(255, 51, 102, 0.3)',
                        transition: 'width 0.5s ease-out'
                      }} 
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
