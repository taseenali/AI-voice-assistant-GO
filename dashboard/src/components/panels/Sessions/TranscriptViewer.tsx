import { X, User, Bot } from 'lucide-react';
import { ChannelBadge } from '../../shared/ChannelBadge';
import { PhoneDisplay, RecordingLink } from '../../shared/SessionFieldCells';
import type { ConversationTurn, Session } from '../../../types/session';

interface TranscriptViewerProps {
  session: Session;
  turns: ConversationTurn[];
  onClose: () => void;
}

export function TranscriptViewer({ session, turns, onClose }: TranscriptViewerProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-medium tracking-tight text-text-primary">Transcript</h2>
            <p className="text-xs text-text-muted font-mono truncate max-w-[320px]">
              {session.sessionId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close transcript"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="card p-4 mb-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-secondary">Channel</span>
            <ChannelBadge channel={session.channel} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-secondary">Caller</span>
            <PhoneDisplay number={session.phoneNumber} channel={session.channel} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-secondary">Recording</span>
            <RecordingLink url={session.recordingUrl} />
          </div>
        </div>

        <div className="space-y-4">
          {turns.map((turn, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                turn.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  turn.role === 'assistant'
                    ? 'bg-primary text-white'
                    : 'bg-accent/20 text-primary'
                }`}
              >
                {turn.role === 'assistant' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`rounded-card p-3 text-sm ${
                    turn.role === 'assistant'
                      ? 'bg-primary-light text-text-primary'
                      : 'bg-page border border-card-border text-text-primary'
                  }`}
                >
                  <p>{turn.text}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-muted" title={turn.timestamp}>
                    {new Date(turn.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  {turn.state && (
                    <span className="badge text-xs bg-page border border-card-border text-text-muted">
                      {turn.state}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {turns.length === 0 && (
          <p className="text-center text-text-muted py-8">No conversation turns recorded.</p>
        )}
      </div>
    </div>
  );
}
