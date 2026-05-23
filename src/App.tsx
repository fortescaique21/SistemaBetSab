import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { StatsCard } from './components/StatsCard';
import { BetForm } from './components/BetForm';
import type { BetInput } from './components/BetForm';
import { BetList } from './components/BetList';
import type { Bet } from './components/BetList';
import { Analytics } from './components/Analytics';
import './App.css';

const MOCK_BETS: Bet[] = [
  {
    id: 'mock-1',
    evento: 'Manchester City x Liverpool',
    esporte: 'Futebol',
    mercado: 'Ambas Marcam',
    valor: 100,
    odd: 1.95,
    status: 'Green',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 1 dia atrás
  },
  {
    id: 'mock-2',
    evento: 'Lakers x Warriors',
    esporte: 'Basquete',
    mercado: 'Vencedor do Jogo',
    valor: 150,
    odd: 1.80,
    status: 'Red',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString() // 12 horas atrás
  },
  {
    id: 'mock-3',
    evento: 'Carlos Alcaraz x Novak Djokovic',
    esporte: 'Tênis',
    mercado: 'Vencedor do Confronto',
    valor: 120,
    odd: 1.75,
    status: 'Pendente',
    created_at: new Date().toISOString()
  }
];

function App() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [bancaInicial, setBancaInicial] = useState<number>(1000);
  const [bancaInput, setBancaInput] = useState<string>('1000');
  const [showBancaEdit, setShowBancaEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Carrega banca inicial do localStorage (preferência do usuário)
        const savedBanca = localStorage.getItem('sistemabet_banca_inicial');
        if (savedBanca) {
          setBancaInicial(parseFloat(savedBanca));
          setBancaInput(savedBanca);
        }

        // Tentar buscar do Supabase
        const { data, error } = await supabase
          .from('bets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setBets(data as Bet[]);
          setUsingFallback(false);
        } else {
          setBets(MOCK_BETS);
          setUsingFallback(false);
        }
      } catch (err: any) {
        console.warn('Falha ao conectar ao Supabase (tabela "bets" pode não existir). Usando localStorage como fallback.', err.message);
        setUsingFallback(true);
        
        // Carregar do localStorage caso a tabela não exista ou ocorra erro
        const localBets = localStorage.getItem('sistemabet_bets');
        if (localBets && JSON.parse(localBets).length > 0) {
          setBets(JSON.parse(localBets));
        } else {
          setBets(MOCK_BETS);
        }
        
        // Define mensagem informativa de ajuda
        setErrorMessage(
          'Nota: Usando armazenamento local. Se você deseja usar o Supabase, crie uma tabela chamada "bets" no banco de dados "nutricionista_sistema" do seu console Supabase com as colunas: id (uuid), evento (text), esporte (text), mercado (text), valor (numeric), odd (numeric), status (text) e created_at (timestamp).'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Salvar no localStorage sempre que as bets mudarem (para manter backup local)
  useEffect(() => {
    if (usingFallback) {
      localStorage.setItem('sistemabet_bets', JSON.stringify(bets));
    }
  }, [bets, usingFallback]);

  const handleSaveBancaInicial = () => {
    const valor = parseFloat(bancaInput);
    if (!isNaN(valor) && valor >= 0) {
      setBancaInicial(valor);
      localStorage.setItem('sistemabet_banca_inicial', valor.toString());
      setShowBancaEdit(false);
    }
  };

  const handleAddBet = async (newBetInput: BetInput) => {
    const tempId = crypto.randomUUID();
    const newBet: Bet = {
      id: tempId,
      ...newBetInput,
      created_at: new Date().toISOString()
    };

    // Otimista: atualiza a UI imediatamente
    setBets(prev => [newBet, ...prev]);

    if (!usingFallback) {
      try {
        const { error } = await supabase
          .from('bets')
          .insert([{
            evento: newBet.evento,
            esporte: newBet.esporte,
            mercado: newBet.mercado,
            valor: newBet.valor,
            odd: newBet.odd,
            status: newBet.status
          }]);

        if (error) throw error;
        
        // Recarregar dados para obter o ID correto do Supabase
        const { data } = await supabase
          .from('bets')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setBets(data as Bet[]);
      } catch (err: any) {
        console.error('Erro ao salvar no Supabase, fazendo fallback local...', err);
        setUsingFallback(true);
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Bet['status']) => {
    // Atualizar localmente
    setBets(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    if (!usingFallback) {
      try {
        const { error } = await supabase
          .from('bets')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('Erro ao atualizar status no Supabase, usando local...', err);
        setUsingFallback(true);
      }
    }
  };

  const handleDeleteBet = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aposta?')) return;

    // Atualizar localmente
    setBets(prev => prev.filter(b => b.id !== id));

    if (!usingFallback) {
      try {
        const { error } = await supabase
          .from('bets')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('Erro ao deletar no Supabase, usando local...', err);
        setUsingFallback(true);
      }
    }
  };

  // Cálculos de Estatísticas de Banca
  const totalApostado = bets.reduce((acc, b) => acc + b.valor, 0);
  
  const lucroLiquido = bets.reduce((acc, b) => {
    if (b.status === 'Green') return acc + b.valor * (b.odd - 1);
    if (b.status === 'Red') return acc - b.valor;
    return acc;
  }, 0);

  const bancaTotal = bancaInicial + lucroLiquido;
  
  const roi = totalApostado > 0 ? (lucroLiquido / totalApostado) * 100 : 0;

  const betsResolvidas = bets.filter(b => b.status === 'Green' || b.status === 'Red');
  const greens = bets.filter(b => b.status === 'Green').length;
  const winRate = betsResolvidas.length > 0 ? (greens / betsResolvidas.length) * 100 : 0;

  return (
    <div className="dashboard-container">
      {/* Topbar/Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0 }}>
            BetMind AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Inteligência em Gestão de Banca e Apostas Esportivas
          </p>
        </div>
        
        {/* Indicador de Conexão com Supabase */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span 
            className={`badge ${usingFallback ? 'badge-violet' : 'badge-green'}`} 
            style={{ 
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textShadow: 'none'
            }}
          >
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: usingFallback ? 'var(--accent-violet)' : 'var(--accent-green)',
                boxShadow: `0 0 8px ${usingFallback ? 'var(--accent-violet)' : 'var(--accent-green)'}`
              }} 
            />
            {usingFallback ? 'Modo Local (Offline)' : 'Supabase Conectado'}
          </span>
        </div>
      </header>

      {/* Alerta de Modo Local explicativo */}
      {errorMessage && usingFallback && (
        <div 
          className="glass animate-fade-in" 
          style={{ 
            padding: '16px 20px', 
            borderColor: 'rgba(139, 92, 246, 0.25)', 
            background: 'rgba(139, 92, 246, 0.05)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <span style={{ color: 'var(--accent-violet)', fontSize: '1.2rem', lineHeight: '1' }}>💡</span>
          <div>
            <strong>Modo Sandbox Ativo:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Grid de Estatísticas Rápidas (Cards) */}
      <section className="dashboard-grid">
        <StatsCard 
          title="Banca Atual" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bancaTotal)}
          subtext={
            showBancaEdit ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', width: '100%' }}>
                <input 
                  type="number" 
                  value={bancaInput}
                  onChange={(e) => setBancaInput(e.target.value)}
                  style={{ width: '80px', padding: '4px 8px', fontSize: '0.75rem' }}
                  className="input-premium"
                />
                <button 
                  onClick={handleSaveBancaInicial} 
                  className="btn-premium" 
                  style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                >
                  Salvar
                </button>
              </div>
            ) : (
              <span 
                style={{ cursor: 'pointer', textDecoration: 'underline', opacity: 0.8 }} 
                onClick={() => setShowBancaEdit(true)}
              >
                Banca Inicial: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bancaInicial)} (Editar)
              </span>
            )
          }
          type="default"
          icon="💰"
        />

        <StatsCard 
          title="Lucro / Prejuízo" 
          value={(lucroLiquido >= 0 ? '+' : '') + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroLiquido)}
          subtext={lucroLiquido >= 0 ? 'Desempenho Positivo' : 'Banca em Queda'}
          type={lucroLiquido > 0 ? 'success' : lucroLiquido < 0 ? 'danger' : 'default'}
          icon={lucroLiquido >= 0 ? '📈' : '📉'}
        />

        <StatsCard 
          title="ROI %" 
          value={`${roi.toFixed(1)}%`}
          subtext={`Total investido: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalApostado)}`}
          type={roi > 0 ? 'success' : roi < 0 ? 'danger' : 'default'}
          icon="📊"
        />

        <StatsCard 
          title="Taxa de Acerto (Win Rate)" 
          value={`${winRate.toFixed(1)}%`}
          subtext={`${greens} Greens de ${betsResolvidas.length} palpites resolvidos`}
          type={winRate >= 50 ? 'success' : winRate > 0 ? 'danger' : 'default'}
          icon="🎯"
        />
      </section>

      {/* Conteúdo Principal em Grid Lateral */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--accent-violet)', fontSize: '1.2rem', fontWeight: '500' }}>
          ⌛ Carregando dashboard do BetMind AI...
        </div>
      ) : (
        <main className="main-content-layout">
          {/* Esquerda: Histórico e Gráficos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <BetList 
              bets={bets} 
              onUpdateStatus={handleUpdateStatus} 
              onDeleteBet={handleDeleteBet} 
            />
            
            <Analytics 
              bets={bets} 
              bancaInicial={bancaInicial} 
            />
          </div>

          {/* Direita: Formulário e Configurações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <BetForm onAddBet={handleAddBet} />
            
            {/* Bloco informativo adicional */}
            <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                ℹ️ Dicas de Gestão de Risco
              </h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '16px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Nunca aposte mais do que <strong>2% a 5%</strong> da sua banca total por palpite.</li>
                <li>Mantenha um registro constante para analisar quais mercados dão mais retorno.</li>
                <li>A taxa de ROI acima de 5% é considerada excelente a longo prazo.</li>
              </ul>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
