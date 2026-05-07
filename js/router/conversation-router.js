/**
 * Conversation Router
 * 
 * Pre-processing gate that runs BEFORE the 6-step pipeline.
 * Classifies all input into one of 6 types — only CORE goes
 * into the main decision engine.
 * 
 * INTENT PRIORITY STACK (highest → lowest):
 *   1. STRONG BUSINESS INTENT — domain signal + high confidence → CORE
 *   2. CORRECTION / PIVOT     — interrupt phrase + domain signal → CORE (not INTERRUPT)
 *   3. GREETING / META        — social or informational
 *   4. FLOW CONTINUATION      — default passthrough → CORE
 *   5. FILLER / NOISE         — lowest priority
 *
 * CONFIG-DRIVEN: Meta phrases and domain tokens come from AppContext config.
 */

import { AppContext } from '../config/loader.js';

export const ROUTE_TYPE = {
  GREETING:     'GREETING',
  NOISE:        'NOISE',
  META:         'META',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  INTERRUPT:    'INTERRUPT',
  CORE:         'CORE'
};

export class ConversationRouter {

  constructor() {
    const config = AppContext.getConfig();

    // ── Greeting triggers ───────────────────────────────────
    this._greetingExact = new Set([
      'hi', 'hello', 'hey', 'hiya', 'yo', 'sup', 'howdy',
      'good morning', 'good afternoon', 'good evening', 'good day',
      'hi there', 'hey there', 'hello there', 'is someone there',
      'is anyone there', 'anyone there', 'is this thing on',
      'are you there', 'you there'
    ]);

    this._greetingPattern = /^(hi+|hey+|hel+o+|howdy|yo+)\b/i;

    // ── Meta triggers (from config — about the system / company) ──
    this._metaPhrases = (config.meta_phrases && config.meta_phrases.length > 0)
      ? [...config.meta_phrases]
      : [
          'who are you', 'what are you', 'are you a bot', 'are you ai',
          'are you human', 'are you real', 'what do you do', 'what can you do',
          'what do you offer', 'what do you provide', 'what services',
          'tell me about yourself', 'how does this work',
          'what is this', 'what is this for', 'how can you help me',
          'who made you', 'who built you'
        ];

    // Remove any company-specific meta phrases that might match the old hardcoded config
    // (e.g., "what is genuine optimum" is now generalized via config)

    // ── Out-of-scope triggers ────────────────────────────────
    this._outOfScopePatterns = [
      /(?:sell|buy|purchase|order|ship|deliver)\s+(?:phone|product|item|car|clothes|shoes|hardware)/i,
      /(?:weather|forecast|temperature|rain|snow)/i,
      /(?:recipe|how to cook|food delivery|order food|what to eat)/i,
      /(?:relationship|dating|married|divorce|breakup)/i,
      /(?:medical advice|doctor|symptoms|diagnosis|medicine|prescription)/i,
      /(?:legal advice|lawyer|attorney|lawsuit|sue me)/i,
      /(?:homework|essay|assignment|exam help|study for)/i,
      /(?:watch|stream|download)\s+(?:movie|film|series|show)/i,
      /(?:football|soccer|cricket|basketball)\s+(?:score|match|game|result)/i,
      /(?:politics|president|government|election|vote)/i,
      /(?:play|gaming|ps5|playstation|xbox|nintendo|fortnite)/i
    ];

    // ── Noise triggers ───────────────────────────────────────
    this._fillerTokens = new Set([
      'uh', 'um', 'uhh', 'umm', 'idk', 'hmm', 'hm', 'ahh',
      'ah', 'oh', 'err', 'erm', 'meh', 'ok', 'okay', 'k',
      'lol', 'haha', 'hehe', 'lmao', 'omg', 'wow', 'nice'
    ]);

    // ── Interrupt triggers ───────────────────────────────────
    this._interruptPhrases = new Set([
      'wait', 'hold on', 'one sec', 'one second', 'scratch that',
      'actually', 'nevermind', 'wait no', 'sorry', 'hang on',
      'give me a sec', 'give me a second', 'my bad', 'just a minute',
      'just a sec', 'give me a moment'
    ]);

    // ── Service Domain keywords (from config) ────────────────
    this._serviceDomainTokens = (config.service_domain_tokens && config.service_domain_tokens.length > 0)
      ? [...config.service_domain_tokens]
      : [
          'business', 'help', 'service', 'solution', 'grow', 'growth',
          'clients', 'customers', 'leads', 'revenue', 'sales'
        ];
  }

