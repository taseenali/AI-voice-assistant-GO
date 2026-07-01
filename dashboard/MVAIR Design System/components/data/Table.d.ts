import { CSSProperties, ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell renderer; falls back to item[key] */
  render?: (item: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Stable row key */
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
}

export function Table<T>(props: TableProps<T>): JSX.Element;
