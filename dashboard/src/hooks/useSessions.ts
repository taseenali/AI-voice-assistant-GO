import { useState, useEffect, useCallback } from 'react';
import type { Session, SessionStats } from '../types/session';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface SessionsResponse {
  sessions: Session[];
  stats: SessionStats;
  total: number;
  hasMore: boolean;
}

const EMPTY_STATS: SessionStats = {
  totalToday: 0,
  leadsToday: 0,
  avgDuration: 0,
  emergenciesToday: 0,
  phoneCallsToday: 0,
  webCallsToday: 0,
};

const PAGE = 100;

export function useSessions() {
  const { tenantId } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async (off: number, append: boolean) => {
    try {
      const data = await api.get<SessionsResponse>(
        `/api/sessions?limit=${PAGE}&offset=${off}`
      );
      setSessions(prev => append ? [...prev, ...(data.sessions || [])] : (data.sessions || []));
      setTotal(data.total ?? 0);
      setHasMore(data.hasMore ?? false);
      if (!append && data.stats) {
        setStats({
          ...EMPTY_STATS,
          ...data.stats,
          phoneCallsToday: data.stats.phoneCallsToday ?? 0,
          webCallsToday: data.stats.webCallsToday ?? 0,
        });
      }
      setError(null);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('[useSessions]', err);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    setSessions([]);
    setLoading(true);
    fetchSessions(0, false).finally(() => setLoading(false));
  }, [tenantId, fetchSessions]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    const next = offset + PAGE;
    setOffset(next);
    setLoadingMore(true);
    await fetchSessions(next, true);
    setLoadingMore(false);
  }, [hasMore, loadingMore, offset, fetchSessions]);

  return { sessions, stats, total, hasMore, loading, loadingMore, error, loadMore };
}
