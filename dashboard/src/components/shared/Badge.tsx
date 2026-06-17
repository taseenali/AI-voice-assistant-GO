interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  intent?: string;
  className?: string;
}

const intentColorMap: Record<string, string> = {
  general: 'bg-intent-general/15 text-intent-general',
  dental: 'bg-intent-dental/15 text-intent-dental',
  followup: 'bg-intent-followup/15 text-intent-followup',
  urgent: 'bg-intent-urgent/15 text-intent-urgent',
  inquiry: 'bg-intent-inquiry/15 text-intent-inquiry',
  unknown: 'bg-intent-unknown/15 text-intent-unknown',
};

const variantColorMap: Record<string, string> = {
  default: 'bg-primary-light text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-gray-100 text-neutral',
};

export function Badge({ label, variant = 'default', intent, className = '' }: BadgeProps) {
  const colorClass = intent
    ? intentColorMap[intent] || intentColorMap.unknown
    : variantColorMap[variant];

  return (
    <span className={`badge ${colorClass} ${className}`}>
      {label}
    </span>
  );
}