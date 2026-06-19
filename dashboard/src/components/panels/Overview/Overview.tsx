import { useNavigate } from 'react-router-dom';
import { useSessions } from '../../../hooks/useSessions';
import { KPIRow } from './KPIRow';
import { RecentSessionsTable } from './RecentSessionsTable';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { Calendar } from 'lucide-react';

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function Overview() {
  const navigate = useNavigate();
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
        avgDuration={formatDuration(stats?.avgDuration || 0)}
        emergencies={stats?.emergenciesToday || 0}
      />
      <RecentSessionsTable
        sessions={sessions}
        onSessionClick={() => navigate('/app/sessions')}
      />
    </div>
  );
}