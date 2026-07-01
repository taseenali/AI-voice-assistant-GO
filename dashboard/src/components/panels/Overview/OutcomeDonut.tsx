import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../../../types/session';

interface Props {
  sessions: Session[];
}

function deriveOutcome(s: Session): 'booked' | 'lead' | 'triaged' | 'info' {
  if (s.emergencyDetected) return 'triaged';
  const intentLower = (s.intent ?? '').toLowerCase();
  if (s.leadCaptured && (intentLower.includes('appoint') || intentLower.includes('book'))) return 'booked';
  if (s.leadCaptured) return 'lead';
  return 'info';
}

const SEGMENTS = [
  { key: 'booked',  label: 'Booked',       color: 'var(--mvair-primary)' },
  { key: 'lead',    label: 'Lead captured', color: 'var(--mvair-accent)' },
  { key: 'triaged', label: 'Triaged',       color: 'var(--mvair-warning)' },
  { key: 'info',    label: 'Info only',     color: 'var(--mvair-border)' },
] as const;

type SegKey = (typeof SEGMENTS)[number]['key'];

const EMPTY_DATA = [{ name: 'None', value: 1, color: 'var(--mvair-border)' }];

export function OutcomeDonut({ sessions }: Props) {
  const navigate = useNavigate();
  const total = sessions.length;

  const counts: Record<SegKey, number> = { booked: 0, lead: 0, triaged: 0, info: 0 };
  for (const s of sessions) counts[deriveOutcome(s)]++;

  const chartData = SEGMENTS.map((seg) => ({
    name: seg.label,
    value: counts[seg.key],
    color: seg.color,
  })).filter((d) => d.value > 0);

  const displayData = chartData.length > 0 ? chartData : EMPTY_DATA;

  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Today's outcomes
        </h3>
        <button
          type="button"
          onClick={() => navigate('/app/calls')}
          className="text-[11px] text-primary font-semibold hover:underline"
        >
          View all calls
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative w-[110px] h-[110px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={34}
                outerRadius={52}
                strokeWidth={0}
                dataKey="value"
                isAnimationActive={false}
              >
                {displayData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number, name: string) => [val, name]}
                contentStyle={{
                  background: 'var(--app-card)',
                  border: '1px solid var(--mvair-card-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[22px] font-bold text-text-primary leading-none">{total}</span>
            <span className="text-[10px] text-text-muted mt-0.5">calls</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {SEGMENTS.map((seg) => (
            <div key={seg.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-[12px] text-text-secondary truncate">{seg.label}</span>
              </div>
              <span className="text-[13px] font-semibold text-text-primary shrink-0">
                {counts[seg.key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
