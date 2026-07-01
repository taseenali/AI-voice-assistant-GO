import { CSSProperties } from 'react';

export interface StatusDotProps {
  /** online (success) · offline (danger) · warning (amber) · live (chartreuse signal) */
  status?: 'online' | 'offline' | 'warning' | 'live';
  /** Force pulse on/off; defaults to on for online & live */
  pulse?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function StatusDot(props: StatusDotProps): JSX.Element;
