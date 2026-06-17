import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: KPICardProps) {
  const variantClasses = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-card-title uppercase tracking-wider font-semibold text-text-secondary">
          {title}
        </div>
        <Icon className={`w-5 h-5 ${variantClasses[variant]}`} />
      </div>
      <div className="text-kpi font-bold text-text-primary mb-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-text-muted">{subtitle}</div>
      )}
    </div>
  );
}