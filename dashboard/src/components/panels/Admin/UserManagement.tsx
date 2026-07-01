import { useEffect, useState, useCallback } from 'react';
import { UserPlus, UserX } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { useAuth } from '../../../context/AuthContext';

interface AdminUser {
  user_id: string;
  tenant_id: string;
  email: string;
  role: string;
  active: number;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  clinic_admin: 'Clinic Admin',
  clinic_staff: 'Staff',
};

function roleBadge(role: string) {
  const cls =
    role === 'super_admin'
      ? 'bg-primary/10 text-primary'
      : role === 'clinic_admin'
        ? 'bg-accent/10 text-primary-dark'
        : 'bg-page text-text-secondary';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border border-card-border ${cls}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

export function UserManagement() {
  const { viewingTenantId, isSuperAdmin, tenantId: callerTenant } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'clinic_staff', tenant_id: viewingTenantId ?? '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const tenantForQuery = isSuperAdmin ? viewingTenantId : callerTenant;

  const load = useCallback(() => {
    setLoading(true);
    const params = tenantForQuery ? `?tenant_id=${tenantForQuery}` : '';
    api
      .get<{ users: AdminUser[] }>(`/api/admin/users${params}`)
      .then((d) => setUsers(d.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [tenantForQuery]);

  useEffect(() => { load(); }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post('/api/admin/users', { ...form, tenant_id: tenantForQuery });
      setShowForm(false);
      setForm({ email: '', password: '', role: 'clinic_staff', tenant_id: tenantForQuery ?? '' });
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  async function deactivate(userId: string, email: string) {
    if (!confirm(`Deactivate ${email}?`)) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate user');
    }
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage clinic users and access"
        action={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        }
      />

      {/* Add user form */}
      {showForm && (
        <form onSubmit={submit} className="card p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Add a new user</h3>
          {formError && <p className="text-sm text-danger">{formError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Email *</label>
              <input
                required
                type="email"
                className="input w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Temporary Password *</label>
              <input
                required
                type="password"
                className="input w-full"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Role *</label>
              <select
                className="input w-full"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="clinic_staff">Staff</option>
                <option value="clinic_admin">Clinic Admin</option>
                {isSuperAdmin && <option value="super_admin">Super Admin</option>}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2">
              {saving ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingState variant="panel" />
      ) : users.length === 0 ? (
        <div className="card p-8 text-center text-sm text-text-muted">
          No users found for this tenant.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-card-border">
              <tr>
                {['Email', 'Role', 'Tenant', 'Status', 'Created', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-text-secondary px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-b border-card-border/50 last:border-0 hover:bg-page transition-colors">
                  <td className="px-5 py-3 text-text-primary">{u.email}</td>
                  <td className="px-5 py-3">{roleBadge(u.role)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-text-muted">{u.tenant_id}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${u.active ? 'text-success' : 'text-text-muted line-through'}`}>
                      {u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {u.active ? (
                      <button
                        type="button"
                        onClick={() => deactivate(u.user_id, u.email)}
                        className="text-danger hover:text-danger/80 transition-colors"
                        title="Deactivate user"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
