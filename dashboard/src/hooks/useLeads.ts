import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Lead } from '../types/lead';
import { useAuth } from '../context/AuthContext';

interface LeadsData {
  leads: Lead[];
}

export function useLeads(refreshInterval = 15000) {
  const { tenantId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(
    async (filters?: { service?: string; completenessMin?: number }) => {
      try {
        const params = new URLSearchParams({ client: tenantId });
        if (filters?.service) params.set('service', filters.service);
        if (filters?.completenessMin) {
          params.set('completeness_min', String(filters.completenessMin));
        }
        const data = await api.get<LeadsData>(`/api/leads?${params}`);
        setLeads(data.leads || []);
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
    fetchLeads();
    const interval = setInterval(() => fetchLeads(), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}
