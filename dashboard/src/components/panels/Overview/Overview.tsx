import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useSessions } from '../../../hooks/useSessions';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { KPIRow } from './KPIRow';
import { OutcomeDonut } from './OutcomeDonut';
import { AIInsightCard } from './AIInsightCard';
import { SystemTrustMini } from './SystemTrustMini';
import { RecentSessionsTable } from './RecentSessionsTable';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingState } from '../../shared/LoadingState';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

export function Overview() {
  const navigate = useNavigate();
  const { sessions, stats, loading } = useSessions();
  const { data: analytics } = useAnalytics(30);
  const [emergencyDismissed, setEmergencyDismissed] = useState(false);

  if (loading) {
    return <LoadingState variant="panel" />;
  }

  if (!loading && sessions.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No session data available"
        description="Sessions appear here from inbound phone calls and the browser voice widget."
        variant="info"
      />
    );
  }

  const openEmergencies = stats?.emergenciesToday ?? 0;
  const showEmergencyBanner = openEmergencies > 0 && !emergencyDismissed;

  return (
    <div>
      {/* Emergency alert banner */}
      {showEmergencyBanner && (
        <div className="mb-5 flex items-start gap-3 rounded-card border border-danger/30 bg-danger/[0.06] px-4 py-3.5 border-l-4 border-l-danger">
          <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-danger">
              {openEmergencies} open emergency{openEmergencies !== 1 ? ' events' : ''} awaiting callback
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Flagged by Aria · escalation protocol triggered
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/emergency')}
            className="px-3 py-1.5 rounded-lg bg-danger text-white text-xs font-semibold hover:bg-danger/90 transition-colors shrink-0"
          >
            Review
          </button>
          <button
            type="button"
            onClick={() => setEmergencyDismissed(true)}
            className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI row with sparklines */}
      <KPIRow
        totalCalls={stats?.totalToday ?? 0}
        phoneCalls={stats?.phoneCallsToday ?? 0}
        webCalls={stats?.webCallsToday ?? 0}
        leadsCaptured={stats?.leadsToday ?? 0}
        bookings={analytics?.totals.appointments ?? 0}
        emergencies={stats?.emergenciesToday ?? 0}
        daily={analytics?.daily ?? []}
      />

      {/* Middle row: donut | AI insight | system trust */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <OutcomeDonut sessions={sessions} />
        <AIInsightCard sessions={sessions} />
        <SystemTrustMini />
      </div>

      {/* Recent calls table */}
      <RecentSessionsTable
        sessions={sessions}
        onSessionClick={() => navigate('/app/calls')}
      />
    </div>
  );
}
