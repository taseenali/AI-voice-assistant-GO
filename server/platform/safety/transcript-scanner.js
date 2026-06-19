/**
 * Deterministic emergency keyword scan for phone channel.
 * Duplicated patterns from js/modules/emergency-detector.js — platform isolation boundary.
 * @see docs/EMERGENCY-PHONE-PATH.md
 */

const EMERGENCY_PATTERNS = [
  // Cardiac
  /\bchest\s+pain\b/i,
  /\bheart\s+attack\b/i,
  /\bcardiac\s+arrest\b/i,

  // Respiratory
  /\bcan'?t\s+breath/i,
  /\b(difficulty|trouble|hard\s+time)\s+breath/i,
  /\bnot\s+breath/i,
  /\bstopped?\s+breath/i,
  /\bchoking\b/i,

  // Neurological — specific to active event (not medical history)
  /\b(having|i'?m\s+having|he'?s\s+having|she'?s\s+having)\s+a\s+stroke\b/i,
  /\b(signs?\s+of\s+(a\s+)?stroke|stroke\s+symptoms?)\b/i,
  /\bface\s+(drooping|droop|numb)\b/i,
  /\barm\s+weak/i,
  /\bseizure\b/i,
  /\bnot\s+respond/i,

  // Bleeding
  /\bsevere\s+(bleeding|blood\s+loss)\b/i,
  /\bcan'?t\s+stop\s+(the\s+)?bleed/i,
  /\buncontrolled\s+bleed/i,

  // Unconscious / collapse
  /\bunconscious\b/i,
  /\bpassed?\s+out\b/i,
  /\bnot\s+moving\b/i,

  // Allergic / toxic
  /\banaphylaxis\b/i,
  /\bepipen\b|\bepinephrine\s+pen\b/i,
  /\boverdose\b/i,
  /\bpoisoning\b/i,

  // Self-harm
  /\bkill\s+myself\b/i,
  /\bsuicide\b/i,

  // Obstetric
  /\bwater\s+broke\b/i,
  /\bcontractions\b/i,

  // Emergency services mention
  /\b911\b/i,
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
