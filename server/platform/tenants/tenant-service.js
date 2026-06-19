import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { platformQueries } from '../../lib/platform-migrations.js';

const CONFIGS_DIR = path.join(process.cwd(), 'configs');

function formatBusinessHours(bh) {
  if (!bh) return null;
  const ordered = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const short = { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri', saturday:'Sat', sunday:'Sun' };

  function fmt12(t) {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  const parts = [];
  let i = 0;
  while (i < ordered.length) {
    const day = ordered[i];
    const h = bh[day];
    if (!h) {
      let j = i + 1;
      while (j < ordered.length && !bh[ordered[j]]) j++;
      parts.push(j === i + 1 ? `${short[day]}: closed` : `${short[day]}–${short[ordered[j - 1]]}: closed`);
      i = j;
    } else {
      let j = i + 1;
      while (j < ordered.length && bh[ordered[j]] && bh[ordered[j]].open === h.open && bh[ordered[j]].close === h.close) j++;
      const range = j === i + 1 ? short[day] : `${short[day]}–${short[ordered[j - 1]]}`;
      parts.push(`${range}: ${fmt12(h.open)}–${fmt12(h.close)}`);
      i = j;
    }
  }
  return parts.join(', ');
}

/**
 * Build system prompt from legacy services JSON shape.
 */
export function buildSystemPrompt(config) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: config.timezone || 'UTC',
  });

  const lines = [
    `You are ${config.assistant_name || 'Aria'}, an AI medical receptionist for ${config.company_name || 'the clinic'}.`,
    `Tone: ${config.tone || 'warm, calm, professional'}.`,
    `Primary goal: ${config.primary_goal || 'book_appointment'}.`,
    `TODAY IS: ${today}. Use this to compute relative dates like "tomorrow", "next Monday", or "next week".`,
    'Never suggest or book appointment dates in the past. All bookings must be today or in the future.',
    '',
    'COMMUNICATION RULES (follow strictly):',
    '- Keep every reply to one or two sentences. You are on a phone call — never give long explanations.',
    '- Ask for one piece of information at a time.',
    '- Never diagnose symptoms. Never recommend medications or treatments.',
    '- Always disclose you are an AI at the start of the call.',
    '- If the caller goes silent for more than 5 seconds, gently prompt once: "Are you still there?" If no response, thank them and end the call.',
    '- If the caller seems confused or unsure what service they need, default to General Consultation.',
    '',
    'RELATIVE DATE HANDLING:',
    '- "tomorrow" → today\'s date + 1 day.',
    '- "next Monday/Tuesday/..." → the next occurrence of that weekday after today.',
    '- "next week" → offer Monday of next week as a starting point.',
    '- "this week" → the closest upcoming weekday.',
    '- "in two weeks" → today + 14 days.',
    '- Always convert relative terms to a concrete YYYY-MM-DD before calling any calendar tool.',
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
    '3. Ask for the reason for their visit. If vague (e.g. "I need a doctor"), classify as General Consultation and confirm.',
    '4. Ask for their callback phone number — this is required before saving any details.',
    '   - Repeat the number back digit-by-digit once to confirm accuracy.',
    '   - Store in E.164 format: +1 followed by 10 digits (e.g. +16125551234 for 612-555-1234).',
    '   - If the caller says "same number I\'m calling from", acknowledge that but still ask them to confirm the number verbally.',
    '   - Never save fewer than 10 digits. If the number seems short, ask them to repeat.',
    '5. Call capture_lead now — you have name, phone, and reason. Do not wait until the end of the call.',
    '6. Ask what date works for them.',
    '   - Always call get_available_slots(date) first and offer those exact times to the patient.',
    '   - If the patient picks one of those times, go directly to step 7 — do NOT call check_availability again (those slots are already confirmed open).',
    '   - Only call check_availability(date, time) if the patient names a specific time without having seen the available slots list.',
    '   - If the requested time is unavailable, call get_available_slots(date) and offer the alternatives.',
    '   - If no slots are available on that date, apologize and ask for a different date.',
    '7. Confirm the chosen slot aloud with the patient ("So that\'s [Day], [Date] at [Time] — does that work for you?").',
    '8. Call book_appointment to write the booking. Pass the patient\'s phone number in the `phone` parameter.',
    '9. Thank the patient and end the call gracefully.',
    '',
    'TOOL FAILURE RESPONSES:',
    '- If get_available_slots or check_availability fails: "I\'m having a little trouble checking the schedule right now.',
    '  Let me take your details and the clinic will confirm your appointment time by phone."',
    '  Then call capture_lead with what you have collected.',
    '- If book_appointment fails: "I\'m having difficulty completing the booking at the moment.',
    '  Your details are already saved and the clinic team will call you to finalize the appointment."',
    '',
    'IMPORTANT CONSTRAINTS:',
    '- Call capture_lead as soon as name, phone, and reason are all known — do not wait until the end of the call.',
    '- Never call capture_lead without a phone number.',
    '- Never call book_appointment without first calling get_available_slots or check_availability.',
    '- If the patient hangs up before you collect their phone, do not call capture_lead.',
    '- Never book an appointment that conflicts with one already confirmed.'
  );

  if (config.business_hours) {
    const formatted = formatBusinessHours(config.business_hours);
    lines.push(
      '',
      `BUSINESS HOURS: ${formatted}.`,
      'Only offer appointment slots during clinic hours. If a patient requests a time outside these hours, explain the clinic is not open then and suggest an alternative.',
      'If the caller contacts outside business hours: acknowledge them warmly, explain the clinic is currently closed,',
      'collect their name, phone, and reason using capture_lead, and tell them the clinic will call back',
      'the next business day to schedule their appointment. Do not attempt to book a calendar slot.',
      'Example: "We\'re currently outside clinic hours, but I\'d love to take your details so someone can call you back."'
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

const ALLOWED_EDIT_KEYS = [
  'company_name', 'assistant_name', 'first_message', 'greetings',
  'emergency_response', 'emergency_keywords', 'business_hours',
  'services', 'timezone', 'calendar_enabled', 'calendar_id',
];

/**
 * Update a tenant's config from the dashboard JSON editor.
 * Merges allowed fields only, writes to configs/<id>.json, re-upserts SQLite.
 */
export function updateTenantConfig(tenantId, updates) {
  if (!/^[a-z0-9-]+$/.test(tenantId)) throw new Error('Invalid tenant ID');

  const filePath = path.join(CONFIGS_DIR, `${tenantId}.json`);
  if (!existsSync(filePath)) throw new Error(`Config file not found: ${tenantId}`);

  const current = JSON.parse(readFileSync(filePath, 'utf8'));
  const merged = { ...current };
  for (const key of ALLOWED_EDIT_KEYS) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      merged[key] = updates[key];
    }
  }

  writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');

  const slug = tenantId;
  const clientUpper = slug.toUpperCase().replace(/-/g, '_');
  const webhookUrl = process.env[`${clientUpper}_WEBHOOK_URL`] || merged.webhook_url || '';
  const webhookSecret = process.env[`${clientUpper}_WEBHOOK_SECRET`] || merged.webhook_secret || '';

  platformQueries.upsertTenant.run(slug, merged.company_name || slug, 'active', 'starter');
  platformQueries.upsertTenantConfig.run(
    slug,
    merged.assistant_name || 'Aria',
    buildSystemPrompt({ ...merged }),
    firstGreeting(merged),
    '11labs',
    process.env.DEFAULT_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
    merged.calendar_id || null,
    merged.calendar_enabled ? 1 : 0,
    JSON.stringify(merged.business_hours || null),
    JSON.stringify(merged.emergency_keywords || []),
    merged.emergency_response || '',
    JSON.stringify(merged.services || []),
    webhookUrl,
    webhookSecret,
    merged.timezone || 'UTC',
    new Date().toISOString()
  );

  console.log(`[Platform] Tenant config updated: ${slug}`);
  return getTenantConfig(slug);
}
