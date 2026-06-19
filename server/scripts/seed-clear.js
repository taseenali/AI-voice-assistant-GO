/**
 * Wipe all call session data from the database.
 * Deletes: sessions, conversation_turns, leads, emergency_events, appointments, audit_logs.
 * Preserves: tenants, tenant_config, phone_numbers, users.
 *
 * Run with: npm run seed:clear
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/medvoice.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const clear = db.transaction(() => {
  // Child tables first (foreign key order)
  const r1 = db.prepare('DELETE FROM conversation_turns').run();
  const r2 = db.prepare('DELETE FROM leads').run();
  const r3 = db.prepare('DELETE FROM emergency_events').run();
  const r4 = db.prepare('DELETE FROM audit_logs').run();
  const r5 = db.prepare('DELETE FROM appointments').run();
  const r6 = db.prepare('DELETE FROM sessions').run();

  return { r1, r2, r3, r4, r5, r6 };
});

const { r1, r2, r3, r4, r5, r6 } = clear();

console.log('[seed:clear] Database cleared:');
console.log(`  sessions           ${r6.changes} rows deleted`);
console.log(`  conversation_turns ${r1.changes} rows deleted`);
console.log(`  leads              ${r2.changes} rows deleted`);
console.log(`  emergency_events   ${r3.changes} rows deleted`);
console.log(`  appointments       ${r5.changes} rows deleted`);
console.log(`  audit_logs         ${r4.changes} rows deleted`);
console.log('\nTenants, users, and phone mappings are unchanged.');
console.log('The database is ready for real call data.\n');

db.close();
