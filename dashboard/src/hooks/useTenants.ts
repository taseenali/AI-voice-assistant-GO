import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { TenantSummary, TenantsListResponse } from '../types/tenant';
import { useAuth } from '../context/AuthContext';

export function useTenants() {
  const { isSuperAdmin } = useAuth();
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    if (!isSuperAdmin) {
      setTenants([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.get<TenantsListResponse>('/api/admin/tenants');
      setTenants(data.tenants || []);
      setError(null);
    } catch {
      setError('Failed to load tenants');
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refetch: fetchTenants };
}
