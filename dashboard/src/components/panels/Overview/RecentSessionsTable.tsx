import { useNavigate } from 'react-router-dom';
import { ChannelBadge } from '../../shared/ChannelBadge';
import { PhoneDisplay } from '../../shared/SessionFieldCells';
import { Badge } from '../../shared/Badge';
import type { Session } from '../../../types/session';

function OutcomePill({ session }: { session: Session }) {
  if (session.emergencyDetected) return <Badge label="emergency" variant="danger" />;
  const intentLower = (session.intent ?? '').toLowerCase();
  if (session.leadCaptured && (intentLower.includes('appoint') || intentLower.includes('book'))) {
    return <Badge label="Booked" variant="success" />;
  }
  if (session.leadCaptured) return <Badge label="Lead captured" variant="success" />;
  if (session.intent) return <Badge label={session.intent} intent={session.intent} />;
  return <span className="text-text-muted text-xs">—</span>;
}

interface Props {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
}

export function RecentSessionsTable({ sessions, onSessionClick }: Props) {
  const navigate = useNavigate();
  const rows = sessions.slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-text-primary">Recent calls</h3>
        <button
          type="button"
          onClick={() => navigate('/app/calls')}
          className="text-[11px] text-primary font-semibold hover:underline"
        >
          View all calls
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              {['CHANNEL', 'CALLER', 'INTENT', 'OUTCOME'].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {h}
                </th>
              ))}
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">
                  No calls recorded yet
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr
                  key={s.sessionId}
                  className="border-b border-card-border/60 last:border-0 hover:bg-page transition-colors cursor-pointer"
                  onClick={() => onSessionClick?.(s)}
                >
                  <td className="px-4 py-3">
                    <ChannelBadge channel={s.channel} />
                  </td>
                  <td className="px-4 py-3">
                    <PhoneDisplay number={s.phoneNumber} channel={s.channel} />
                  </td>
                  <td className="px-4 py-3">
                    {s.intent ? (
                      <Badge label={s.intent} intent={s.intent} />
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <OutcomePill session={s} />
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs">›</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
