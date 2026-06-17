import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { HealthStatus } from '../types/api';

export function useServerHealth(refreshInterval = 30000) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const data = await api.get<HealthStatus>('/health');
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('Server unreachable');
      setHealth({ status: 'DOWN', timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, checkHealth]);

  return { health, loading, error, refetch: checkHealth };
}