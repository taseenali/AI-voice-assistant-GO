import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../../../types/session';

interface Props {
  sessions: Session[];
}

function deriveInsight(sessions: Session[]): { title: string; body: string; target: string } | null {
  if (sessions.length === 0) return null;

  const total = sessions.length;
  const phoneSessions = sessions.filter((s) => s.channel === 'phone');
  const leads = sessions.filter((s) => s.leadCaptured);
  const captureRate = total > 0 ? Math.round((leads.length / total) * 100) : 0;

  // After-hours: calls that started before 9am or after 6pm
  const afterHours = phoneSessions.filter((s) => {
    const h = new Date(s.startTime).getHours();
    return h < 9 || h >= 18;
  });

  if (afterHours.length > 0 && phoneSessions.length > 0) {
    const ahPct = Math.round((afterHours.length / phoneSessions.length) * 100);
    return {
      title: `${ahPct}% of calls arrive outside business hours`,
      body: `Aria answered ${afterHours.length} after-hours call${afterHours.length !== 1 ? 's' : ''} that would have gone to voicemail — keeping patients captured without extra staff cost.`,
      target: '/app/analytics',
    };
  }

  if (captureRate >= 50) {
    return {
      title: `${captureRate}% lead capture rate across ${total} session${total !== 1 ? 's' : ''}`,
      body: `Aria is capturing leads at a strong rate. Every lead includes name, phone, and reason for visit — ready for the clinic to follow up.`,
      target: '/app/leads',
    };
  }

  return {
    title: `${total} session${total !== 1 ? 's' : ''} processed by Aria`,
    body: `Aria has handled ${total} interaction${total !== 1 ? 's' : ''} so far. Lead capture, appointment bookings, and emergency triage are all logged automatically.`,
    target: '/app/analytics',
  };
}

export function AIInsightCard({ sessions }: Props) {
  const navigate = useNavigate();
  const insight = deriveInsight(sessions);

  if (!insight) return null;

  return (
    <div className="card px-5 py-4 mb-6" style={{ background: 'linear-gradient(160deg, var(--mvair-primary-light) 0%, transparent 100%)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">AI Insight</span>
      </div>
      <h3 className="text-[15px] font-semibold text-text-primary leading-snug mb-2">{insight.title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{insight.body}</p>
      <button
        type="button"
        onClick={() => navigate(insight.target)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        See analysis <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
