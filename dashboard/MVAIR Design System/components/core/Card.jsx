import React from 'react';

/**
 * MVAIR surface card. White, soft cool-tinted shadow, generous radius.
 * `padding` defaults to 24px; `hover` enables the marketing lift.
 */
export function Card({
  children,
  padding = 24,
  radius = 'var(--mvair-radius-card)',
  hover = false,
  className = '',
  style = {},
  onClick,
}) {
  const [h, setH] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      className={className}
      style={{
        background: 'var(--mvair-bg-card)',
        border: '1px solid var(--mvair-border-card)',
        borderRadius: radius,
        boxShadow: h ? 'var(--mvair-shadow-card-hover)' : 'var(--mvair-shadow-card)',
        padding,
        transform: h ? 'translateY(-4px)' : 'none',
        transition: 'transform var(--mvair-duration) ease, box-shadow var(--mvair-duration) ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
