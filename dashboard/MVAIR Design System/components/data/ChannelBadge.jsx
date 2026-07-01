import React from 'react';

const PhoneGlyph = (
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
);
const GlobeGlyph = (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </>
);

/**
 * Channel badge — phone (emerald) vs web (slate), each with its glyph.
 * Distinct from Badge so the two session channels read instantly in a table.
 */
export function ChannelBadge({ channel, className = '', style = {} }) {
  const isPhone = channel === 'phone';
  const color = isPhone ? 'var(--mvair-chip-teal-stroke)' : 'var(--mvair-text-secondary)';
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderRadius: 'var(--mvair-radius-badge)',
        fontSize: 'var(--mvair-badge)',
        fontWeight: 600,
        lineHeight: 1,
        fontFamily: 'var(--mvair-font-sans)',
        background: isPhone ? 'var(--mvair-chip-teal-bg)' : '#EEF1F3',
        color,
        ...style,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isPhone ? PhoneGlyph : GlobeGlyph}
      </svg>
      {isPhone ? 'Phone' : 'Web'}
    </span>
  );
}
