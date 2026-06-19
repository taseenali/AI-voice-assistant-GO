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

function getDayHours(businessHours, date) {
  if (!businessHours) return null;
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayName = dayNames[new Date(`${date}T12:00:00Z`).getUTCDay()];
  const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return { dayName, dayLabel, hours: businessHours[dayName] ?? null };
}

export async function checkAvailability({ calendarId, date, time, durationMinutes = 30, timezone = 'UTC', businessHours = null }) {
  if (!calendarId) {
    return { available: false, message: 'Calendar is not configured for this clinic.' };
  }

  // Reject past dates before hitting the calendar — gives the LLM a clear error to correct
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return {
      available: false,
      message: `${date} is in the past. Today is ${today}. Please use a future date.`,
    };
  }

  if (businessHours) {
    const { dayLabel, hours } = getDayHours(businessHours, date);
    if (!hours) {
      return { available: false, message: `The clinic is closed on ${dayLabel}s. Please choose a weekday.` };
    }
    const [reqH, reqM] = time.split(':').map(Number);
    const reqMin = reqH * 60 + reqM;
    const [openH, openM] = hours.open.split(':').map(Number);
    const [closeH, closeM] = hours.close.split(':').map(Number);
    if (reqMin < openH * 60 + openM || reqMin + durationMinutes > closeH * 60 + closeM) {
      return {
        available: false,
        message: `${time} is outside clinic hours (${hours.open}–${hours.close}). Please choose a time within business hours.`,
      };
    }
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

/**
 * Return all available 30-minute appointment slots on a given date.
 * Scans the clinic's operating hours (09:00–17:00) and returns slots not blocked
 * by existing calendar events. Gives the LLM concrete options to offer the caller.
 */
export async function getAvailableSlots({ calendarId, date, timezone = 'UTC', businessHours = null }) {
  if (!calendarId) {
    return { slots: [], message: 'Calendar is not configured for this clinic.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return { slots: [], message: `${date} is in the past. Please use a future date.` };
  }

  if (businessHours) {
    const { dayLabel, hours } = getDayHours(businessHours, date);
    if (!hours) {
      return { slots: [], message: `The clinic is closed on ${dayLabel}s. Please ask the patient for a weekday.` };
    }
  }

  const cal = resolveCalendarClient();
  if (!cal) {
    return { slots: [], message: 'Calendar service is not configured on the server.' };
  }

  try {
    const [openH, openM] = businessHours
      ? (getDayHours(businessHours, date).hours?.open || '09:00').split(':').map(Number)
      : [9, 0];
    const [closeH, closeM] = businessHours
      ? (getDayHours(businessHours, date).hours?.close || '17:00').split(':').map(Number)
      : [17, 0];
    const CLINIC_OPEN = openH * 60 + openM;
    const CLINIC_CLOSE = closeH * 60 + closeM;
    const SLOT_DURATION = 30;

    const candidateSlots = [];
    for (let m = CLINIC_OPEN; m + SLOT_DURATION <= CLINIC_CLOSE; m += SLOT_DURATION) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      candidateSlots.push(`${hh}:${mm}`);
    }

    // Convert each slot to a UTC window and build a freebusy query for the whole day
    const dayStart = wallClockToUtc(date, '00:00', timezone);
    const dayEnd   = wallClockToUtc(date, '23:59', timezone);

    const response = await cal.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busyIntervals = response.data.calendars?.[calendarId]?.busy || [];

    // A slot is available if its UTC window doesn't overlap any busy interval
    const availableSlots = candidateSlots.filter(time => {
      const { startTime, endTime } = toSlotIso(date, time, SLOT_DURATION, timezone);
      const slotStart = new Date(startTime).getTime();
      const slotEnd   = new Date(endTime).getTime();
      return !busyIntervals.some(b => {
        const busyStart = new Date(b.start).getTime();
        const busyEnd   = new Date(b.end).getTime();
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });

    if (availableSlots.length === 0) {
      return {
        slots: [],
        message: `No available slots on ${date}. Please ask the patient for a different date.`,
      };
    }

    const formatted = availableSlots.map(t => {
      const [h, m] = t.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
    });

    return {
      slots: availableSlots,
      message: `Available times on ${date}: ${formatted.join(', ')}. Ask the patient which works best.`,
    };
  } catch (err) {
    console.error('[Calendar] getAvailableSlots:', err.message);
    return { slots: [], message: `Could not retrieve available slots: ${err.message}` };
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
  phone,
  leadId,
  sessionId,
  timezone = 'UTC',
}) {
  if (!calendarId) {
    return { success: false, message: 'Calendar is not configured for this clinic.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return {
      success: false,
      message: `Cannot book ${date} — that date is in the past. Today is ${today}. Ask the patient for a future date.`,
    };
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
        phone ? `Phone: ${phone}` : null,
        reason ? `Reason: ${reason}` : null,
        leadId ? `Lead ID: ${leadId}` : null,
        sessionId ? `Session: ${sessionId}` : null,
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
