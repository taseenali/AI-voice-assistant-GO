import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Service Account Auth
const auth = new google.auth.JWT(
  process.env.G_CLIENT_EMAIL,
  null,
  process.env.G_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  [process.env.G_CALENDAR_SCOPE || 'https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

/**
 * POST /api/calendar/check
 * Check availability for a specific time slot
 */
router.post('/check', async (req, res) => {
  const { calendar_id, startTime, endTime } = req.body;

  // Path traversal protection
  if (!calendar_id || !calendar_id.includes('@')) {
    return res.status(400).json({ error: 'Invalid calendar_id' });
  }

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime, // ISO UTC
        timeMax: endTime,   // ISO UTC
        items: [{ id: calendar_id }]
      }
    });

    const busy = response.data.calendars[calendar_id].busy;
    res.json({ available: busy.length === 0 });
  } catch (err) {
    console.error('[CalendarAPI] Check failed:', err.message);
    res.status(err.code || 500).json({ 
      error: 'Failed to check availability',
      message: err.message,
      code: err.code,
      calendarId: calendar_id
    });
  }
});

/**
 * POST /api/calendar/book
 * Create a new event after availability confirmed
 */
router.post('/book', async (req, res) => {
  const { calendar_id, startTime, endTime, patientName, reason, leadId } = req.body;

  if (!calendar_id || !calendar_id.includes('@')) {
    return res.status(400).json({ error: 'Invalid calendar_id' });
  }

  try {
    const event = {
      summary: `MedVoice: ${patientName}`,
      description: `Lead ID: ${leadId}\nReason: ${reason}`,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 1440 }
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendar_id,
      requestBody: event
    });

    res.json({ success: true, eventId: response.data.id });
  } catch (err) {
    console.error('[CalendarAPI] Booking failed:', err.message);
    res.status(err.code || 500).json({ 
      error: 'Failed to create event',
      message: err.message,
      code: err.code,
      calendarId: calendar_id
    });
  }
});

export default router;
