import express from 'express';
import { queries } from '../lib/database.js';
import { requireDashboardAuth } from '../platform/auth/clinic-auth.js';
import { writeAuditLog } from '../lib/audit.js';
import { requireStrings, parseIntParam } from '../lib/validate.js';

const router = express.Router();

function ensureSessionExists(sessionId, clientId, startedAt) {
  if (!sessionId) return;
  try {
    queries.insertSession.run(
      String(sessionId),
      String(clientId || 'unknown').substring(0, 128),
      startedAt,
      null
    );
  } catch {
    /* duplicate */
  }
}

function normalizePatientType(v) {
  if (v == null || v === '') return null;
  const s = String(v).toLowerCase().trim();
  if (s === 'new' || s === 'returning') return s;
  return null;
}

// GET /api/leads - List all leads for a client (dashboard — JWT required)
router.get('/', requireDashboardAuth, (req, res) => {
  try {
    const client = req.tenantId;
    const limit = parseIntParam(req.query.limit, 100, 1, 200);
    const offset = parseIntParam(req.query.offset, 0, 0, 1_000_000);
    const { service, completeness_min } = req.query;
    const total = queries.countLeads.get(client).n;

    writeAuditLog({
      event_type: 'phi_access',
      action: 'list_leads',
      resource: 'leads',
      client_id: client,
      user_id: req.user?.userId,
      req,
    });

    let rows = queries.getLeads.all(client, limit, offset);

    // Filter by service if provided
    if (service && service !== 'all') {
      rows = rows.filter(l => l.service === service);
    }

    // Filter by completeness if provided
    if (completeness_min) {
      const minScore = parseFloat(completeness_min) / 100;
      rows = rows.filter(l => l.completeness_score >= minScore);
    }

    // Map DB snake_case → dashboard camelCase; convert 0-1 score to 0-100 percentage
    const leads = rows.map(l => ({
      name:               l.name,
      phone:              l.phone,
      patient_type:       l.patient_type,
      dob:                l.dob,
      reason_for_visit:   l.reason_for_visit,
      insurance_provider: l.insurance_provider,
      insurance_id:       l.insurance_id,
      urgency:            l.urgency,
      contactMethod:      l.contact_method,
      client_id:          l.client_id,
      capturedAt:         l.captured_at,
      completeness:       Math.round((l.completeness_score || 0) * 100),
      service:            l.service,
    }));

    res.json({ leads, total, hasMore: offset + leads.length < total });
  } catch (error) {
    console.error('[Leads API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/leads - Create new lead
router.post('/', (req, res) => {
  try {
    const err = requireStrings(req.body, ['session_id', 'client_id']);
    if (err) return res.status(400).json({ error: err });

    const {
      session_id,
      client_id,
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
      service
    } = req.body;

    const captured_at = new Date().toISOString();

    ensureSessionExists(session_id, client_id, captured_at);

    const result = queries.insertLead.run(
      session_id,
      client_id,
      name || null,
      phone || null,
      normalizePatientType(patient_type),
      dob || null,
      reason_for_visit || null,
      insurance_provider || null,
      insurance_id || null,
      urgency || null,
      contact_method || null,
      completeness_score || 0,
      captured_at,
      service || null
    );

    if (session_id) {
      queries.markSessionLeadCaptured.run(session_id);
    }

    res.json({ success: true, lead_id: result.lastInsertRowid });
  } catch (error) {
    console.error('[Leads API] Error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

export default router;