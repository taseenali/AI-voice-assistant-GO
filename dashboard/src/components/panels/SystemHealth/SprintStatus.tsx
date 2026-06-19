import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

const done = [
  'Vapi phone integration — Aria answers, books, captures leads',
  'Google Calendar — check_availability + book_appointment live',
  'get_available_slots — LLM offered real open times',
  'Partial lead capture — saved on early hang-up',
  'Phone normalisation — E.164 stored on every capture_lead',
  'Duplicate booking guard — same patient/date check before insert',
  'Business hours config — after-hours flow active',
  'Multi-tenant architecture — configs/ seeds SQLite on boot',
  'Dashboard — sessions, leads, appointments, emergency panels',
  'MVAIR design system — tokens, Tailwind bridge',
  'Marketing landing page with Sign in → dashboard link',
  'Live Receptionist Monitor — localhost:3000 (SSE real-time)',
  'System Health — real Vapi + Calendar + SSE status',
  'Security headers — helmet + per-route rate limits',
  'Emergency → Session cross-panel navigation',
  'Dead codebase isolation — pre-Vapi files removed',
  'Recording playback — inline audio player in Transcript viewer',
];

const next = [
  'Railway + Vercel deployment (Sprint E)',
  'Editable tenant config via dashboard UI',
  'Webhook URL pingback when on-call provider is configured',
  'Recording proxy — serve audio through API (privacy hardening)',
];

export function SprintStatus() {
  return (
    <div className="card p-6">
      <h3 className="text-section-heading font-semibold text-text-primary mb-5">
        Sprint Status
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Done */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-text-primary">Shipped</span>
          </div>
          <ul className="space-y-2">
            {done.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Next */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-text-primary">Up next</span>
          </div>
          <ul className="space-y-2">
            {next.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3 mt-0.5 text-warning flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
