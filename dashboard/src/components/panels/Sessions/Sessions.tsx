import { useState } from 'react';
import { useSessions } from '../../../hooks/useSessions';
import { SessionsTable } from './SessionsTable';
import { TranscriptViewer } from './TranscriptViewer';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { MessageSquare } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Session, ConversationTurn } from '../../../types/session';

interface SessionDetailResponse {
  turns: ConversationTurn[];
  channel?: string;
  phone_number?: string | null;
  recording_url?: string | null;
}

export function Sessions() {
  const { sessions, loading } = useSessions();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [transcript, setTranscript] = useState<ConversationTurn[]>([]);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const loadTranscript = async (session: Session) => {
    setSelectedSession(session);
    setTranscriptLoading(true);
    try {
      const data = await api.get<SessionDetailResponse>(
        `/api/sessions/${encodeURIComponent(session.sessionId)}`
      );
      setTranscript(data.turns || []);
      setSelectedSession({
        ...session,
        channel: (data.channel as Session['channel']) || session.channel,
        phoneNumber: data.phone_number ?? session.phoneNumber,
        recordingUrl: data.recording_url ?? session.recordingUrl,
      });
    } catch {
      setTranscript([]);
    } finally {
      setTranscriptLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Sessions" subtitle="Loading conversations..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <div>
        <PageHeader title="Sessions" subtitle="Conversation sessions" />
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

  return (
    <div>
      <PageHeader
        title="Sessions"
        subtitle={`${sessions.length} session${sessions.length !== 1 ? 's' : ''} · ${phoneCount} phone · ${webCount} web`}
      />
      <SessionsTable sessions={sessions} onSessionClick={loadTranscript} />

      {selectedSession && !transcriptLoading && (
        <TranscriptViewer
          session={selectedSession}
          turns={transcript}
          onClose={() => {
            setSelectedSession(null);
            setTranscript([]);
          }}
        />
      )}
      {transcriptLoading && <LoadingState variant="panel" />}
    </div>
  );
}
