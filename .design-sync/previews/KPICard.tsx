import { KPICard } from 'medvoice-dashboard';
import { Phone, Users, Calendar, AlertCircle } from 'lucide-react';

export const Default = () => <KPICard title="Total Calls" value="142" icon={Phone} />;
export const Success = () => <KPICard title="Leads Captured" value="38" subtitle="This month" icon={Users} variant="success" />;
export const Warning = () => <KPICard title="Avg Duration" value="3:24" subtitle="minutes" icon={Calendar} variant="warning" />;
export const Danger = () => <KPICard title="Missed Calls" value="12" subtitle="Needs attention" icon={AlertCircle} variant="danger" />;
