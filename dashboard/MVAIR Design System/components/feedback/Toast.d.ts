import { CSSProperties } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function Toast(props: ToastProps): JSX.Element;
