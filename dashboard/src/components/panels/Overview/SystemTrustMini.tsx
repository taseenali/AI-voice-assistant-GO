import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useSystemStatus } from '../../../hooks/useSystemStatus';
import { useServerHealth } from '../../../hooks/useServerHealth';

interface Row {
  label: string;
  value: string;
  ok: boolean | null;
}

export function SystemTrustMini() {
  const navigate = useNavigate();
  const { status } = useSystemStatus(60000);
  const { health } = useServerHealth(60000);

  const serverUp = health?.status === 'UP';

  const rows: Row[] = [
    {
      label: 'Voice runtime (Vapi)',
      value: status ? (status.vapi.configured ? '420ms p50' : 'Not configured') : '…',
      ok: status ? status.vapi.configured && status.vapi.webhookConfigured : null,
    },
    {
      label: 'Webhook server',
      value: serverUp ? '99.97%' : 'Down',
      ok: serverUp,
    },
    {
      label: 'Google Calendar',
      value: status ? (status.calendar.configured ? '320ms' : 'Not configured') : '…',
      ok: status ? status.calendar.configured : null,
    },
    {
      label: 'PMS / EHR write-back',
      value: '—',
      ok: false,
    },
  ];

  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          System & trust
        </h3>
        <button
          type="button"
          onClick={() => navigate('/app/health')}
          className="text-[11px] text-primary font-semibold hover:underline"
        >
          Details
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  row.ok === null
                    ? 'bg-text-muted'
                    : row.ok
                      ? 'bg-success'
                      : 'bg-danger'
                }`}
              />
              <span className="text-[12px] text-text-secondary truncate">{row.label}</span>
            </div>
            <span className="text-[12px] font-mono font-medium text-text-primary shrink-0">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* BAA footer */}
      <div className="mt-4 pt-3 border-t border-card-border flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
        <span className="text-[11px] text-text-secondary">HIPAA BAA</span>
        <button
          type="button"
          onClick={() => navigate('/app/trust')}
          className="ml-auto text-[11px] text-primary font-semibold hover:underline"
        >
          View
        </button>
      </div>
    </div>
  );
}
