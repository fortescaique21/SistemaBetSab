import React, { useState } from 'react';

export interface Bet {
  id: string;
  evento: string;
  esporte: string;
  mercado: string;
  valor: number;
  odd: number;
  status: 'Pendente' | 'Green' | 'Red' | 'Devolvida';
  created_at?: string;
}

interface BetListProps {
  bets: Bet[];
  onUpdateStatus: (id: string, status: Bet['status']) => void;
  onDeleteBet: (id: string) => void;
}

export const BetList: React.FC<BetListProps> = ({ bets, onUpdateStatus, onDeleteBet }) => {
  const [filtroEsporte, setFiltroEsporte] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [buscaInput, setBuscaInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem das apostas
  const betsFiltradas = bets.filter(bet => {
    const matchEsporte = filtroEsporte === 'Todos' || bet.esporte === filtroEsporte;
    const matchStatus = filtroStatus === 'Todos' || bet.status === filtroStatus;
    const matchBusca = searchQuery === '' || 
      bet.evento.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bet.mercado.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEsporte && matchStatus && matchBusca;
  });

  const getStatusBadgeClass = (status: Bet['status']) => {
    switch (status) {
      case 'Green': return 'badge-green';
      case 'Red': return 'badge-red';
      case 'Devolvida': return 'badge-cyan';
      default: return 'badge-violet';
    }
  };

  const getEsporteEmoji = (esporte: string) => {
    switch (esporte) {
      case 'Futebol': return '⚽';
      case 'Basquete': return '🏀';
      case 'Tênis': return '🎾';
      case 'E-sports': return '🎮';
      default: return '🎲';
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const calcularRetornoLiquido = (bet: Bet) => {
    if (bet.status === 'Green') {
      return bet.valor * (bet.odd - 1);
    }
    if (bet.status === 'Red') {
      return -bet.valor;
    }
    return 0;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(buscaInput);
  };

  const handleClearSearch = () => {
    setBuscaInput('');
    setSearchQuery('');
  };

  return (
    <div 
      className="glass animate-fade-in"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem' }}>📊</span>
          Histórico de Palpites
        </h3>

        {/* Filtros e Busca */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' }} className="lg:w-auto lg:flex-nowrap">
          
          {/* Campo de Busca Otimizado */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', position: 'relative', flexGrow: 1 }} className="sm:flex-initial">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>
                🔍
              </span>
              <input 
                type="text" 
                placeholder="Buscar palpite..." 
                value={buscaInput}
                onChange={(e) => setBuscaInput(e.target.value)}
                className="input-premium"
                style={{ paddingLeft: '36px', paddingRight: buscaInput ? '32px' : '12px', width: '100%', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.85rem' }}
              />
              {buscaInput && (
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              )}
            </div>
            <button 
              type="submit" 
              className="btn-premium"
              style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
            >
              Buscar
            </button>
          </form>

          {/* Filtros Dropdown */}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }} className="sm:w-auto">
            <div style={{ position: 'relative', flexGrow: 1 }} className="sm:flex-initial">
              <select 
                value={filtroEsporte} 
                onChange={(e) => setFiltroEsporte(e.target.value)}
                className="input-premium"
                style={{ width: '100%', padding: '8px 32px 8px 12px', fontSize: '0.85rem', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Todos">⚽ Todos Esportes</option>
                <option value="Futebol">⚽ Futebol</option>
                <option value="Basquete">🏀 Basquete</option>
                <option value="Tênis">🎾 Tênis</option>
                <option value="E-sports">🎮 E-sports</option>
                <option value="Outros">🎲 Outros</option>
              </select>
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '0.75rem' }}>▼</span>
            </div>

            <div style={{ position: 'relative', flexGrow: 1 }} className="sm:flex-initial">
              <select 
                value={filtroStatus} 
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="input-premium"
                style={{ width: '100%', padding: '8px 32px 8px 12px', fontSize: '0.85rem', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Todos">⏳ Todos Status</option>
                <option value="Pendente">⏳ Pendente</option>
                <option value="Green">🟢 Green</option>
                <option value="Red">🔴 Red</option>
                <option value="Devolvida">🔄 Devolvida</option>
              </select>
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '0.75rem' }}>▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualização 1: Tabela (Desktop - Oculta no mobile com Tailwind) */}
      <div style={{ overflowX: 'auto', width: '100%' }} className="hidden md:block">
        {betsFiltradas.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma aposta cadastrada com os filtros selecionados.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Evento</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Esporte</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Mercado</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Valor</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Odd</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Lucro/Perda</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {betsFiltradas.map((bet) => {
                const retorno = calcularRetornoLiquido(bet);
                return (
                  <tr 
                    key={bet.id} 
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '16px 8px', fontWeight: '500' }}>{bet.evento}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                      {getEsporteEmoji(bet.esporte)} {bet.esporte}
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                      <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        {bet.mercado}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', fontWeight: '500' }}>{formatarMoeda(bet.valor)}</td>
                    <td style={{ padding: '16px 8px', fontWeight: '600', color: 'var(--accent-violet)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>⚡</span>
                        {bet.odd.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px 8px', 
                      fontWeight: '600', 
                      color: retorno > 0 ? 'var(--accent-green)' : retorno < 0 ? 'var(--accent-red)' : 'var(--text-muted)' 
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>📊</span>
                        {retorno > 0 ? `+${formatarMoeda(retorno)}` : retorno < 0 ? formatarMoeda(retorno) : 'R$ 0,00'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`badge ${getStatusBadgeClass(bet.status)}`}>
                        {bet.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* Botão de Green */}
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Green')}
                        title="Marcar Green"
                        style={{
                          background: 'rgba(0, 255, 135, 0.1)',
                          border: '1px solid rgba(0, 255, 135, 0.2)',
                          borderRadius: '6px',
                          color: 'var(--accent-green)',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-green)';
                          e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 255, 135, 0.1)';
                          e.currentTarget.style.color = 'var(--accent-green)';
                        }}
                      >
                        ✓
                      </button>

                      {/* Botão de Red */}
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Red')}
                        title="Marcar Red"
                        style={{
                          background: 'rgba(255, 51, 102, 0.1)',
                          border: '1px solid rgba(255, 51, 102, 0.2)',
                          borderRadius: '6px',
                          color: 'var(--accent-red)',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-red)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 51, 102, 0.1)';
                          e.currentTarget.style.color = 'var(--accent-red)';
                        }}
                      >
                        ✗
                      </button>

                      {/* Botão de Devolvida */}
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Devolvida')}
                        title="Marcar Devolvida"
                        style={{
                          background: 'rgba(0, 240, 255, 0.1)',
                          border: '1px solid rgba(0, 240, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'var(--accent-cyan)',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-cyan)';
                          e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                          e.currentTarget.style.color = 'var(--accent-cyan)';
                        }}
                      >
                        ⟳
                      </button>

                      {/* Divisor */}
                      <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

                      {/* Botão de Excluir */}
                      <button 
                        onClick={() => onDeleteBet(bet.id)}
                        title="Excluir Aposta"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Visualização 2: Cards Otimizados para Celular (Mobile-First - Oculto no desktop) */}
      <div className="block md:hidden">
        {betsFiltradas.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Nenhuma aposta cadastrada com os filtros selecionados.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {betsFiltradas.map((bet) => {
              const retorno = calcularRetornoLiquido(bet);
              return (
                <div 
                  key={bet.id} 
                  className="glass animate-fade-in" 
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px', 
                    position: 'relative',
                    borderLeft: `4px solid ${
                      bet.status === 'Green' 
                        ? 'var(--accent-green)' 
                        : bet.status === 'Red' 
                          ? 'var(--accent-red)' 
                          : bet.status === 'Devolvida'
                            ? 'var(--accent-cyan)'
                            : 'rgba(255, 255, 255, 0.1)'
                    }`
                  }}
                >
                  {/* Detalhe brilhante neon de fundo */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${
                        bet.status === 'Green' 
                          ? 'var(--accent-green)' 
                          : bet.status === 'Red' 
                            ? 'var(--accent-red)' 
                            : 'var(--accent-violet)'
                      }08 0%, transparent 70%)`,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Header do Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                      {getEsporteEmoji(bet.esporte)} {bet.esporte}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(bet.status)}`} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                      {bet.status}
                    </span>
                  </div>

                  {/* Detalhes do Evento */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                      {bet.evento}
                    </h4>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)', 
                      marginTop: '6px', 
                      display: 'inline-block',
                      fontWeight: '500' 
                    }}>
                      {bet.mercado}
                    </span>
                  </div>

                  {/* Info Grid com Efeito de Ícones Premium */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '10px', 
                    background: 'rgba(0, 0, 0, 0.15)', 
                    padding: '10px 12px', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Valor</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatarMoeda(bet.valor)}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Odd</span>
                      <span style={{ fontWeight: '700', color: 'var(--accent-violet)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <span>⚡</span>{bet.odd.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px', marginTop: '2px' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Retorno Líquido</span>
                      <span style={{ 
                        fontWeight: '700', 
                        fontSize: '0.9rem',
                        color: retorno > 0 ? 'var(--accent-green)' : retorno < 0 ? 'var(--accent-red)' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>📊</span>
                        {retorno > 0 ? `+${formatarMoeda(retorno)}` : retorno < 0 ? formatarMoeda(retorno) : 'R$ 0,00'}
                      </span>
                    </div>
                  </div>

                  {/* Footer Ações Rápidas para Dispositivo Móvel */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                    paddingTop: '12px', 
                    marginTop: '4px' 
                  }}>
                    {/* Botões Rápidos de Alteração de Status */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Green')}
                        className="btn-premium"
                        style={{ padding: '6px 10px', fontSize: '0.7rem', background: 'rgba(0, 255, 135, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0, 255, 135, 0.15)' }}
                      >
                        ✓ Green
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Red')}
                        className="btn-premium"
                        style={{ padding: '6px 10px', fontSize: '0.7rem', background: 'rgba(255, 51, 102, 0.1)', color: 'var(--accent-red)', border: '1px solid rgba(255, 51, 102, 0.15)' }}
                      >
                        ✗ Red
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(bet.id, 'Devolvida')}
                        className="btn-premium"
                        style={{ padding: '6px 10px', fontSize: '0.7rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 240, 255, 0.15)' }}
                      >
                        ⟳ Ref
                      </button>
                    </div>

                    {/* Botão Deletar */}
                    <button 
                      onClick={() => onDeleteBet(bet.id)}
                      style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer', 
                        padding: '6px 8px', 
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-red)';
                        e.currentTarget.style.background = 'rgba(255, 51, 102, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
