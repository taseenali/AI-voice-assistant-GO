import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.JWT(
  process.env.G_CLIENT_EMAIL,
  null,
  process.env.G_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

async function test() {
  try {
    const res = await calendar.events.insert({
      calendarId: '0e172716449b2f4e77bbc3a8a2c3d11bfbb46c36e7972688108c16c691fd7347@group.calendar.google.com',
      requestBody: {
        summary: 'MedVoice AI — Test Booking',
        description: 'Pass 8 verification test',
        start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
        end: { dateTime: new Date(Date.now() + 86400000 + 1800000).toISOString() }
      }
    });
    console.log('✅ SUCCESS — Event created:', res.data.htmlLink);
  } catch (err) {
    console.error('❌ FAILED:', err.message);
  }
}

test();
