import type { Config } from '../../../types/config';

interface JSONViewProps {
  config: Config;
}

export function JSONView({ config }: JSONViewProps) {
  const jsonString = JSON.stringify(config, null, 2);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-section-heading font-semibold text-text-primary">
          Raw Configuration JSON
        </h3>
        <span className="text-xs text-text-muted">
          {Object.keys(config).length} keys
        </span>
      </div>
      <pre className="bg-gray-900 text-green-400 rounded-card p-6 overflow-x-auto text-xs font-mono leading-relaxed max-h-[600px] overflow-y-auto">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}