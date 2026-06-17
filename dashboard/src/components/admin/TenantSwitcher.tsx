import { useTenants } from '../../hooks/useTenants';
import { useAuth } from '../../context/AuthContext';

export function TenantSwitcher() {
  const { viewingTenantId, setViewingTenantId, isSuperAdmin } = useAuth();
  const { tenants, loading } = useTenants();

  if (!isSuperAdmin) return null;

  return (
    <div className="px-6 mb-4">
      <label htmlFor="tenant-switcher" className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 block mb-1">
        Viewing tenant
      </label>
      <select
        id="tenant-switcher"
        value={viewingTenantId}
        onChange={(e) => setViewingTenantId(e.target.value)}
        disabled={loading || tenants.length === 0}
        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-primary"
      >
        {tenants.length === 0 ? (
          <option value={viewingTenantId}>{viewingTenantId}</option>
        ) : (
          tenants.map((t) => (
            <option key={t.tenant_id} value={t.tenant_id}>
              {t.company_name} ({t.tenant_id})
            </option>
          ))
        )}
      </select>
    </div>
  );
}
