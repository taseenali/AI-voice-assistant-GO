import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { LLMHealth } from '../types/api';

export function useLLMHealth(refreshInterval = 30000) {
  const [health, setHealth] = useState<LLMHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const data = await api.get<LLMHealth>('/api/llm/health');
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('LLM endpoint unreachable');
      setHealth({ available: false, endpoint: 'unknown' });
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