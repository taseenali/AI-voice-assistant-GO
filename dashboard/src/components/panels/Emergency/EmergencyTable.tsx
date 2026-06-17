import { Table, type Column } from '../../shared/Table';
import { Badge } from '../../shared/Badge';

export interface EmergencyEvent {
  id: string;
  sessionId: string;
  detectedAt: string;
  keyword: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
  notes?: string;
}

const columns: Column<EmergencyEvent>[] = [
  {
    key: 'detectedAt',
    header: 'Time',
    render: (e: EmergencyEvent) => new Date(e.detectedAt).toLocaleTimeString(),
  },
  {
    key: 'sessionId',
    header: 'Session',
    className: 'font-mono text-xs',
  },
  {
    key: 'keyword',
    header: 'Keyword Triggered',
    render: (e: EmergencyEvent) => (
      <span className="text-text-primary font-medium">{e.keyword}</span>
    ),
  },
  {
    key: 'severity',
    header: 'Severity',
    render: (e: EmergencyEvent) => {
      const variantMap: Record<string, 'danger' | 'warning' | 'neutral'> = {
        high: 'danger',
        medium: 'warning',
        low: 'neutral',
      };
      return <Badge label={e.severity.toUpperCase()} variant={variantMap[e.severity]} />;
    },
  },
  {
    key: 'resolved',
    header: 'Status',
    render: (e: EmergencyEvent) =>
      e.resolved ? (
        <Badge label="Resolved" variant="success" />
      ) : (
        <Badge label="Active" variant="danger" />
      ),
  },
];

interface EmergencyTableProps {
  events: EmergencyEvent[];
  onEventClick?: (event: EmergencyEvent) => void;
}

export function EmergencyTable({ events, onEventClick }: EmergencyTableProps) {
  return (
    <Table
      columns={columns}
      data={events}
      keyExtractor={(e) => e.id}
      onRowClick={onEventClick}
      emptyMessage="No emergency events detected"
    />
  );
}