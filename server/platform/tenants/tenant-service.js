import { readFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { platformQueries } from '../../lib/platform-migrations.js';

const CONFIGS_DIR = path.join(process.cwd(), 'configs');

/**
 * Build system prompt from legacy services JSON shape.
 */
export function buildSystemPrompt(config) {
  const lines = [
    `You are ${config.assistant_name || 'Aria'}, an AI medical receptionist for ${config.company_name || 'the clinic'}.`,
    `Tone: ${config.tone || 'warm, calm, professional'}.`,
    `Primary goal: ${config.primary_goal || 'book_appointment'}.`,
    '',
    'COMMUNICATION RULES (follow strictly):',
    '- Keep every reply to one or two sentences. You are on a phone call — never give long explanations.',
    '- Ask for one piece of information at a time.',
    '- Never diagnose symptoms. Never recommend medications or treatments.',
    '- Always disclose you are an AI at the start of the call.',
    '',
    'Services you can help with:',
  ];

  for (const svc of config.services || []) {
    lines.push(`- ${svc.display_name} (${svc.intent_key})`);
  }

  if (config.emergency_keywords?.length) {
    lines.push(
      '',
      'EMERGENCY: If the caller mentions any emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.),',
      'call log_emergency immediately, tell them to call 911, and end the booking flow.',
      `Response template: ${config.emergency_response || 'Please call 911 immediately. I am alerting the clinic now.'}`
    );
  }

  lines.push(
    '',
    'BOOKING FLOW:',
    '1. Greet and ask how you can help.',
    '2. Ask for the patient\'s full name.',
    '3. Ask for the reason for their visit.',
    '4. Ask for their callback phone number — this is required before saving any details.',
    '5. Use check_availability to find an open slot.',
    '6. Confirm the slot with the patient.',
    '7. Use book_appointment to confirm the booking.',
    '8. Use capture_lead to save patient details (name, phone, reason_for_visit are all required).',
    '',
    'Never call capture_lead without a phone number. Never call book_appointment without first calling check_availability.'
  );

  if (config.business_hours) {
    lines.push(
      '',
      `BUSINESS HOURS: ${JSON.stringify(config.business_hours)}.`,
      'If the caller contacts outside business hours, acknowledge them warmly, collect their details using capture_lead,',
      'and let them know the clinic will call them back the next business day.'
    );
  }

  return lines.join('\n');
}

function firstGreeting(config) {
  const greetings = config.greetings;
  if (Array.isArray(greetings) && greetings.length > 0) return greetings[0];
  return `Hi! I'm ${config.assistant_name || 'Aria'}. How can I help you today?`;
}

/**
 * Seed tenants from configs/*.json (legacy → platform migration).
 */
export function seedTenantsFromConfigs() {
  if (process.env.PLATFORM_SEED_TENANTS === 'false') return;

  if (!existsSync(CONFIGS_DIR)) return;

  const files = readdirSync(CONFIGS_DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(CONFIGS_DIR, file);
    if (!existsSync(filePath)) continue;

    const slug = file.replace('.json', '');
    const config = JSON.parse(readFileSync(filePath, 'utf8'));
    const clientUpper = slug.toUpperCase().replace(/-/g, '_');

    platformQueries.upsertTenant.run(
      slug,
      config.company_name || slug,
      'active',
      'starter'
    );

    const webhookUrl =
      process.env[`${clientUpper}_WEBHOOK_URL`] || config.webhook_url || '';
    const webhookSecret =
      process.env[`${clientUpper}_WEBHOOK_SECRET`] || config.webhook_secret || '';

    platformQueries.upsertTenantConfig.run(
      slug,
      config.assistant_name || 'Aria',
      buildSystemPrompt({ ...config, company_name: config.company_name }),
      firstGreeting(config),
      '11labs',
      process.env.DEFAULT_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
      config.calendar_id || null,
      config.calendar_enabled ? 1 : 0,
      JSON.stringify(config.business_hours || null),
      JSON.stringify(config.emergency_keywords || []),
      config.emergency_response || '',
      JSON.stringify(config.services || []),
      webhookUrl,
      webhookSecret,
      config.timezone || 'UTC',
      new Date().toISOString()
    );
  }

  // Dev phone mapping for contract tests
  platformQueries.upsertPhoneNumber.run('+15559876543', 'medical-clinic', 'Pilot line (dev)');
  // Live Vapi number (spike)
  platformQueries.upsertPhoneNumber.run('+18564402211', 'medical-clinic', 'Vapi spike line');

  console.log('[Platform] Tenants seeded from configs/');
}

/**
 * Seed default users for local development (super_admin + clinic_admin).
 */
export async function seedDefaultUsers() {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[Platform] Refusing to seed default users in production');
    return;
  }

  const password = process.env.PLATFORM_ADMIN_PASSWORD || 'changeme-dev-only';
  const hash = await bcrypt.hash(password, 10);

  const adminEmail = (process.env.PLATFORM_ADMIN_EMAIL || 'admin@medvoice.local').trim().toLowerCase();
  if (!platformQueries.getUserByEmail.get(adminEmail)) {
    platformQueries.insertUser.run(randomUUID(), null, adminEmail, hash, 'super_admin');
    console.log(`[Platform] Default super_admin created: ${adminEmail}`);
  }

  const clinicEmail = (process.env.PLATFORM_CLINIC_EMAIL || 'clinic@medical-clinic.local').trim().toLowerCase();
  if (!platformQueries.getUserByEmail.get(clinicEmail)) {
    platformQueries.insertUser.run(
      randomUUID(),
      'medical-clinic',
      clinicEmail,
      hash,
      'clinic_admin'
    );
    console.log(`[Platform] Default clinic_admin created: ${clinicEmail}`);
  }
}

