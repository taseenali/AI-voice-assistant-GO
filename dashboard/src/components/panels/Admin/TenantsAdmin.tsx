import { useState } from 'react';
import { Building2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenants } from '../../../hooks/useTenants';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import { api } from '../../../lib/api';
import { TenantsTable } from './TenantsTable';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { EmptyState } from '../../shared/EmptyState';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function NewClinicPanel({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    company_name: '',
    tenant_id: '',
    plan_tier: 'starter',
    admin_email: '',
    admin_password: '',
  });
  const [saving, setSaving] = useState(false);
  const [idEdited, setIdEdited] = useState(false);

  function set(key: string, value: string) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'company_name' && !idEdited) next.tenant_id = slugify(value);
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name || !form.tenant_id) return;
    setSaving(true);
    try {
      await api.post('/api/admin/tenants', {
        tenant_id: form.tenant_id,
        company_name: form.company_name,
        plan_tier: form.plan_tier,
        ...(form.admin_email && form.admin_password
          ? { admin_email: form.admin_email, admin_password: form.admin_password }
          : {}),
      });
      addToast(`Clinic "${form.company_name}" created`, 'success');
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to create clinic';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-y-0 right-0 w-[420px] bg-card-bg border-l border-card-border z-40 overflow-y-auto flex flex-col"
      style={{ boxShadow: 'var(--app-shadow-pop)' }}
    >
      <div className="flex items-center justify-between p-6 border-b border-card-border shrink-0">
        <h2 className="text-base font-display font-semibold text-text-primary">New Clinic</h2>
        <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={submit} className="p-6 flex flex-col gap-5 flex-1">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Clinic Name *</label>
          <input
            className="input w-full"
            value={form.company_name}
            onChange={e => set('company_name', e.target.value)}
            placeholder="e.g. Sunrise Medical Clinic"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Tenant ID *</label>
          <input
            className="input w-full font-mono text-sm"
            value={form.tenant_id}
            onChange={e => { setIdEdited(true); set('tenant_id', e.target.value); }}
            placeholder="e.g. sunrise-medical"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
            required
          />
          <p className="text-[11px] text-text-muted mt-1">Lowercase letters, numbers, hyphens. Cannot be changed later.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Plan Tier</label>
          <select className="input w-full" value={form.plan_tier} onChange={e => set('plan_tier', e.target.value)}>
            <option value="starter">Starter — 500 calls/mo · $199/mo</option>
            <option value="growth">Growth — 2000 calls/mo · $499/mo</option>
            <option value="enterprise">Enterprise — Unlimited · Custom</option>
          </select>
        </div>

        <div className="border-t border-card-border pt-4">
          <p className="text-xs font-semibold text-text-secondary mb-3">Admin Account (optional)</p>
          <div className="flex flex-col gap-3">
            <input
              className="input w-full"
              type="email"
              placeholder="admin@clinic.com"
              value={form.admin_email}
              onChange={e => set('admin_email', e.target.value)}
            />
            <input
              className="input w-full"
              type="password"
              placeholder="Initial password"
              value={form.admin_password}
              onChange={e => set('admin_password', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 px-4 py-2 text-sm font-semibold">Cancel</button>
          <button type="submit" className="btn-primary flex-1 px-4 py-2 text-sm font-semibold" disabled={saving}>
            {saving ? 'Creating…' : 'Create Clinic'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function TenantsAdmin() {
  const { viewingTenantId, setViewingTenantId } = useAuth();
  const { tenants, loading, error, refetch } = useTenants();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  const handleSelect = (tenantId: string) => {
    setViewingTenantId(tenantId);
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Clinics" subtitle="Loading tenant registry..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Clinics" />
        <EmptyState icon={Building2} title="Could not load clinics" description={error} variant="warning" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader
          title="Clinics"
          subtitle={`${tenants.length} clinic${tenants.length !== 1 ? 's' : ''} registered`}
        />
        <button type="button" onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2 shrink-0 px-4 py-2 text-sm font-semibold">
          <Plus className="w-4 h-4" />
          New Clinic
        </button>
      </div>

      <TenantsTable
        tenants={tenants}
        activeTenantId={viewingTenantId}
        onSelectTenant={handleSelect}
      />

      {showNew && (
        <NewClinicPanel
          onClose={() => setShowNew(false)}
          onCreated={refetch}
        />
      )}
    </div>
  );
}
