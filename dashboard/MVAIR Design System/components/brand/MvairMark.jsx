import React from 'react';

/**
 * MVAIR waveform logo mark. Petrol on light surfaces, aqua on dark.
 * This is the real brand mark recreated from the product source.
 */
export function MvairMark({ tone = 'petrol', size = 30, className = '', style = {} }) {
  const color = tone === 'aqua' ? 'var(--mvair-accent)' : 'var(--mvair-primary)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <rect x="3" y="13" width="2.6" height="6" rx="1.3" fill={color} />
      <rect x="8" y="10" width="2.6" height="12" rx="1.3" fill={color} />
      <path
        d="M13.4 16 L16 16 L18 9 L21 23 L23 16 L29 16"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full lockup: waveform mark + "MVAIR" wordmark (Newsreader).
 */
export function MvairLogo({ tone = 'petrol', size = 30, className = '', style = {} }) {
  const wordColor = tone === 'aqua' ? '#fff' : 'var(--mvair-text-primary)';
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 11, ...style }}>
      <MvairMark tone={tone} size={size} />
      <span style={{
        fontFamily: 'var(--mvair-font-display)',
        fontWeight: 600,
        fontSize: size * 0.76,
        letterSpacing: '-0.01em',
        color: wordColor,
      }}>
        MVAIR
      </span>
    </span>
  );
}
