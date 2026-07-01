import { ComponentType, CSSProperties, ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  /** petrol primary (default) · aqua CTA · secondary · outline · ghost */
  variant?: 'primary' | 'aqua' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon component, rendered before the label by default */
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  iconRight?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: CSSProperties;
}

/**
 * MVAIR action button.
 * @startingPoint section="Core" subtitle="Petrol / aqua / outline action button" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
