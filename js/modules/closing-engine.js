/**
 * Closing Engine Module
 * Maps to: 07_closing_engine.md
 *
 * Moves the user toward a clear next step:
 *   - Booking consultation
 *   - Requesting callback
 *   - WhatsApp follow-up
 *
 * Close types: Soft Close, Direct Close
 *
 * Rules:
 *   - Never force a sale
 *   - Only close after value is established and problem is clear
 *   - Guide naturally
 */

export class ClosingEngine {

  constructor() {
    // ─── Soft Close Responses ─────────────────────────────
    this._softCloses = [
      "Would you like to take this forward? I can arrange a quick consultation with our team to discuss specifics.",
      "This sounds like something we can definitely help with. Would you like us to look into this for you?",
      "I think there's a real opportunity here. Want me to set up a quick call so we can map out a plan?",
      "Based on everything you've shared, I'm confident we can make a real difference. Shall I get the ball rolling?"
    ];

    // ─── Direct Close Responses ───────────────────────────
    this._directCloses = [
      "Let's get you started. I'll pass your details to our team and they'll reach out to set up next steps.",
      "Great — let's make this happen. Our team will follow up with a tailored plan for you.",
      "Perfect. I'll set everything in motion. You'll hear from our team very soon."
    ];

    // ─── Confirmation Follow-ups ──────────────────────────
    this._confirmations = [
      "Excellent! We'll take great care of this. Is there anything else you'd like to add before I pass this along?",
      "Wonderful! You're in good hands. Any final questions or details you'd like to share?",
      "Brilliant! Our team will reach out shortly. Anything else on your mind?"
    ];

    // ─── Polite Exit (user declines) ──────────────────────
    this._exits = [
      "No worries at all! Feel free to reach out anytime you're ready. We'll be here.",
      "Totally understand — no pressure at all. Whenever you'd like to revisit this, just reach out.",
      "All good! Thanks for the conversation. You know where to find us when the time is right.",
      "I appreciate you taking the time to chat. Whenever you're ready, we'd love to help."
    ];

    this._pickCounters = {};
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get a closing response based on engagement level
   * @param {string} engagementLevel - 'high', 'medium', 'low'
   * @returns {{ response: string, type: string }}
   */
  getClose(engagementLevel) {
    if (engagementLevel === 'high') {
      return {
        response: this._pick(this._directCloses, 'direct'),
        type: 'direct'
      };
    }

    return {
      response: this._pick(this._softCloses, 'soft'),
      type: 'soft'
    };
  }

  /**
   * Get a confirmation response after user agrees to proceed
   */
  getConfirmation() {
    return this._pick(this._confirmations, 'confirm');
  }

  /**
   * Get a polite exit response when user declines
   */
  getExit() {
    return this._pick(this._exits, 'exit');
  }

  /**
   * Determine if we should attempt a close based on context
   * @param {object} context - Conversation context
   * @returns {boolean}
   */
  shouldClose(context) {
    return (
      context.engagementScore >= 60 &&
      context.flowStep >= 2 &&
      context.intent !== null
    );
  }

  // ─── Private ──────────────────────────────────────────────

  _pick(arr, key = 'default') {
    if (!this._pickCounters[key]) this._pickCounters[key] = 0;
    const idx = this._pickCounters[key] % arr.length;
    this._pickCounters[key]++;
    return arr[idx];
  }
}
