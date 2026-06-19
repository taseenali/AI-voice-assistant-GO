import React, { useEffect, useReducer, useRef } from 'react';
import { ExternalLink, Phone, Mic, CalendarCheck, AlertTriangle } from 'lucide-react';
import { CallStatus } from './components/CallStatus';
import { PatientPanel, PatientInfo, AppointmentInfo } from './components/PatientPanel';
import { Transcript, Turn } from './components/Transcript';
import { ToolEventData } from './components/ToolEvent';

// ─── State ───────────────────────────────────────────────────────────────────

interface State {
  connStatus: 'connecting' | 'connected' | 'error';
  callStatus: 'idle' | 'active' | 'ended';
  callId: string | null;
  callerPhone: string | null;
  startedAt: number | null;
  duration: number | null;
  recordingUrl: string | null;
  turns: Turn[];
  toolEvents: ToolEventData[];
  patient: PatientInfo;
  appointment: AppointmentInfo;
}

const INITIAL: State = {
  connStatus: 'connecting',
  callStatus: 'idle',
  callId: null,
  callerPhone: null,
  startedAt: null,
  duration: null,
  recordingUrl: null,
  turns: [],
  toolEvents: [],
  patient: {},
  appointment: {},
};

type Action =
  | { type: 'CONNECTED' }
  | { type: 'CONN_ERROR' }
  | { type: 'CALL_STARTED'; callId: string; callerPhone: string | null; ts: number }
  | { type: 'TRANSCRIPT'; turns: Turn[] }
  | { type: 'TOOL_START'; toolName: string; args: Record<string, unknown>; ts: number }
  | { type: 'TOOL_DONE'; toolName: string; args: Record<string, unknown>; result: string | null; ts: number }
  | { type: 'CALL_ENDED'; duration: number | null; recordingUrl: string | null; ts: number };

function toolId(toolName: string, ts: number) {
  return `${toolName}-${ts}`;
}

/** Extract patient/appointment info from completed tool calls */
function applyToolResult(
  state: State,
  toolName: string,
  args: Record<string, unknown>,
  result: string | null,
): Pick<State, 'patient' | 'appointment'> {
  let { patient, appointment } = state;

  if (toolName === 'capture_lead') {
    patient = {
      name:   (args.name   as string) || patient.name,
      phone:  (args.phone  as string) || patient.phone,
      reason: (args.reason_for_visit as string) || patient.reason,
    };
  }

  if (toolName === 'check_availability') {
    // Prefill date/time from args so panel shows before booking is confirmed
    appointment = {
      ...appointment,
      date: (args.date as string) || appointment.date,
      time: (args.time as string) || appointment.time,
      status: appointment.status ?? 'pending',
    };
  }

  if (toolName === 'book_appointment') {
    const success = result?.includes('Booked') ?? false;
    appointment = {
      date:   (args.date as string) || appointment.date,
      time:   (args.time as string) || appointment.time,
      status: success ? 'confirmed' : 'failed',
    };
    if (!patient.name && args.patient_name) {
      patient = { ...patient, name: args.patient_name as string };
    }
  }

  return { patient, appointment };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CONNECTED':
      return { ...state, connStatus: 'connected' };

    case 'CONN_ERROR':
      return { ...state, connStatus: 'error' };

    case 'CALL_STARTED':
      return {
        ...INITIAL,
        connStatus: state.connStatus,
        callStatus: 'active',
        callId: action.callId,
        callerPhone: action.callerPhone,
        startedAt: action.ts,
      };

    case 'TRANSCRIPT':
      // Vapi sends the full accumulated conversation on each update — replace turns
      return { ...state, turns: action.turns };

    case 'TOOL_START': {
      const id = toolId(action.toolName, action.ts);
      const existing = state.toolEvents.find(e => e.id === id);
      if (existing) return state;
      return {
        ...state,
        toolEvents: [
          ...state.toolEvents,
          { id, toolName: action.toolName, args: action.args, status: 'calling', ts: action.ts },
        ],
      };
    }

    case 'TOOL_DONE': {
      const id = toolId(action.toolName, action.ts);
      const updated = state.toolEvents.map(e =>
        e.id === id
          ? { ...e, status: 'done' as const, result: action.result }
          : e
      );
      // If the event didn't arrive before (tool_start missed), add it
      const found = updated.find(e => e.id === id);
      const toolEvents = found
        ? updated
        : [...updated, { id, toolName: action.toolName, args: action.args, status: 'done' as const, result: action.result, ts: action.ts }];

      const derived = applyToolResult(state, action.toolName, action.args, action.result);
      return { ...state, toolEvents, ...derived };
    }

    case 'CALL_ENDED':
      return {
        ...state,
        callStatus: 'ended',
        duration: action.duration,
        recordingUrl: action.recordingUrl,
      };

    default:
      return state;
  }
}

