import { queries } from '../../lib/database.js';

function normalizePatientType(v) {
  if (v == null || v === '') return null;
  const s = String(v).toLowerCase().trim();
  if (s === 'new' || s === 'returning') return s;
  return null;
}

function ensureSession(sessionId, tenantId) {
  if (!sessionId) return;
  const ts = new Date().toISOString();
  try {
    queries.insertSession.run(String(sessionId), String(tenantId), ts, null);
  } catch {
    /* duplicate */
  }
}

export function captureLead({
  tenantId,
  sessionId,
  name,
  phone,
  patient_type,
  dob,
  reason_for_visit,
  insurance_provider,
  insurance_id,
  urgency,
  contact_method,
  completeness_score,
  service,
}) {
  ensureSession(sessionId, tenantId);
  const captured_at = new Date().toISOString();

  const result = queries.insertLead.run(
    sessionId || `lead_${Date.now()}`,
    tenantId,
    name || null,
    phone || null,
    normalizePatientType(patient_type),
    dob || null,
    reason_for_visit || null,
    insurance_provider || null,
    insurance_id || null,
    urgency || null,
    contact_method || null,
    completeness_score ?? 0.5,
    captured_at,
    service || null
  );

  if (sessionId) {
    queries.markSessionLeadCaptured.run(sessionId);
  }

  const parts = [name, phone, reason_for_visit].filter(Boolean);
  const summary = parts.length
    ? `Captured lead: ${parts.join(', ')}.`
    : 'Patient information saved.';

  return {
    success: true,
    lead_id: result.lastInsertRowid,
    message: summary,
  };
}
