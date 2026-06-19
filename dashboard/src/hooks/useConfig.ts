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
    timezone?: string;
    emergency_keywords: string[];
    emergency_response?: string;
    business_hours?: Record<string, unknown> | null;
    services: Config['services'];
  };
}

// Fields shown in the JSON editor — no secrets, no derived fields
const EDITABLE_KEYS = [
  'assistant_name', 'first_message', 'timezone',
  'calendar_enabled', 'calendar_id', 'emergency_response',
  'emergency_keywords', 'business_hours', 'services',
] as const;

function toEditableConfig(bundle: TenantBundle): Record<string, unknown> {
  const result: Record<string, unknown> = { company_name: bundle.company_name };
  for (const key of EDITABLE_KEYS) {
    const val = (bundle.config as Record<string, unknown>)[key];
    if (val !== undefined) result[key] = val;
  }
  return result;
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
  const [editableConfig, setEditableConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await api.get<TenantBundle>(`/api/admin/tenants/${tenantId}`);
      setConfig(mapTenantBundleToConfig(data));
      setEditableConfig(toEditableConfig(data));
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

  const saveConfig = useCallback(async (updates: Record<string, unknown>) => {
    await api.put<TenantBundle>(`/api/admin/tenants/${tenantId}`, updates);
    await fetchConfig();
  }, [tenantId, fetchConfig]);

  return { config, editableConfig, loading, error, saveConfig };
}
