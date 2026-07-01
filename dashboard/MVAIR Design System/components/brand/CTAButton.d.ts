import { CSSProperties, ReactNode } from 'react';

export interface CTAButtonProps {
  href?: string;
  children?: ReactNode;
  /** petrol (light bg) · aqua (primary CTA) · ghost (over dark hero) */
  variant?: 'petrol' | 'aqua' | 'ghost';
  size?: 'sm' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export function CTAButton(props: CTAButtonProps): JSX.Element;
