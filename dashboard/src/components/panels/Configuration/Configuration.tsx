import { useState } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { useAuth } from '../../../context/AuthContext';
import { PageHeader } from '../../layout/PageHeader';
import { VisualView } from './VisualView';
import { JSONView } from './JSONView';
import { LoadingState } from '../../shared/LoadingState';

export function Configuration() {
  const { config, editableConfig, loading, error, saveConfig } = useConfig();
  const { tenantId } = useAuth();
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  if (loading)
    return (
      <div>
        <PageHeader title="Client Configuration" subtitle="Loading..." />
        <LoadingState variant="panel" />
      </div>
    );

  if (error)
    return (
      <div>
        <PageHeader title="Client Configuration" />
        <div className="card p-6 border-l-4 border-danger">
          <p className="text-danger font-medium">{error}</p>
          <p className="text-sm text-text-secondary mt-2">
            Check that the MedVoice server is running on port 3001 and you are signed in.
          </p>
        </div>
      </div>
    );

  if (!config) return null;

  return (
    <div>
      <PageHeader
        title="Client Configuration"
        subtitle={`${config.company_name} · ${tenantId}`}
      />

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setViewMode('visual')}
          className={`px-4 py-2 rounded-button transition-colors ${
            viewMode === 'visual'
              ? 'bg-primary text-white'
              : 'bg-page text-text-secondary border border-card-border hover:bg-primary-light hover:text-primary'
          }`}
        >
          Visual View
        </button>
        <button
          onClick={() => setViewMode('json')}
          className={`px-4 py-2 rounded-button transition-colors ${
            viewMode === 'json'
              ? 'bg-primary text-white'
              : 'bg-page text-text-secondary border border-card-border hover:bg-primary-light hover:text-primary'
          }`}
        >
          JSON View
        </button>
      </div>

      {viewMode === 'visual' ? (
        <VisualView config={config} />
      ) : (
        <JSONView config={config} editableConfig={editableConfig} onSave={saveConfig} />
      )}
    </div>
  );
}