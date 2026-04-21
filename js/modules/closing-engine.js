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
 *
 * CONFIG-DRIVEN: All closing responses come from config.closing_responses.
 * Calendar URL is injected from config.calendar_url.
 */

import { AppContext } from '../config/loader.js';

export class ClosingEngine {

  constructor() {
    const config = AppContext.getConfig();
    const closingConfig = config.closing_responses || {};

    // ─── Soft Close Responses (from config) ──────────────
    this._softCloses = (closingConfig.soft && closingConfig.soft.length > 0)
      ? [...closingConfig.soft]
      : [
          "Would you like to take this forward? I can arrange a quick consultation to discuss specifics.",
          "This sounds like something we can definitely help with. Would you like us to look into this for you?",
          "I think there's a real opportunity here. Want me to set up a quick call so we can map out a plan?",
          "Based on everything you've shared, I'm confident we can make a real difference. Shall I get the ball rolling?"
        ];

    // ─── Direct Close Responses (from config) ────────────
    this._directCloses = (closingConfig.direct && closingConfig.direct.length > 0)
      ? [...closingConfig.direct]
      : [
          "Let's get you started. I'll pass your details to our team and they'll reach out to set up next steps.",
          "Great — let's make this happen. Our team will follow up with a tailored plan for you.",
          "Perfect. I'll set everything in motion. You'll hear from our team very soon."
        ];

    // ─── Confirmation Follow-ups (from config) ───────────
    this._confirmations = (closingConfig.confirmations && closingConfig.confirmations.length > 0)
      ? [...closingConfig.confirmations]
      : [
          "Excellent! We'll take great care of this. Is there anything else you'd like to add before I pass this along?",
          "Wonderful! You're in good hands. Any final questions or details you'd like to share?",
          "Brilliant! Our team will reach out shortly. Anything else on your mind?"
        ];

    // ─── Polite Exit (from config) ───────────────────────
    this._exits = (closingConfig.exit && closingConfig.exit.length > 0)
      ? [...closingConfig.exit]
      : [
          "No worries at all! Feel free to reach out anytime you're ready. We'll be here.",
          "Totally understand — no pressure at all. Whenever you'd like to revisit this, just reach out.",
          "All good! Thanks for the conversation. You know where to find us when the time is right.",
          "I appreciate you taking the time to chat. Whenever you're ready, we'd love to help."
        ];

    // ─── Calendar URL (from config) ──────────────────────
    this._calendarUrl = config.calendar_url || '';

    this._pickCounters = {};
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get a closing response based on engagement level.
   * If a calendar URL is configured, appends it to direct closes.
   * @param {string} engagementLevel - 'high', 'medium', 'low'
   * @returns {{ response: string, type: string }}
   */
  getClose(engagementLevel) {
    if (engagementLevel === 'high') {
      let response = this._pick(this._directCloses, 'direct');
      if (this._calendarUrl) {
        response += ` You can also book directly here: ${this._calendarUrl}`;
      }
      return { response, type: 'direct' };
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
    let response = this._pick(this._confirmations, 'confirm');
    if (this._calendarUrl) {
      response += ` You can also book a time here: ${this._calendarUrl}`;
    }
    return response;
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
    if (!arr || arr.length === 0) return "Would you like to proceed?";
    if (!this._pickCounters[key]) this._pickCounters[key] = 0;
    const idx = this._pickCounters[key] % arr.length;
    this._pickCounters[key]++;
    return arr[idx];
  }
}
