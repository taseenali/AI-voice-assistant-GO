import type { SessionChannel } from '../types/session';

/** Null-safe display for optional session fields */
export function emDash(value: string | null | undefined): string {
  return value?.trim() ? value.trim() : '—';
}

export function formatPhoneNumber(value: string | null | undefined): string {
  if (!value?.trim()) return '—';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
}

export function channelLabel(channel: SessionChannel | string | null | undefined): string {
  return channel === 'phone' ? 'Phone' : 'Web';
}

export function isPhoneChannel(channel: SessionChannel | string | null | undefined): boolean {
  return channel === 'phone';
}

export function hasRecording(url: string | null | undefined): boolean {
  return Boolean(url?.trim());
}
