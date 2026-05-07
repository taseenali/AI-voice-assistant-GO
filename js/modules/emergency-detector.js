/**
 * Emergency Detector — Deterministic Medical Safety Gate (G-028)
 * Pass 3 — Medical AI Receptionist Platform
 *
 * Architecture: DETERMINISTIC keyword match — NOT LLM-based.
 * T02/T03 mandate: safety-critical paths must never rely on generative AI reasoning.
 * This module runs BEFORE the router and BEFORE any LLM call.
 *
 * Integration point: Top of processInput() in response-orchestrator.js (~line 121)
 * If emergency detected → return emergency response immediately, bypass all pipeline.
 *
 * Red-flag categories:
 *   - Cardiac: chest pain, heart attack
 *   - Respiratory: can't breathe, difficulty breathing
 *   - Neurological: stroke symptoms, sudden confusion, face drooping
 *   - Trauma: severe bleeding, unconscious
 *   - Pediatric: baby not breathing, child seizure
 */

// ─── Red-Flag Keyword Patterns ──────────────────────────────────
// Each pattern is tested against the normalized (lowercased) user input.
// Using word-boundary anchors where possible to minimize false positives.

const EMERGENCY_PATTERNS = [
  // Cardiac
  /\bchest\s+pain\b/i,
  /\bheart\s+attack\b/i,
  /\bmy\s+heart\b.*\b(hurts|pain|stop|racing)\b/i,
  /\b(crushing|squeezing)\s+(chest|pain)\b/i,

  // Respiratory
  /\bcan'?t\s+breath/i,
  /\b(difficulty|trouble|hard\s+time)\s+breath/i,
  /\bnot\s+breath/i,
  /\bstop\s+breath/i,

  // Neurological / Stroke
  /\bstroke\b/i,
  /\bface\s+(drooping|droop|numb)\b/i,
  /\barm\s+weak/i,
  /\bsudden\s+(confusion|headache|dizziness|numbness)\b/i,
  /\bblurred?\s+vision\b/i,
  /\bslurred?\s+speech\b/i,

  // Trauma / Severe Injury
  /\bsevere\s+(bleeding|blood|injury|wound)\b/i,
  /\bbleed(ing)?\s+(badly|uncontrolled|won'?t\s+stop)\b/i,
  /\bunconscious\b/i,
  /\bnot\s+responding\b/i,
  /\bpassed?\s+out\b/i,

  // General
  /\bchoking\b/i,

  // Pediatric
  /\bbaby\s+(not\s+breath|choking|unconscious|seizing)\b/i,
  /\bchild\s+(seiz|not\s+breath|unconscious)\b/i,

  // Direct emergency declarations
  /\b911\b/i,
  /\bcall\s+(an?\s+)?(ambulance|paramedic|emergency)\b/i,
  /\bgoing\s+to\s+(die|collapse)\b/i,
  /\bmedical\s+emergency\b/i
];

// ─── Emergency Response Templates ──────────────────────────────

const EMERGENCY_RESPONSE = 
  '🚨 This sounds like a medical emergency. Please call 911 (or your local emergency number) immediately. ' +
  'Do not wait — emergency services can help you right now. ' +
  'If you are unable to call, ask someone nearby for help or text 911 if available in your area.';

const EMERGENCY_RESPONSE_VOICE =
  'This sounds like a medical emergency. Please call 9-1-1 immediately. ' +
  'Do not wait for a callback. Emergency services are available right now.';

// ─── EmergencyDetector Class ────────────────────────────────────

export class EmergencyDetector {
  constructor() {
    this._triggerCount = 0; // Track how many emergencies detected this session
  }

  /**
   * Scan user input for emergency keywords.
   * DETERMINISTIC — no LLM involvement.
   *
   * @param {string} input - Raw (but sanitized) user input
   * @returns {{ detected: boolean, response: string|null, voiceResponse: string|null, pattern: string|null }}
   */
  scan(input) {
    if (!input || typeof input !== 'string') {
      return { detected: false, response: null, voiceResponse: null, pattern: null };
    }

    const normalized = input.toLowerCase().trim();

    for (const pattern of EMERGENCY_PATTERNS) {
      if (pattern.test(normalized)) {
        this._triggerCount++;
        const matchedPattern = pattern.toString();
        console.warn(`[EmergencyDetector] 🚨 Emergency detected! Pattern: ${matchedPattern}. Input: "${normalized}"`);

        return {
          detected:      true,
          response:      EMERGENCY_RESPONSE,
          voiceResponse: EMERGENCY_RESPONSE_VOICE,
          pattern:       matchedPattern
        };
      }
    }

    return { detected: false, response: null, voiceResponse: null, pattern: null };
  }

  /**
   * Number of emergency detections this session.
   * @returns {number}
   */
  get triggerCount() {
    return this._triggerCount;
  }

  /**
   * Reset for new conversation.
   */
  reset() {
    this._triggerCount = 0;
  }
}

// Singleton export — one detector per session
export const emergencyDetector = new EmergencyDetector();
