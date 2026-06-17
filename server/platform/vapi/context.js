import { resolveTenantByPhone, resolveTenantBySlug } from '../tenants/tenant-service.js';

/**
 * Extract tenant_id from Vapi webhook body.
 */
export function extractTenantId(body) {
  const meta =
    body?.message?.assistant?.metadata ||
    body?.message?.call?.assistant?.metadata ||
    body?.assistant?.metadata;

  if (meta?.tenant_id) return meta.tenant_id;

  const phone =
    body?.message?.call?.phoneNumber?.number ||
    body?.message?.call?.to?.phoneNumber ||
    body?.call?.phoneNumber?.number;

  if (phone) {
    const tenant = resolveTenantByPhone(phone);
    if (tenant) return tenant.tenant_id;
  }

  return null;
}

export function extractCallId(body) {
  return body?.message?.call?.id || body?.call?.id || null;
}

export function extractSessionId(body) {
  const meta =
    body?.message?.assistant?.metadata ||
    body?.message?.call?.assistant?.metadata;
  return meta?.session_id || extractCallId(body);
}

export function requireTenant(tenantId) {
  const bundle = resolveTenantBySlug(tenantId);
  if (!bundle) {
    const err = new Error(`Unknown tenant: ${tenantId}`);
    err.status = 404;
    throw err;
  }
  if (bundle.status === 'suspended') {
    const err = new Error('Tenant suspended');
    err.status = 403;
    throw err;
  }
  return bundle;
}
