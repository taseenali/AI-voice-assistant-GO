import { AlertCircle } from 'lucide-react';

const issues = [
  {
    issue: 'Appointments panel',
    status: 'planned',
    detail: 'Calendar bookings not surfaced in dashboard yet.',
    week: 'Phase 2, Sprint 2.3',
  },
  {
    issue: 'Call recording playback',
    status: 'planned',
    detail: 'recording_url is stored on phone sessions; no audio player UI yet.',
    week: 'Phase 3',
  },
  {
    issue: 'Editable tenant configuration',
    status: 'planned',
    detail: 'Configuration is read-only from tenant_config DB.',
    week: 'Phase 2+',
  },
  {
    issue: 'Calendar integration',
    status: 'info',
    detail: 'calendar_enabled is false for medical-clinic. Enable when Google SA is wired.',
    week: 'Phase 3',
  },
];

const statusColors: Record<string, string> = {
  planned: 'bg-warning/15 text-warning',
  info: 'bg-primary-light text-primary',
  resolved: 'bg-success/15 text-success',
};

export function KnownIssues() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h3 className="text-section-heading font-semibold text-text-primary">
          Known Issues & Planned Work
        </h3>
      </div>
      <div className="space-y-3">
        {issues.map((item) => (
          <div
            key={item.issue}
            className="flex items-start gap-3 p-3 border border-card-border rounded-card"
          >
            <span
              className={`badge text-xs flex-shrink-0 mt-0.5 ${statusColors[item.status]}`}
            >
              {item.status.toUpperCase()}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{item.issue}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.detail}</p>
            </div>
            <span className="text-xs text-text-muted flex-shrink-0">{item.week}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
