import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { useAuth } from '../../../context/AuthContext';

interface AuditEntry {
  id: number;
  timestamp: string;
  event_type: string;
  action: string;
  resource: string;
  client_id: string;
  user_id: string | null;
  ip: string | null;
  detail: string | null;
}

const EVENT_COLORS: Record<string, string> = {
  phi_access: 'text-primary bg-primary/10',
  auth: 'text-text-secondary bg-page',
  recording_access: 'text-accent-dark bg-accent/10',
};

export function AuditLog() {
  const { viewingTenantId } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTenant, setFilterTenant] = useState(viewingTenantId ?? '');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE = 50;

  const load = useCallback(
    (off: number) => {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(PAGE + 1), offset: String(off) });
      if (filterTenant) params.set('tenant_id', filterTenant);
      api
        .get<{ logs: AuditEntry[] }>(`/api/admin/audit-logs?${params}`)
        .then((d) => {
          const page = d.logs.slice(0, PAGE);
          setLogs(off === 0 ? page : (prev) => [...prev, ...page]);
          setHasMore(d.logs.length > PAGE);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    },
    [filterTenant],
  );

  useEffect(() => {
    setOffset(0);
    load(0);
  }, [load]);

  function loadMore() {
    const next = offset + PAGE;
    setOffset(next);
    load(next);
  }

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="PHI access and auth events" />

      {/* Filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            className="input pl-9 w-full"
            placeholder="Filter by tenant ID…"
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
          />
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <LoadingState variant="panel" />
      ) : logs.length === 0 ? (
        <div className="card p-8 text-center text-sm text-text-muted">No audit events found.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-card-border">
              <tr>
                {['Timestamp', 'Type', 'Action', 'Resource', 'Tenant', 'User', 'IP'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-text-secondary px-4 py-3 first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-card-border/50 last:border-0 hover:bg-page transition-colors"
                >
                  <td className="px-5 py-2.5 font-mono text-xs text-text-secondary whitespace-nowrap">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                        EVENT_COLORS[e.event_type] ?? 'text-text-secondary bg-page'
                      }`}
                    >
                      {e.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-text-primary">{e.action}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{e.resource}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-muted">{e.client_id}</td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">{e.user_id ?? '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-muted">{e.ip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div className="px-5 py-3 border-t border-card-border">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
