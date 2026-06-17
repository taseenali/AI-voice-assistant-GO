import { useState, useEffect } from 'react';
import type { Session, SessionStats } from '../types/session';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface SessionsResponse {
  sessions: Session[];
  stats: SessionStats;
}

const EMPTY_STATS: SessionStats = {
  totalToday: 0,
  leadsToday: 0,
  avgDuration: 0,
  emergenciesToday: 0,
  phoneCallsToday: 0,
  webCallsToday: 0,
};

export function useSessions() {
  const { tenantId } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.get<SessionsResponse>(
          `/api/sessions?client=${encodeURIComponent(tenantId)}&limit=50&offset=0`
        );
        setSessions(data.sessions || []);
        if (data.stats) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [tenantId]);

  return { sessions, stats, loading, error };
}
