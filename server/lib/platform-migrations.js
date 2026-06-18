/**
 * Platform schema migrations — idempotent, run on every boot.
 * Legacy tables remain in database.js; platform tables added here.
 */
export function runPlatformMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      tenant_id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','trial','suspended')),
      plan_tier TEXT NOT NULL DEFAULT 'starter',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenant_config (
      tenant_id TEXT PRIMARY KEY REFERENCES tenants(tenant_id),
      assistant_name TEXT NOT NULL DEFAULT 'Aria',
      system_prompt TEXT NOT NULL DEFAULT '',
      first_message TEXT NOT NULL DEFAULT '',
      voice_provider TEXT DEFAULT '11labs',
      voice_id TEXT DEFAULT '',
      calendar_id TEXT,
      calendar_enabled INTEGER NOT NULL DEFAULT 0,
      business_hours TEXT,
      emergency_keywords TEXT,
      emergency_response TEXT,
      services TEXT,
      webhook_url TEXT,
      webhook_secret TEXT,
      timezone TEXT NOT NULL DEFAULT 'UTC',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS phone_numbers (
      phone_number TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
      label TEXT,
      vapi_phone_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(tenant_id),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('super_admin','clinic_admin','clinic_staff')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      appointment_id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
      session_id TEXT,
      start_time TEXT NOT NULL,
      end_time TEXT,
      patient_name TEXT,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      html_link TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_phone_tenant ON phone_numbers(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_time);
  `);

  // Extend tenant_config with timezone (safe column add for existing DBs)
  const configCols = db.pragma('table_info(tenant_config)').map((c) => c.name);
  if (!configCols.includes('timezone')) {
    db.exec(`ALTER TABLE tenant_config ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC'`);
    console.log('[Database] Migration: tenant_config.timezone');
  }

  // Extend sessions for phone channel (safe column adds)
  const sessionCols = db.pragma('table_info(sessions)').map((c) => c.name);
  if (!sessionCols.includes('channel')) {
    db.exec(`ALTER TABLE sessions ADD COLUMN channel TEXT NOT NULL DEFAULT 'web'`);
    console.log('[Database] Migration: sessions.channel');
  }
  if (!sessionCols.includes('external_call_id')) {
    db.exec(`ALTER TABLE sessions ADD COLUMN external_call_id TEXT`);
    console.log('[Database] Migration: sessions.external_call_id');
  }
  if (!sessionCols.includes('recording_url')) {
    db.exec(`ALTER TABLE sessions ADD COLUMN recording_url TEXT`);
    console.log('[Database] Migration: sessions.recording_url');
  }
  if (!sessionCols.includes('phone_number')) {
    db.exec(`ALTER TABLE sessions ADD COLUMN phone_number TEXT`);
    console.log('[Database] Migration: sessions.phone_number');
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_external_call ON sessions(external_call_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_channel ON sessions(channel);
  `);
}

export const platformQueries = {
  getTenant: null,
  getTenantConfig: null,
  getTenantByPhone: null,
  listTenants: null,
  upsertTenant: null,
  upsertTenantConfig: null,
  upsertPhoneNumber: null,
  getUserByEmail: null,
  insertUser: null,
  updateSessionPhoneMeta: null,
  getAppointmentsByTenant: null,
  insertAppointment: null,
};

export function initPlatformQueries(db) {
  platformQueries.getTenant = db.prepare(`SELECT * FROM tenants WHERE tenant_id = ?`);
  platformQueries.getTenantConfig = db.prepare(`SELECT * FROM tenant_config WHERE tenant_id = ?`);
  platformQueries.getTenantByPhone = db.prepare(`
    SELECT t.*, tc.*
    FROM phone_numbers pn
    JOIN tenants t ON t.tenant_id = pn.tenant_id
    LEFT JOIN tenant_config tc ON tc.tenant_id = t.tenant_id
    WHERE pn.phone_number = ?
  `);
  platformQueries.listTenants = db.prepare(`SELECT * FROM tenants ORDER BY created_at DESC`);
  platformQueries.upsertTenant = db.prepare(`
    INSERT INTO tenants (tenant_id, company_name, status, plan_tier)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(tenant_id) DO UPDATE SET
      company_name = excluded.company_name,
      status = excluded.status,
      plan_tier = excluded.plan_tier
  `);
  platformQueries.upsertTenantConfig = db.prepare(`
    INSERT INTO tenant_config (
      tenant_id, assistant_name, system_prompt, first_message,
      voice_provider, voice_id, calendar_id, calendar_enabled,
      business_hours, emergency_keywords, emergency_response,
      services, webhook_url, webhook_secret, timezone, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(tenant_id) DO UPDATE SET
      assistant_name = excluded.assistant_name,
      system_prompt = excluded.system_prompt,
      first_message = excluded.first_message,
      voice_provider = excluded.voice_provider,
      voice_id = excluded.voice_id,
      calendar_id = excluded.calendar_id,
      calendar_enabled = excluded.calendar_enabled,
      business_hours = excluded.business_hours,
      emergency_keywords = excluded.emergency_keywords,
      emergency_response = excluded.emergency_response,
      services = excluded.services,
      webhook_url = excluded.webhook_url,
      webhook_secret = excluded.webhook_secret,
      timezone = excluded.timezone,
      updated_at = excluded.updated_at
  `);
  platformQueries.upsertPhoneNumber = db.prepare(`
    INSERT INTO phone_numbers (phone_number, tenant_id, label)
    VALUES (?, ?, ?)
    ON CONFLICT(phone_number) DO UPDATE SET
      tenant_id = excluded.tenant_id,
      label = excluded.label
  `);
  platformQueries.getUserByEmail = db.prepare(`SELECT * FROM users WHERE email = ?`);
  platformQueries.insertUser = db.prepare(`
    INSERT INTO users (user_id, tenant_id, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  platformQueries.updateSessionPhoneMeta = db.prepare(`
    UPDATE sessions
    SET channel = ?, external_call_id = ?, recording_url = ?, phone_number = ?, end_time = ?,
        duration_seconds = ?
    WHERE session_id = ?
  `);
  platformQueries.getAppointmentsByTenant = db.prepare(`
    SELECT * FROM appointments
    WHERE tenant_id = ? AND start_time >= ?
    ORDER BY start_time ASC
    LIMIT ?
  `);
  platformQueries.insertAppointment = db.prepare(`
    INSERT INTO appointments
      (appointment_id, tenant_id, session_id, start_time, end_time,
       patient_name, reason, status, html_link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
}
