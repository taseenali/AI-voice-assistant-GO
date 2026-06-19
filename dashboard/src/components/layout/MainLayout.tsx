import type { ReactNode } from 'react';
import { Eye, Building2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toast } from '../shared/Toast.tsx';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useTenants } from '../../hooks/useTenants';

interface MainLayoutProps {
  children: ReactNode;
}

/** Turn a tenant slug ("northgate-family-health") into a readable name. */
function prettyTenant(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function MainLayout({ children }: MainLayoutProps) {
  const { toasts, removeToast } = useToast();
  const { isSuperAdmin, viewingTenantId } = useAuth();
  const { tenants } = useTenants();

  const viewingTenant = tenants.find((t) => t.tenant_id === viewingTenantId);
  const displayName = viewingTenant?.company_name ?? prettyTenant(viewingTenantId);
  const planTier = viewingTenant?.plan_tier;

  return (
    <div className="flex min-h-screen bg-page overflow-x-hidden">
      <Sidebar />
      <main className="ml-[220px] flex-1 min-w-0 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {isSuperAdmin && (
            <div className="mb-6 flex items-center gap-2.5 rounded-card border border-primary/20 bg-primary-light px-4 py-2.5 text-sm text-primary">
              <Building2 className="w-4 h-4 shrink-0" />
              <Eye className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span>
                Viewing as <strong className="font-semibold">{displayName}</strong>
              </span>
              {planTier && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                  {planTier}
                </span>
              )}
              <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                Super-admin
              </span>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
