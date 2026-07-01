import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { runPlatformMigrations, initPlatformQueries } from './platform-migrations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SQLITE_PATH env var allows Railway Volume or any absolute path.
// Default: server/data/medvoice.db (local dev / fallback).
const dbPath = process.env.SQLITE_PATH ?? path.join(__dirname, '../data/medvoice.db');

// Ensure parent directory exists (handles both local data/ and volume mounts)
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read/write performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration_seconds INTEGER,
    total_turns INTEGER DEFAULT 0,
    final_state TEXT,
    intent_detected TEXT,
    lead_captured BOOLEAN DEFAULT 0,
    emergency_detected BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Conversation turns table
  CREATE TABLE IF NOT EXISTS conversation_turns (
    turn_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    turn_number INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    state TEXT,
    message TEXT NOT NULL,
    intent TEXT,
    confidence REAL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  -- Leads table
  CREATE TABLE IF NOT EXISTS leads (
    lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    patient_type TEXT CHECK(patient_type IN ('new', 'returning')),
    dob TEXT,
    reason_for_visit TEXT,
    insurance_provider TEXT,
    insurance_id TEXT,
    urgency TEXT,
    contact_method TEXT CHECK(contact_method IN ('phone', 'email')),
    completeness_score REAL,
    captured_at TEXT NOT NULL,
    service TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  -- Emergency events table
  CREATE TABLE IF NOT EXISTS emergency_events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    pattern_matched TEXT NOT NULL,
    user_message TEXT NOT NULL,
    response_sent TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  -- Audit logs table (HIPAA compliance)
  CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    session_id TEXT,
    client_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    user_id TEXT,
    action TEXT NOT NULL,
    resource TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_sessions_client ON sessions(client_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
  CREATE INDEX IF NOT EXISTS idx_turns_session ON conversation_turns(session_id);
  CREATE INDEX IF NOT EXISTS idx_leads_client ON leads(client_id);
  CREATE INDEX IF NOT EXISTS idx_leads_captured ON leads(captured_at);
  CREATE INDEX IF NOT EXISTS idx_emergency_session ON emergency_events(session_id);
  CREATE INDEX IF NOT EXISTS idx_audit_client ON audit_logs(client_id);
  CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
`);

// ─── Migrations ───────────────────────────────────────────────
// Safe to run on every boot — each block is idempotent.
// SQLite does not support "ALTER TABLE ... ADD COLUMN IF NOT EXISTS",
// so we check PRAGMA table_info before issuing the ALTER.

const leadsColumns = db.pragma('table_info(leads)').map(c => c.name);
if (!leadsColumns.includes('phone')) {
  db.exec('ALTER TABLE leads ADD COLUMN phone TEXT');
  console.log('[Database] Migration applied: leads.phone column added.');
}

console.log('[Database] SQLite initialized at', dbPath);

runPlatformMigrations(db);
initPlatformQueries(db);

// Prepared statements for common operations
export const queries = {
  // Sessions
  insertSession: db.prepare(`
    INSERT INTO sessions (session_id, client_id, start_time, intent_detected)
    VALUES (?, ?, ?, ?)
  `),

  updateSession: db.prepare(`
    UPDATE sessions
    SET end_time = ?, duration_seconds = ?, total_turns = ?, final_state = ?,
        lead_captured = ?, emergency_detected = ?
    WHERE session_id = ?
  `),

  getSession: db.prepare(`
    SELECT * FROM sessions WHERE session_id = ?
  `),

  listSessions: db.prepare(`
    SELECT s.*,
      (SELECT COUNT(*) FROM conversation_turns t WHERE t.session_id = s.session_id) AS computed_turns
    FROM sessions s
    WHERE s.client_id = ?
    ORDER BY s.start_time DESC
    LIMIT ? OFFSET ?
  `),

  // Conversation turns
  insertTurn: db.prepare(`
    INSERT INTO conversation_turns
    (session_id, turn_number, timestamp, role, state, message, intent, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getTurns: db.prepare(`
    SELECT * FROM conversation_turns
    WHERE session_id = ?
    ORDER BY turn_number ASC
  `),

  syncSessionTurnCount: db.prepare(`
    UPDATE sessions
    SET total_turns = (SELECT COUNT(*) FROM conversation_turns WHERE session_id = ?)
    WHERE session_id = ?
  `),

  markSessionLeadCaptured: db.prepare(`
    UPDATE sessions SET lead_captured = 1 WHERE session_id = ?
  `),

  markSessionEmergency: db.prepare(`
    UPDATE sessions SET emergency_detected = 1 WHERE session_id = ?
  `),

  // Leads
  insertLead: db.prepare(`
    INSERT INTO leads
    (session_id, client_id, name, phone, patient_type, dob, reason_for_visit,
     insurance_provider, insurance_id, urgency, contact_method,
     completeness_score, captured_at, service)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getLeads: db.prepare(`
    SELECT * FROM leads
    WHERE client_id = ?
    ORDER BY captured_at DESC
    LIMIT ? OFFSET ?
  `),

  getLeadBySession: db.prepare(`
    SELECT * FROM leads WHERE session_id = ?
  `),

  // Emergency events
  insertEmergencyEvent: db.prepare(`
    INSERT INTO emergency_events
    (session_id, timestamp, pattern_matched, user_message, response_sent)
    VALUES (?, ?, ?, ?, ?)
  `),

  getEmergencyEvents: db.prepare(`
    SELECT * FROM emergency_events
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `),

  getEmergencyEventsByClient: db.prepare(`
    SELECT e.*
    FROM emergency_events e
    INNER JOIN sessions s ON s.session_id = e.session_id
    WHERE s.client_id = ?
    ORDER BY e.timestamp DESC
    LIMIT ? OFFSET ?
  `),

  // Audit logs
  insertAuditLog: db.prepare(`
    INSERT INTO audit_logs
    (timestamp, session_id, client_id, event_type, user_id, action, resource, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
};

export default db;