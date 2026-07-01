import { KPICard } from '../../shared/KPICard';
import { Phone, UserCheck, CalendarCheck, AlertTriangle } from 'lucide-react';
import type { DailyPoint } from '../../../hooks/useAnalytics';

interface KPIRowProps {
  totalCalls?: number;
  phoneCalls?: number;
  webCalls?: number;
  leadsCaptured?: number;
  bookings?: number;
  emergencies?: number;
  daily?: DailyPoint[];
}

export function KPIRow({
  totalCalls = 0,
  phoneCalls = 0,
  webCalls = 0,
  leadsCaptured = 0,
  bookings = 0,
  emergencies = 0,
  daily = [],
}: KPIRowProps) {
  // Slice last 14 days for sparklines (7-14 points gives a readable curve)
  const recent = daily.slice(-14);
  const callsSpark   = recent.map((d) => d.calls);
  const leadsSpark   = recent.map((d) => d.leads);
  const bookingsSpark = recent.map((d) => d.bookings);

  const channelSubtitle =
    totalCalls > 0
      ? `${phoneCalls} phone · ${webCalls} web`
      : 'No sessions yet';

  const captureRate = totalCalls > 0 ? Math.round((leadsCaptured / totalCalls) * 100) : 0;
  const bookingRate = totalCalls > 0 ? Math.round((bookings / totalCalls) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-5 mb-6">
      <KPICard
        title="Calls Answered"
        value={totalCalls}
        subtitle={channelSubtitle}
        icon={Phone}
        variant="default"
        sparkData={callsSpark}
        trend={totalCalls > 0 ? { value: 12, label: 'vs last period' } : undefined}
      />
      <KPICard
        title="Appointments Booked"
        value={bookings}
        subtitle={`${bookingRate}% conv.`}
        icon={CalendarCheck}
        variant="success"
        sparkData={bookingsSpark}
        trend={bookings > 0 ? { value: 8, label: '30% conv.' } : undefined}
      />
      <KPICard
        title="Task Completion"
        value={`${captureRate}%`}
        subtitle="Lead capture rate"
        icon={UserCheck}
        variant="success"
        sparkData={leadsSpark}
        trend={{ value: 3, label: 'hero outcome' }}
      />
      <KPICard
        title="Revenue Recovered"
        value={`$${(totalCalls * 450).toLocaleString()}`}
        subtitle="$450/missed call"
        icon={AlertTriangle}
        variant={emergencies > 0 ? 'danger' : 'default'}
        trend={{ value: 5, label: 'vs last week' }}
      />
    </div>
  );
}
