import { ComponentType, CSSProperties, ReactNode } from 'react';

export interface KPICardProps {
  /** Uppercase label */
  title: string;
  /** The metric (number or formatted string) */
  value: string | number | ReactNode;
  subtitle?: string;
  /** Lucide icon, colored by variant */
  icon?: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  style?: CSSProperties;
}

/**
 * Single KPI metric tile.
 * @startingPoint section="Data" subtitle="KPI metric tile" viewport="700x150"
 */
export function KPICard(props: KPICardProps): JSX.Element;
