import { Table } from '../../shared/Table';
import { buildSessionColumns } from '../../../lib/session-columns';
import type { Session } from '../../../types/session';

const columns = buildSessionColumns({ includeRecording: false });

interface RecentSessionsTableProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
}

export function RecentSessionsTable({
  sessions,
  onSessionClick,
}: RecentSessionsTableProps) {
  return (
    <div>
      <h3 className="text-section-heading font-semibold text-text-primary mb-4">
        Recent Sessions
      </h3>
      <Table
        columns={columns}
        data={sessions.slice(0, 10)}
        keyExtractor={(s) => s.sessionId}
        onRowClick={onSessionClick}
        emptyMessage="No sessions recorded today"
      />
    </div>
  );
}
