/**
 * Router Handlers
 * 
 * Clean, short responses for non-core input types.
 * Every response:
 *   - ≤ 2 sentences
 *   - ≤ 1 guiding question
 *   - redirects toward business context
 * 
 * Uses round-robin selection — no consecutive repetition.
 */

export class RouterHandlers {

  constructor() {

    // ── Greeting Responses ──────────────────────────────────
    this._greetings = [
      "Hi! Welcome to Genuine Optimum. What are you looking to improve in your business?",
      "Hey there! I'm here to help. What's the main challenge you're working on right now?",
      "Hello! Good to have you here. What brings you in today — is there something specific you're trying to solve?",
      "Hey! I help businesses grow through websites, SEO, and automation. What are you working on?",
      "Hi — great timing. What business challenge can I help you tackle today?"
    ];

    // ── Noise / Unclear Responses ───────────────────────────
    this._noise = [
      "I didn't quite catch that — what would you like help with?",
      "Could you share a bit more? I want to make sure I point you in the right direction.",
      "I want to help — what's the main thing you're trying to improve?",
      "Let me make sure I understand you correctly. What are you working on?"
    ];

    // ── Noise Escalation (after 2+ unclear turns) ───────────
    this._noiseEscalated = [
      "Let me simplify — are you looking for help with your business growth?",
      "We specialize in four areas: websites, SEO, AI automation, and app development. Does any of those sound relevant to you?",
      "Happy to help — I just need a bit more to go on. What type of business do you run?"
    ];

    // ── Meta Responses ────────────────────────────────────────
    this._meta = [
      "I'm an AI business consultant for Genuine Optimum. We help businesses grow through websites, SEO, and automation. What are you trying to improve?",
      "I'm here to help with business growth — whether that's building a website, increasing your visibility online, or automating your operations. What's on your mind?",
      "Genuine Optimum helps businesses leverage technology to scale. I identify the right solution for your specific situation. What challenge are you facing?",
      "Think of me as your digital growth advisor. I help with websites, SEO, AI systems, and apps. What area would you like to explore?"
    ];

    // ── Out-of-Scope Responses ────────────────────────────────
    this._outOfScope = [
      "That's outside what I can help with, but we do specialize in business growth systems. What are you looking to improve?",
      "I'm focused on business technology — websites, SEO, and automation. Is there something along those lines I can help with?",
      "That's not our area, but if you're looking to grow your business with better technology, that's exactly what we do. What's the challenge you're facing?",
      "We don't cover that — but we do help businesses get more clients and build better systems. What are you working on?"
    ];

    // ── Round-Robin Counters ─────────────────────────────────
    this._counters = {};
  }

  /**
   * Get the appropriate handler response for a route type.
   * @param {string} routeType - One of: GREETING, NOISE, META, OUT_OF_SCOPE
   * @param {number} unclearStreak - Used to escalate noise responses
   * @returns {string}
   */
  handle(routeType, unclearStreak = 0) {
    switch (routeType) {
      case 'GREETING':
        return this._pick(this._greetings, 'greeting');

      case 'NOISE':
        if (unclearStreak >= 2) {
          return this._pick(this._noiseEscalated, 'noise_escalated');
        }
        return this._pick(this._noise, 'noise');

      case 'META':
        return this._pick(this._meta, 'meta');

      case 'OUT_OF_SCOPE':
        return this._pick(this._outOfScope, 'out_of_scope');

      default:
        return this._pick(this._noise, 'noise_fallback');
    }
  }

  // ── Private: Round-Robin Selector ─────────────────────────

  _pick(pool, key) {
    if (!this._counters[key]) this._counters[key] = 0;
    const idx = this._counters[key] % pool.length;
    this._counters[key]++;
    return pool[idx];
  }
}
