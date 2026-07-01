import { Radio } from 'lucide-react';

export function LiveMonitor() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Radio className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-page-title font-display font-semibold text-text-primary">Live Monitor</h1>
      <p className="text-text-secondary max-w-sm">
        Real-time call transcript view. Streams live as Aria speaks with patients.
      </p>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
        Coming in next sprint
      </span>
    </div>
  );
}
