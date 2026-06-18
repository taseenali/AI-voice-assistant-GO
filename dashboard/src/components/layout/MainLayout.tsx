import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toast } from '../shared/Toast.tsx';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div className="flex min-h-screen bg-page overflow-x-hidden">
      <Sidebar />
      <main className="ml-[220px] flex-1 min-w-0 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {isSuperAdmin && (
            <div className="mb-6 flex items-center gap-2 rounded-card border border-primary/20 bg-primary-light px-4 py-2.5 text-sm text-primary">
              <Eye className="w-4 h-4 shrink-0" />
              <span>
                Viewing as <strong className="font-semibold">{prettyTenant(viewingTenantId)}</strong>
              </span>
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
