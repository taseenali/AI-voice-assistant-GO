import { ComponentType, CSSProperties, ReactNode } from 'react';

export interface BadgeProps {
  /** Text label (or use children) */
  label?: string;
  children?: ReactNode;
  /** Status color */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Session-category color (overrides variant) */
  intent?: 'general' | 'dental' | 'followup' | 'urgent' | 'inquiry' | 'unknown';
  /** Optional Lucide icon */
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  className?: string;
  style?: CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
