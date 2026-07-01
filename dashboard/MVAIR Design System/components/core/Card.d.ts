import { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  children?: ReactNode;
  /** Inner padding in px (default 24) */
  padding?: number;
  /** CSS border-radius value (default --mvair-radius-card) */
  radius?: string;
  /** Enable hover lift + deeper shadow (marketing surfaces) */
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card(props: CardProps): JSX.Element;
