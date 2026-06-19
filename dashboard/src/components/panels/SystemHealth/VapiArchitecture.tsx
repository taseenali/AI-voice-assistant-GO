import { Phone, Zap, Calendar, UserPlus, AlertTriangle, Radio } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    label: 'Patient calls',
    detail: '+1 (856) 440-2211',
    color: 'text-text-secondary',
  },
  {
    icon: Radio,
    label: 'Vapi receives call',
    detail: 'Speech → text · voice synthesis',
    color: 'text-primary',
  },
  {
    icon: Zap,
    label: 'Webhook → Express',
    detail: 'ngrok → POST /api/vapi/webhook',
    color: 'text-accent',
  },
  {
    icon: Calendar,
    label: 'Calendar tools',
    detail: 'check_availability · book_appointment · get_available_slots',
    color: 'text-primary',
  },
  {
    icon: UserPlus,
    label: 'Lead capture',
    detail: 'capture_lead → SQLite · partial on hang-up',
    color: 'text-success',
  },
  {
    icon: AlertTriangle,
    label: 'Safety layer',
    detail: 'Deterministic keyword scan · log_emergency',
    color: 'text-danger',
  },
];

export function VapiArchitecture() {
  return (
    <div className="card p-6 mb-8">
      <h3 className="text-section-heading font-semibold text-text-primary mb-1">
        MVAIR Call Architecture
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Every inbound call flows through Vapi for voice I/O, hits Express for tool execution,
        and writes to SQLite. The LLM (GPT-4o-mini via Vapi) never touches the calendar or DB directly.
      </p>

      {/* Flow diagram */}
      <div className="flex flex-wrap items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center text-center w-[130px]">
              <div className={`w-10 h-10 rounded-full border-2 border-card-border flex items-center justify-center mb-2 bg-page ${step.color}`}>
                <step.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-text-primary leading-tight">{step.label}</p>
              <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{step.detail}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="w-6 h-px bg-card-border mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Key facts */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-card-border">
        <div className="text-center">
          <p className="text-xs text-text-muted mb-1">Voice engine</p>
          <p className="text-sm font-semibold text-text-primary">Vapi · ElevenLabs / Elliot</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted mb-1">LLM</p>
          <p className="text-sm font-semibold text-text-primary">GPT-4o-mini (via Vapi)</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted mb-1">Database</p>
          <p className="text-sm font-semibold text-text-primary">SQLite · better-sqlite3</p>
        </div>
      </div>
    </div>
  );
}
