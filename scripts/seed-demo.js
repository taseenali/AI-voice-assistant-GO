#!/usr/bin/env node
/**
 * Seed synthetic demo data for MedVoice dashboard demos.
 * Idempotent: deletes all demo tenant rows then re-inserts.
 *
 * Usage:
 *   node scripts/seed-demo.js          # reset + seed
 *   node scripts/seed-demo.js --reset  # reset only (wipe demo data)
 */
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'medvoice.db');

const DEMO_TENANTS = ['northgate-family-health', 'sunrise-dental', 'valley-physiotherapy'];

// All tables live in medvoice.db — no split database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = OFF'); // avoid FK cascade issues during seeding

// Ensure appointments table exists (safe for runs before first server boot)
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    appointment_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    session_id TEXT,
    start_time TEXT NOT NULL,
    end_time TEXT,
    patient_name TEXT,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    html_link TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_time);
`);

// ---------------------------------------------------------------------------
// Date helpers — all times expressed as ISO strings (UTC)
// ---------------------------------------------------------------------------
const NOW = new Date();

function isoAt(daysOffset, hour, minute = 0) {
  const d = new Date(NOW);
  d.setDate(d.getDate() + daysOffset);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

// "today" = day offset 0; positive = future, negative = past
const T = {
  // Northgate today sessions
  ngT1s: isoAt(0, 9, 0),   ngT1e: isoAt(0, 9, 12),
  ngT2s: isoAt(0, 10, 30), ngT2e: isoAt(0, 10, 53),
  ngT3s: isoAt(0, 11, 5),  ngT3e: isoAt(0, 11, 6),
  ngT4s: isoAt(0, 14, 15), ngT4e: isoAt(0, 14, 37),
  // Northgate historical sessions
  ngH1s: isoAt(-2, 10, 0), ngH1e: isoAt(-2, 10, 18),
  ngH2s: isoAt(-4, 9, 30), ngH2e: isoAt(-4, 9, 54),
  ngH3s: isoAt(-3, 15, 0), ngH3e: isoAt(-3, 15, 1),
  ngH4s: isoAt(-6, 11, 0), ngH4e: isoAt(-6, 11, 15),
  ngH5s: isoAt(-8, 10, 0), ngH5e: isoAt(-8, 10, 32),
  ngH6s: isoAt(-9, 13, 0), ngH6e: isoAt(-9, 13, 15),
  ngH7s: isoAt(-11, 9, 0), ngH7e: isoAt(-11, 9, 23),
  ngH8s: isoAt(-13, 14, 0),ngH8e: isoAt(-13, 14, 1),
  // Northgate appointments (future)
  ngA1s: isoAt(2, 14, 0),  ngA1e: isoAt(2, 14, 30),
  ngA2s: isoAt(5, 10, 30), ngA2e: isoAt(5, 11, 0),
  ngA3s: isoAt(9, 9, 0),   ngA3e: isoAt(9, 9, 30),
  // Sunrise today sessions
  sdT1s: isoAt(0, 13, 0),  sdT1e: isoAt(0, 13, 16),
  // Sunrise historical sessions
  sdH1s: isoAt(-2, 9, 0),  sdH1e: isoAt(-2, 9, 19),
  sdH2s: isoAt(-5, 11, 0), sdH2e: isoAt(-5, 11, 7),
  sdH3s: isoAt(-8, 15, 0), sdH3e: isoAt(-8, 15, 0),
  sdH4s: isoAt(-12, 10, 0),sdH4e: isoAt(-12, 10, 1),
  // Sunrise appointment
  sdA1s: isoAt(3, 10, 0),  sdA1e: isoAt(3, 10, 45),
  // Valley today sessions
  vpT1s: isoAt(0, 11, 30), vpT1e: isoAt(0, 11, 53),
  // Valley historical sessions
  vpH1s: isoAt(-3, 9, 0),  vpH1e: isoAt(-3, 9, 14),
  vpH2s: isoAt(-7, 14, 0), vpH2e: isoAt(-7, 14, 1),
  vpH3s: isoAt(-11, 10, 0),vpH3e: isoAt(-11, 10, 0),
  // Valley appointment
  vpA1s: isoAt(4, 15, 0),  vpA1e: isoAt(4, 15, 30),
};

// ---------------------------------------------------------------------------
// Reset — delete all demo data in FK-safe order
// ---------------------------------------------------------------------------
function reset() {
  const placeholders = DEMO_TENANTS.map(() => '?').join(',');

  // Platform DB deletions
  db.transaction(() => {
    db.prepare(`DELETE FROM appointments WHERE tenant_id IN (${placeholders})`).run(...DEMO_TENANTS);
    db.prepare(`DELETE FROM phone_numbers WHERE tenant_id IN (${placeholders})`).run(...DEMO_TENANTS);
    db.prepare(`DELETE FROM tenant_config WHERE tenant_id IN (${placeholders})`).run(...DEMO_TENANTS);
    db.prepare(`DELETE FROM tenants WHERE tenant_id IN (${placeholders})`).run(...DEMO_TENANTS);
  })();

  // Legacy DB deletions
  db.transaction(() => {
    db.prepare(`DELETE FROM leads WHERE client_id IN (${placeholders})`).run(...DEMO_TENANTS);
    // emergency_events has no client_id — delete by session_id prefix
    db.prepare(`DELETE FROM emergency_events WHERE session_id LIKE 'demo-%'`).run();
    db.prepare(`DELETE FROM sessions WHERE client_id IN (${placeholders})`).run(...DEMO_TENANTS);
  })();

  console.log('[seed-demo] Demo data reset.');
}

// ---------------------------------------------------------------------------
// Seed helpers — note which DB each table lives in
// ---------------------------------------------------------------------------

// Legacy DB (medvoice.db)
const insSession = db.prepare(`
  INSERT OR IGNORE INTO sessions
    (session_id, client_id, start_time, end_time, duration_seconds,
     lead_captured, emergency_detected, final_state, intent_detected, channel)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insLead = db.prepare(`
  INSERT INTO leads
    (client_id, session_id, name, phone,
     reason_for_visit, dob, insurance_provider, completeness_score, captured_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insEmergency = db.prepare(`
  INSERT INTO emergency_events
    (session_id, timestamp, pattern_matched, user_message, response_sent)
  VALUES (?, ?, ?, ?, ?)
`);

// Platform DB (platform.db)
const insAppt = db.prepare(`
  INSERT OR IGNORE INTO appointments
    (appointment_id, tenant_id, session_id, start_time, end_time,
     patient_name, reason, status, html_link, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insTenant = db.prepare(`
  INSERT OR IGNORE INTO tenants (tenant_id, company_name, status, plan_tier)
  VALUES (?, ?, ?, ?)
`);

const insTenantCfg = db.prepare(`
  INSERT OR IGNORE INTO tenant_config
    (tenant_id, assistant_name, system_prompt, first_message,
     voice_provider, voice_id, calendar_id, calendar_enabled,
     business_hours, emergency_keywords, emergency_response,
     services, webhook_url, webhook_secret, timezone, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function seedTenant(id, name, assistantName, firstMsg, timezone, emergencyKw, emergencyResp) {
  insTenant.run(id, name, 'active', 'starter');
  insTenantCfg.run(
    id,
    assistantName,
    `You are ${assistantName}, the AI receptionist for ${name}. Greet callers warmly and help them book appointments. Keep replies to one or two sentences.`,
    firstMsg,
    '11labs',
    '',
    null,
    0,
    null,
    JSON.stringify(emergencyKw),
    emergencyResp,
    '[]',
    '',
    '',
    timezone,
    NOW.toISOString()
  );
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
function seed() {
  db.transaction(() => {
    // NORTHGATE FAMILY HEALTH
    seedTenant(
      'northgate-family-health', 'Northgate Family Health', 'Emma',
      "Hi! I'm Emma, the AI receptionist at Northgate Family Health. How can I help you today?",
      'America/New_York',
      ['chest pain', "can't breathe", 'stroke', 'severe bleeding', 'unconscious'],
      'This sounds like a medical emergency. Please call 911 immediately.'
    );
    insAppt.run('demo-appt-ng-1', 'northgate-family-health', 'demo-ng-t1',
      T.ngA1s, T.ngA1e, 'James Harrington', 'Annual physical checkup', 'confirmed', null, NOW.toISOString());
    insAppt.run('demo-appt-ng-2', 'northgate-family-health', 'demo-ng-t2',
      T.ngA2s, T.ngA2e, 'Patricia Collins', 'Follow-up after blood test results', 'confirmed', null, NOW.toISOString());
    insAppt.run('demo-appt-ng-3', 'northgate-family-health', 'demo-ng-h1',
      T.ngA3s, T.ngA3e, 'Sandra Nguyen', 'Persistent cough and fatigue', 'confirmed', null, NOW.toISOString());

    // SUNRISE DENTAL
    seedTenant(
      'sunrise-dental', 'Sunrise Dental', 'Lily',
      "Hi! I'm Lily, the AI receptionist at Sunrise Dental. How can I help you today?",
      'America/Chicago',
      ['severe pain', 'swollen face', 'bleeding heavily', "can't breathe"],
      "That sounds urgent. Please call our emergency line or 911 if you're in severe distress."
    );
    insAppt.run('demo-appt-sd-1', 'sunrise-dental', 'demo-sd-t1',
      T.sdA1s, T.sdA1e, 'Chloe Patterson', 'Routine cleaning and check-up', 'confirmed', null, NOW.toISOString());

    // VALLEY PHYSIOTHERAPY
    seedTenant(
      'valley-physiotherapy', 'Valley Physiotherapy', 'Sophie',
      "Hi! I'm Sophie, the AI receptionist at Valley Physiotherapy. How can I help you today?",
      'America/Los_Angeles',
      ["can't move", 'paralyzed', 'severe injury', 'fracture', 'broken bone'],
      'That sounds serious. Please visit an emergency room or call 911 if you suspect a severe injury.'
    );
    insAppt.run('demo-appt-vp-1', 'valley-physiotherapy', 'demo-vp-t1',
      T.vpA1s, T.vpA1e, 'David Chen', 'Initial assessment for lower back rehabilitation', 'confirmed', null, NOW.toISOString());
    // NORTHGATE — sessions (12)
    insSession.run('demo-ng-t1', 'northgate-family-health', T.ngT1s, T.ngT1e, 720, 1, 0, 'LEAD_CAPTURED', 'GENERAL_CONSULT', 'phone');
    insSession.run('demo-ng-t2', 'northgate-family-health', T.ngT2s, T.ngT2e, 1380, 1, 0, 'LEAD_CAPTURED', 'FOLLOW_UP', 'web');
    insSession.run('demo-ng-t3', 'northgate-family-health', T.ngT3s, T.ngT3e, 67, 0, 1, 'EMERGENCY_DETECTED', 'URGENT_CARE', 'phone');
    insSession.run('demo-ng-t4', 'northgate-family-health', T.ngT4s, T.ngT4e, 1320, 1, 0, 'LEAD_CAPTURED', 'GENERAL_CONSULT', 'web');
    insSession.run('demo-ng-h1', 'northgate-family-health', T.ngH1s, T.ngH1e, 1080, 1, 0, 'LEAD_CAPTURED', 'GENERAL_CONSULT', 'phone');
    insSession.run('demo-ng-h2', 'northgate-family-health', T.ngH2s, T.ngH2e, 1440, 1, 0, 'LEAD_CAPTURED', 'FOLLOW_UP', 'phone');
    insSession.run('demo-ng-h3', 'northgate-family-health', T.ngH3s, T.ngH3e, 89, 0, 0, 'ENDED', 'GENERAL_CONSULT', 'web');
    insSession.run('demo-ng-h4', 'northgate-family-health', T.ngH4s, T.ngH4e, 900, 1, 0, 'LEAD_CAPTURED', 'PEDIATRICS', 'phone');
    insSession.run('demo-ng-h5', 'northgate-family-health', T.ngH5s, T.ngH5e, 1920, 1, 0, 'LEAD_CAPTURED', 'GENERAL_CONSULT', 'phone');
    insSession.run('demo-ng-h6', 'northgate-family-health', T.ngH6s, T.ngH6e, 900, 1, 0, 'LEAD_CAPTURED', 'FOLLOW_UP', 'web');
    insSession.run('demo-ng-h7', 'northgate-family-health', T.ngH7s, T.ngH7e, 1380, 1, 0, 'LEAD_CAPTURED', 'GENERAL_CONSULT', 'phone');
    insSession.run('demo-ng-h8', 'northgate-family-health', T.ngH8s, T.ngH8e, 78, 0, 0, 'ENDED', 'GENERAL_CONSULT', 'web');

    // NORTHGATE — emergency
    insEmergency.run(
      'demo-ng-t3', T.ngT3s,
      'chest pain', "I have really bad chest pain and I can't breathe properly",
      'This sounds like a medical emergency. Please call 911 immediately.'
    );

    // NORTHGATE — leads (9) — (client_id, session_id, name, phone, reason_for_visit, dob, insurance_provider, completeness_score, captured_at)
    insLead.run('northgate-family-health', 'demo-ng-t1',
      'James Harrington', '+12125550101', 'Annual physical checkup', '1982-04-15', 'BlueCross BlueShield', 0.92, T.ngT1s);
    insLead.run('northgate-family-health', 'demo-ng-t2',
      'Patricia Collins', '+12125550102', 'Follow-up after blood test results', '1975-09-22', 'Aetna', 0.88, T.ngT2s);
    insLead.run('northgate-family-health', 'demo-ng-t4',
      'Marcus Webb', '+12125550104', 'General consultation — back pain', '1990-01-08', 'UnitedHealth', 0.85, T.ngT4s);
    insLead.run('northgate-family-health', 'demo-ng-h1',
      'Sandra Nguyen', '+12025550201', 'Persistent cough and fatigue', null, null, 0.63, T.ngH1s);
    insLead.run('northgate-family-health', 'demo-ng-h2',
      'Robert Kim', '+12025550202', 'Follow-up on knee surgery', null, 'Medicare', 0.65, T.ngH2s);
    insLead.run('northgate-family-health', 'demo-ng-h4',
      'Diana Lopez', '+13055550301', 'Pediatric check for daughter, age 7', null, null, 0.58, T.ngH4s);
    insLead.run('northgate-family-health', 'demo-ng-h5',
      'Thomas Grant', '+13055550302', 'Headaches and dizziness', null, null, 0.35, T.ngH5s);
    insLead.run('northgate-family-health', 'demo-ng-h6',
      'Angela Brooks', '+17185550401', 'Routine follow-up appointment', null, null, 0.33, T.ngH6s);
    insLead.run('northgate-family-health', 'demo-ng-h7',
      'Kevin M.', '+17185550402', null, null, null, 0.18, T.ngH7s);

    // SUNRISE DENTAL — sessions (5)
    insSession.run('demo-sd-t1', 'sunrise-dental', T.sdT1s, T.sdT1e, 960, 1, 0, 'LEAD_CAPTURED', 'DENTAL_CLEANING', 'phone');
    insSession.run('demo-sd-h1', 'sunrise-dental', T.sdH1s, T.sdH1e, 1140, 1, 0, 'LEAD_CAPTURED', 'DENTAL_PAIN', 'phone');
    insSession.run('demo-sd-h2', 'sunrise-dental', T.sdH2s, T.sdH2e, 450, 1, 0, 'LEAD_CAPTURED', 'DENTAL_CLEANING', 'web');
    insSession.run('demo-sd-h3', 'sunrise-dental', T.sdH3s, T.sdH3e, 45, 0, 0, 'ENDED', 'DENTAL_CLEANING', 'phone');
    insSession.run('demo-sd-h4', 'sunrise-dental', T.sdH4s, T.sdH4e, 110, 0, 0, 'ENDED', 'DENTAL_COSMETIC', 'web');

    // SUNRISE DENTAL — leads (3)
    insLead.run('sunrise-dental', 'demo-sd-t1',
      'Chloe Patterson', '+13125550501', 'Routine cleaning and check-up', '1995-06-12', 'Delta Dental', 0.91, T.sdT1s);
    insLead.run('sunrise-dental', 'demo-sd-h1',
      'Brandon Fields', '+13125550502', 'Severe toothache — upper left molar', null, null, 0.38, T.sdH1s);
    insLead.run('sunrise-dental', 'demo-sd-h2',
      'Michelle Torres', '+13125550503', 'Teeth whitening consultation', '1988-11-30', null, 0.62, T.sdH2s);

    // VALLEY PHYSIOTHERAPY — sessions (4)
    insSession.run('demo-vp-t1', 'valley-physiotherapy', T.vpT1s, T.vpT1e, 1380, 1, 0, 'LEAD_CAPTURED', 'PHYSIO_ASSESSMENT', 'phone');
    insSession.run('demo-vp-h1', 'valley-physiotherapy', T.vpH1s, T.vpH1e, 870, 1, 0, 'LEAD_CAPTURED', 'PHYSIO_SPORTS', 'web');
    insSession.run('demo-vp-h2', 'valley-physiotherapy', T.vpH2s, T.vpH2e, 87, 0, 0, 'ENDED', 'PHYSIO_TREATMENT', 'phone');
    insSession.run('demo-vp-h3', 'valley-physiotherapy', T.vpH3s, T.vpH3e, 52, 0, 0, 'ENDED', 'PHYSIO_ASSESSMENT', 'web');

    // VALLEY PHYSIOTHERAPY — leads (2)
    insLead.run('valley-physiotherapy', 'demo-vp-t1',
      'David Chen', '+14155550601', 'Initial assessment for lower back rehabilitation', '1985-03-19', null, 0.68, T.vpT1s);
    insLead.run('valley-physiotherapy', 'demo-vp-h1',
      'Sarah Winters', '+14155550602', 'Hamstring strain from marathon training', null, null, 0.35, T.vpH1s);
  })();

  console.log('[seed-demo] Demo data seeded successfully.');
  console.log('');
  console.log('  Northgate Family Health   → 12 sessions, 9 leads, 3 appointments, 1 emergency');
  console.log('  Sunrise Dental            → 5 sessions,  3 leads, 1 appointment');
  console.log('  Valley Physiotherapy      → 4 sessions,  2 leads, 1 appointment');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const resetOnly = process.argv.includes('--reset');

reset();
if (!resetOnly) {
  seed();
}

db.close();
