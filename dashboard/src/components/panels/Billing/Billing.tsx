import { useEffect, useState } from 'react';
import { DollarSign, Phone, Clock } from 'lucide-react';
import { api } from '../../../lib/api';

interface BillingSummary {
  totalCalls: number;
  totalCostUsd: number;
  totalMinutes: number;
  period: string;
}

export function Billing() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ sessions?: Array<{ cost_usd?: number; duration_seconds?: number }> }>('/api/sessions?limit=1000')
      .then((data) => {
        const sessions = data.sessions ?? [];
        const totalCalls = sessions.length;
        const totalCostUsd = sessions.reduce((sum, s) => sum + (s.cost_usd ?? 0), 0);
        const totalMinutes = sessions.reduce(
          (sum, s) => sum + Math.ceil((s.duration_seconds ?? 0) / 60),
          0
        );
        setSummary({ totalCalls, totalCostUsd, totalMinutes, period: 'All time' });
      })
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  const kpis = summary
    ? [
        { label: 'Total calls', value: summary.totalCalls.toLocaleString(), icon: Phone, color: 'text-primary' },
        {
          label: 'Total cost',
          value: `$${summary.totalCostUsd.toFixed(4)}`,
          icon: DollarSign,
          color: 'text-success',
        },
        { label: 'Total minutes', value: summary.totalMinutes.toLocaleString(), icon: Clock, color: 'text-warning' },
      ]
    : [];

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-page-title font-display font-semibold text-text-primary">Billing & Usage</h1>
          <p className="text-text-secondary mt-1">Vapi usage costs pulled from session records</p>
        </div>
        <span className="text-xs text-text-muted border border-card-border rounded px-2 py-1">
          Stripe invoicing — Gate 2
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card px-5 py-5 h-24 shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
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
      )}

      <div className="mt-6 card px-5 py-5">
        <p className="text-sm text-text-secondary">
          Full Stripe billing integration is planned for Gate 2 (post-client signing). Cost data above is
          sourced from Vapi's <code className="font-mono text-xs bg-page px-1 py-0.5 rounded">cost_usd</code>{' '}
          field stored per session.
        </p>
      </div>
    </div>
  );
}
