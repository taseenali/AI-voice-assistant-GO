interface LoadingStateProps {
  lines?: number;
  variant?: 'card' | 'table' | 'panel';
}

export function LoadingState({ lines = 3, variant = 'card' }: LoadingStateProps) {
  if (variant === 'panel') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded shimmer" />
        <div className="h-4 w-96 bg-gray-200 rounded shimmer" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-card shimmer" />
          <div className="h-48 bg-gray-200 rounded-card shimmer" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-gray-200 rounded shimmer" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-3 w-16 bg-gray-200 rounded shimmer mb-2" />
          <div className="h-8 w-24 bg-gray-200 rounded shimmer" />
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded shimmer" />
      </div>
      <div className="h-4 w-32 bg-gray-200 rounded shimmer" />
    </div>
  );
}