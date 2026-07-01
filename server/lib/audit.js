import { queries } from './database.js';

/**
 * Write a row to audit_logs.
 * Call this at every PHI touch point: login, sessions GET, leads GET,
 * recordings access, config changes, logout.
 *
 * @param {object} params
 * @param {string} params.event_type  e.g. 'auth', 'phi_access', 'config_change'
 * @param {string} params.action      e.g. 'login', 'list_sessions', 'read_recording'
 * @param {string} [params.resource]  e.g. 'sessions', 'leads', 'tenant_config'
 * @param {string} [params.client_id] tenant ID (defaults to 'system')
 * @param {string} [params.user_id]   acting user ID
 * @param {string} [params.session_id]
 * @param {object} [params.details]   any extra context — will be JSON-encoded
 * @param {import('express').Request} [params.req] Express request for IP + UA
 */
export function writeAuditLog({
  event_type,
  action,
  resource = null,
  client_id = 'system',
  user_id = null,
  session_id = null,
  details = null,
  req = null,
}) {
  try {
    queries.insertAuditLog.run(
      new Date().toISOString(),
      session_id,
      client_id,
      event_type,
      user_id,
      action,
      resource,
      details ? JSON.stringify(details) : null,
      req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null,
      req?.headers?.['user-agent'] ?? null
    );
  } catch (err) {
    // Audit failure must never crash the request — log and continue.
    console.error('[Audit] Failed to write log:', err.message);
  }
}
