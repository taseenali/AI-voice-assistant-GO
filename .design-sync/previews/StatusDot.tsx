import { StatusDot } from 'medvoice-dashboard';

export const Online = () => <StatusDot status="online" label="Connected" />;
export const Offline = () => <StatusDot status="offline" label="Disconnected" />;
export const Warning = () => <StatusDot status="warning" label="Degraded" />;
export const Pulse = () => <StatusDot status="online" pulse label="Live" />;