export function getTenantConfig(tenantId) {
  const tenant = platformQueries.getTenant.get(tenantId);
  if (!tenant) return null;
  const cfg = platformQueries.getTenantConfig.get(tenantId);
  if (!cfg) return null;

  return {
    tenant_id: tenant.tenant_id,
    company_name: tenant.company_name,
    status: tenant.status,
    plan_tier: tenant.plan_tier,
    config: {
      assistant_name: cfg.assistant_name,
      system_prompt: cfg.system_prompt,
      first_message: cfg.first_message,
      voice_provider: cfg.voice_provider,
      voice_id: cfg.voice_id,
      calendar_id: cfg.calendar_id,
      calendar_enabled: Boolean(cfg.calendar_enabled),
      timezone: cfg.timezone || 'UTC',
      business_hours: cfg.business_hours ? JSON.parse(cfg.business_hours) : null,
      emergency_keywords: cfg.emergency_keywords ? JSON.parse(cfg.emergency_keywords) : [],
      emergency_response: cfg.emergency_response,
      services: cfg.services ? JSON.parse(cfg.services) : [],
      webhook_url: cfg.webhook_url,
      webhook_secret: cfg.webhook_secret,
    },
  };
}

export function resolveTenantByPhone(phoneNumber) {
  if (!phoneNumber) return null;
  const normalized = phoneNumber.replace(/\s/g, '');
  const row = platformQueries.getTenantByPhone.get(normalized);
  if (!row) return null;

  return {
    tenant_id: row.tenant_id,
    company_name: row.company_name,
    status: row.status,
    plan_tier: row.plan_tier,
    config: {
      assistant_name: row.assistant_name,
      system_prompt: row.system_prompt,
      first_message: row.first_message,
      voice_provider: row.voice_provider,
      voice_id: row.voice_id,
      calendar_id: row.calendar_id,
      calendar_enabled: Boolean(row.calendar_enabled),
      timezone: row.timezone || 'UTC',
      business_hours: row.business_hours ? JSON.parse(row.business_hours) : null,
      emergency_keywords: row.emergency_keywords ? JSON.parse(row.emergency_keywords) : [],
      emergency_response: row.emergency_response,
      services: row.services ? JSON.parse(row.services) : [],
      webhook_url: row.webhook_url,
      webhook_secret: row.webhook_secret,
    },
  };
}

export function resolveTenantBySlug(tenantId) {
  return getTenantConfig(tenantId);
}
