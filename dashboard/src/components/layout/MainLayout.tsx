import { Outlet } from 'react-router-dom';
import { Eye, Building2, Sun, Moon, AlignJustify, AlignLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toast } from '../shared/Toast.tsx';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useTenants } from '../../hooks/useTenants';
import { useTheme } from '../../context/ThemeContext';

function prettyTenant(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function MainLayout() {
  const { toasts, removeToast } = useToast();
  const { isSuperAdmin, viewingTenantId } = useAuth();
  const { tenants } = useTenants();
  const { theme, density, toggleTheme, toggleDensity } = useTheme();

  const viewingTenant = tenants.find((t) => t.tenant_id === viewingTenantId);
  const displayName = viewingTenant?.company_name ?? prettyTenant(viewingTenantId);
  const planTier = viewingTenant?.plan_tier;

  return (
    <div className="flex min-h-screen bg-page overflow-x-hidden">
      <Sidebar />

      <div className="ml-[220px] flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-12 border-b border-card-border bg-page flex items-center justify-end px-6 gap-2 shrink-0 sticky top-0 z-20">
          <button
            type="button"
            onClick={toggleDensity}
            title={density === 'comfortable' ? 'Switch to compact' : 'Switch to comfortable'}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors"
          >
            {density === 'comfortable' ? (
              <AlignJustify className="w-4 h-4" />
            ) : (
              <AlignLeft className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
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
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
