/**
 * TEMPORARY spike instrumentation — writes raw webhook bodies to captures/
 * Remove after Phase 1.5 spike passes. @see docs/PHASE-3-SPIKE.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = path.join(__dirname, '../../../captures');

function ensureDir() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }
}

/**
 * Express middleware — tee body to disk before handler runs.
 */
export function captureRawWebhook(req, _res, next) {
  if (process.env.VAPI_CAPTURE_ENABLED === 'false') {
    return next();
  }

  try {
    ensureDir();
    const type = req.body?.message?.type || 'unknown';
    const ts = Date.now();
    const file = path.join(CAPTURE_DIR, `${ts}-${type}.json`);
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    console.log(`[Vapi Capture] ${path.basename(file)}`);
  } catch (err) {
    console.warn('[Vapi Capture] write failed:', err.message);
  }

  next();
}

export { CAPTURE_DIR };
