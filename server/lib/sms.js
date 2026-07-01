/**
 * SMS confirmation via Twilio.
 * Only active when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER are set.
 * Silently skips when not configured — never throws.
 */

import twilio from 'twilio';

let _client = null;

function getClient() {
  if (_client) return _client;
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!sid || !token) return null;
  _client = twilio(sid, token);
  return _client;
}

/**
 * Send appointment confirmation SMS to the patient.
 * Non-blocking, non-throwing.
 *
 * @param {object} params
 * @param {string} params.to    Patient E.164 phone number
 * @param {string} params.date  YYYY-MM-DD
 * @param {string} params.time  HH:MM
 * @param {string} params.clinic Clinic display name
 */
export async function sendAppointmentConfirmation({ to, date, time, clinic }) {
  if (!to) return;
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  if (!from) return;

  try {
    const client = getClient();
    if (!client) return;

    const body = `Your appointment at ${clinic} is confirmed for ${date} at ${time}. Reply STOP to opt out.`;
    await client.messages.create({ to, from, body });
    console.log(`[SMS] Confirmation sent to ${to.slice(0, 6)}***`);
  } catch (err) {
    console.error('[SMS] Failed to send confirmation:', err.message);
  }
}
