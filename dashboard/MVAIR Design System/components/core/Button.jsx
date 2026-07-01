import React from 'react';

const sizes = {
  sm: { fontSize: 14, padding: '8px 14px', borderRadius: 'var(--mvair-radius-button)' },
  md: { fontSize: 15, padding: '10px 18px', borderRadius: 'var(--mvair-radius-button)' },
  lg: { fontSize: 16, padding: '14px 26px', borderRadius: '9px' },
};

const palettes = {
  primary: {
    background: 'var(--mvair-primary)',
    color: '#fff',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-primary-dark)',
  },
  aqua: {
    background: 'var(--mvair-accent)',
    color: 'var(--mvair-on-accent)',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-accent-hover)',
  },
  secondary: {
    background: 'var(--mvair-white)',
    color: 'var(--mvair-text-secondary)',
    border: '1px solid var(--mvair-card-border)',
    '--hov-bg': 'var(--mvair-surface)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--mvair-primary)',
    border: '1px solid rgb(var(--mvair-primary-rgb) / 0.30)',
    '--hov-bg': 'rgb(var(--mvair-primary-rgb) / 0.05)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--mvair-text-secondary)',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-surface)',
  },
};

/**
 * MVAIR primary action button. Petrol is the default; aqua is reserved for
 * marketing CTAs; outline/secondary/ghost for lower-emphasis actions.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  const pal = palettes[variant] || palettes.primary;
  const sz = sizes[size] || sizes.md;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--mvair-font-sans)',
    fontWeight: 600,
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'background var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...pal,
    ...sz,
    background: hover && !disabled ? pal['--hov-bg'] : pal.background,
    ...style,
  };

  const iconEl = Icon ? <Icon size={size === 'lg' ? 18 : 16} strokeWidth={2} /> : null;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={composed}
    >
      {!iconRight && iconEl}
      {children}
      {iconRight && iconEl}
    </button>
  );
}
