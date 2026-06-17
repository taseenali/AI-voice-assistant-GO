import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Config } from '../types/config';
import { useAuth } from '../context/AuthContext';

interface TenantBundle {
  tenant_id: string;
  company_name: string;
  config: {
    assistant_name: string;
    first_message: string;
    calendar_enabled: boolean;
    calendar_id?: string | null;
    emergency_keywords: string[];
    services: Config['services'];
  };
}

function mapTenantBundleToConfig(bundle: TenantBundle): Config {
  const cfg = bundle.config;
  return {
    company_name: bundle.company_name,
    assistant_name: cfg.assistant_name,
    assistant_role: 'AI Medical Receptionist',
    tone: 'warm, calm, professional',
    primary_goal: 'book_appointment',
    secondary_goals: [],
    ai_tier: 2,
    llm_model: 'gpt-4o',
    services: cfg.services || [],
    qualification_fields: [],
    emergency_keywords: cfg.emergency_keywords || [],
    greetings: cfg.first_message ? [cfg.first_message] : [],
    cta_templates: [],
    calendar_enabled: Boolean(cfg.calendar_enabled),
    calendar_id: cfg.calendar_id || undefined,
  };
}

export function useConfig() {
  const { tenantId } = useAuth();
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await api.get<TenantBundle>(`/api/admin/tenants/${tenantId}`);
      setConfig(mapTenantBundleToConfig(data));
      setError(null);
    } catch (err) {
      setError('Failed to load configuration');
      console.error('[useConfig]', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    setLoading(true);
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error };
}
