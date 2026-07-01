import { CSSProperties } from 'react';

export interface ChannelBadgeProps {
  /** Session origin */
  channel: 'phone' | 'web' | string | null | undefined;
  className?: string;
  style?: CSSProperties;
}

export function ChannelBadge(props: ChannelBadgeProps): JSX.Element;
