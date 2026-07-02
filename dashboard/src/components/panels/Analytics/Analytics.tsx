import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Funnel as ReFunnel, FunnelChart, LabelList,
} from 'recharts';
import { TrendingUp, AlertTriangle, Sparkles, Phone, Users, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';

const WINDOW_OPTIONS = [7, 14, 30, 90] as const;
type WindowDays = (typeof WINDOW_OPTIONS)[number];

/* ── tiny subcomponents ── */

function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`card p-4 ${accent ? 'border-primary/30' : ''}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
        <span className={`p-1.5 rounded-lg ${accent ? 'bg-primary/10 text-primary' : 'bg-page text-text-secondary'}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="text-[26px] font-display font-bold text-text-primary leading-none">{value}</div>
      {sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
    </div>
  );
}

function InsightCard({ icon: Icon, tone, title, body }: {
  icon: React.ElementType; tone: 'success' | 'warning' | 'accent';
  title: string; body: string;
}) {
  const color = { success: 'text-success border-success/40', warning: 'text-warning border-warning/40', accent: 'text-primary border-primary/40' }[tone];
  return (
    <div className={`card p-4 border-t-2 ${color.split(' ').slice(1).join(' ')}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color.split(' ')[0]}`} />
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed m-0">{body}</p>
    </div>
  );
}

const COLORS = [
  'var(--mvair-primary)',
  'var(--mvair-accent)',
  'var(--mvair-success)',
  'var(--mvair-warning)',
  'var(--mvair-danger)',
  '#8B5CF6',
];

export function Analytics() {
  const location = useLocation();
  const navDays = (location.state as { days?: number } | null)?.days;
  const initialDays: WindowDays = WINDOW_OPTIONS.includes(navDays as WindowDays) ? (navDays as WindowDays) : 30;
  const [days, setDays] = useState<WindowDays>(initialDays);
  const { data, loading, error } = useAnalytics(days);

  // Sync when navigated from topbar with a new days value
  useEffect(() => {
    if (navDays && WINDOW_OPTIONS.includes(navDays as WindowDays)) {
      setDays(navDays as WindowDays);
    }
  }, [navDays]);

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  };

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
                  days === d ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        }
      />

      {loading && <LoadingState variant="panel" />}
      {error && <div className="card p-6 text-center text-danger text-sm">{error}</div>}

      {data && (
        <div className="space-y-5">
          {/* AI insight callouts */}
          <div className="grid grid-cols-3 gap-4">
            {data.rates.lead_conversion_pct >= 50 ? (
              <InsightCard icon={TrendingUp} tone="success"
                title={`${data.rates.lead_conversion_pct}% lead conversion`}
                body="Above-average capture rate — Aria is collecting patient details on over half of all calls."
              />
            ) : (
              <InsightCard icon={AlertTriangle} tone="warning"
                title={`${data.rates.lead_conversion_pct}% lead conversion`}
                body="Capture rate is below 50%. Consider reviewing Aria's lead collection flow in the config."
              />
            )}
            <InsightCard icon={Sparkles} tone="accent"
              title={`${data.totals.calls} call${data.totals.calls !== 1 ? 's' : ''} handled`}
              body={`Aria answered every call in the ${days}-day window. ${data.totals.phone_calls} via phone.`}
            />
            <InsightCard icon={CalendarDays} tone="success"
              title={`${data.rates.booking_rate_pct}% booking rate`}
              body={`${data.totals.appointments} appointment${data.totals.appointments !== 1 ? 's' : ''} confirmed over the period.`}
            />
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Calls" value={data.totals.calls} sub={`${data.totals.phone_calls} phone`} icon={Phone} accent />
            <StatCard label="Leads" value={data.totals.leads} sub={`${data.rates.lead_conversion_pct}% conversion`} icon={Users} />
            <StatCard label="Avg Duration" value={data.performance.avg_duration_seconds > 0
              ? `${Math.floor(data.performance.avg_duration_seconds / 60)}m ${data.performance.avg_duration_seconds % 60}s` : '—'}
              icon={Clock} />
            <StatCard label="Avg Cost" value={data.performance.avg_cost_usd > 0
              ? `$${data.performance.avg_cost_usd.toFixed(4)}` : '—'}
              sub={data.performance.total_cost_usd > 0 ? `$${data.performance.total_cost_usd.toFixed(2)} total` : undefined}
              icon={DollarSign} />
          </div>

          {/* Trend line + funnel */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Call volume &amp; leads trend</h3>
              {data.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--mvair-border)" />
                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--mvair-dark)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                      labelFormatter={fmtDate}
                    />
                    <Line type="monotone" dataKey="calls" stroke="var(--mvair-primary)" strokeWidth={2} dot={false} name="Calls" />
                    <Line type="monotone" dataKey="leads" stroke="var(--mvair-accent)" strokeWidth={2} dot={false} name="Leads" />
                    <Line type="monotone" dataKey="bookings" stroke="var(--mvair-success)" strokeWidth={2} dot={false} name="Bookings" />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--mvair-text-secondary)' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">No daily data yet</div>
              )}
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Outcome funnel</h3>
              {data.totals.calls > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <FunnelChart>
                    <Tooltip contentStyle={{ background: 'var(--mvair-dark)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <ReFunnel
                      dataKey="value"
                      data={[
                        { name: 'Calls answered', value: data.totals.calls, fill: 'var(--mvair-primary)' },
                        { name: 'Leads captured', value: data.totals.leads, fill: 'var(--mvair-accent)' },
                        { name: 'Appointments', value: data.totals.appointments, fill: 'var(--mvair-success)' },
                        { name: 'Emergencies', value: data.totals.emergencies, fill: 'var(--mvair-danger)' },
                      ].filter((s) => s.value > 0)}
                      isAnimationActive
                    >
                      <LabelList position="right" fill="var(--mvair-text-secondary)" style={{ fontSize: 11 }} />
                    </ReFunnel>
                  </FunnelChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">No data yet</div>
              )}
              {data.totals.calls > 0 && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-primary/8 text-xs text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">
                    {Math.round(((data.totals.leads + data.totals.appointments) / data.totals.calls) * 100)}%
                  </strong>{' '}
                  of calls end with a lead or booking.
                </div>
              )}
            </div>
          </div>

          {/* Intent donut + reasons bar */}
          <div className="grid grid-cols-2 gap-4">
            {data.top_reasons.length > 0 && (
              <>
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Top visit reasons</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.top_reasons.slice(0, 6)}
                        dataKey="count"
                        nameKey="reason"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={46}
                        paddingAngle={2}
                      >
                        {data.top_reasons.slice(0, 6).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--mvair-dark)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--mvair-text-secondary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Volume by reason</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      layout="vertical"
                      data={data.top_reasons.slice(0, 6)}
                      margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--mvair-border)" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} allowDecimals={false} />
                      <YAxis type="category" dataKey="reason" tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} width={110} />
                      <Tooltip contentStyle={{ background: 'var(--mvair-dark)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="count" fill="var(--mvair-primary)" radius={[0, 4, 4, 0]} name="Calls" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {data.top_reasons.length === 0 && data.daily.length > 0 && (
              <div className="card p-5 col-span-2">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Daily breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--mvair-border)" />
                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--mvair-text-secondary)' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'var(--mvair-dark)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} labelFormatter={fmtDate} />
                    <Bar dataKey="calls" fill="var(--mvair-primary)" name="Calls" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="leads" fill="var(--mvair-accent)" name="Leads" radius={[3, 3, 0, 0]} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--mvair-text-secondary)' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
