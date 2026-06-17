import { requireTenant } from '../vapi/context.js';
import * as calendarTool from './calendar-tool.js';
import * as leadTool from './lead-tool.js';
import * as emergencyTool from './emergency-tool.js';

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
    });
    return result.message;
  },

  book_appointment: async (tenantId, args, ctx) => {
    const bundle = requireTenant(tenantId);
    const cfg = bundle.config;

    if (!cfg.calendar_enabled) {
      return 'Online booking is not enabled for this clinic.';
    }

    const result = await calendarTool.bookAppointment({
      calendarId: cfg.calendar_id,
      date: args.date,
      time: args.time,
      durationMinutes: args.duration_minutes || 30,
      patientName: args.patient_name || args.patientName,
      reason: args.reason || args.reason_for_visit,
      sessionId: ctx.sessionId,
    });
    return result.message;
  },

  capture_lead: async (tenantId, args, ctx) => {
    const result = leadTool.captureLead({
      tenantId,
      sessionId: ctx.sessionId,
      ...args,
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
