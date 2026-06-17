import { KPICard } from '../../shared/KPICard';
import { Phone, UserCheck, Clock, AlertTriangle } from 'lucide-react';

interface KPIRowProps {
  totalCalls?: number;
  phoneCalls?: number;
  webCalls?: number;
  leadsCaptured?: number;
  avgDuration?: string;
  emergencies?: number;
}

export function KPIRow({
  totalCalls = 0,
  phoneCalls = 0,
  webCalls = 0,
  leadsCaptured = 0,
  avgDuration = '0m',
  emergencies = 0,
}: KPIRowProps) {
  const channelSubtitle =
    totalCalls > 0
      ? `${phoneCalls} phone · ${webCalls} web`
      : 'No sessions yet';

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Total Calls Today"
        value={totalCalls}
        subtitle={channelSubtitle}
        icon={Phone}
        variant="default"
      />
      <KPICard
        title="Leads Captured"
        value={leadsCaptured}
        subtitle={`${totalCalls > 0 ? Math.round((leadsCaptured / totalCalls) * 100) : 0}% capture rate`}
        icon={UserCheck}
        variant="success"
      />
      <KPICard
        title="Avg Duration"
        value={avgDuration}
        subtitle="Per conversation"
        icon={Clock}
        variant="default"
      />
      <KPICard
        title="Emergencies"
        value={emergencies}
        subtitle="Requiring escalation"
        icon={AlertTriangle}
        variant={emergencies > 0 ? 'danger' : 'default'}
      />
    </div>
  );
}
