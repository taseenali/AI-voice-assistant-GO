import { useEffect, useState } from 'react';
import { DollarSign, Phone, Clock, TrendingUp } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';

interface CostsResponse {
  window_days: number;
  costs: { date: string; cost_usd: number }[];
  total_usd: number;
}

interface OverviewResponse {
  totals: { calls: number };
  performance: { avg_duration_seconds: number; total_cost_usd: number; avg_cost_usd: number };
}

export function Billing() {
  const [costs, setCosts] = useState<CostsResponse | null>(null);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<CostsResponse>('/api/analytics/costs?days=30'),
      api.get<OverviewResponse>('/api/analytics/overview?days=30'),
    ])
      .then(([c, o]) => { setCosts(c); setOverview(o); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalMinutes = overview
    ? Math.ceil((overview.performance.avg_duration_seconds * overview.totals.calls) / 60)
    : 0;

  const kpis = [
    {
      label: 'Calls (30 days)',
      value: overview ? overview.totals.calls.toLocaleString() : '—',
      icon: Phone,
      color: 'text-primary',
    },
    {
      label: 'Cost (30 days)',
      value: costs ? `$${costs.total_usd.toFixed(4)}` : '—',
      icon: DollarSign,
      color: 'text-success',
    },
    {
      label: 'Avg cost / call',
      value: overview ? `$${overview.performance.avg_cost_usd.toFixed(4)}` : '—',
      icon: TrendingUp,
      color: 'text-accent',
    },
    {
      label: 'Total minutes',
      value: totalMinutes.toLocaleString(),
      icon: Clock,
      color: 'text-warning',
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader title="Billing & Usage" subtitle="Vapi usage costs · last 30 days" />
        <span className="text-xs text-text-muted border border-card-border rounded px-2 py-1 shrink-0">
          Stripe invoicing — Gate 2
        </span>
      </div>

      {loading ? (
        <LoadingState variant="panel" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {kpis.map((k) => (
              <div key={k.label} className="card px-5 py-5">
                <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                  {k.label}
                </div>
                <div className="text-kpi font-semibold text-text-primary leading-none">{k.value}</div>
              </div>
            ))}
          </div>

          {costs && costs.costs.length > 0 && (
            <div className="card px-5 py-5 mb-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-4">Daily cost breakdown</h3>
              <div className="space-y-1.5">
                {costs.costs.slice(-14).map((row) => (
                  <div key={row.date} className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-24 shrink-0 font-mono">{row.date}</span>
                    <div className="flex-1 h-2 bg-page rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.min(100, (row.cost_usd / Math.max(...costs.costs.map(c => c.cost_usd))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-primary w-16 text-right shrink-0">
                      ${row.cost_usd.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card px-5 py-5">
            <p className="text-sm text-text-secondary">
              Full Stripe billing integration is planned for Gate 2 (post-client signing). Cost data above is
              sourced from Vapi's <code className="font-mono text-xs bg-page px-1 py-0.5 rounded">cost_usd</code>{' '}
              field stored per session.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
