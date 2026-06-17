interface StatusDotProps {
  status: 'online' | 'offline' | 'warning';
  pulse?: boolean;
  label?: string;
}

export function StatusDot({ status, pulse = false, label }: StatusDotProps) {
  const statusClass = {
    online: 'status-dot-online',
    offline: 'status-dot-offline',
    warning: 'w-2 h-2 rounded-full bg-warning',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`${statusClass[status]} ${pulse && status === 'online' ? 'animate-pulse' : ''}`} />
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </div>
  );
}