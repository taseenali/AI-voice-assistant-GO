import { useServerHealth } from '../../../hooks/useServerHealth';
import { useLLMHealth } from '../../../hooks/useLLMHealth';
import { StatusCard } from './StatusCard';
import { AITierInfo } from './AITierInfo';
import { KnownIssues } from './KnownIssues';
import { PageHeader } from '../../layout/PageHeader';

export function SystemHealth() {
  const { health: serverHealth, loading: serverLoading } = useServerHealth();
  const { health: llmHealth, loading: llmLoading } = useLLMHealth();

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
            lastChecked: serverHealth?.timestamp
              ? new Date(serverHealth.timestamp).toLocaleTimeString()
              : undefined,
          }}
        />

        <StatusCard
          title="Ollama LLM"
          status={llmHealth?.available ? 'AVAILABLE' : 'UNAVAILABLE'}
          loading={llmLoading}
          details={{
            model: llmHealth?.model,
            endpoint: llmHealth?.endpoint,
          }}
        />

        {/* Webhook Queue - Not implemented yet */}
        <StatusCard
          title="Webhook Queue"
          status="N/A"
          loading={false}
          details={{
            note: 'Browser-side queue (IndexedDB). Server endpoint not available yet.',
          }}
        />

        {/* Calendar Integration */}
        <StatusCard
          title="Calendar Integration"
          status="DISABLED"
          loading={false}
          details={{
            note: 'calendar_enabled: false in config',
          }}
        />
      </div>

      <AITierInfo />
      <KnownIssues />
    </div>
  );
}