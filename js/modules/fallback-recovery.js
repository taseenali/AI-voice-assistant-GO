/**
 * Fallback & Recovery Module
 * Maps to: 09_fallback_recovery.md
 *
 * Handles unknown input, confusion, and irrelevant queries.
 * Tracks confusion count and escalates responses accordingly.
 * Never breaks conversation flow — always recovers smoothly.
 */

import { AppContext } from '../config/loader.js';

export class FallbackRecovery {

  constructor() {
    this._confusionCount = 0;
    this.interruptCount = 0;
    
    // Dynamically build the service summary for recovery prompts
    const config = AppContext.getConfig();
    const services = config.services || [];
    let serviceListStr = "our core services";
    if (services.length > 0) {
      const names = services.map(s => (s.display_name || s.name || 'service').toLowerCase());
      if (names.length === 1) serviceListStr = names[0];
      else if (names.length === 2) serviceListStr = `${names[0]} and ${names[1]}`;
      else serviceListStr = `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
    }

    // ─── Response Pools by Escalation Level ───────────────
    this._responses = {
      // Level 0: First confusion — gentle clarification
      gentle: [
        "I didn't quite catch that — could you tell me a bit more about what you're looking for?",
        "I want to make sure I understand you correctly. Could you rephrase that for me?",
        "Hmm, I'm not sure I followed. Are you looking for help with a specific health concern or a question about our clinic?",
        "Could you clarify that? I want to make sure I point you in the right direction."
      ],

      // Level 1: Second confusion — guided redirect
      guided: [
        "Let me help narrow things down. Are you looking to schedule a checkup, dental care, or do you have a specific medical question?",
        "No worries! Let me ask this differently — what's the main reason for your visit today?",
        "I want to help — could you tell me what symptoms you're experiencing or what kind of care you're looking for?"
      ],

      // Level 2: Third confusion — simplified options
      simplified: [
        `Let me make this simple. We help patients with services like ${serviceListStr}. Which one sounds closest to what you need?`,
        `I think we might be going in circles! Here's what we do best: ${serviceListStr}. Does any of that sound relevant to you?`
      ],

      // Level 3+: Offer human handoff
      escalated: [
        "I think it might be best to connect you with our scheduling team who can help you directly. Would you like to arrange a quick call?",
        "I appreciate your patience! I think a short conversation with one of our staff members would be more helpful. Want me to set that up?"
      ]
    };

    // ─── Redirect Responses (for irrelevant topics) ───────
    this._redirects = [
      "That's an interesting question! But let me steer us back — are you looking for any help with your medical care?",
      "I appreciate the thought! My focus is on helping you with healthcare needs though. Is there a health concern you're facing that I might be able to help with?",
      `Good question, but that's a bit outside my area! I specialize in ${serviceListStr}. Is there something along those lines I can help with?`
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
   * Generates extremely concise interrupt acknowledgement.
   * Tracks interrupt fatigue to throttle system verbosity downstream.
   */
  getInterruptResponse() {
    this.interruptCount++;
    
    const config = AppContext.getConfig();
    const pools = config.interrupt_phrases || [
      "Got it — go ahead.",
      "I'm listening.",
      "Go ahead.",
      "What were you thinking?",
      "Take your time."
    ];

    return {
      response: pools[(this.interruptCount - 1) % pools.length],
      interruptCount: this.interruptCount
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
