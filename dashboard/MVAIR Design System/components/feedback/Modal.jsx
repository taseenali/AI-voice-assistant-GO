import React from 'react';

const sizes = { sm: 448, md: 512, lg: 672 };

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Centered modal dialog over a 50% scrim. Click the scrim or the ✕ to close.
 * `title` renders the header; `children` is the body.
 */
export function Modal({ isOpen, onClose, title, children, size = 'md', className = '', style = {} }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(12,26,32,0.5)' }} />
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: sizes[size] || sizes.md,
          margin: '0 16px',
          padding: 24,
          background: 'var(--mvair-white)',
          borderRadius: 'var(--mvair-radius-card)',
          boxShadow: 'var(--mvair-shadow-modal)',
          fontFamily: 'var(--mvair-font-sans)',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--mvair-text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mvair-text-muted)', display: 'flex', padding: 0 }}
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