// ─── SSE hook ────────────────────────────────────────────────────────────────

function useLiveStream(dispatch: React.Dispatch<Action>) {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    function connect() {
      const es = new EventSource('/api/calls/stream');
      esRef.current = es;

      es.addEventListener('connected', () => dispatch({ type: 'CONNECTED' }));

      es.addEventListener('call:started', (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        dispatch({ type: 'CALL_STARTED', callId: d.callId, callerPhone: d.callerPhone, ts: d.ts });
      });

      es.addEventListener('call:transcript', (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        dispatch({ type: 'TRANSCRIPT', turns: d.turns });
      });

      es.addEventListener('call:tool:start', (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        dispatch({ type: 'TOOL_START', toolName: d.toolName, args: d.args, ts: d.ts });
      });

      es.addEventListener('call:tool:done', (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        dispatch({ type: 'TOOL_DONE', toolName: d.toolName, args: d.args, result: d.result, ts: d.ts });
      });

      es.addEventListener('call:ended', (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        dispatch({ type: 'CALL_ENDED', duration: d.duration, recordingUrl: d.recordingUrl, ts: d.ts });
      });

      es.onerror = () => {
        dispatch({ type: 'CONN_ERROR' });
        es.close();
        // Auto-reconnect after 3 s
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => esRef.current?.close();
  }, [dispatch]);
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function LiveMonitor() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  useLiveStream(dispatch);

  const { connStatus, callStatus, callerPhone, startedAt, duration, recordingUrl,
          turns, toolEvents, patient, appointment } = state;

  return (
    <div className="h-full flex flex-col bg-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* MVAIR wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">M</span>
            </div>
            <span className="text-xs font-semibold text-on-dark tracking-wide">MVAIR</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-xs text-on-dark-muted">Live Receptionist</span>
        </div>

        <div className="flex items-center gap-4">
          <CallStatus
            status={callStatus}
            callerPhone={callerPhone}
            startedAt={startedAt}
          />
          {/* Connection indicator */}
          <div className="flex items-center gap-1.5">
            <div className={[
              'w-1.5 h-1.5 rounded-full',
              connStatus === 'connected' ? 'bg-signal' :
              connStatus === 'error'     ? 'bg-danger' :
                                           'bg-on-dark-muted animate-pulse',
            ].join(' ')} />
            <span className="text-[10px] text-on-dark-muted">
              {connStatus === 'connected' ? 'Live' :
               connStatus === 'error'     ? 'Reconnecting…' :
                                            'Connecting…'}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — patient + appointment */}
        <div className="w-64 flex-shrink-0 border-r border-white/[0.08] p-4 overflow-y-auto">
          <PatientPanel
            patient={patient}
            appointment={appointment}
            callStatus={callStatus}
          />
        </div>

        {/* Right panel — transcript */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Transcript header */}
          <div className="px-5 py-2.5 border-b border-white/[0.06] flex-shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-on-dark-muted font-semibold">
              Transcript
            </span>
          </div>

          {callStatus === 'idle' && turns.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center select-none">
              {/* Pulse ring */}
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone size={22} className="text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-dark mb-1">Waiting for inbound call…</p>
                <p className="text-xs text-on-dark-muted max-w-[260px] leading-relaxed">
                  Call <span className="text-accent font-mono">+1 (856) 440-2211</span> to see
                  this panel come alive — transcript, tool calls, and booking status update in real time.
                </p>
              </div>
              {/* What you'll see */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[360px]">
                {[
                  { Icon: Mic,           label: 'Transcript',   sub: 'streams live' },
                  { Icon: CalendarCheck, label: 'Booking',      sub: 'confirms here' },
                  { Icon: AlertTriangle, label: 'Emergency',    sub: 'flags instantly' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="rounded-xl border border-white/[0.08] px-3 py-3 flex flex-col items-center gap-1.5">
                    <Icon size={14} className="text-on-dark-muted" />
                    <span className="text-[11px] font-semibold text-on-dark">{label}</span>
                    <span className="text-[10px] text-on-dark-muted">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Transcript
              turns={turns}
              toolEvents={toolEvents}
              callStatus={callStatus}
            />
          )}

          {/* Post-call recording link */}
          {callStatus === 'ended' && (
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between flex-shrink-0">
              <div className="text-xs text-on-dark-muted">
                Call ended
                {duration != null && duration > 0 && (
                  <span> · {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</span>
                )}
              </div>
              {recordingUrl && (
                <a
                  href={recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-white transition-colors"
                >
                  <ExternalLink size={12} />
                  Play recording
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
