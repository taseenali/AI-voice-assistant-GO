import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

let calendarClient = null;
/** @type {ReturnType<typeof google.calendar> | null | undefined} undefined = use real client */
let testCalendarClientOverride = undefined;

function getCalendarClient() {
  if (calendarClient) return calendarClient;

  const email = process.env.G_CLIENT_EMAIL;
  const key = process.env.G_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !key) {
    return null;
  }

  const auth = new google.auth.JWT(email, null, key, [
    process.env.G_CALENDAR_SCOPE || 'https://www.googleapis.com/auth/calendar',
  ]);

  calendarClient = google.calendar({ version: 'v3', auth });
  return calendarClient;
}

function resolveCalendarClient() {
  if (testCalendarClientOverride !== undefined) return testCalendarClientOverride;
  return getCalendarClient();
}

/** @internal test hook */
export function __setTestCalendarClient(client) {
  testCalendarClientOverride = client;
}

/** @internal test hook */
export function __clearTestCalendarClient() {
  testCalendarClientOverride = undefined;
}

export { getCalendarClient };

/**
 * Convert a naive wall-clock datetime in a given IANA timezone to a UTC Date.
 * Uses the sv-locale Intl trick: format the UTC guess in the target timezone,
 * then subtract the difference to find the true UTC instant.
 */
function wallClockToUtc(dateStr, timeStr, timezone) {
  const asIfUtc = new Date(`${dateStr}T${timeStr}:00Z`);
  const tzString = asIfUtc.toLocaleString('sv', { timeZone: timezone });
  const tzAsUtc = new Date(tzString.replace(' ', 'T') + 'Z');
  return new Date(2 * asIfUtc.getTime() - tzAsUtc.getTime());
}

/**
 * Parse date + time in the clinic's IANA timezone → UTC ISO window for freebusy queries.
 * timezone defaults to 'UTC' so Railway and local produce identical results.
 */
export function toSlotIso(date, time, durationMinutes = 30, timezone = 'UTC') {
  const start = wallClockToUtc(date, time, timezone);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid date/time: ${date} ${time}`);
  }
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

export async function checkAvailability({ calendarId, date, time, durationMinutes = 30, timezone = 'UTC' }) {
  if (!calendarId) {
    return { available: false, message: 'Calendar is not configured for this clinic.' };
  }

  const cal = resolveCalendarClient();
  if (!cal) {
    return {
      available: false,
      message: 'Calendar service is not configured on the server (missing G_CLIENT_EMAIL).',
    };
  }

  try {
    const { startTime, endTime } = toSlotIso(date, time, durationMinutes, timezone);

    const response = await cal.freebusy.query({
      requestBody: {
        timeMin: startTime,
        timeMax: endTime,
        items: [{ id: calendarId }],
      },
    });

    const busy = response.data.calendars?.[calendarId]?.busy || [];
    const available = busy.length === 0;

    const human = available
      ? `${date} at ${time} is available for a ${durationMinutes}-minute appointment.`
      : `${date} at ${time} is not available. Please suggest another time.`;

    return { available, message: human, startTime, endTime };
  } catch (err) {
    console.error('[Calendar] checkAvailability:', err.message);
    return {
      available: false,
      message: `Could not check availability: ${err.message}`,
    };
  }
}

export async function listUpcomingAppointments({
  calendarId,
  maxResults = 30,
  timeMin,
}) {
  if (!calendarId) {
    return { events: [], message: 'Calendar is not configured for this clinic.' };
  }

  const cal = resolveCalendarClient();
  if (!cal) {
    return {
      events: [],
      message: 'Calendar service is not configured on the server (missing G_CLIENT_EMAIL).',
    };
  }

  try {
    const response = await cal.events.list({
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (response.data.items || []).map((ev) => {
      const start = ev.start?.dateTime || ev.start?.date || '';
      const end = ev.end?.dateTime || ev.end?.date || '';
      const summary = ev.summary || '';
      const patientName = summary.replace(/^MedVoice:\s*/i, '').trim() || 'Patient';
      const reasonMatch = (ev.description || '').match(/^Reason:\s*(.+)$/m);
      return {
        id: ev.id,
        startTime: start,
        endTime: end,
        patientName,
        reason: reasonMatch?.[1]?.trim() || null,
        status: ev.status || 'confirmed',
        htmlLink: ev.htmlLink || null,
      };
    });

    return { events };
  } catch (err) {
    console.error('[Calendar] listUpcomingAppointments:', err.message);
    return { events: [], message: `Could not load appointments: ${err.message}` };
  }
}

export async function bookAppointment({
  calendarId,
  date,
  time,
  durationMinutes = 30,
  patientName,
  reason,
  leadId,
  sessionId,
  timezone = 'UTC',
}) {
  if (!calendarId) {
    return { success: false, message: 'Calendar is not configured for this clinic.' };
  }

  const cal = resolveCalendarClient();
  if (!cal) {
    return { success: false, message: 'Calendar service is not configured on the server.' };
  }

  try {
    const check = await checkAvailability({ calendarId, date, time, durationMinutes, timezone });
    if (!check.available) {
      return { success: false, message: check.message };
    }

    // Compute end wall-clock time by adding durationMinutes to the start time string.
    // Passing naive datetime + timeZone lets Google store the event in the clinic's zone
    // regardless of where the server runs (UTC on Railway, UTC+5 locally, etc.).
    const [startH, startM] = time.split(':').map(Number);
    const endTotal = startH * 60 + startM + durationMinutes;
    const endTimeStr = `${String(Math.floor(endTotal / 60) % 24).padStart(2, '0')}:${String(endTotal % 60).padStart(2, '0')}`;

    const event = {
      summary: `MedVoice: ${patientName || 'Patient'}`,
      description: [
        leadId ? `Lead ID: ${leadId}` : null,
        sessionId ? `Session: ${sessionId}` : null,
        reason ? `Reason: ${reason}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      start: { dateTime: `${date}T${time}:00`, timeZone: timezone },
      end: { dateTime: `${date}T${endTimeStr}:00`, timeZone: timezone },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 1440 },
        ],
      },
    };

    const response = await cal.events.insert({
      calendarId,
      requestBody: event,
    });

    return {
      success: true,
      eventId: response.data.id,
      message: `Booked ${patientName || 'the patient'} for ${date} at ${time}. Confirmation event created.`,
    };
  } catch (err) {
    console.error('[Calendar] bookAppointment:', err.message);
    return {
      success: false,
      message: `Could not book appointment: ${err.message}`,
    };
  }
}
