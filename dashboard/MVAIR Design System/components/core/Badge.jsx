import React from 'react';

const variantColor = {
  default: 'var(--mvair-primary)',
  success: 'var(--mvair-success)',
  warning: 'var(--mvair-warning)',
  danger: 'var(--mvair-danger)',
  neutral: 'var(--mvair-text-secondary)',
};

const intentColor = {
  general: 'var(--mvair-intent-general)',
  dental: 'var(--mvair-intent-dental)',
  followup: 'var(--mvair-intent-followup)',
  urgent: 'var(--mvair-intent-urgent)',
  inquiry: 'var(--mvair-intent-inquiry)',
  unknown: 'var(--mvair-intent-unknown)',
};

/**
 * Soft-tint status/category badge: 15% color wash + full-strength text.
 * Pass `intent` for session-category colors, or `variant` for status.
 */
export function Badge({ label, children, variant = 'default', intent, icon: Icon, className = '', style = {} }) {
  const color = intent ? (intentColor[intent] || intentColor.unknown) : (variantColor[variant] || variantColor.default);
  const content = children ?? label;

  // neutral uses a flat border-tint rather than a color wash
  const bg = variant === 'neutral' && !intent
    ? 'var(--mvair-card-border)'
    : `color-mix(in srgb, ${color} 15%, transparent)`;

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
        textTransform: 'capitalize',
        background: bg,
        color,
        ...style,
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2} />}
      {content}
    </span>
  );
}
