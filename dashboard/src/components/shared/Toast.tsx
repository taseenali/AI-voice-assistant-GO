import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-success',
  error: 'border-danger',
  warning: 'border-warning',
  info: 'border-primary',
};

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = iconMap[type];

  return (
    <div
      className={`card p-4 border-l-4 ${colorMap[type]} shadow-lg flex items-center gap-3 min-w-[300px] max-w-[420px] animate-slide-in`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${
        type === 'success' ? 'text-success' :
        type === 'error' ? 'text-danger' :
        type === 'warning' ? 'text-warning' : 'text-primary'
      }`} />
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}