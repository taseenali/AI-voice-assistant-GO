import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface DailyPoint {
  date: string;
  calls: number;
  leads: number;
  bookings: number;
}

interface TopReason {
  reason: string;
  count: number;
}

export interface AnalyticsOverview {
  window_days: number;
  since: string;
  totals: {
    calls: number;
    phone_calls: number;
    leads: number;
    appointments: number;
    emergencies: number;
  };
  rates: {
    lead_conversion_pct: number;
    booking_rate_pct: number;
  };
  performance: {
    avg_duration_seconds: number;
    avg_cost_usd: number;
    total_cost_usd: number;
  };
  daily: DailyPoint[];
  top_reasons: TopReason[];
}

export function useAnalytics(days = 30) {
  const { tenantId } = useAuth();
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<AnalyticsOverview>(`/api/analytics/overview?days=${days}`)
      .then(setData)
      .catch((e) => setError(e.message ?? 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [tenantId, days]);

  return { data, loading, error };
}
