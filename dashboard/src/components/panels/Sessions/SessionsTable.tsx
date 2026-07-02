import { Table } from '../../shared/Table';
import { buildSessionColumns } from '../../../lib/session-columns';
import type { Session } from '../../../types/session';

const columns = buildSessionColumns({ includeEmergency: true, includeRecording: true });

interface SessionsTableProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function SessionsTable({ sessions, onSessionClick, hasMore, loadingMore, onLoadMore }: SessionsTableProps) {
  return (
    <div>
      <Table
        columns={columns}
        data={sessions}
        keyExtractor={(s) => s.sessionId}
        onRowClick={onSessionClick}
        emptyMessage="No sessions recorded"
      />
      {hasMore && (
        <div className="px-5 py-3 border-t border-card-border">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
