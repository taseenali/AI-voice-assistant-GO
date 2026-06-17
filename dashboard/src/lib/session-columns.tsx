import type { Column } from '../components/shared/Table';
import { Badge } from '../components/shared/Badge';
import { ChannelBadge } from '../components/shared/ChannelBadge';
import { PhoneDisplay, RecordingLink } from '../components/shared/SessionFieldCells';
import type { Session } from '../types/session';

/** Shared session table columns — channel first for visual scan */
export function buildSessionColumns(options?: {
  includeEmergency?: boolean;
  includeRecording?: boolean;
}): Column<Session>[] {
  const { includeEmergency = false, includeRecording = true } = options ?? {};

  const cols: Column<Session>[] = [
    {
      key: 'channel',
      header: 'Channel',
      render: (session) => <ChannelBadge channel={session.channel} />,
    },
    {
      key: 'phoneNumber',
      header: 'Caller',
      render: (session) => (
        <PhoneDisplay number={session.phoneNumber} channel={session.channel} />
      ),
    },
    {
      key: 'startTime',
      header: 'Start Time',
      render: (session) => new Date(session.startTime).toLocaleString(),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (session) => {
        const mins = Math.floor(session.duration / 60);
        const secs = session.duration % 60;
        return `${mins}m ${secs}s`;
      },
    },
    {
      key: 'turns',
      header: 'Turns',
    },
    {
      key: 'intent',
      header: 'Intent',
      render: (session) =>
        session.intent ? (
          <Badge label={session.intent} intent={session.intent} />
        ) : (
          <span className="text-text-muted">—</span>
        ),
    },
    {
      key: 'leadCaptured',
      header: 'Lead',
      render: (session) =>
        session.leadCaptured ? (
          <Badge label="Captured" variant="success" />
        ) : (
          <span className="text-text-muted">—</span>
        ),
    },
  ];

  if (includeRecording) {
    cols.push({
      key: 'recordingUrl',
      header: 'Recording',
      render: (session) => <RecordingLink url={session.recordingUrl} />,
    });
  }

  if (includeEmergency) {
    cols.push({
      key: 'emergencyDetected',
      header: 'Emergency',
      render: (session) =>
        session.emergencyDetected ? (
          <Badge label="Yes" variant="danger" />
        ) : (
          <span className="text-text-muted">—</span>
        ),
    });
  }

  cols.push({
    key: 'sessionId',
    header: 'Session ID',
    className: 'font-mono text-xs text-text-muted',
    render: (session) => (
      <span className="font-mono text-xs text-text-muted truncate max-w-[140px] inline-block">
        {session.sessionId}
      </span>
    ),
  });

  return cols;
}
