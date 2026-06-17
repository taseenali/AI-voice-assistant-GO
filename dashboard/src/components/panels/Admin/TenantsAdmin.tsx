import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenants } from '../../../hooks/useTenants';
import { useAuth } from '../../../context/AuthContext';
import { TenantsTable } from './TenantsTable';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { EmptyState } from '../../shared/EmptyState';

export function TenantsAdmin() {
  const { viewingTenantId, setViewingTenantId } = useAuth();
  const { tenants, loading, error } = useTenants();
  const navigate = useNavigate();

  const handleSelect = (tenantId: string) => {
    setViewingTenantId(tenantId);
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Tenants" subtitle="Loading tenant registry..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Tenants" />
        <EmptyState icon={Building2} title="Could not load tenants" description={error} variant="warning" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tenants"
        subtitle={`${tenants.length} clinic${tenants.length !== 1 ? 's' : ''} · scope via ?client= on existing routes`}
      />
      <p className="text-sm text-text-secondary mb-6 max-w-2xl">
        Selecting a tenant switches the dashboard to that clinic&apos;s data. Scope is enforced
        server-side by the same <code className="text-xs bg-gray-100 px-1 rounded">requireDashboardAuth</code>{' '}
        guard clinic users use — super_admin only, via <code className="text-xs bg-gray-100 px-1 rounded">?client=</code>.
      </p>
      <TenantsTable
        tenants={tenants}
        activeTenantId={viewingTenantId}
        onSelectTenant={handleSelect}
      />
    </div>
  );
}
