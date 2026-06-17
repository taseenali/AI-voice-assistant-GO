import { StatusDot } from '../../shared/StatusDot';

interface StatusCardProps {
  title: string;
  status: string;
  loading: boolean;
  details?: Record<string, string | undefined>;
}

export function StatusCard({ title, status, loading, details }: StatusCardProps) {
  const getStatusType = (s: string): 'online' | 'offline' | 'warning' => {
    const upper = s.toUpperCase();
    if (upper === 'UP' || upper === 'AVAILABLE') return 'online';
    if (upper === 'DOWN' || upper === 'UNAVAILABLE') return 'offline';
    return 'warning';
  };

  const getStatusColor = (s: string): string => {
    const upper = s.toUpperCase();
    if (upper === 'UP' || upper === 'AVAILABLE') return 'text-success';
    if (upper === 'DOWN' || upper === 'UNAVAILABLE') return 'text-danger';
    return 'text-warning';
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded shimmer" />
          <div className="h-3 w-24 bg-gray-200 rounded shimmer" />
          <div className="h-3 w-48 bg-gray-200 rounded shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-section-heading font-semibold text-text-primary">
          {title}
        </h3>
        <StatusDot status={getStatusType(status)} pulse={getStatusType(status) === 'online'} />
      </div>
      <div className={`text-kpi font-bold mb-3 ${getStatusColor(status)}`}>
        {status}
      </div>
      {details && (
        <div className="space-y-2">
          {Object.entries(details).map(([key, value]) => {
            if (!value) return null;
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="text-text-muted capitalize">{key}:</span>
                <span className="text-text-secondary font-mono text-xs">{value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}