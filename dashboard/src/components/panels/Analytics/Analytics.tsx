import { useState } from 'react';
import { TrendingUp, Phone, Users, CalendarDays, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className={`card p-5 ${highlight ? 'border-primary/30' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
        <span className={`p-1.5 rounded-lg ${highlight ? 'bg-primary/10 text-primary' : 'bg-page text-text-secondary'}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="text-2xl font-display font-bold text-text-primary">{value}</div>
      {sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
    </div>
  );
}

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-32 text-text-secondary truncate">{label}</div>
      <div className="flex-1 bg-page rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-right text-text-primary font-medium tabular-nums">{value}</div>
    </div>
  );
}

const WINDOW_OPTIONS = [7, 14, 30, 90] as const;
type WindowDays = (typeof WINDOW_OPTIONS)[number];

export function Analytics() {
  const [days, setDays] = useState<WindowDays>(30);
  const { data, loading, error } = useAnalytics(days);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle={`${days}-day rolling view`}
        action={
          <div className="flex gap-1 p-1 bg-page border border-card-border rounded-lg">
            {WINDOW_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  days === d
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        }
      />

      {loading && <LoadingState variant="panel" />}

      {error && (
        <div className="card p-6 text-center text-danger text-sm">{error}</div>
      )}

      {data && (
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Calls"
              value={data.totals.calls}
              sub={`${data.totals.phone_calls} phone`}
              icon={Phone}
              highlight
            />
            <StatCard
              label="Leads Captured"
              value={data.totals.leads}
              sub={`${data.rates.lead_conversion_pct}% conversion`}
              icon={Users}
            />
            <StatCard
              label="Appointments"
              value={data.totals.appointments}
              sub={`${data.rates.booking_rate_pct}% booking rate`}
              icon={CalendarDays}
            />
            <StatCard
              label="Emergencies"
              value={data.totals.emergencies}
              icon={AlertTriangle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Avg Call Duration"
              value={data.performance.avg_duration_seconds > 0
                ? `${Math.floor(data.performance.avg_duration_seconds / 60)}m ${data.performance.avg_duration_seconds % 60}s`
                : '—'}
              icon={Clock}
            />
            <StatCard
              label="Avg Cost / Call"
              value={data.performance.avg_cost_usd > 0
                ? `$${data.performance.avg_cost_usd.toFixed(4)}`
                : '—'}
              sub={data.performance.total_cost_usd > 0
                ? `$${data.performance.total_cost_usd.toFixed(2)} total`
                : undefined}
              icon={DollarSign}
            />
            <StatCard
              label="Lead Conversion"
              value={`${data.rates.lead_conversion_pct}%`}
              sub="calls that captured a lead"
              icon={TrendingUp}
            />
          </div>

          {/* Daily sparkline table */}
          {data.daily.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Daily Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left text-xs font-semibold text-text-secondary pb-2 pr-4">Date</th>
                      <th className="text-right text-xs font-semibold text-text-secondary pb-2 px-3">Calls</th>
                      <th className="text-right text-xs font-semibold text-text-secondary pb-2 px-3">Leads</th>
                      <th className="text-right text-xs font-semibold text-text-secondary pb-2 px-3">Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.slice(-14).map((d) => (
                      <tr key={d.date} className="border-b border-card-border/50 last:border-0">
                        <td className="py-2 pr-4 font-mono text-xs text-text-secondary">{d.date}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{d.calls}</td>
                        <td className="py-2 px-3 text-right tabular-nums text-primary">{d.leads}</td>
                        <td className="py-2 px-3 text-right tabular-nums text-text-primary">{d.bookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top reasons */}
          {data.top_reasons.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Top Visit Reasons</h3>
              <div className="space-y-3">
                {data.top_reasons.map((r) => (
                  <MiniBar
                    key={r.reason}
                    label={r.reason}
                    value={r.count}
                    max={data.top_reasons[0].count}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
