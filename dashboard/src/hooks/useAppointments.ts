import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Appointment, AppointmentsResponse } from '../types/appointment';

export function useAppointments(refreshInterval = 60000) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await api.get<AppointmentsResponse>('/api/appointments');
      setAppointments(data.appointments || []);
      setCalendarEnabled(data.calendarEnabled);
      setStatusMessage(data.message);
      setError(null);
    } catch {
      setError('Failed to load appointments');
      setCalendarEnabled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(() => fetchAppointments(), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchAppointments]);

  return {
    appointments,
    calendarEnabled,
    statusMessage,
    loading,
    error,
    refetch: fetchAppointments,
  };
}
