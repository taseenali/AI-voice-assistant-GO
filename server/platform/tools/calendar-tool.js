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
 * Parse date + time in local clinic context → ISO UTC window.
 * Phase 1: treats input as local, stores UTC ISO strings.
 */
export function toSlotIso(date, time, durationMinutes = 30) {
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid date/time: ${date} ${time}`);
  }
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

export async function checkAvailability({ calendarId, date, time, durationMinutes = 30 }) {
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
    const { startTime, endTime } = toSlotIso(date, time, durationMinutes);

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
}) {
  if (!calendarId) {
    return { success: false, message: 'Calendar is not configured for this clinic.' };
  }

  const cal = resolveCalendarClient();
  if (!cal) {
    return { success: false, message: 'Calendar service is not configured on the server.' };
  }

  try {
    const check = await checkAvailability({ calendarId, date, time, durationMinutes });
    if (!check.available) {
      return { success: false, message: check.message };
    }

    const event = {
      summary: `MedVoice: ${patientName || 'Patient'}`,
      description: [
        leadId ? `Lead ID: ${leadId}` : null,
        sessionId ? `Session: ${sessionId}` : null,
        reason ? `Reason: ${reason}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      start: { dateTime: check.startTime },
      end: { dateTime: check.endTime },
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
