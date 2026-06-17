import crypto from 'crypto';

/**
 * Spike: plaintext shared secret via x-vapi-secret header.
 * Production: X-Vapi-Signature HMAC over raw body.
 * @see docs/PHASE-3-SPIKE.md Step 3
 */
export function verifyVapiWebhook(req) {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  const publicUrl = process.env.PUBLIC_URL || '';
  const isExposed =
    publicUrl.startsWith('https://') || publicUrl.includes('ngrok');

  // Never run an open webhook on a public URL
  if (!secret) {
    if (process.env.NODE_ENV === 'production' || isExposed) {
      return {
        ok: false,
        reason: 'VAPI_WEBHOOK_SECRET required when webhook is publicly reachable',
      };
    }
    return { ok: true, mode: 'none' };
  }

  const headerSecret = req.get('x-vapi-secret');
  if (headerSecret && headerSecret.length === secret.length) {
    try {
      if (crypto.timingSafeEqual(Buffer.from(headerSecret), Buffer.from(secret))) {
        return { ok: true, mode: 'header' };
      }
    } catch {
      return { ok: false, reason: 'Unauthorized' };
    }
  }

  // Production path: HMAC signature (when VAPI_WEBHOOK_HMAC=true)
  const signature = req.get('x-vapi-signature');
  if (signature && process.env.VAPI_WEBHOOK_HMAC === 'true') {
    const rawBody = req.rawBody;
    if (!rawBody) {
      return { ok: false, reason: 'rawBody required for HMAC verification' };
    }
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    const sig = signature.replace(/^sha256=/, '');
    if (sig.length !== expected.length) {
      return { ok: false, reason: 'Invalid HMAC signature' };
    }
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return { ok: true, mode: 'hmac' };
    }
    return { ok: false, reason: 'Invalid HMAC signature' };
  }

  return { ok: false, reason: 'Unauthorized' };
}

export function vapiAuthMiddleware(req, res, next) {
  const result = verifyVapiWebhook(req);
  if (!result.ok) {
    return res.status(401).json({ error: result.reason });
  }
  next();
}
