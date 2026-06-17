import { Table, type Column } from '../../shared/Table';
import { Badge } from '../../shared/Badge';
import type { Appointment } from '../../../types/appointment';

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const columns: Column<Appointment>[] = [
  {
    key: 'startTime',
    header: 'When',
    render: (a) => (
      <span className="text-text-primary font-medium">{formatDateTime(a.startTime)}</span>
    ),
  },
  {
    key: 'patientName',
    header: 'Patient',
    render: (a) => a.patientName || '—',
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (a) => a.reason || '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (a) => (
      <Badge
        label={(a.status || 'confirmed').toUpperCase()}
        variant={a.status === 'cancelled' ? 'neutral' : 'success'}
      />
    ),
  },
  {
    key: 'htmlLink',
    header: 'Calendar',
    render: (a) =>
      a.htmlLink ? (
        <a
          href={a.htmlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Open
        </a>
      ) : (
        '—'
      ),
  },
];

interface AppointmentsTableProps {
  appointments: Appointment[];
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <Table
      columns={columns}
      data={appointments}
      keyExtractor={(a) => a.id}
      emptyMessage="No upcoming appointments"
    />
  );
}
