import React from 'react';

const Icon = ({ d, color, size = 16, strokeWidth = 2, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
    {d}
  </svg>
);

const glyphs = {
  success: { color: 'var(--mvair-success)', node: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></> },
  error: { color: 'var(--mvair-danger)', node: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
  warning: { color: 'var(--mvair-warning)', node: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
  info: { color: 'var(--mvair-primary)', node: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></> },
};

/**
 * Toast notification — card with a left accent bar in the status color.
 * Slides in from the right; render inside a bottom-right fixed stack.
 */
export function Toast({ message, type = 'info', onClose, className = '', style = {} }) {
  const g = glyphs[type] || glyphs.info;
  return (
    <div
      role="alert"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 300,
        maxWidth: 420,
        padding: 16,
        background: 'var(--mvair-bg-card)',
        border: '1px solid var(--mvair-border-card)',
        borderLeft: `4px solid ${g.color}`,
        borderRadius: 'var(--mvair-radius-card)',
        boxShadow: 'var(--mvair-shadow-card-hover)',
        fontFamily: 'var(--mvair-font-sans)',
        animation: 'mvair-slide-in 0.25s ease-out',
        ...style,
      }}
    >
      <Icon d={g.node} color={g.color} size={20} />
      <p style={{ flex: 1, margin: 0, fontSize: 'var(--mvair-body)', color: 'var(--mvair-text-primary)' }}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mvair-text-muted)', display: 'flex', padding: 0 }}
          aria-label="Dismiss"
        >
          <Icon d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} color="currentColor" size={16} />
        </button>
      )}
      <style>{`@keyframes mvair-slide-in { from { opacity: 0; transform: translateX(100%);} to { opacity: 1; transform: translateX(0);} }`}</style>
    </div>
  );
}
