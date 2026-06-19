import { useNavigate } from 'react-router-dom';
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

interface EmergencyTableProps {
  events: EmergencyEvent[];
  onEventClick?: (event: EmergencyEvent) => void;
}

export function EmergencyTable({ events, onEventClick }: EmergencyTableProps) {
  const navigate = useNavigate();

  const columns: Column<EmergencyEvent>[] = [
    {
      key: 'detectedAt',
      header: 'Detected',
      render: (e: EmergencyEvent) => {
        const d = new Date(e.detectedAt);
        return (
          <span title={d.toISOString()}>
            {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        );
      },
    },
    {
      key: 'sessionId',
      header: 'Session',
      render: (e: EmergencyEvent) => (
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            navigate('/app/sessions', { state: { highlightSessionId: e.sessionId } });
          }}
          className="font-mono text-xs text-primary hover:underline truncate max-w-[140px] block text-left"
          title={`View session ${e.sessionId}`}
        >
          {e.sessionId}
        </button>
      ),
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
