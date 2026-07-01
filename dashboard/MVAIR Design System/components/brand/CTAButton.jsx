import React from 'react';

const variants = {
  petrol: { background: 'var(--mvair-primary)', color: '#fff', border: '1px solid transparent', hov: 'var(--mvair-primary-dark)' },
  aqua: { background: 'var(--mvair-accent)', color: 'var(--mvair-on-accent)', border: '1px solid transparent', hov: 'var(--mvair-accent-hover)' },
  ghost: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.24)', hov: 'transparent' },
};

const sizes = {
  sm: { fontSize: 15, padding: '11px 20px', borderRadius: 8 },
  lg: { fontSize: 16, padding: '15px 26px', borderRadius: 9 },
};

/**
 * Marketing CTA link (renders an <a>). Petrol / aqua / ghost, two sizes.
 * Ghost is for use over the dark hero; its hover brightens the border to aqua.
 */
export function CTAButton({ href = '#', children, variant = 'petrol', size = 'sm', className = '', style = {} }) {
  const [hov, setHov] = React.useState(false);
  const v = variants[variant] || variants.petrol;
  const s = sizes[size] || sizes.sm;
  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-block',
        textDecoration: 'none',
        fontFamily: 'var(--mvair-font-sans)',
        fontWeight: 600,
        background: hov && variant !== 'ghost' ? v.hov : v.background,
        color: v.color,
        border: v.border,
        borderColor: hov && variant === 'ghost' ? 'var(--mvair-accent)' : (v.border.includes('rgba') ? 'rgba(255,255,255,0.24)' : 'transparent'),
        transition: 'background var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
        ...s,
        ...style,
      }}
    >
      {children}
    </a>
  );
}
