import React from 'react';

const dotColor = {
  online: 'var(--mvair-success)',
  offline: 'var(--mvair-danger)',
  warning: 'var(--mvair-warning)',
  live: 'var(--mvair-signal)',
};

/**
 * Status indicator dot, optionally pulsing, with an optional label.
 * `live` uses the chartreuse signal color (reserved for "always answering").
 */
export function StatusDot({ status = 'online', pulse, label, className = '', style = {} }) {
  const shouldPulse = pulse ?? (status === 'online' || status === 'live');
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          background: dotColor[status] || dotColor.online,
          animation: shouldPulse ? 'mvair-pulse 2s infinite' : 'none',
          flex: 'none',
        }}
      />
      {label && (
        <span style={{ fontSize: 'var(--mvair-body-sm)', color: 'var(--mvair-text-secondary)', fontFamily: 'var(--mvair-font-sans)' }}>
          {label}
        </span>
      )}
    </span>
  );
}
