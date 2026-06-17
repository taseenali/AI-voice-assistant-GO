import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export interface EmergencyEvent {
  id: string;
  sessionId: string;
  detectedAt: string;
  keyword: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
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

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents, refreshInterval]);

  return { events, loading, error, refetch: fetchEvents };
}
