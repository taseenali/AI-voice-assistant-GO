import { describe, it, expect } from 'vitest';
import {
  canAccessLead,
  canAccessSession,
  canAccessEmergencyEvent,
} from '../server/platform/auth/clinic-auth.js';

describe('canAccess* guards fail closed', () => {
  const clinicReq = {
    user: { role: 'clinic_admin', tenantId: 'medical-clinic' },
    tenantId: 'medical-clinic',
  };

  it('denies when req.user is missing', () => {
    expect(canAccessSession({}, { client_id: 'medical-clinic' })).toBe(false);
    expect(canAccessLead({}, { client_id: 'medical-clinic' })).toBe(false);
    expect(
      canAccessEmergencyEvent({}, { event_id: 1 }, 'medical-clinic')
    ).toBe(false);
  });

  it('denies clinic user when req.tenantId is missing', () => {
    const req = { user: { role: 'clinic_admin', tenantId: 'medical-clinic' } };
    expect(canAccessSession(req, { client_id: 'medical-clinic' })).toBe(false);
    expect(canAccessLead(req, { client_id: 'medical-clinic' })).toBe(false);
    expect(canAccessEmergencyEvent(req, { event_id: 1 }, 'medical-clinic')).toBe(
      false
    );
  });

  it('denies emergency when sessionClientId is missing for clinic user', () => {
    expect(
      canAccessEmergencyEvent(clinicReq, { event_id: 1 }, null)
    ).toBe(false);
    expect(
      canAccessEmergencyEvent(clinicReq, { event_id: 1 }, undefined)
    ).toBe(false);
  });

  it('allows super_admin without tenantId on record', () => {
    const req = { user: { role: 'super_admin' }, tenantId: 'medical-clinic' };
    expect(canAccessSession(req, { client_id: 'other' })).toBe(true);
  });
});
