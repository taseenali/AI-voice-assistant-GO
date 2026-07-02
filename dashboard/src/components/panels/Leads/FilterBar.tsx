interface FilterBarProps {
  serviceFilter: string;
  completenessFilter: number;
  onServiceChange: (value: string) => void;
  onCompletenessChange: (value: number) => void;
  services: string[];
}

export function FilterBar({
  serviceFilter,
  completenessFilter,
  onServiceChange,
  onCompletenessChange,
  services,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6 p-4 bg-card-bg border border-card-border rounded-card">
      <div className="flex items-center gap-2">
        <label className="text-xs text-text-muted font-medium">Service:</label>
        <select
          value={serviceFilter}
          onChange={(e) => onServiceChange(e.target.value)}
          className="text-sm border border-card-border rounded-input px-3 py-1.5 bg-card-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-text-muted font-medium">
          Min Completeness:
        </label>
        <select
          value={completenessFilter}
          onChange={(e) => onCompletenessChange(Number(e.target.value))}
          className="text-sm border border-card-border rounded-input px-3 py-1.5 bg-card-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value={0}>Any</option>
          <option value={25}>25%+</option>
          <option value={50}>50%+</option>
          <option value={75}>75%+</option>
          <option value={100}>100%</option>
        </select>
      </div>
    </div>
  );
}