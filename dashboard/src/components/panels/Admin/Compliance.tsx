import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Plus } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { useAuth } from '../../../context/AuthContext';

interface BaaRecord {
  baa_id: string;
  tenant_id: string;
  signed_by: string;
  signed_at: string;
  effective_date: string;
  expiry_date: string | null;
  document_ref: string | null;
  status: 'active' | 'expired' | 'revoked';
  notes: string | null;
}

function statusBadge(status: BaaRecord['status']) {
  const cls =
    status === 'active'
      ? 'text-green-700 bg-green-50 border-green-200'
      : status === 'expired'
        ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
        : 'text-danger bg-red-50 border-red-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

export function Compliance() {
  const { viewingTenantId } = useAuth();
  const [records, setRecords] = useState<BaaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ signed_by: '', signed_at: '', effective_date: '', document_ref: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<{ baa_records: BaaRecord[] }>(`/api/admin/baa?tenant_id=${viewingTenantId}`)
      .then((d) => setRecords(d.baa_records))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [viewingTenantId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/api/admin/baa', {
        tenant_id: viewingTenantId,
        ...form,
        signed_at: new Date(form.signed_at).toISOString(),
        effective_date: new Date(form.effective_date).toISOString(),
      });
      setShowForm(false);
      setForm({ signed_by: '', signed_at: '', effective_date: '', document_ref: '', notes: '' });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save BAA record');
    } finally {
      setSaving(false);
    }
  }

  const activeBaa = records.find((r) => r.status === 'active');

  return (
    <div>
      <PageHeader
        title="Compliance"
        subtitle="Business Associate Agreements (HIPAA)"
        action={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            Record BAA
          </button>
        }
      />

      {/* BAA status banner */}
      <div className={`mb-6 flex items-center gap-3 rounded-card border px-5 py-4 ${activeBaa ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        {activeBaa ? (
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0" />
        )}
        <div>
          <p className={`text-sm font-semibold ${activeBaa ? 'text-green-800' : 'text-yellow-800'}`}>
            {activeBaa ? 'Active BAA on file' : 'No active BAA — live booking is restricted'}
          </p>
          {activeBaa && (
            <p className="text-xs text-green-700 mt-0.5">
              Signed by {activeBaa.signed_by} · Effective {activeBaa.effective_date.slice(0, 10)}
            </p>
          )}
        </div>
      </div>

      {/* Add BAA form */}
      {showForm && (
        <form onSubmit={submit} className="card p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Record a signed BAA</h3>
          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Signed by *</label>
              <input
                required
                className="input w-full"
                placeholder="Name or organization"
                value={form.signed_by}
                onChange={(e) => setForm({ ...form, signed_by: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Signed date *</label>
              <input
                required
                type="date"
                className="input w-full"
                value={form.signed_at}
                onChange={(e) => setForm({ ...form, signed_at: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Effective date *</label>
              <input
                required
                type="date"
                className="input w-full"
                value={form.effective_date}
                onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Document ref / URL</label>
              <input
                className="input w-full"
                placeholder="e.g. DocuSign ID or file path"
                value={form.document_ref}
                onChange={(e) => setForm({ ...form, document_ref: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">Notes</label>
            <textarea
              className="input w-full"
              rows={2}
              placeholder="Optional notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2">
              {saving ? 'Saving…' : 'Save BAA Record'}
            </button>
          </div>
        </form>
      )}

      {/* Records table */}
      {loading ? (
        <LoadingState variant="panel" />
      ) : records.length === 0 ? (
        <div className="card p-8 text-center text-sm text-text-muted">
          No BAA records on file for this tenant.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-card-border">
              <tr>
                {['Signed by', 'Effective', 'Expiry', 'Status', 'Document'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-text-secondary px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.baa_id} className="border-b border-card-border/50 last:border-0 hover:bg-page transition-colors">
                  <td className="px-5 py-3 text-text-primary font-medium">{r.signed_by}</td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{r.effective_date.slice(0, 10)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{r.expiry_date?.slice(0, 10) ?? '—'}</td>
                  <td className="px-5 py-3">{statusBadge(r.status)}</td>
                  <td className="px-5 py-3 text-xs text-text-muted truncate max-w-[160px]">{r.document_ref ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
