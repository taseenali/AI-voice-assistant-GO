import Database from 'better-sqlite3';

const db = new Database('server/data/medvoice.db');
const sessions = db
  .prepare(
    `SELECT session_id, channel, phone_number, recording_url, start_time
     FROM sessions WHERE channel = 'phone' OR session_id LIKE '019ed232%'
     ORDER BY start_time DESC LIMIT 3`
  )
  .all();
const lead = db
  .prepare(`SELECT name, phone, session_id FROM leads WHERE session_id LIKE '019ed232%'`)
  .get();
console.log(JSON.stringify({ sessions, lead }, null, 2));
