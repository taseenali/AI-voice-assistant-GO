import { EmptyState } from 'medvoice-dashboard';
import { Calendar, Phone } from 'lucide-react';

export const Default = () => (
  <EmptyState
    icon={Calendar}
    title="No appointments"
    description="No appointments scheduled for today."
  />
);
export const WithAction = () => (
  <EmptyState
    icon={Phone}
    title="No sessions yet"
    description="Calls will appear here after the first patient interaction."
    action={{ label: "View guide", onClick: () => {} }}
  />
);
