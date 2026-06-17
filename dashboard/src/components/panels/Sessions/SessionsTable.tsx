import { Table } from '../../shared/Table';
import { buildSessionColumns } from '../../../lib/session-columns';
import type { Session } from '../../../types/session';

const columns = buildSessionColumns({ includeEmergency: true, includeRecording: true });

interface SessionsTableProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
}

export function SessionsTable({ sessions, onSessionClick }: SessionsTableProps) {
  return (
    <Table
      columns={columns}
      data={sessions}
      keyExtractor={(s) => s.sessionId}
      onRowClick={onSessionClick}
      emptyMessage="No sessions recorded"
    />
  );
}
