import { CalendarDays } from 'lucide-react';
import { useAppointments } from '../../../hooks/useAppointments';
import { AppointmentsTable } from './AppointmentsTable';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';

export function Appointments() {
  const { appointments, calendarEnabled, statusMessage, loading, error } = useAppointments();

  if (loading) {
    return (
      <div>
        <PageHeader title="Appointments" subtitle="Loading calendar..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Appointments" subtitle="Upcoming bookings" />
        <EmptyState
          icon={CalendarDays}
          title="Could not load appointments"
          description={error}
          variant="warning"
        />
      </div>
    );
  }

  if (!calendarEnabled) {
    return (
      <div>
        <PageHeader title="Appointments" subtitle="Upcoming bookings" />
        <EmptyState
          icon={CalendarDays}
          title="Online booking is disabled"
          description={
            statusMessage ||
            'Enable calendar integration in tenant configuration to list appointments booked by the AI receptionist.'
          }
          variant="info"
        />
      </div>
    );
  }

  if (statusMessage && appointments.length === 0) {
    return (
      <div>
        <PageHeader title="Appointments" subtitle="Upcoming bookings" />
        <EmptyState
          icon={CalendarDays}
          title="No appointments to show"
          description={statusMessage}
          variant="info"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} upcoming booking${appointments.length !== 1 ? 's' : ''}`}
      />
      {statusMessage && (
        <p className="text-sm text-amber-600 mb-4 px-1">{statusMessage}</p>
      )}
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
