import { Table, type Column } from '../../shared/Table';
import { Badge } from '../../shared/Badge';
import type { Lead } from '../../../types/lead';

const columns: Column<Lead>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (lead: Lead) => lead.name || <span className="text-text-muted italic">Unknown</span>,
  },
  {
    key: 'patient_type',
    header: 'Type',
    render: (lead: Lead) => (
      lead.patient_type ? (
        <Badge
          label={lead.patient_type === 'new' ? 'New' : 'Returning'}
          variant={lead.patient_type === 'new' ? 'default' : 'neutral'}
        />
      ) : (
        <span className="text-text-muted">—</span>
      )
    ),
  },
  {
    key: 'service',
    header: 'Service',
    render: (lead: Lead) =>
      lead.service ? <Badge label={lead.service} /> : <span className="text-text-muted">—</span>,
  },
  {
    key: 'urgency',
    header: 'Urgency',
    render: (lead: Lead) =>
      lead.urgency ? (
        <Badge
          label={lead.urgency}
          variant={lead.urgency === 'urgent' ? 'danger' : 'neutral'}
        />
      ) : (
        <span className="text-text-muted">—</span>
      ),
  },
  {
    key: 'completeness',
    header: 'Complete',
    render: (lead: Lead) => {
      const pct = lead.completeness;
      const colorClass =
        pct >= 75 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-text-muted';
      return <span className={`font-medium ${colorClass}`}>{pct}%</span>;
    },
  },
  {
    key: 'capturedAt',
    header: 'Captured',
    render: (lead: Lead) => {
      const d = new Date(lead.capturedAt);
      return (
        <span title={d.toISOString()}>
          {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    },
  },
];

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  return (
    <Table
      columns={columns}
      data={leads}
      keyExtractor={(l) => `${l.capturedAt}::${l.name ?? ''}::${l.client_id}`}
      onRowClick={onLeadClick}
      emptyMessage="No leads captured yet"
    />
  );
}