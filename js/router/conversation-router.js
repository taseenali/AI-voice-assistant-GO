/**
 * Conversation Router
 * 
 * Pre-processing gate that runs BEFORE the 6-step pipeline.
 * Classifies all input into one of 5 types — only CORE goes
 * into the main decision engine.
 * 
 * Classification order (priority highest → lowest):
 *   1. GREETING
 *   2. META
 *   3. OUT_OF_SCOPE
 *   4. NOISE
 *   5. CORE
 */

export const ROUTE_TYPE = {
  GREETING:     'GREETING',
  NOISE:        'NOISE',
  META:         'META',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  CORE:         'CORE'
};

export class ConversationRouter {

  constructor() {

    // ── Greeting triggers ───────────────────────────────────
    this._greetingExact = new Set([
      'hi', 'hello', 'hey', 'hiya', 'yo', 'sup', 'howdy',
      'good morning', 'good afternoon', 'good evening', 'good day',
      'hi there', 'hey there', 'hello there', 'is someone there',
      'is anyone there', 'anyone there', 'is this thing on',
      'are you there', 'you there'
    ]);

    this._greetingPattern = /^(hi+|hey+|hel+o+|howdy|yo+)\b/i;

    // ── Meta triggers (about the system / company) ──────────
    this._metaPhrases = [
      'who are you', 'what are you', 'are you a bot', 'are you ai',
      'are you human', 'are you real', 'what do you do', 'what can you do',
      'what do you offer', 'what do you provide', 'what services',
      'what is genuine optimum', 'tell me about yourself',
      'tell me about genuine optimum', 'how does this work',
      'what is this', 'what is this for', 'how can you help me',
      'who made you', 'who built you'
    ];

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

    // ── Service Domain keywords (used to confirm CORE) ──────
    this._serviceDomainTokens = [
      'website', 'site', 'seo', 'google', 'ranking', 'traffic',
      'automation', 'ai', 'bot', 'app', 'software', 'marketing',
      'clients', 'customers', 'leads', 'revenue', 'sales', 'grow',
      'growth', 'business', 'agency', 'ads', 'social', 'brand',
      'visibility', 'search', 'conversion', 'funnel', 'analytics',
      'email', 'campaign', 'online', 'digital', 'platform', 'mobile',
      'design', 'develop', 'build', 'create', 'launch', 'scale'
    ];
  }

  /**
   * Route user input to a classification type.
   * @param {string} input - Raw user text
   * @param {object} nlpData - NLP analysis result (can be null for pre-NLP calls)
   * @param {number} unclearStreak - From orchestrator context
   * @returns {{ type: string, confidence: number, reason: string }}
   */
  route(input, nlpData = null, unclearStreak = 0) {
    if (!input || !input.trim()) {
      return { type: ROUTE_TYPE.NOISE, confidence: 1.0, reason: 'empty_input' };
    }

    const normalized = input.toLowerCase().trim();
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const wordCount = tokens.length;

    // ── 1. GREETING ─────────────────────────────────────────
    if (this._isGreeting(normalized, tokens)) {
      return { type: ROUTE_TYPE.GREETING, confidence: 0.95, reason: 'greeting_match' };
    }

    // ── 2. META ─────────────────────────────────────────────
    if (this._isMeta(normalized)) {
      return { type: ROUTE_TYPE.META, confidence: 0.9, reason: 'meta_match' };
    }

    // ── 3. OUT OF SCOPE ──────────────────────────────────────
    if (this._isOutOfScope(normalized)) {
      return { type: ROUTE_TYPE.OUT_OF_SCOPE, confidence: 0.85, reason: 'out_of_scope_match' };
    }

    // ── 4. NOISE ─────────────────────────────────────────────
    // a) Pure filler
    if (tokens.every(t => this._fillerTokens.has(t))) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.95, reason: 'pure_filler' };
    }

    // b) Very short input with no service domain signal
    if (wordCount <= 2 && !this._hasDomainSignal(normalized)) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.8, reason: 'short_no_signal' };
    }

    // c) Low NLP confidence AND no domain signal
    if (nlpData && nlpData.confidence && nlpData.confidence.overall < 0.25 && !this._hasDomainSignal(normalized)) {
      return { type: ROUTE_TYPE.NOISE, confidence: 0.75, reason: 'low_nlp_confidence' };
    }

    // ── 5. CORE ──────────────────────────────────────────────
    // Has meaningful business signal → route to pipeline
    if (this._hasDomainSignal(normalized)) {
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
    return this._serviceDomainTokens.some(token => normalized.includes(token));
  }
}
