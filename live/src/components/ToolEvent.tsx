import React from 'react';
import { Search, CalendarCheck, UserPlus, AlertTriangle, Loader } from 'lucide-react';

export interface ToolEventData {
  id: string;
  toolName: string;
  status: 'calling' | 'done' | 'error';
  result?: string | null;
  ts: number;
}

const TOOL_META: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  check_availability: { label: 'Checking calendar',  Icon: Search,        color: 'text-accent' },
  book_appointment:   { label: 'Booking appointment', Icon: CalendarCheck, color: 'text-signal' },
  capture_lead:       { label: 'Saving patient info', Icon: UserPlus,      color: 'text-primary' },
  log_emergency:      { label: 'Emergency logged',    Icon: AlertTriangle, color: 'text-danger' },
};

export function ToolEvent({ event }: { event: ToolEventData }) {
  const meta = TOOL_META[event.toolName] ?? {
    label: event.toolName,
    Icon: Search,
    color: 'text-on-dark-muted',
  };
  const { label, Icon, color } = meta;

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 my-1 mx-1 rounded-lg bg-white/[0.04] border border-white/[0.06] animate-slide-in">
      <div className={`flex-shrink-0 ${color}`}>
        {event.status === 'calling' ? (
          <Loader size={12} className="animate-spin" />
        ) : (
          <Icon size={12} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[11px] font-medium ${color}`}>{label}</span>
        {event.status === 'done' && event.result && (
          <span className="ml-2 text-[11px] text-on-dark-muted truncate">
            — {event.result}
          </span>
        )}
        {event.status === 'error' && (
          <span className="ml-2 text-[11px] text-danger">failed</span>
        )}
      </div>
    </div>
  );
}
