/**
 * Lightweight request validation utilities.
 * Only validate at system boundaries — internal helpers are trusted.
 */

/**
 * Assert required string fields exist in body.
 * Returns an error message string or null if valid.
 */
export function requireStrings(body, fields) {
  for (const field of fields) {
    const v = body?.[field];
    if (v === undefined || v === null || v === '') {
      return `Missing required field: ${field}`;
    }
    if (typeof v !== 'string') {
      return `Field '${field}' must be a string`;
    }
  }
  return null;
}

/**
 * Parse and clamp a numeric query param.
 * Returns the clamped integer or the default.
 */
export function parseIntParam(value, defaultVal, min = 0, max = 1000) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return defaultVal;
  return Math.max(min, Math.min(max, n));
}

/**
 * Express middleware that rejects bodies larger than the given limit.
 * Use when a route receives arbitrary JSON from untrusted sources.
 */
export function bodyNotEmpty(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }
  next();
}
