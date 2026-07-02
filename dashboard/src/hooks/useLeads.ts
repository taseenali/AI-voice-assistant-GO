import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import type { Lead } from '../types/lead';
import { useAuth } from '../context/AuthContext';

interface LeadsData {
  leads: Lead[];
  total: number;
  hasMore: boolean;
}

const PAGE = 100;

export function useLeads(refreshInterval = 15000) {
  const { tenantId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersRef = useRef<{ service?: string; completenessMin?: number }>({});

  const fetchLeads = useCallback(
    async (filters?: { service?: string; completenessMin?: number }, off = 0, append = false) => {
      if (filters !== undefined) filtersRef.current = filters;
      const f = filtersRef.current;
      try {
        const params = new URLSearchParams({ limit: String(PAGE), offset: String(off) });
        if (f.service) params.set('service', f.service);
        if (f.completenessMin) params.set('completeness_min', String(f.completenessMin));
        const data = await api.get<LeadsData>(`/api/leads?${params}`);
        setLeads(prev => append ? [...prev, ...(data.leads || [])] : (data.leads || []));
        setTotal(data.total ?? 0);
        setHasMore(data.hasMore ?? false);
        setError(null);
      } catch {
        setError('Failed to load leads');
      } finally {
        setLoading(false);
      }
    },
    [tenantId]
  );

  useEffect(() => {
    setOffset(0);
    setLeads([]);
    setLoading(true);
    fetchLeads(undefined, 0, false);
    const interval = setInterval(() => fetchLeads(undefined, 0, false), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchLeads]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    const next = offset + PAGE;
    setOffset(next);
    setLoadingMore(true);
    await fetchLeads(undefined, next, true);
    setLoadingMore(false);
  }, [hasMore, loadingMore, offset, fetchLeads]);

  return { leads, total, hasMore, loading, loadingMore, error, refetch: fetchLeads, loadMore };
}
