/**
 * Fallback & Recovery Module
 * Maps to: 09_fallback_recovery.md
 *
 * Handles unknown input, confusion, and irrelevant queries.
 * Tracks confusion count and escalates responses accordingly.
 * Never breaks conversation flow — always recovers smoothly.
 */

export class FallbackRecovery {

  constructor() {
    this._confusionCount = 0;

    // ─── Response Pools by Escalation Level ───────────────
    this._responses = {
      // Level 0: First confusion — gentle clarification
      gentle: [
        "I didn't quite catch that — could you tell me a bit more about what you're looking for?",
        "I want to make sure I understand you correctly. Could you rephrase that for me?",
        "Hmm, I'm not sure I followed. Are you looking for help with a specific business challenge?",
        "Could you clarify that? I want to make sure I point you in the right direction."
      ],

      // Level 1: Second confusion — guided redirect
      guided: [
        "Let me help narrow things down. Are you looking for help with a website, marketing, automation, or an app?",
        "No worries! Let me ask this differently — what's the biggest challenge your business is facing right now?",
        "I want to help — could you tell me what kind of business you're running and what problem you'd like to solve?"
      ],

      // Level 2: Third confusion — simplified options
      simplified: [
        "Let me make this simple. We help businesses with four main things: building websites, getting more clients through search, setting up automation, and building apps. Which one sounds closest to what you need?",
        "I think we might be going in circles! Here's what we do best: websites, SEO, AI automation, and app development. Does any of that sound relevant to you?"
      ],

      // Level 3+: Offer human handoff
      escalated: [
        "I think it might be best to connect you with someone from our team who can help you directly. Would you like to arrange a quick call?",
        "I appreciate your patience! I think a short conversation with one of our consultants would be more helpful. Want me to set that up?"
      ]
    };

    // ─── Redirect Responses (for irrelevant topics) ───────
    this._redirects = [
      "That's an interesting question! But let me steer us back — are you looking for any help growing your business with technology?",
      "I appreciate the thought! My focus is on helping you with business solutions though. Is there a challenge you're facing that I might be able to help with?",
      "Good question, but that's a bit outside my area! I specialize in web, marketing, AI, and app solutions. Is there something along those lines I can help with?"
    ];
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get a fallback response based on current confusion level.
   * @returns {{ response: string, level: string, shouldEscalate: boolean }}
   */
  getResponse() {
    this._confusionCount++;

    let pool;
    let level;
    let shouldEscalate = false;

    if (this._confusionCount <= 1) {
      pool  = this._responses.gentle;
      level = 'gentle';
    } else if (this._confusionCount === 2) {
      pool  = this._responses.guided;
      level = 'guided';
    } else if (this._confusionCount === 3) {
      pool  = this._responses.simplified;
      level = 'simplified';
    } else {
      pool  = this._responses.escalated;
      level = 'escalated';
      shouldEscalate = true;
    }

    return {
      response:       this._pick(pool),
      level,
      shouldEscalate,
      confusionCount: this._confusionCount
    };
  }

  /**
   * Get a redirect response for irrelevant input.
   */
  getRedirect() {
    return this._pick(this._redirects);
  }

  /**
   * Reset confusion counter (call when user provides clear input).
   */
  reset() {
    this._confusionCount = 0;
  }

  /**
   * Get current confusion count.
   */
  getConfusionCount() {
    return this._confusionCount;
  }

  // ─── Private ──────────────────────────────────────────────

  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
