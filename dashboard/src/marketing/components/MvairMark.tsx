interface MvairMarkProps {
  tone?: 'petrol' | 'aqua';
  size?: number;
}

/** MVAIR waveform logo mark — petrol on light, aqua on dark. */
export function MvairMark({ tone = 'petrol', size = 30 }: MvairMarkProps) {
  const color = tone === 'aqua' ? 'var(--mvair-accent)' : 'var(--mvair-primary)';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
