import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: React.ReactNode;
  type?: 'default' | 'success' | 'danger' | 'info';
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  type = 'default',
  icon,
}) => {
  const getBadgeClass = () => {
    switch (type) {
      case 'success':
        return 'badge-green';
      case 'danger':
        return 'badge-red';
      case 'info':
        return 'badge-cyan';
      default:
        return 'badge-violet';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'success':
        return 'var(--accent-green)';
      case 'danger':
        return 'var(--accent-red)';
      case 'info':
        return 'var(--accent-cyan)';
      default:
        return 'var(--text-primary)';
    }
  };

  return (
    <div 
      className="glass animate-slide-up" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.07)'
      }}
    >
      {/* Detalhe brilhante de fundo */}
      <div 
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getValueColor()}18 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {icon && (
          <div className={`badge ${getBadgeClass()}`} style={{ padding: '6px', borderRadius: '8px', fontSize: '1rem', width: '32px', height: '32px' }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span 
          style={{ 
            fontSize: '2.1rem', 
            fontWeight: '700', 
            letterSpacing: '-0.02em',
            color: getValueColor(),
            textShadow: type !== 'default' ? `0 0 20px ${getValueColor()}20` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {value}
        </span>
        {subtext && (
          <div 
            style={{ 
              fontSize: '0.8rem', 
              color: type === 'success' ? 'var(--accent-green)' : type === 'danger' ? 'var(--accent-red)' : 'var(--text-muted)',
              fontWeight: '500',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexWrap: 'wrap'
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
