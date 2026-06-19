/**
 * Recover real Vapi call sessions from the Vapi API.
 * Queries recent phone calls and inserts any not already in the DB.
 * Run: node server/scripts/recover-vapi-calls.js
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/medvoice.db');

// Load .env without exposing values
function loadEnv() {
  const envPath = path.join(__dirname, '../../.env');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const VAPI_API_KEY = env.VAPI_API_KEY;
if (!VAPI_API_KEY) {
  console.error('[Recover] VAPI_API_KEY not found in .env — aborting.');
  process.exit(1);
}
console.log('[Recover] API key loaded.');

// Query Vapi for recent calls (last 30 days)
async function fetchVapiCalls() {
  const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://api.vapi.ai/call?limit=100&createdAtGt=${encodeURIComponent(since)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VAPI_API_KEY}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Vapi API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const existingIds = new Set(
  db.prepare('SELECT session_id FROM sessions').all().map(r => r.session_id)
);

const insertSession = db.prepare(`
  INSERT OR IGNORE INTO sessions
    (session_id, client_id, start_time, end_time, duration_seconds,
     channel, phone_number, recording_url, final_state, intent_detected,
     lead_captured, emergency_detected)
  VALUES (?, ?, ?, ?, ?, 'phone', ?, ?, 'ended', 'appointment_booking', 0, 0)
`);

const insertTurn = db.prepare(`
  INSERT OR IGNORE INTO conversation_turns
    (session_id, turn_number, timestamp, role, state, message, intent, confidence)
  VALUES (?, ?, ?, ?, NULL, ?, NULL, NULL)
`);

async function run() {
  let calls;
  try {
    calls = await fetchVapiCalls();
  } catch (err) {
    console.error('[Recover] Failed to fetch from Vapi:', err.message);
    process.exit(1);
  }

  console.log(`[Recover] Vapi returned ${calls.length} call(s).`);

  const insert = db.transaction((call) => {
    const sessionId = call.id;
    const startedAt = call.startedAt ?? call.createdAt ?? null;
    const endedAt = call.endedAt ?? null;
    const duration = startedAt && endedAt
      ? Math.round((new Date(endedAt) - new Date(startedAt)) / 1000)
      : null;
    const recordingUrl = call.artifact?.recordingUrl ?? call.artifact?.recording?.url ?? null;
    const callerPhone = call.customer?.number ?? null;

    insertSession.run(
      sessionId,
      'medical-clinic',
      startedAt,
      endedAt,
      duration,
      callerPhone,
      recordingUrl,
    );

    // Insert conversation turns from artifact.messages
    const messages = call.artifact?.messages ?? [];
    let turnNum = 1;
    for (const m of messages) {
      if (!m.message?.trim()) continue;
      const role = (m.role === 'user' || m.role === 'customer') ? 'user' : 'assistant';
      const ts = m.time
        ? new Date(m.time).toISOString()
        : (startedAt ?? new Date().toISOString());
      insertTurn.run(sessionId, turnNum++, ts, role, m.message.trim());
    }

    return { sessionId, duration, callerPhone, recordingUrl, turns: turnNum - 1 };
  });

  let inserted = 0;
  let skipped = 0;

  for (const call of calls) {
    if (!call.id) continue;
    // Only phone calls that have ended
    if (call.type !== 'inboundPhoneCall' && call.type !== 'outboundPhoneCall' && !call.customer?.number) {
      skipped++;
      continue;
    }
    if (existingIds.has(call.id)) {
      skipped++;
      continue;
    }

    const result = insert(call);
    console.log(`  ✓ Inserted: ${result.sessionId.slice(0, 16)}... | ${result.duration ?? '?'}s | caller: ${result.callerPhone ?? 'unknown'} | recording: ${result.recordingUrl ? 'YES' : 'none'} | turns: ${result.turns}`);
    inserted++;
  }

  console.log(`\n[Recover] Done — ${inserted} inserted, ${skipped} skipped.`);
  db.close();
}

run().catch((err) => {
  console.error('[Recover] Fatal:', err.message);
  process.exit(1);
});
