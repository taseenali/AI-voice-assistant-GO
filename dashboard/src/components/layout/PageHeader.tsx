import type { ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  if (!title && !subtitle && !action) return null;
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {title && (
          <h1 className="text-page-title font-display font-medium tracking-tight text-text-primary">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-text-muted mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}