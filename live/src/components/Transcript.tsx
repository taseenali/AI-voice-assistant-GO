import React, { useEffect, useRef } from 'react';
import { ToolEvent, ToolEventData } from './ToolEvent';

export interface Turn {
  role: 'user' | 'bot';
  text: string;
  ts: number;
}

type TranscriptItem =
  | { type: 'turn'; turn: Turn; key: string; ts: number }
  | { type: 'tool'; event: ToolEventData; key: string; ts: number };

interface Props {
  turns: Turn[];
  toolEvents: ToolEventData[];
  callStatus: 'idle' | 'active' | 'ended';
}

function Bubble({ turn }: { turn: Turn }) {
  const isAria = turn.role === 'bot';
  return (
    <div className={`flex ${isAria ? 'justify-start' : 'justify-end'} mb-2 animate-slide-in`}>
      {isAria && (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white mr-2 mt-0.5 flex-shrink-0">
          A
        </div>
      )}
      <div
        className={[
          'max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed',
          isAria
            ? 'bg-white/[0.07] text-on-dark rounded-tl-sm'
            : 'bg-primary/90 text-white rounded-tr-sm',
        ].join(' ')}
      >
        {turn.text}
      </div>
    </div>
  );
}

export function Transcript({ turns, toolEvents, callStatus }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns.length, toolEvents.length]);

  // Merge turns and tool events into a single timeline sorted by ts
  const items: TranscriptItem[] = [
    ...turns.map((t, i) => ({ type: 'turn' as const, turn: t, ts: t.ts, key: `t-${i}` })),
    ...toolEvents.map(e => ({ type: 'tool' as const, event: e, ts: e.ts, key: `ev-${e.id}` })),
  ].sort((a, b) => a.ts - b.ts);

  if (callStatus === 'idle' && items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-dark-muted">
        <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <p className="text-xs">No active call. Transcript will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
      {items.map(item =>
        item.type === 'turn'
          ? <Bubble key={item.key} turn={item.turn} />
          : <ToolEvent key={item.key} event={item.event} />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
