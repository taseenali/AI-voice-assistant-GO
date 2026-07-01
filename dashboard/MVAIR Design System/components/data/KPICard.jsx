import React from 'react';

const variantColor = {
  default: 'var(--mvair-primary)',
  success: 'var(--mvair-success)',
  warning: 'var(--mvair-warning)',
  danger: 'var(--mvair-danger)',
};

/**
 * Dashboard KPI tile — uppercase label + accent icon, big bold metric,
 * optional subtitle. The icon color carries the variant.
 */
export function KPICard({ title, value, subtitle, icon: Icon, variant = 'default', className = '', style = {} }) {
  const color = variantColor[variant] || variantColor.default;
  return (
    <div
      className={className}
      style={{
        background: 'var(--mvair-bg-card)',
        border: '1px solid var(--mvair-border-card)',
        borderRadius: 'var(--mvair-radius-card)',
        boxShadow: 'var(--mvair-shadow-card)',
        padding: 24,
        fontFamily: 'var(--mvair-font-sans)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          fontSize: 'var(--mvair-card-title)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--mvair-card-title-tracking)',
          fontWeight: 600,
          color: 'var(--mvair-text-secondary)',
        }}>
          {title}
        </div>
        {Icon && <Icon size={20} strokeWidth={2} color={color} />}
      </div>
      <div style={{ fontSize: 'var(--mvair-kpi)', lineHeight: 'var(--mvair-kpi-lh)', fontWeight: 700, color: 'var(--mvair-text-primary)', marginBottom: 4 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 'var(--mvair-body-sm)', color: 'var(--mvair-text-muted)' }}>{subtitle}</div>
      )}
    </div>
  );
}
