import { Badge } from 'medvoice-dashboard';

export const Default = () => <Badge label="Active" />;
export const Success = () => <Badge label="Confirmed" variant="success" />;
export const Warning = () => <Badge label="Pending" variant="warning" />;
export const Danger = () => <Badge label="Missed" variant="danger" />;
export const Neutral = () => <Badge label="Unknown" variant="neutral" />;
export const IntentGeneral = () => <Badge label="General" intent="general" />;
export const IntentUrgent = () => <Badge label="Urgent" intent="urgent" />;
