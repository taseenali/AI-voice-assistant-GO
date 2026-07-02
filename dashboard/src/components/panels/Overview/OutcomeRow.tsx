import type { Session } from '../../../types/session';
import { CheckCircle, UserCheck, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  sessions: Session[];
}

export function OutcomeRow({ sessions }: Props) {
  const navigate = useNavigate();

  if (sessions.length === 0) return null;

  const total = sessions.length;
  const leads = sessions.filter((s) => s.leadCaptured).length;
  const emergencies = sessions.filter((s) => s.emergencyDetected).length;
  const completed = sessions.filter((s) => !s.emergencyDetected && !s.leadCaptured).length;
  const captureRate = total > 0 ? Math.round((leads / total) * 100) : 0;

  const segments = [
    {
      label: 'Lead captured',
      count: leads,
      pct: captureRate,
      color: 'bg-primary',
      icon: UserCheck,
      iconColor: 'text-primary',
      bg: 'bg-primary/8',
    },
    {
      label: 'Emergency',
      count: emergencies,
      pct: total > 0 ? Math.round((emergencies / total) * 100) : 0,
      color: 'bg-danger',
      icon: AlertTriangle,
      iconColor: 'text-danger',
      bg: 'bg-danger/8',
    },
    {
      label: 'Info / other',
      count: completed,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      color: 'bg-app-muted',
      icon: Info,
      iconColor: 'text-text-secondary',
      bg: 'bg-page',
    },
  ];

  return (
    <div className="card px-5 py-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Outcome funnel — all sessions
        </span>
        <button
          type="button"
          onClick={() => navigate('/app/calls')}
          className="text-xs text-primary font-semibold hover:underline"
        >
          View calls
        </button>
      </div>

      {/* Funnel bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all`}
            style={{ width: `${seg.pct}%`, minWidth: seg.count > 0 ? 4 : 0 }}
          />
        ))}
        {total === 0 && <div className="bg-skeleton flex-1" />}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className={`rounded-lg ${seg.bg} px-3 py-2.5 flex items-center gap-2.5`}>
            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${seg.bg}`}>
              <seg.icon className={`w-3.5 h-3.5 ${seg.iconColor}`} />
            </div>
            <div>
              <div className="text-[17px] font-semibold text-text-primary leading-none">{seg.count}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">
                {seg.label} <span className="text-text-muted">({seg.pct}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
