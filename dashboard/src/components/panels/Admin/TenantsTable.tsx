import { Table, type Column } from '../../shared/Table';
import { Badge } from '../../shared/Badge';
import type { TenantSummary } from '../../../types/tenant';

function statusVariant(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'trial') return 'warning';
  if (status === 'suspended') return 'danger';
  return 'neutral';
}

interface TenantsTableProps {
  tenants: TenantSummary[];
  activeTenantId: string;
  onSelectTenant: (tenantId: string) => void;
}

export function TenantsTable({ tenants, activeTenantId, onSelectTenant }: TenantsTableProps) {
  const columns: Column<TenantSummary>[] = [
    {
      key: 'tenant_id',
      header: 'Tenant ID',
      className: 'font-mono text-xs',
    },
    {
      key: 'company_name',
      header: 'Clinic',
      render: (t) => <span className="font-medium text-text-primary">{t.company_name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <Badge label={t.status} variant={statusVariant(t.status)} />,
    },
    {
      key: 'plan_tier',
      header: 'Plan',
      render: (t) => t.plan_tier || '—',
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (t) => new Date(t.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (t) =>
        t.tenant_id === activeTenantId ? (
          <Badge label="Viewing" variant="default" />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTenant(t.tenant_id);
            }}
            className="text-sm text-primary hover:underline"
          >
            View as
          </button>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={tenants}
      keyExtractor={(t) => t.tenant_id}
      onRowClick={(t) => onSelectTenant(t.tenant_id)}
      emptyMessage="No tenants found"
    />
  );
}
