import { CSSProperties } from 'react';

export interface MvairMarkProps {
  /** petrol (on light) · aqua (on dark) */
  tone?: 'petrol' | 'aqua';
  /** px square (default 30) */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** Waveform glyph only. */
export function MvairMark(props: MvairMarkProps): JSX.Element;

/** Mark + "MVAIR" wordmark lockup (Newsreader). */
export function MvairLogo(props: MvairMarkProps): JSX.Element;
