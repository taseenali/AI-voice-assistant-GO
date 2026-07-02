import { useEffect, useRef, useState, useCallback } from 'react';
import { Radio, Phone, Clock } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';

interface Turn {
  role: string;
  text: string;
  ts: number;
}

interface ActiveCall {
  callId: string;
  tenantId: string;
  phoneNumber: string | null;
  startedAt: number;
  turns: Turn[];
  ended: boolean;
  endedAt?: number;
}

function useElapsed(startedAt: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const m = Math.floor(elapsed / 60);
  const s = String(elapsed % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function CallCard({ call }: { call: ActiveCall }) {
  const elapsed = useElapsed(call.startedAt);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [call.turns.length]);

  return (
    <div className={`card p-5 flex flex-col gap-4 ${call.ended ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-text-primary font-mono">
            {call.phoneNumber ?? 'Unknown caller'}
          </span>
          {!call.ended && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              Live
            </span>
          )}
          {call.ended && (
            <span className="text-[11px] font-semibold text-text-muted bg-page px-2 py-0.5 rounded-full border border-card-border">
              Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="w-3.5 h-3.5" />
          {elapsed}
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {call.turns.length === 0 && (
          <p className="text-xs text-text-muted italic">Waiting for transcript…</p>
        )}
        {call.turns.map((t, i) => (
          <div key={i} className={`flex gap-2 ${t.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted shrink-0 mt-0.5 w-10 text-right">
              {t.role === 'assistant' ? 'Aria' : 'Patient'}
            </span>
            <span
              className={`text-[13px] px-3 py-1.5 rounded-xl max-w-[85%] leading-snug ${
                t.role === 'assistant'
                  ? 'bg-primary/10 text-text-primary'
                  : 'bg-card-border text-text-primary'
              }`}
            >
              {t.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function LiveMonitor() {
  const [calls, setCalls] = useState<Map<string, ActiveCall>>(new Map());
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const updateCall = useCallback((callId: string, updater: (c: ActiveCall) => ActiveCall) => {
    setCalls(prev => {
      const existing = prev.get(callId);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(callId, updater(existing));
      return next;
    });
  }, []);

  useEffect(() => {
    const es = new EventSource('/api/calls/stream', { withCredentials: true });
    esRef.current = es;

    es.addEventListener('connected', () => setConnected(true));

    es.addEventListener('call:started', (e) => {
      const d = JSON.parse(e.data);
      setCalls(prev => {
        const next = new Map(prev);
        next.set(d.callId, {
          callId: d.callId,
          tenantId: d.tenantId,
          phoneNumber: d.phoneNumber ?? null,
          startedAt: Date.now(),
          turns: [],
          ended: false,
        });
        return next;
      });
    });

    es.addEventListener('call:transcript', (e) => {
      const d = JSON.parse(e.data);
      updateCall(d.callId, (c) => ({
        ...c,
        turns: [...c.turns, ...(d.turns ?? [])],
      }));
    });

    es.addEventListener('call:ended', (e) => {
      const d = JSON.parse(e.data);
      updateCall(d.callId, (c) => ({ ...c, ended: true, endedAt: Date.now() }));
      setTimeout(() => {
        setCalls(prev => { const next = new Map(prev); next.delete(d.callId); return next; });
      }, 30_000);
    });

    es.onerror = () => setConnected(false);

    return () => { es.close(); esRef.current = null; };
  }, [updateCall]);

  const activeCalls = [...calls.values()];

  return (
    <div>
      <PageHeader
        title="Live Monitor"
        subtitle={
          connected
            ? activeCalls.filter(c => !c.ended).length > 0
              ? `${activeCalls.filter(c => !c.ended).length} call${activeCalls.filter(c => !c.ended).length !== 1 ? 's' : ''} in progress`
              : 'No active calls'
            : 'Connecting…'
        }
      />

      {activeCalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Radio className={`w-7 h-7 text-primary ${connected ? '' : 'opacity-40'}`} />
          </div>
          <p className="text-text-secondary text-sm max-w-xs">
            {connected
              ? 'No calls in progress. When Aria answers a call, the live transcript will appear here.'
              : 'Connecting to event stream…'}
          </p>
          {connected && (
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              Listening for incoming calls
            </span>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activeCalls.map(call => <CallCard key={call.callId} call={call} />)}
        </div>
      )}
    </div>
  );
}
