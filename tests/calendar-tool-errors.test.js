import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import * as calendarTool from '../server/platform/tools/calendar-tool.js';
import { toSlotIso } from '../server/platform/tools/calendar-tool.js';

const TEST_CALENDAR = 'test@group.calendar.google.com';

beforeAll(async () => {
  await import('../server/lib/database.js');
  const { bootstrapPlatform } = await import('../server/platform/bootstrap.js');
  await bootstrapPlatform();
});

afterEach(() => {
  calendarTool.__clearTestCalendarClient();
  vi.restoreAllMocks();
});

describe('toSlotIso timezone conversion', () => {
  it('converts 10:00 Asia/Karachi (UTC+5) to 05:00 UTC', () => {
    const { startTime, endTime } = toSlotIso('2026-06-23', '10:00', 30, 'Asia/Karachi');
    expect(startTime).toBe('2026-06-23T05:00:00.000Z');
    expect(endTime).toBe('2026-06-23T05:30:00.000Z');
  });

  it('leaves UTC wall-clock unchanged', () => {
    const { startTime } = toSlotIso('2026-06-23', '10:00', 30, 'UTC');
    expect(startTime).toBe('2026-06-23T10:00:00.000Z');
  });
});

describe('calendar tool error paths (Vapi-safe strings, not throws)', () => {
  it('bookAppointment returns failure message when slot is unavailable', async () => {
    calendarTool.__setTestCalendarClient({
      freebusy: {
        query: vi.fn().mockResolvedValue({
          data: {
            calendars: {
              [TEST_CALENDAR]: {
                busy: [{ start: '2027-03-15T14:00:00Z', end: '2027-03-15T14:30:00Z' }],
              },
            },
          },
        }),
      },
      events: { insert: vi.fn() },
    });

    const result = await calendarTool.bookAppointment({
      calendarId: TEST_CALENDAR,
      date: '2027-03-15',
      time: '10:00',
      patientName: 'Jane Doe',
      reason: 'checkup',
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/not available/);
  });

  it('bookAppointment returns failure message when Google API throws on insert', async () => {
    calendarTool.__setTestCalendarClient({
      freebusy: {
        query: vi.fn().mockResolvedValue({
          data: { calendars: { [TEST_CALENDAR]: { busy: [] } } },
        }),
      },
      events: {
        insert: vi.fn().mockRejectedValue(new Error('Calendar API unavailable')),
      },
    });

    const result = await calendarTool.bookAppointment({
      calendarId: TEST_CALENDAR,
      date: '2027-03-15',
      time: '10:00',
      patientName: 'Jane Doe',
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/Could not book appointment/);
    expect(result.message).toMatch(/Calendar API unavailable/);
  });
});

describe('book_appointment via tool loop (200-shaped for Vapi)', () => {
  it('handleToolCalls returns user-facing string when booking fails (no throw)', async () => {
    const toolRouter = await import('../server/platform/tools/tool-router.js');
    const { handleToolCalls } = await import('../server/platform/tools/tool-calls-handler.js');

    const orig = toolRouter.TOOL_HANDLERS.book_appointment;
    toolRouter.TOOL_HANDLERS.book_appointment = async () =>
      'Could not book appointment: Calendar API unavailable';

    const message = {
      type: 'tool-calls',
      toolCallList: [
        {
          id: 'call_book_fail_001',
          type: 'function',
          function: {
            name: 'book_appointment',
            arguments: {
              date: '2027-03-15',
              time: '10:00',
              patient_name: 'Jane',
              reason_for_visit: 'checkup',
            },
          },
        },
      ],
      assistant: { metadata: { tenant_id: 'medical-clinic' } },
    };

    const result = await handleToolCalls(message, 'medical-clinic', {
      sessionId: 'test-book-fail',
    });

    toolRouter.TOOL_HANDLERS.book_appointment = orig;

    expect(result.results[0].toolCallId).toBe('call_book_fail_001');
    expect(result.results[0].result).toBe(
      'Could not book appointment: Calendar API unavailable'
    );
    expect(result.results[0].result).not.toMatch(/^Error:/);
  });

  it('handleToolCalls wraps unexpected throws as Error: string for Vapi', async () => {
    const toolRouter = await import('../server/platform/tools/tool-router.js');
    const { handleToolCalls } = await import('../server/platform/tools/tool-calls-handler.js');

    const orig = toolRouter.TOOL_HANDLERS.book_appointment;
    toolRouter.TOOL_HANDLERS.book_appointment = async () => {
      throw new Error('Unexpected DB failure');
    };

    const message = {
      type: 'tool-calls',
      toolCallList: [
        {
          id: 'call_book_throw_001',
          type: 'function',
          function: {
            name: 'book_appointment',
            arguments: { date: '2027-03-15', time: '10:00' },
          },
        },
      ],
      assistant: { metadata: { tenant_id: 'medical-clinic' } },
    };

    const result = await handleToolCalls(message, 'medical-clinic', { sessionId: 'x' });
    toolRouter.TOOL_HANDLERS.book_appointment = orig;

    expect(result.results[0].result).toBe('Error: Unexpected DB failure');
  });
});
