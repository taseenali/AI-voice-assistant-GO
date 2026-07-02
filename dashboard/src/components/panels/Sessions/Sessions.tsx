import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessions } from '../../../hooks/useSessions';
import { SessionsTable } from './SessionsTable';
import { TranscriptViewer } from './TranscriptViewer';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Session, ConversationTurn } from '../../../types/session';

interface SessionDetailResponse {
  turns: ConversationTurn[];
  channel?: string;
  phone_number?: string | null;
  recording_url?: string | null;
}

export function Sessions() {
  const { sessions, total, hasMore, loading, loadingMore, loadMore } = useSessions();
  const location = useLocation();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [transcript, setTranscript] = useState<ConversationTurn[]>([]);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  // Auto-open session when navigated from Emergency Log
  useEffect(() => {
    const highlightId: string | undefined = (location.state as { highlightSessionId?: string } | null)?.highlightSessionId;
    if (!highlightId || loading || sessions.length === 0) return;
    const target = sessions.find((s) => s.sessionId === highlightId);
    if (target) loadTranscript(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, loading, sessions]);

  // Push a history entry when panel opens so browser Back closes it
  useEffect(() => {
    if (!selectedSession) return;
    window.history.pushState({ panel: 'session' }, '');
    function onPop() {
      setSelectedSession(null);
      setTranscript([]);
      setTranscriptError(null);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [selectedSession?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTranscript = async (session: Session) => {
    setSelectedSession(session);
    setTranscriptLoading(true);
    setTranscriptError(null);
    try {
      const data = await api.get<SessionDetailResponse>(
        `/api/sessions/${encodeURIComponent(session.sessionId)}`
      );
      setTranscript(data.turns || []);
      setSelectedSession({
        ...session,
        channel: (data.channel as Session['channel']) || session.channel,
        phoneNumber: data.phone_number ?? session.phoneNumber,
        hasRecording: Boolean(data.recording_url) || session.hasRecording,
      });
    } catch {
      setTranscript([]);
      setTranscriptError('Failed to load transcript. Please try again.');
    } finally {
      setTranscriptLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Calls" subtitle="Loading conversations..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <div>
        <PageHeader title="Calls" subtitle="Conversation sessions" />
        <EmptyState
          icon={MessageSquare}
          title="No session data available"
          description="Inbound phone calls and browser widget conversations will appear here."
          variant="info"
        />
      </div>
    );
  }

  const phoneCount = sessions.filter((s) => s.channel === 'phone').length;
  const webCount = sessions.length - phoneCount;
  const subtitle = total > sessions.length
    ? `${total} calls · showing ${sessions.length} · ${phoneCount} phone · ${webCount} web`
    : `${sessions.length} call${sessions.length !== 1 ? 's' : ''} · ${phoneCount} phone · ${webCount} web`;

  return (
    <div>
      <PageHeader title="Calls" subtitle={subtitle} />
      <SessionsTable
        sessions={sessions}
        onSessionClick={loadTranscript}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />

      {transcriptLoading && <LoadingState variant="panel" />}

      {selectedSession && !transcriptLoading && transcriptError && (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-card-bg border-l border-card-border z-40 flex flex-col" style={{ boxShadow: 'var(--app-shadow-pop)' }}>
          <div className="flex items-center justify-between p-6 border-b border-card-border">
            <h2 className="text-lg font-display font-medium text-text-primary">Transcript</h2>
            <button
              type="button"
              onClick={() => { setSelectedSession(null); setTranscriptError(null); }}
              className="text-text-muted hover:text-text-primary transition-colors text-sm"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <AlertCircle className="w-8 h-8 text-danger" />
            <p className="text-sm text-text-primary font-medium">{transcriptError}</p>
            <button
              type="button"
              onClick={() => loadTranscript(selectedSession)}
              className="text-xs text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {selectedSession && !transcriptLoading && !transcriptError && (
        <TranscriptViewer
          session={selectedSession}
          turns={transcript}
          onClose={() => {
            setSelectedSession(null);
            setTranscript([]);
          }}
        />
      )}
    </div>
  );
}
