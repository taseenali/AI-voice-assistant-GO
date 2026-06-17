import { describe, it, expect } from 'vitest';
import {
  emDash,
  formatPhoneNumber,
  hasRecording,
  isPhoneChannel,
} from '../dashboard/src/lib/session-display.ts';

describe('session-display null-safe helpers', () => {
  it('emDash returns — for null/empty', () => {
    expect(emDash(null)).toBe('—');
    expect(emDash('')).toBe('—');
    expect(emDash('  ')).toBe('—');
  });

  it('formatPhoneNumber formats E.164 US or returns —', () => {
    expect(formatPhoneNumber(null)).toBe('—');
    expect(formatPhoneNumber('+18564402211')).toBe('+1 (856) 440-2211');
    expect(formatPhoneNumber('8564402211')).toBe('(856) 440-2211');
  });

  it('hasRecording is false for empty URLs', () => {
    expect(hasRecording(null)).toBe(false);
    expect(hasRecording('')).toBe(false);
    expect(hasRecording('https://example.com/r.mp3')).toBe(true);
  });

  it('isPhoneChannel distinguishes phone from web', () => {
    expect(isPhoneChannel('phone')).toBe(true);
    expect(isPhoneChannel('web')).toBe(false);
    expect(isPhoneChannel(null)).toBe(false);
  });
});
