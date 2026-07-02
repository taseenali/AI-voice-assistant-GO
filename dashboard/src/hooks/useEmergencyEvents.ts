import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export interface EmergencyEvent {
  id: string;
  rawId: number;
  sessionId: string;
  detectedAt: string;
  keyword: string;
  userMessage: string | null;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
  resolvedAt: string | null;
  owner: string | null;
}

interface EmergencyResponse {
  events: EmergencyEvent[];
}

const PAGE = 100;

export function useEmergencyEvents(refreshInterval = 15000) {
  const { tenantId } = useAuth();
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (off = 0, append = false) => {
    try {
      const data = await api.get<EmergencyResponse>(
        `/api/emergency?limit=${PAGE}&offset=${off}`
      );
      const page = data.events || [];
      setEvents(prev => append ? [...prev, ...page] : page);
      setHasMore(page.length === PAGE);
      setError(null);
    } catch {
      setError('Failed to load emergency events');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const resolve = useCallback(async (rawId: number) => {
    await api.put(`/api/emergency/${rawId}/resolve`, {});
    await fetchEvents(0, false);
    setOffset(0);
  }, [fetchEvents]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    const next = offset + PAGE;
    setOffset(next);
    setLoadingMore(true);
    await fetchEvents(next, true);
    setLoadingMore(false);
  }, [hasMore, loadingMore, offset, fetchEvents]);

  useEffect(() => {
    setOffset(0);
    setEvents([]);
    setLoading(true);
    fetchEvents(0, false);
    const interval = setInterval(() => fetchEvents(0, false), refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents, refreshInterval]);

  return { events, hasMore, loading, loadingMore, error, refetch: fetchEvents, resolve, loadMore };
}
