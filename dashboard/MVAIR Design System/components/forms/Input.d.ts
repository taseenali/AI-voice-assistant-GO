import { CSSProperties, ChangeEvent, InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'onChange'> {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Error message — turns the border/ring red */
  error?: string;
  /** Helper text below the field */
  hint?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
