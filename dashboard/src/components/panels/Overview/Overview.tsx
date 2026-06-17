import { useSessions } from '../../../hooks/useSessions';
import { KPIRow } from './KPIRow';
import { RecentSessionsTable } from './RecentSessionsTable';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { Calendar } from 'lucide-react';

export function Overview() {
  const { sessions, stats, loading } = useSessions();

  if (loading) {
    return (
      <div>
        <PageHeader title="Overview" subtitle="Loading activity..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <div>
        <PageHeader
          title="Overview"
          subtitle="Today's activity"
        />
        <EmptyState
          icon={Calendar}
          title="No session data available"
          description="Sessions appear here from inbound phone calls and the browser voice widget."
          variant="info"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`Today's activity · ${new Date().toLocaleDateString()}`}
      />
      <KPIRow
        totalCalls={stats?.totalToday || 0}
        phoneCalls={stats?.phoneCallsToday || 0}
        webCalls={stats?.webCallsToday || 0}
        leadsCaptured={stats?.leadsToday || 0}
        avgDuration={stats?.avgDuration ? `${stats.avgDuration}s` : '0s'}
        emergencies={stats?.emergenciesToday || 0}
      />
      <RecentSessionsTable
        sessions={sessions}
        onSessionClick={(s) => window.location.hash = `#/sessions#${s.sessionId}`}
      />
    </div>
  );
}