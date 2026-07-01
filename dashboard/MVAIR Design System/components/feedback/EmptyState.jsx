import React from 'react';

const variantColor = {
  info: 'var(--mvair-primary)',
  warning: 'var(--mvair-warning)',
  success: 'var(--mvair-success)',
};

/**
 * Centered empty/zero state — large icon, title, supporting copy, optional CTA.
 */
export function EmptyState({ icon: Icon, title, description, action, variant = 'info', className = '', style = {} }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 16px',
        fontFamily: 'var(--mvair-font-sans)',
        ...style,
      }}
    >
      {Icon && <Icon size={64} strokeWidth={1.5} color={variantColor[variant] || variantColor.info} style={{ marginBottom: 16 }} />}
      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: 'var(--mvair-text-primary)' }}>{title}</h3>
      <p style={{ margin: 0, maxWidth: 420, fontSize: 'var(--mvair-body)', color: 'var(--mvair-text-secondary)' }}>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            background: hov ? 'var(--mvair-primary-dark)' : 'var(--mvair-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--mvair-radius-button)',
            fontFamily: 'var(--mvair-font-sans)',
            fontWeight: 600,
            fontSize: 'var(--mvair-body)',
            cursor: 'pointer',
            transition: 'background var(--mvair-duration-fast) ease',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
