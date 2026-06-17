import { formatPhoneNumber, hasRecording } from '../../lib/session-display';

interface RecordingLinkProps {
  url: string | null | undefined;
  className?: string;
}

/** Renders external play link or em dash — never a broken empty link */
export function RecordingLink({ url, className = '' }: RecordingLinkProps) {
  if (!hasRecording(url)) {
    return <span className={`text-text-muted ${className}`}>—</span>;
  }

  return (
    <a
      href={url!}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-primary text-sm font-medium hover:underline ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      Play
    </a>
  );
}

interface PhoneDisplayProps {
  number: string | null | undefined;
  channel?: string | null;
  className?: string;
}

/** Phone number for phone channel; em dash for web / missing */
export function PhoneDisplay({ number, channel, className = '' }: PhoneDisplayProps) {
  if (channel !== 'phone') {
    return <span className={`text-text-muted ${className}`}>—</span>;
  }
  const formatted = formatPhoneNumber(number);
  return (
    <span className={`text-sm text-text-primary tabular-nums ${className}`}>{formatted}</span>
  );
}
