/**
 * Structured JSON logger.
 * In production: emits JSON to stdout for Railway/Vercel log aggregators.
 * In development: pretty-prints with level label.
 *
 * Usage:
 *   import log from '../lib/logger.js';
 *   log.info('session started', { sessionId, tenantId });
 *   log.warn('calendar unavailable', { tenantId });
 *   log.error('tool failure', { tool: 'book_appointment', err: err.message });
 */

const IS_PROD = process.env.NODE_ENV === 'production';
const MIN_LEVEL = process.env.LOG_LEVEL || 'info';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

function emit(level, message, meta = {}) {
  if (LEVELS[level] < LEVELS[MIN_LEVEL]) return;

  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...meta,
  };

  if (IS_PROD) {
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    const label = level.toUpperCase().padEnd(5);
    const metaStr = Object.keys(meta).length
      ? ' ' + JSON.stringify(meta)
      : '';
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[${label}] ${message}${metaStr}`);
  }
}

const log = {
  debug: (msg, meta) => emit('debug', msg, meta),
  info:  (msg, meta) => emit('info', msg, meta),
  warn:  (msg, meta) => emit('warn', msg, meta),
  error: (msg, meta) => emit('error', msg, meta),
};

export default log;
