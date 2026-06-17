/**
 * Deterministic emergency keyword scan for phone channel.
 * Duplicated patterns from js/modules/emergency-detector.js — platform isolation boundary.
 * @see docs/EMERGENCY-PHONE-PATH.md
 */

const EMERGENCY_PATTERNS = [
  /\bchest\s+pain\b/i,
  /\bheart\s+attack\b/i,
  /\bcan'?t\s+breath/i,
  /\b(difficulty|trouble|hard\s+time)\s+breath/i,
  /\bnot\s+breath/i,
  /\bstroke\b/i,
  /\bface\s+(drooping|droop|numb)\b/i,
  /\barm\s+weak/i,
  /\bsevere\s+(bleeding|blood)\b/i,
  /\bunconscious\b/i,
  /\bpassed?\s+out\b/i,
  /\bchoking\b/i,
  /\b911\b/i,
  /\bkill\s+myself\b/i,
  /\bsuicide\b/i,
  /\bwater\s+broke\b/i,
  /\bcontractions\b/i,
];

export function scanTranscriptForEmergency(text, extraKeywords = []) {
  if (!text || typeof text !== 'string') {
    return { detected: false, pattern: null };
  }

  const normalized = text.toLowerCase().trim();

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(normalized)) {
      return { detected: true, pattern: pattern.toString() };
    }
  }

  for (const kw of extraKeywords) {
    if (kw && normalized.includes(String(kw).toLowerCase())) {
      return { detected: true, pattern: `keyword:${kw}` };
    }
  }

  return { detected: false, pattern: null };
}

/**
 * Extract caller utterance text from Vapi transcript event payloads.
 * Field names vary — try multiple paths (validated in spike diff).
 */
export function extractCallerText(body) {
  const msg = body?.message || body;
  const candidates = [
    msg?.transcript,
    msg?.text,
    msg?.speech?.transcript,
    msg?.artifact?.transcript,
    msg?.conversation?.[msg.conversation.length - 1]?.content,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }

  // messages[] array — last user role
  const messages = msg?.artifact?.messages || msg?.messages;
  if (Array.isArray(messages)) {
    const userMsgs = messages.filter((m) => m.role === 'user');
    const last = userMsgs[userMsgs.length - 1];
    if (last?.message || last?.content) return last.message || last.content;
  }

  return null;
}
