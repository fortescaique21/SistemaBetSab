import React, { useState } from 'react';

export interface BetInput {
  evento: string;
  esporte: string;
  mercado: string;
  valor: number;
  odd: number;
  status: 'Pendente' | 'Green' | 'Red' | 'Devolvida';
}

interface BetFormProps {
  onAddBet: (bet: BetInput) => void;
}

export const BetForm: React.FC<BetFormProps> = ({ onAddBet }) => {
  const [evento, setEvento] = useState('');
  const [esporte, setEsporte] = useState('Futebol');
  const [mercado, setMercado] = useState('');
  const [valor, setValor] = useState<string>('');
  const [odd, setOdd] = useState<string>('');
  const [status, setStatus] = useState<BetInput['status']>('Pendente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!evento || !mercado || !valor || !odd) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddBet({
      evento,
      esporte,
      mercado,
      valor: parseFloat(valor),
      odd: parseFloat(odd),
      status,
    });

    // Resetar campos
    setEvento('');
    setMercado('');
    setValor('');
    setOdd('');
    setStatus('Pendente');
  };

  // Ícone dinâmico no input baseado no esporte selecionado
  const getSportIcon = () => {
    switch (esporte) {
      case 'Futebol': return '⚽';
      case 'Basquete': return '🏀';
      case 'Tênis': return '🎾';
      case 'E-sports': return '🎮';
      default: return '🎲';
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="glass animate-slide-up"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
      }}
    >
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: 'var(--text-primary)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
        paddingBottom: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <span style={{ color: 'var(--accent-violet)', fontSize: '1.4rem' }}>✦</span>
        Novo Palpite / Aposta
      </h3>

      {/* Input de Evento com Ícone Esportivo Dinâmico */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Evento / Confronto
        </label>
        <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
          <span style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            fontSize: '1.1rem', 
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            {getSportIcon()}
          </span>
          <input 
            type="text" 
            placeholder="Ex: Manchester City x Liverpool" 
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            className="input-premium"
            style={{ paddingLeft: '42px' }}
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Esporte</label>
          <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
            <select 
              value={esporte}
              onChange={(e) => setEsporte(e.target.value)}
              className="input-premium"
              style={{ appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}
            >
              <option value="Futebol">⚽ Futebol</option>
              <option value="Basquete">🏀 Basquete</option>
              <option value="Tênis">🎾 Tênis</option>
              <option value="E-sports">🎮 E-sports</option>
              <option value="Outros">🎲 Outros</option>
            </select>
            {/* Seta customizada para o select */}
            <span style={{ 
              position: 'absolute', 
              right: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              pointerEvents: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.85rem' 
            }}>
              ▼
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Mercado</label>
          <input 
            type="text" 
            placeholder="Ex: Ambas Marcam" 
            value={mercado}
            onChange={(e) => setMercado(e.target.value)}
            className="input-premium"
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Valor (R$)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="Ex: 50.00" 
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="input-premium"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Odd (Cotação)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="Ex: 1.85" 
            value={odd}
            onChange={(e) => setOdd(e.target.value)}
            className="input-premium"
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Status Inicial</label>
        <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as BetInput['status'])}
            className="input-premium"
            style={{ appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}
          >
            <option value="Pendente">⏳ Pendente</option>
            <option value="Green">🟢 Green (Ganhou)</option>
            <option value="Red">🔴 Red (Perdeu)</option>
            <option value="Devolvida">🔄 Devolvida / Reembolso</option>
          </select>
          <span style={{ 
            position: 'absolute', 
            right: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none', 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem' 
          }}>
            ▼
          </span>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn-premium"
        style={{ marginTop: '10px' }}
      >
        Registrar Aposta
      </button>
    </form>
  );
};
