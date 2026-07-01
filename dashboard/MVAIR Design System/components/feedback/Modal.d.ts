import { CSSProperties, ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export function Modal(props: ModalProps): JSX.Element | null;
