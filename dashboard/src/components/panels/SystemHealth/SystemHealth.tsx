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

  return (
    <div>
      <PageHeader
        title="System Health"
        subtitle="Live status checks — auto-refreshes every 30 seconds"
      />

      <div className="grid grid-cols-2 gap-6 mb-8">
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
            credentials:    status ? (status.calendar.configured       ? '✓ service account set' : '✗ G_CLIENT_EMAIL missing') : undefined,
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
            hint:        status?.sse.activeConnections === 0
              ? 'Open localhost:3000 to connect'
              : undefined,
          }}
        />
      </div>

      {status && (
        <div className="card p-4 mb-8 flex items-center gap-6 text-sm text-text-secondary">
          <span><strong className="text-text-primary">{status.db.tenants}</strong> tenant{status.db.tenants !== 1 ? 's' : ''} configured</span>
          <span className="w-px h-4 bg-card-border" />
          <span><strong className="text-text-primary">{status.db.sessionsToday}</strong> session{status.db.sessionsToday !== 1 ? 's' : ''} today</span>
          <span className="w-px h-4 bg-card-border" />
          <span>Server uptime <strong className="text-text-primary">{formatUptime(status.server.uptimeSeconds)}</strong></span>
          <span className="w-px h-4 bg-card-border" />
          <span>{status.server.nodeVersion}</span>
        </div>
      )}

      <VapiArchitecture />
      <SprintStatus />
    </div>
  );
}
