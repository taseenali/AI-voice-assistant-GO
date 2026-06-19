import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface Props {
  status: 'idle' | 'active' | 'ended';
  callerPhone: string | null;
  startedAt: number | null;
}

function useElapsed(startedAt: number | null, active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active || !startedAt) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active, startedAt]);
  return elapsed;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export function CallStatus({ status, callerPhone, startedAt }: Props) {
  const elapsed = useElapsed(startedAt, status === 'active');

  if (status === 'idle') {
    return (
      <div className="flex items-center gap-2.5 text-on-dark-muted">
        <PhoneOff size={14} />
        <span className="text-xs tracking-wide">Waiting for call…</span>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="flex items-center gap-2.5 text-on-dark-muted">
        <PhoneOff size={14} />
        <span className="text-xs tracking-wide">Call ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Live pulse */}
      <div className="relative w-2.5 h-2.5 flex-shrink-0">
        <div className="absolute inset-0 rounded-full bg-signal animate-live-pulse" />
        <div className="absolute inset-0 rounded-full bg-signal" />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Phone size={13} className="text-accent" />
        <span className="text-on-dark font-medium">
          {callerPhone ?? 'Inbound call'}
        </span>
        <span className="text-on-dark-muted font-mono">{fmt(elapsed)}</span>
      </div>
    </div>
  );
}
