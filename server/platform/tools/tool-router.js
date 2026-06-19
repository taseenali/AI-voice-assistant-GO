import { randomUUID } from 'crypto';
import { requireTenant } from '../vapi/context.js';
import * as calendarTool from './calendar-tool.js';
import * as leadTool from './lead-tool.js';
import * as emergencyTool from './emergency-tool.js';
import { platformQueries } from '../../lib/platform-migrations.js';

/**
 * Normalize a raw phone string to E.164 (+1XXXXXXXXXX for US/CA).
 * Handles formats like "(612) 555-1234", "6125551234", "+16125551234".
 * If the number can't be normalized (non-US/CA, already correct, etc.) it is
 * returned as-is so the LLM value is preserved.
 */
function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  const digits = raw.replace(/\D/g, '');
  // Already E.164 US/CA: +1 followed by 10 digits
  if (/^\+1\d{10}$/.test(raw.trim())) return raw.trim();
  // 11 digits starting with 1 (US/CA country code included without +)
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // 10 digits — assume US/CA, prepend +1
  if (digits.length === 10) return `+1${digits}`;
  // Anything else: return cleaned version of original (non-US international, etc.)
  return raw.trim();
}

const TOOL_HANDLERS = {
  check_availability: async (tenantId, args) => {
    const bundle = requireTenant(tenantId);
    const cfg = bundle.config;

    if (!cfg.calendar_enabled) {
      return 'Online booking is not enabled. Please take a message and have staff call back.';
    }

    const result = await calendarTool.checkAvailability({
      calendarId: cfg.calendar_id,
      date: args.date,
      time: args.time,
      durationMinutes: args.duration_minutes || 30,
      timezone: cfg.timezone || 'UTC',
      businessHours: cfg.business_hours || null,
    });
    return result.message;
  },

  get_available_slots: async (tenantId, args) => {
    const bundle = requireTenant(tenantId);
    const cfg = bundle.config;

    if (!cfg.calendar_enabled) {
      return 'Online booking is not enabled. Please take a message and the clinic will call back.';
    }

    const result = await calendarTool.getAvailableSlots({
      calendarId: cfg.calendar_id,
      date: args.date,
      timezone: cfg.timezone || 'UTC',
      businessHours: cfg.business_hours || null,
    });
    return result.message;
  },

  book_appointment: async (tenantId, args, ctx) => {
    const bundle = requireTenant(tenantId);
    const cfg = bundle.config;

    if (!cfg.calendar_enabled) {
      return 'Online booking is not enabled for this clinic.';
    }

    // Duplicate booking guard: check if this patient already has an appointment that day
    if (args.date && (args.patient_name || args.patientName)) {
      const pName = (args.patient_name || args.patientName || '').toLowerCase().trim();
      const dayStart = new Date(`${args.date}T00:00:00Z`).toISOString();
      const existingToday = platformQueries.getAppointmentsByTenant.all(tenantId, dayStart, 50)
        .filter(a => a.start_time.startsWith(args.date) && a.patient_name?.toLowerCase().trim() === pName);
      if (existingToday.length > 0) {
        const existingTime = existingToday[0].start_time.slice(11, 16);
        return `${args.patient_name || args.patientName} already has an appointment on ${args.date} at ${existingTime}. Please confirm with the patient whether they want to book a different date, or this might be a duplicate.`;
      }
    }

    const result = await calendarTool.bookAppointment({
      calendarId: cfg.calendar_id,
      date: args.date,
      time: args.time,
      durationMinutes: args.duration_minutes || 30,
      patientName: args.patient_name || args.patientName,
      reason: args.reason || args.reason_for_visit,
      phone: args.phone || null,
      sessionId: ctx.sessionId,
      timezone: cfg.timezone || 'UTC',
    });

    if (result.success) {
      try {
        const { startTime, endTime } = calendarTool.toSlotIso(
          args.date,
          args.time,
          args.duration_minutes || 30,
          cfg.timezone || 'UTC'
        );
        platformQueries.insertAppointment.run(
          randomUUID(),
          tenantId,
          ctx.sessionId || null,
          startTime,
          endTime,
          args.patient_name || args.patientName || null,
          args.reason || args.reason_for_visit || null,
          'confirmed',
          null,
          new Date().toISOString()
        );
      } catch (dbErr) {
        console.error('[book_appointment] DB dual-write failed (non-fatal):', dbErr.message);
      }
    }

    return result.message;
  },

  capture_lead: async (tenantId, args, ctx) => {
    const result = leadTool.captureLead({
      tenantId,
      sessionId: ctx.sessionId,
      ...args,
      // Always normalize phone so E.164 is stored regardless of how LLM formatted it
      phone: normalizePhone(args.phone),
    });
    return result.message;
  },

  log_emergency: async (tenantId, args, ctx) => {
    const bundle = requireTenant(tenantId);
    const result = emergencyTool.logEmergency({
      tenantId,
      sessionId: ctx.sessionId,
      pattern_matched: args.pattern_matched || args.keyword,
      user_message: args.user_message || args.message,
      response_sent: bundle.config.emergency_response,
    });
    return result.message;
  },
};

export async function executeTool(toolName, tenantId, args = {}, ctx = {}) {
  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    const err = new Error(`Unknown tool: ${toolName}`);
    err.status = 400;
    throw err;
  }
  return handler(tenantId, args, ctx);
}

export { TOOL_HANDLERS };
