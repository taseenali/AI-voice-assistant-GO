import { ComponentType, CSSProperties } from 'react';

export interface EmptyStateProps {
  icon?: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  variant?: 'info' | 'warning' | 'success';
  className?: string;
  style?: CSSProperties;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
