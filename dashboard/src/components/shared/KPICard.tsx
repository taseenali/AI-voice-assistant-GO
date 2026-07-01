import { LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Optional 7-point daily trend for mini sparkline */
  sparkData?: number[];
  trend?: { value: number; label?: string };
}

const VARIANT_ICON: Record<string, string> = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
};

const VARIANT_SPARK: Record<string, string> = {
  default: 'var(--mvair-primary)',
  success: 'var(--mvair-success)',
  warning: 'var(--mvair-warning)',
  danger:  'var(--mvair-danger)',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  sparkData,
  trend,
}: KPICardProps) {
  const sparkColor = VARIANT_SPARK[variant];
  const chartData = sparkData?.map((v, i) => ({ i, v })) ?? [];

  return (
    <div className="card p-5 flex flex-col gap-3">
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </div>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-page ${VARIANT_ICON[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value row — split with sparkline when available */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-[28px] font-bold leading-none text-text-primary">{value}</div>
          {trend && (
            <div className={`text-[11px] font-semibold mt-1 ${trend.value >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%{trend.label ? ` ${trend.label}` : ''}
            </div>
          )}
          {subtitle && !trend && (
            <div className="text-[11px] text-text-muted mt-1">{subtitle}</div>
          )}
        </div>

        {/* Mini sparkline */}
        {chartData.length > 1 && (
          <div className="w-[72px] h-[36px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <defs>
                  <linearGradient id={`sg-${variant}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sparkColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  fill={`url(#sg-${variant})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Subtitle when there's a trend (show below trend) */}
      {subtitle && trend && (
        <div className="text-[11px] text-text-muted">{subtitle}</div>
      )}
    </div>
  );
}
