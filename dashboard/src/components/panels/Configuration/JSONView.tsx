import { useState } from 'react';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';
import type { Config } from '../../../types/config';

interface JSONViewProps {
  config: Config;
  editableConfig?: Record<string, unknown> | null;
  onSave?: (updates: Record<string, unknown>) => Promise<void>;
}

export function JSONView({ config, editableConfig, onSave }: JSONViewProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const jsonString = JSON.stringify(config, null, 2);

  function startEdit() {
    setEditText(editableConfig ? JSON.stringify(editableConfig, null, 2) : jsonString);
    setSaveError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setSaveError(null);
  }

  async function handleSave() {
    setSaveError(null);
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(editText);
    } catch {
      setSaveError('Invalid JSON — check the syntax and try again.');
      return;
    }
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
      setSaveError('Config must be a JSON object.');
      return;
    }
    setSaving(true);
    try {
      await onSave!(parsed);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-section-heading font-semibold text-text-primary">
          {editing ? 'Edit Configuration' : 'Raw Configuration JSON'}
        </h3>
        <div className="flex items-center gap-2">
          {!editing && (
            <span className="text-xs text-text-muted mr-2">
              {Object.keys(config).length} keys
            </span>
          )}
          {onSave && !editing && (
            <button
              type="button"
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary/30 rounded-button hover:bg-primary/5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {editing && (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-secondary border border-card-border rounded-button hover:bg-page transition-colors disabled:opacity-60"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-button hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                <Check className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 border border-danger/20 rounded-card text-sm text-danger">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {saveError}
        </div>
      )}

      {editing ? (
        <div>
          <p className="text-xs text-text-muted mb-3">
            Editable fields only. Sensitive fields (voice credentials, webhook secrets) are managed server-side. Changes rebuild the system prompt automatically on save.
          </p>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-gray-900 text-green-400 rounded-card p-6 text-xs font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={32}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      ) : (
        <pre className="bg-gray-900 text-green-400 rounded-card p-6 overflow-x-auto text-xs font-mono leading-relaxed max-h-[600px] overflow-y-auto">
          <code>{jsonString}</code>
        </pre>
      )}
    </div>
  );
}
