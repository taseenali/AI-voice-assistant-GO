import { Phone, Globe } from 'lucide-react';
import type { SessionChannel } from '../../types/session';
import { channelLabel, isPhoneChannel } from '../../lib/session-display';

interface ChannelBadgeProps {
  channel: SessionChannel | string | null | undefined;
  className?: string;
}

export function ChannelBadge({ channel, className = '' }: ChannelBadgeProps) {
  const phone = isPhoneChannel(channel);
  const label = channelLabel(channel);

  return (
    <span
      className={`inline-flex items-center gap-1.5 badge text-xs font-semibold ${
        phone
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-slate-100 text-slate-600'
      } ${className}`}
    >
      {phone ? <Phone className="w-3 h-3" aria-hidden /> : <Globe className="w-3 h-3" aria-hidden />}
      {label}
    </span>
  );
}
