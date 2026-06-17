import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'info' | 'warning' | 'success';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'info',
}: EmptyStateProps) {
  const variantClasses = {
    info: 'text-primary',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className={`w-16 h-16 ${variantClasses[variant]} mb-4`} />
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-md mb-2">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}