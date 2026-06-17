import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Toast } from '../shared/Toast.tsx';
import { useToast } from '../../hooks/useToast';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex min-h-screen bg-page overflow-x-hidden">
      <Sidebar />
      <main className="ml-[220px] flex-1 min-w-0 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
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
