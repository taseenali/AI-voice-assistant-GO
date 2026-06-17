import { useEmergencyEvents } from '../../../hooks/useEmergencyEvents';
import { EmergencyTable } from './EmergencyTable';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function EmergencyLog() {
  const { events, loading } = useEmergencyEvents();

  if (loading) {
    return (
      <div>
        <PageHeader title="Emergency Log" subtitle="Loading events..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <PageHeader
          title="Emergency Log"
          subtitle="Real-time emergency detection events"
        />
        <EmptyState
          icon={ShieldCheck}
          title="No emergencies detected"
          description="Emergency events are logged when the AI detects urgent keywords during a call (e.g., 'chest pain', 'suicide', 'overdose'). The system immediately escalates to a human provider."
          variant="success"
        />
        {/* Emergency Response Protocol */}
        <div className="mt-6 card p-6 border-l-4 border-danger">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <h3 className="text-section-heading font-semibold text-text-primary">
              Emergency Response Protocol
            </h3>
          </div>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span className="font-bold text-danger">1.</span>
              AI detects emergency keyword (pattern matching, Tier 1)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-danger">2.</span>
              Caller immediately informed: "This sounds like a medical emergency."
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-danger">3.</span>
              System triggers webhook to on-call provider (when configured)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-danger">4.</span>
              Event logged with timestamp + session ID + keyword
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-danger">5.</span>
              Call immediately terminated or transferred to human
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Emergency Log"
        subtitle={`${events.length} emergency event${events.length !== 1 ? 's' : ''} detected`}
      />
      <EmergencyTable events={events} />
    </div>
  );
}