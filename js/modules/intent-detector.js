/**
 * Intent Detection Module
 * Maps to: 02_intent_detection.md
 *
 * Detects user intent via keyword matching with weighted confidence scoring.
 * Returns intent type, strength, urgency, and matched keywords.
 *
 * CONFIG-DRIVEN: Service intents (keywords + phrases) are loaded from config.services.
 * Generic intents (GENERAL_INQUIRY, LOW_INTENT, OBJECTION, POSITIVE, NEGATIVE)
 * remain engine-level — they are not clinical-specific.
 */

import { AppContext } from '../config/loader.js';

// ─── Generic (engine-level) Intent Constants ──────────────────
export const INTENTS = {
  GENERAL_INQUIRY:  'GENERAL_INQUIRY',
  LOW_INTENT:       'LOW_INTENT',
  OBJECTION:        'OBJECTION',
  POSITIVE:         'POSITIVE',
  NEGATIVE:         'NEGATIVE',
  UNKNOWN:          'UNKNOWN'
};

export class IntentDetector {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Build Intent Config from client services ────────────
    this._intentConfig = {};
    this._serviceIntentKeys = new Set();

    // Inject service intents from config
    if (config.services && Array.isArray(config.services)) {
      for (const svc of config.services) {
        const key = svc.intent_key;
        this._serviceIntentKeys.add(key);

        // Register the intent key as a constant for external references
        INTENTS[key] = key;

        this._intentConfig[key] = {
          keywords: svc.keywords || [],
          phrases:  svc.phrases || [],
          weight:   1.0
        };
      }
    }

    // ─── Generic Intents (Engine-level, NOT config-specific) ─
    this._intentConfig[INTENTS.GENERAL_INQUIRY] = {
      keywords: [
        'services', 'help', 'options', 'care', 'clinic', 'medical', 'health',
        'appointment', 'doctor'
      ],
      phrases: [
        'what do you do', 'how can you help', 'what can you do', 'what services',
        'how does this work', 'medical help', 'need a doctor'
      ],
      weight: 0.8
    };

    this._intentConfig[INTENTS.LOW_INTENT] = {
      keywords: ['browsing', 'curious', 'exploring'],
      phrases: [
        'just checking', 'just looking', 'just browsing',
        'just curious', 'not sure yet', 'looking around'
      ],
      weight: 0.5
    };

    this._intentConfig[INTENTS.OBJECTION] = {
      keywords: [
        'expensive', 'cost', 'price', 'insurance', 'afford',
        'too much'
      ],
      phrases: [
        'too expensive', 'how much', 'what does it cost',
        'not sure about this', 'think about it', 'maybe later',
        'not interested', 'no thanks', 'don\'t need',
        'can\'t afford', 'too much money', 'not right now',
        'not ready', 'do you take insurance'
      ],
      weight: 0.9
    };

    this._intentConfig[INTENTS.POSITIVE] = {
      keywords: [
        'yes', 'yeah', 'sure', 'absolutely', 'definitely',
        'great', 'perfect', 'awesome', 'sounds good', 'interested',
        'let\'s do it', 'okay', 'ok', 'please', 'go ahead'
      ],
      phrases: [
        'that sounds good', 'i\'d like that', 'let\'s do it',
        'sign me up', 'i\'m interested', 'sounds great',
        'yes please', 'let\'s go', 'i want that', 'go for it'
      ],
      weight: 0.85
    };

    this._intentConfig[INTENTS.NEGATIVE] = {
      keywords: [
        'no', 'nope', 'nah', 'not really', 'don\'t'
      ],
      phrases: [
        'no thanks', 'i\'m good', 'not right now',
        'maybe later', 'not interested', 'no need',
        'i don\'t think so', 'not for me'
      ],
      weight: 0.85
    };

    // ─── Urgency Keywords ─────────────────────────────────
    this._urgencyKeywords = {
      high:   ['urgent', 'asap', 'immediately', 'right away', 'need now', 'deadline', 'rush', 'emergency', 'today'],
      medium: ['soon', 'this month', 'this week', 'planning', 'looking to', 'want to start', 'ready to'],
      low:    ['eventually', 'someday', 'just exploring', 'no rush', 'not urgent', 'down the road', 'future']
    };
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get the set of service intent keys (from config).
   * Used by the orchestrator to distinguish service intents from generic ones.
   * @returns {Set<string>}
   */
  getServiceIntentKeys() {
    return new Set(this._serviceIntentKeys);
  }

  /**
   * Detect intent from user input.
   * @param {string} input - Raw user input text
   * @returns {{ intent: string, confidence: number, keywords: string[], urgency: string, intentStrength: string }}
   */
  detect(input) {
    if (!input || typeof input !== 'string') {
      return this._unknownResult();
    }

    const normalized = input.toLowerCase().trim();

    // Score each intent
    const scores = [];
    for (const [intent, config] of Object.entries(this._intentConfig)) {
      const result = this._scoreIntent(normalized, config);
      if (result.score > 0) {
        scores.push({ intent, ...result, weight: config.weight });
      }
    }

    // Sort by weighted score
    scores.sort((a, b) => (b.score * b.weight) - (a.score * a.weight));

    // No matches
    if (scores.length === 0) {
      return { ...this._unknownResult(), urgency: this._detectUrgency(normalized) };
    }

    const best = scores[0];
    const confidence = Math.min(1.0, best.score * best.weight);

    return {
      intent:         best.intent,
      confidence:     confidence,
      keywords:       best.matched,
      urgency:        this._detectUrgency(normalized),
      intentStrength: confidence > 0.3 ? 'strong' : confidence > 0.15 ? 'moderate' : 'weak',
      allIntents:     scores.map(s => ({ intent: s.intent, confidence: Math.min(1.0, s.score * s.weight) }))
    };
  }

  /**
   * Quick check if input is a positive/agreement response
   */
  isPositive(input) {
    const result = this.detect(input);
    return result.intent === INTENTS.POSITIVE;
  }

  /**
   * Quick check if input is a negative/decline response
   */
  isNegative(input) {
    const result = this.detect(input);
    return result.intent === INTENTS.NEGATIVE;
  }

  // ─── Private ──────────────────────────────────────────────

  _scoreIntent(input, config) {
    let score   = 0;
    const matched = [];

    // Phrase matching (higher value — more specific)
    for (const phrase of (config.phrases || [])) {
      if (input.includes(phrase)) {
        score += 0.4;
        matched.push(phrase);
      }
    }

    // Keyword matching
    for (const kw of (config.keywords || [])) {
      // Word boundary check for short keywords to avoid false matches
      if (kw.length <= 3) {
        const regex = new RegExp(`\\b${this._escapeRegex(kw)}\\b`, 'i');
        if (regex.test(input)) {
          score += 0.15;
          matched.push(kw);
        }
      } else if (input.includes(kw)) {
        score += 0.15;
        matched.push(kw);
      }
    }

    return { score, matched };
  }

  _detectUrgency(input) {
    for (const [level, keywords] of Object.entries(this._urgencyKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        return level;
      }
    }
    return 'medium';
  }

  _unknownResult() {
    return {
      intent:         INTENTS.UNKNOWN,
      confidence:     0,
      keywords:       [],
      urgency:        'medium',
      intentStrength: 'weak',
      allIntents:     []
    };
  }

  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
