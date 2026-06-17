import { describe, it, expect } from 'vitest';
import {
  normalizeToolCallList,
  formatToolResult,
  buildToolCallResponse,
} from '../server/platform/vapi/normalize-tool-calls.js';

describe('normalizeToolCallList', () => {
  it('parses toolCallList with object arguments', () => {
    const list = normalizeToolCallList({
      toolCallList: [
        {
          id: 'toolu_1',
          name: 'capture_lead',
          arguments: { name: 'Jane', reason_for_visit: 'checkup' },
        },
      ],
    });
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('capture_lead');
    expect(list[0].arguments.name).toBe('Jane');
  });

  it('parses toolCalls with string arguments', () => {
    const list = normalizeToolCallList({
      toolCalls: [
        {
          id: 'toolu_2',
          function: {
            name: 'capture_lead',
            arguments: '{"name":"Bob","reason_for_visit":"pain"}',
          },
        },
      ],
    });
    expect(list[0].arguments.name).toBe('Bob');
  });

  it('parses live capture shape (nested function.arguments object)', () => {
    const list = normalizeToolCallList({
      toolCalls: [
        {
          id: 'call_capture_test_001',
          type: 'function',
          function: {
            name: 'capture_lead',
            arguments: { name: 'Jane', reason_for_visit: 'checkup' },
          },
        },
      ],
      toolCallList: [
        {
          id: 'call_capture_test_001',
          type: 'function',
          function: {
            name: 'capture_lead',
            arguments: { name: 'Jane', reason_for_visit: 'checkup' },
          },
        },
      ],
    });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('call_capture_test_001');
    expect(list[0].arguments.reason_for_visit).toBe('checkup');
  });
});

describe('formatToolResult', () => {
  it('flattens multiline strings to single line', () => {
    expect(formatToolResult('Line one\nLine two')).toBe('Line one Line two');
  });

  it('stringifies objects', () => {
    expect(formatToolResult({ ok: true })).toBe('{"ok":true}');
  });
});

describe('buildToolCallResponse', () => {
  it('returns results array with matching toolCallId', () => {
    const calls = [{ id: 'toolu_x', name: 'capture_lead', arguments: {} }];
    const map = new Map([['toolu_x', { result: 'Saved.' }]]);
    const out = buildToolCallResponse(calls, map);
    expect(out.results[0]).toEqual({ toolCallId: 'toolu_x', result: 'Saved.' });
  });
});
