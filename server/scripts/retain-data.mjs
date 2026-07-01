/**
 * Data retention job — run manually or on a cron.
 *
 * HIPAA minimum: retain PHI 6 years from creation (or last patient activity).
 * This script purges records OLDER than RETENTION_DAYS (default: 2190 = 6 years).
 *
 * Usage:
 *   node server/scripts/retain-data.mjs [--dry-run] [--days=<n>]
 *
 * It deletes:
 *   - conversation_turns older than RETENTION_DAYS (text PHI)
 *   - leads older than RETENTION_DAYS (PHI: name, phone, reason)
 *   - sessions older than RETENTION_DAYS that have no leads or appointments
 *   - audit_logs older than RETENTION_DAYS
 *   NOTE: emergency_events and appointments are kept permanently.
 *
 * Always run with --dry-run first to see what would be deleted.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../server/data/medvoice.db');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const daysArg = args.find(a => a.startsWith('--days='));
const RETENTION_DAYS = daysArg ? parseInt(daysArg.split('=')[1]) : 2190;

const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
const cutoffIso = cutoff.toISOString();

console.log(`[Retention] Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
console.log(`[Retention] Purging records created before: ${cutoffIso} (${RETENTION_DAYS} days)`);

const db = new Database(dbPath);

function count(sql, params = []) {
  return db.prepare(sql).get(...params)?.n ?? 0;
}

// Conversation turns
const turnCount = count(
  `SELECT COUNT(*) AS n FROM conversation_turns WHERE timestamp < ?`,
  [cutoffIso]
);
console.log(`[Retention] conversation_turns to delete: ${turnCount}`);
if (!DRY_RUN && turnCount > 0) {
  const result = db.prepare(`DELETE FROM conversation_turns WHERE timestamp < ?`).run(cutoffIso);
  console.log(`[Retention] Deleted ${result.changes} conversation_turns`);
}

// Leads
const leadCount = count(
  `SELECT COUNT(*) AS n FROM leads WHERE captured_at < ?`,
  [cutoffIso]
);
console.log(`[Retention] leads to delete: ${leadCount}`);
if (!DRY_RUN && leadCount > 0) {
  const result = db.prepare(`DELETE FROM leads WHERE captured_at < ?`).run(cutoffIso);
  console.log(`[Retention] Deleted ${result.changes} leads`);
}

// Sessions with no remaining leads/appointments (orphaned call records)
const sessionCount = count(
  `SELECT COUNT(*) AS n FROM sessions s
   WHERE s.start_time < ?
     AND NOT EXISTS (SELECT 1 FROM leads l WHERE l.session_id = s.session_id)
     AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.session_id = s.session_id)`,
  [cutoffIso]
);
console.log(`[Retention] orphaned sessions to delete: ${sessionCount}`);
if (!DRY_RUN && sessionCount > 0) {
  const result = db.prepare(
    `DELETE FROM sessions WHERE session_id IN (
      SELECT s.session_id FROM sessions s
      WHERE s.start_time < ?
        AND NOT EXISTS (SELECT 1 FROM leads l WHERE l.session_id = s.session_id)
        AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.session_id = s.session_id)
    )`
  ).run(cutoffIso);
  console.log(`[Retention] Deleted ${result.changes} sessions`);
}

// Audit logs (keep 7 years / 2555 days of audit trail regardless of RETENTION_DAYS)
const auditCutoff = new Date();
auditCutoff.setDate(auditCutoff.getDate() - Math.max(RETENTION_DAYS, 2555));
const auditCutoffIso = auditCutoff.toISOString();
const auditCount = count(
  `SELECT COUNT(*) AS n FROM audit_logs WHERE timestamp < ?`,
  [auditCutoffIso]
);
console.log(`[Retention] audit_logs to delete (older than 7yr): ${auditCount}`);
if (!DRY_RUN && auditCount > 0) {
  const result = db.prepare(`DELETE FROM audit_logs WHERE timestamp < ?`).run(auditCutoffIso);
  console.log(`[Retention] Deleted ${result.changes} audit_logs`);
}

if (DRY_RUN) {
  console.log('\n[Retention] DRY RUN complete — no data was deleted. Remove --dry-run to execute.');
} else {
  console.log('\n[Retention] Purge complete.');
}

db.close();
