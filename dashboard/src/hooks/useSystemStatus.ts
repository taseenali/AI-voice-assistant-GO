import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export interface SystemStatus {
  server: {
    up: boolean;
    version: string;
    uptimeSeconds: number;
    nodeVersion: string;
    timestamp: string;
  };
  vapi: {
    configured: boolean;
    webhookConfigured: boolean;
    publicUrlSet: boolean;
    spikeMode: boolean;
  };
  calendar: {
    configured: boolean;
    enabledTenants: number;
  };
  sse: {
    activeConnections: number;
  };
  db: {
    tenants: number;
    sessionsToday: number;
  };
}

export function useSystemStatus(refreshInterval = 30000) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.get<SystemStatus>('/api/status');
      setStatus(data);
      setError(null);
    } catch {
      setError('Could not reach status endpoint');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}
