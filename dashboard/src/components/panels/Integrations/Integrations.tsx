import { CheckCircle, Clock, Link2, XCircle, Loader2 } from 'lucide-react';
import { useSystemStatus } from '../../../hooks/useSystemStatus';
import { PageHeader } from '../../layout/PageHeader';

type StatusKind = 'live' | 'error' | 'planned' | 'checking';

interface Integration {
  name: string;
  description: string;
  status: StatusKind;
  detail?: string;
  gate?: string;
}

function StatusBadge({ status, gate }: { status: StatusKind; gate?: string }) {
  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-page text-text-muted text-xs font-semibold border border-card-border">
        <Loader2 className="w-3 h-3 animate-spin" />
        Checking
      </span>
    );
  }
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
        <CheckCircle className="w-3 h-3" />
        Connected
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger text-xs font-semibold">
        <XCircle className="w-3 h-3" />
        Not configured
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">
      <Clock className="w-3 h-3" />
      {gate ?? 'Planned'}
    </span>
  );
}

export function Integrations() {
  const { status, loading } = useSystemStatus();

  const vapiStatus: StatusKind = loading
    ? 'checking'
    : status?.vapi.configured && status?.vapi.webhookConfigured
      ? 'live'
      : 'error';

  const vapiDetail = status
    ? [
        status.vapi.configured ? 'API key set' : 'API key missing',
        status.vapi.webhookConfigured ? 'webhook secret set' : 'webhook secret missing',
        status.vapi.publicUrlSet ? 'public URL set' : 'PUBLIC_URL not set',
      ].join(' · ')
    : undefined;

  const calendarStatus: StatusKind = loading
    ? 'checking'
    : status?.calendar.configured
      ? 'live'
      : 'error';

  const calendarDetail = status
    ? status.calendar.configured
      ? `Service account configured · ${status.calendar.enabledTenants} tenant(s) enabled`
      : 'G_CLIENT_EMAIL / G_PRIVATE_KEY missing'
    : undefined;

  const integrations: Integration[] = [
    {
      name: 'Vapi',
      description: 'AI voice & telephony — STT, LLM (gpt-4o-mini), TTS, phone routing',
      status: vapiStatus,
      detail: vapiDetail,
    },
    {
      name: 'Google Calendar',
      description: 'Appointment booking + real-time availability checks',
      status: calendarStatus,
      detail: calendarDetail,
    },
    {
      name: 'Twilio SMS',
      description: 'Outbound SMS appointment reminders for patients',
      status: 'planned',
      gate: 'Gate 2',
    },
    {
      name: 'PMS Write-back',
      description: 'Push confirmed bookings directly into your practice management system',
      status: 'planned',
      gate: 'Gate 2',
    },
    {
      name: 'Stripe Billing',
      description: 'Usage-based invoicing and plan management for multi-tenant accounts',
      status: 'planned',
      gate: 'Gate 2',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Services connected to MedVoice AI"
      />

      <div className="grid gap-3">
        {integrations.map((item) => (
          <div key={item.name} className="card px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-text-primary">{item.name}</div>
              <div className="text-sm text-text-secondary">{item.description}</div>
              {item.detail && (
                <div className="text-[11px] text-text-muted mt-0.5 font-mono">{item.detail}</div>
              )}
            </div>
            <StatusBadge status={item.status} gate={item.gate} />
          </div>
        ))}
      </div>
    </div>
  );
}
