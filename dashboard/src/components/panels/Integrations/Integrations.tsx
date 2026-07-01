import { CheckCircle, Clock, Link2 } from 'lucide-react';

const integrations = [
  {
    name: 'Google Calendar',
    description: 'Appointment booking + availability checks',
    status: 'live' as const,
    gate: null,
  },
  {
    name: 'Vapi',
    description: 'AI voice & telephony layer',
    status: 'live' as const,
    gate: null,
  },
  {
    name: 'PMS Write-back',
    description: 'Push bookings directly into your practice management system',
    status: 'planned' as const,
    gate: 'Gate 2',
  },
  {
    name: 'SMS Reminders',
    description: 'Automated patient appointment reminders via SMS',
    status: 'planned' as const,
    gate: 'Gate 2',
  },
  {
    name: 'Stripe Billing',
    description: 'Usage-based invoicing for multi-tenant plans',
    status: 'planned' as const,
    gate: 'Gate 2',
  },
];

export function Integrations() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-page-title font-display font-semibold text-text-primary">Integrations</h1>
        <p className="text-text-secondary mt-1">Services connected to MedVoice AI</p>
      </div>

      <div className="grid gap-3">
        {integrations.map((item) => (
          <div key={item.name} className="card px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-text-primary">{item.name}</div>
              <div className="text-sm text-text-secondary">{item.description}</div>
            </div>
            {item.status === 'live' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                <CheckCircle className="w-3 h-3" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">
                <Clock className="w-3 h-3" />
                {item.gate}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
