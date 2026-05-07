import { describe, it, expect } from 'vitest';
import { extractDateTime } from '../js/nlp/nlp-temporal-extractor.js';

describe('Temporal Extraction - Pass 8', () => {

  it('should extract "tomorrow at 3pm"', () => {
    const res = extractDateTime('can i book for tomorrow at 3pm?');
    expect(res.found).toBe(true);
    expect(res.naturalLanguage).toContain('Tomorrow');
    expect(res.naturalLanguage).toContain('3:00 PM');
    expect(res.iso).not.toBeNull();
    expect(res.iso).toContain('T15:00:00+05:00');
  });

  it('should extract "Monday morning"', () => {
    const res = extractDateTime('how about monday morning');
    expect(res.found).toBe(true);
    expect(res.naturalLanguage).toContain('Monday');
    expect(res.naturalLanguage).toContain('morning');
    expect(res.iso).not.toBeNull();
    expect(res.iso).toContain('T09:00:00+05:00');
  });

  it('should extract "next Tuesday at 2:00 PM"', () => {
    const res = extractDateTime('next tuesday at 2:00 PM works for me');
    expect(res.found).toBe(true);
    expect(res.naturalLanguage).toContain('Tuesday');
    expect(res.naturalLanguage).toContain('2:00 PM');
    expect(res.iso).not.toBeNull();
  });

  it('should NOT extract irrelevant medical input', () => {
    const res = extractDateTime('I have a severe headache');
    expect(res.found).toBe(false);
  });

  it('should extract "today"', () => {
    const res = extractDateTime('actually i can come in today');
    expect(res.found).toBe(true);
    expect(res.naturalLanguage).toContain('Today');
  });

  it('should extract "3pm" (time only)', () => {
    const res = extractDateTime('is 3pm available?');
    expect(res.found).toBe(true);
    expect(res.naturalLanguage).toBe('3:00 PM');
    expect(res.iso).toBeNull(); // No date found
  });

});
