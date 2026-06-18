import { useState } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { useAuth } from '../../../context/AuthContext';
import { PageHeader } from '../../layout/PageHeader';
import { VisualView } from './VisualView';
import { JSONView } from './JSONView';
import { LoadingState } from '../../shared/LoadingState';

export function Configuration() {
  const { config, loading, error } = useConfig();
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
        <JSONView config={config} />
      )}

      {/* Edit Warning */}
      <div className="mt-6 card p-4 border-l-4 border-warning bg-warning/5">
        <p className="text-sm text-text-secondary">
          <strong>Note:</strong> Configuration editing is not available in this
          version. To update the config: edit{' '}
          <code>configs/medical-clinic.json</code> on the server, then restart
          the Node.js process. A write API endpoint is planned for v1.1.
        </p>
      </div>
    </div>
  );
}