  /**
   * Route user input to a classification type.
   * 
   * INTENT PRIORITY STACK:
   *   Priority 1: Strong business intent (domain signal) → CORE immediately
   *   Priority 2: Correction + domain signal → CORE (bypasses interrupt)
   *   Priority 3: Greeting / Meta / Out-of-scope
   *   Priority 4: Interrupt (only if NO domain signal attached)
   *   Priority 5: Pure noise / filler
   *   Priority 6: Default passthrough → CORE
   *
   * @param {string} input - Raw user text
   * @param {object} nlpData - NLP analysis result (can be null for pre-NLP calls)
   * @param {number} unclearStreak - From orchestrator context
   * @returns {{ type: string, confidence: number, reason: string }}
   */
  route(input, nlpData = null, unclearStreak = 0) {
    if (!input || !input.trim()) {
      return { type: ROUTE_TYPE.NOISE, confidence: 1.0, reason: 'empty_input' };
    }

    // Explicit system-level interrupt signal (mid-speech cutoff)
    if (input === '__INTERRUPT__') {
      return { type: ROUTE_TYPE.INTERRUPT, confidence: 1.0, reason: 'system_interrupt_signal' };
    }

    const normalized = input.toLowerCase().trim();
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const wordCount = tokens.length;
    const hasDomain = this._hasDomainSignal(normalized);

    // ═══ PRIORITY 1: STRONG BUSINESS INTENT ═══════════════
    // If input clearly contains business-relevant domain signal
    // AND is long enough to be intentional, fast-track to CORE.
    if (hasDomain && wordCount >= 3) {
      return { type: ROUTE_TYPE.CORE, confidence: 0.9, reason: 'strong_domain_signal' };
    }

    // ═══ PRIORITY 2: CORRECTION WITH INTENT ═══════════════
    // "Actually I need a website" → contains interrupt word + domain signal
    // This must go to CORE, not INTERRUPT, so the pivot is handled properly.
    if (this._isInterrupt(normalized, tokens) && hasDomain) {
      return { type: ROUTE_TYPE.CORE, confidence: 0.9, reason: 'correction_with_intent' };
    }

    // ═══ PRIORITY 3: GREETING ═════════════════════════════
    if (this._isGreeting(normalized, tokens)) {
      return { type: ROUTE_TYPE.GREETING, confidence: 0.95, reason: 'greeting_match' };
    }

    // ═══ PRIORITY 3: META ═════════════════════════════════
    if (this._isMeta(normalized)) {
      return { type: ROUTE_TYPE.META, confidence: 0.9, reason: 'meta_match' };
    }

    // ═══ PRIORITY 3: OUT OF SCOPE ═════════════════════════
    if (this._isOutOfScope(normalized)) {
      return { type: ROUTE_TYPE.OUT_OF_SCOPE, confidence: 0.85, reason: 'out_of_scope_match' };
    }

    // ═══ PRIORITY 4: INTERRUPT (pure pause, no domain signal) ═════
    if (this._isInterrupt(normalized, tokens) && !hasDomain) {
      return { type: ROUTE_TYPE.INTERRUPT, confidence: 0.95, reason: 'interrupt_match' };
    }

    // ═══ PRIORITY 5: NOISE ════════════════════════════════
    // a) Pure filler
    if (tokens.every(t => this._fillerTokens.has(t))) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.95, reason: 'pure_filler' };
    }

    // b) Very short input with no service domain signal
    if (wordCount <= 2 && !hasDomain) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.8, reason: 'short_no_signal' };
    }

    // c) Low NLP confidence AND no domain signal
    if (nlpData && nlpData.confidence && nlpData.confidence.overall < 0.25 && !hasDomain) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.75, reason: 'low_nlp_confidence' };
    }

    // ═══ PRIORITY 6: CORE (default passthrough) ═══════════
    // Has meaningful business signal → route to pipeline
    if (hasDomain) {
      return { type: ROUTE_TYPE.CORE, confidence: 0.85, reason: 'domain_signal' };
    }

    // NLP is confident → route to pipeline
    if (nlpData && nlpData.confidence && nlpData.confidence.overall >= 0.5) {
      return { type: ROUTE_TYPE.CORE, confidence: nlpData.confidence.overall, reason: 'nlp_confident' };
    }

    // Unclear streak escalation — after 2+ noisy turns, treat as NOISE even if ambiguous
    if (unclearStreak >= 2) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.7, reason: 'unclear_streak' };
    }

    // Default: send to pipeline — let the existing fallback handle it
    return { type: ROUTE_TYPE.CORE, confidence: 0.5, reason: 'default_passthrough' };
  }

  // ── Private Classifiers ────────────────────────────────────

  _isGreeting(normalized, tokens) {
    // Exact match
    if (this._greetingExact.has(normalized)) return true;

    // Single token greeting
    if (tokens.length === 1 && this._greetingPattern.test(normalized)) return true;

    // Starts with greeting word + short rest (e.g. "hello! how are you")
    if (tokens.length <= 4 && this._greetingPattern.test(normalized) && !this._hasDomainSignal(normalized)) return true;

    return false;
  }

  _isMeta(normalized) {
    return this._metaPhrases.some(phrase => normalized.includes(phrase));
  }

  _isOutOfScope(normalized) {
    return this._outOfScopePatterns.some(regex => regex.test(normalized));
  }

  _hasDomainSignal(normalized) {
    return this._serviceDomainTokens.some(token => {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      return regex.test(normalized);
    });
  }

  _isInterrupt(normalized, tokens) {
    const cleanedText = normalized.replace(/[^\w\s\']/g, '');
    if (this._interruptPhrases.has(cleanedText)) return true;
    
    // Check if the input starts with an interrupt phrase and is very short
    const cleanedTokens = cleanedText.split(/\s+/).filter(Boolean);
    if (cleanedTokens.length <= 5) {
      const firstTwo = cleanedTokens.slice(0, 2).join(' ');
      if (this._interruptPhrases.has(cleanedTokens[0]) || this._interruptPhrases.has(firstTwo)) {
        return true;
      }
    }
    return false;
  }
}
