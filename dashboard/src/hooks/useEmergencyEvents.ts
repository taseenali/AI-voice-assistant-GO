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

export function useEmergencyEvents(refreshInterval = 15000) {
  const { tenantId } = useAuth();
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.get<EmergencyResponse>(
        `/api/emergency?client=${encodeURIComponent(tenantId)}`
      );
      setEvents(data.events || []);
      setError(null);
    } catch {
      setError('Failed to load emergency events');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const resolve = useCallback(async (rawId: number) => {
    await api.put(`/api/emergency/${rawId}/resolve`, {});
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents, refreshInterval]);

  return { events, loading, error, refetch: fetchEvents, resolve };
}
