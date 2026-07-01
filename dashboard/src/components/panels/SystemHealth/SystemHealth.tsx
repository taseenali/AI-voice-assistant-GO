import { Activity, Gauge, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useSystemStatus } from '../../../hooks/useSystemStatus';
import { useServerHealth } from '../../../hooks/useServerHealth';
import { StatusCard } from './StatusCard';
import { VapiArchitecture } from './VapiArchitecture';
import { SprintStatus } from './SprintStatus';
import { PageHeader } from '../../layout/PageHeader';

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function SystemHealth() {
  const { health: serverHealth, loading: serverLoading } = useServerHealth();
  const { status, loading: statusLoading } = useSystemStatus();

  const vapiStatus = status
    ? status.vapi.configured && status.vapi.webhookConfigured
      ? 'CONNECTED'
      : 'NOT CONFIGURED'
    : 'CHECKING';

  const calendarStatus = status
    ? status.calendar.configured && status.calendar.enabledTenants > 0
      ? 'ACTIVE'
      : status.calendar.configured
        ? 'CONFIGURED — NO TENANT ENABLED'
        : 'NOT CONFIGURED'
    : 'CHECKING';

  const sseStatus = status
    ? status.sse.activeConnections > 0
      ? `${status.sse.activeConnections} LIVE`
      : 'IDLE'
    : 'CHECKING';

  // Derive golden signals from available status data
  const configErrors = status ? [
    !status.vapi.configured,
    !status.vapi.webhookConfigured,
    !status.vapi.publicUrlSet,
    !status.calendar.configured,
  ].filter(Boolean).length : 0;

  const serverUp = serverHealth?.status === 'UP';
  const allGreen = serverUp && configErrors === 0;

  const goldenSignals = [
    {
      label: 'Latency',
      value: serverUp ? '< 7.5s' : '—',
      sub: 'Vapi assistant-request budget',
      icon: Gauge,
      ok: serverUp,
    },
    {
      label: 'Traffic',
      value: status ? `${status.db.sessionsToday}` : '—',
      sub: 'sessions today',
      icon: Activity,
      ok: true,
    },
    {
      label: 'Errors',
      value: configErrors > 0 ? `${configErrors}` : '0',
      sub: 'misconfigured components',
      icon: AlertTriangle,
      ok: configErrors === 0,
    },
    {
      label: 'Saturation',
      value: status ? `${status.sse.activeConnections}` : '—',
      sub: 'live SSE connections',
      icon: status?.sse.activeConnections ? Wifi : WifiOff,
      ok: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="System Health"
        subtitle="Live status checks — auto-refreshes every 30 seconds"
      />

      {/* Overall banner */}
      <div className={`card px-5 py-4 mb-6 flex items-center gap-4 border-l-4 ${allGreen ? 'border-success' : 'border-warning'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${allGreen ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-text-primary">
            {allGreen ? 'All systems operational' : `${configErrors} component${configErrors !== 1 ? 's' : ''} need attention`}
          </div>
          <div className="text-sm text-text-secondary">
            {status ? `${status.db.tenants} tenant${status.db.tenants !== 1 ? 's' : ''} · ${status.db.sessionsToday} session${status.db.sessionsToday !== 1 ? 's' : ''} today · uptime ${formatUptime(status.server.uptimeSeconds)}` : 'Fetching status…'}
          </div>
        </div>
        <span className="text-xs text-text-muted">Auto-refreshes every 30s</span>
      </div>

      {/* Four golden signals (SRE) */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-3">Four golden signals</div>
        <div className="grid grid-cols-4 gap-4">
          {goldenSignals.map((sig) => (
            <div key={sig.label} className="card px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sig.ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                <sig.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{sig.label}</div>
                <div className="text-[20px] font-bold text-text-primary leading-tight">{sig.value}</div>
                <div className="text-[11px] text-text-muted truncate">{sig.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component status grid + latency card */}
      <div className="grid grid-cols-[1fr_300px] gap-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <StatusCard
            title="MedVoice Server"
            status={serverHealth?.status || 'DOWN'}
            loading={serverLoading}
            details={{
              version: serverHealth?.version,
              uptime: status ? formatUptime(status.server.uptimeSeconds) : undefined,
              node: status?.server.nodeVersion,
              lastChecked: serverHealth?.timestamp
                ? new Date(serverHealth.timestamp).toLocaleTimeString()
                : undefined,
            }}
          />
          <StatusCard
            title="Vapi AI (Phone Engine)"
            status={vapiStatus}
            loading={statusLoading}
            details={{
              apiKey:    status ? (status.vapi.configured        ? '✓ set' : '✗ missing') : undefined,
              webhook:   status ? (status.vapi.webhookConfigured ? '✓ set' : '✗ missing') : undefined,
              publicUrl: status ? (status.vapi.publicUrlSet      ? '✓ set' : '✗ missing — ngrok needed') : undefined,
              mode:      status ? (status.vapi.spikeMode         ? 'spike (capture-only)' : 'full (calendar + booking)') : undefined,
            }}
          />
          <StatusCard
            title="Google Calendar"
            status={calendarStatus}
            loading={statusLoading}
            details={{
              credentials:    status ? (status.calendar.configured ? '✓ service account set' : '✗ G_CLIENT_EMAIL missing') : undefined,
              enabledTenants: status ? `${status.calendar.enabledTenants} of ${status.db.tenants} tenant(s)` : undefined,
            }}
          />
          <StatusCard
            title="Live Monitor (SSE)"
            status={sseStatus}
            loading={statusLoading}
            details={{
              connections: status ? `${status.sse.activeConnections} browser(s) connected` : undefined,
              endpoint:    '/api/calls/stream',
              hint:        status?.sse.activeConnections === 0 ? 'Open localhost:3000 to connect' : undefined,
            }}
          />
        </div>

        {/* Latency vs Vapi 7.5s budget */}
        <div className="flex flex-col gap-4">
          <div className="card p-5 flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Latency vs. Vapi budget</h3>
            <div className="space-y-4">
              {[
                { label: 'p50 (typical)', ms: 420, color: 'bg-success' },
                { label: 'p95 (slow)', ms: 1200, color: 'bg-warning' },
                { label: 'p99 (tail)', ms: 2800, color: 'bg-danger' },
              ].map(({ label, ms, color }) => {
                const pct = Math.min(Math.round((ms / 7500) * 100), 100);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{label}</span>
                      <span className="font-mono font-semibold text-text-primary">{ms}ms</span>
                    </div>
                    <div className="h-1.5 bg-page rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-card-border">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">assistant-request budget</span>
                <span className="font-mono font-semibold text-text-primary">7,500ms</span>
              </div>
              <div className="h-1.5 bg-page rounded-full overflow-hidden">
                <div className="h-full bg-primary/30 rounded-full w-full" />
              </div>
              <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                Vapi enforces a 7.5s build budget per call. Values above are estimates — instrument your webhook for real metrics.
              </p>
            </div>
          </div>

          <div className="card p-4 border-l-4 border-warning">
            <div className="flex gap-3">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-text-primary mb-1">Webhook tunnel is a SPOF</div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  If the tunnel goes down, <code className="font-mono text-[11px] bg-page px-1 rounded">assistant-request</code> fails inside the 7.5s window and calls drop. Move off ngrok before production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VapiArchitecture />
      <SprintStatus />
    </div>
  );
}
