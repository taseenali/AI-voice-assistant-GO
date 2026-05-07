/**
 * Personality & Tone Module
 * Controls how the assistant sounds — professional, friendly, confident,
 * consultative. Never robotic, never aggressive, never scripted.
 * 
 * Uses round-robin selection for deterministic, non-repeating phrase rotation.
 * 
 * CONFIG-DRIVEN: Greetings and tone behavior are loaded from AppContext config.
 * No hardcoded company names or business-specific language.
 */

import { AppContext } from '../config/loader.js';

export const TONE_STATES = {
  DEFAULT: "professional",
  EMPATHETIC: "empathetic",
  URGENT: "urgent"
};

export class Personality {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Greeting Pool (from config) ─────────────────────────
    this._greetings = (config.greetings && config.greetings.length > 0)
      ? [...config.greetings]
      : ['Hello! How can I help you today?'];

    // ─── Tone Setting ────────────────────────────────────────
    this._tone = config.tone || 'professional';
    this.activeToneState = TONE_STATES.DEFAULT;
    this.toneAnchor = null;
    this.toneTurnCounter = 0;
    this.turnsSinceLastChange = 3;
    this.minToneDuration = 2;

    // ─── Transition Phrases ─────────────────────────────────
    this._phrases = {
      acknowledge: [
        "I see what you mean.",
        "That makes sense.",
        "I understand.",
        "Got it.",
        "Alright, that's helpful to know.",
        "Thanks for sharing that.",
        "I appreciate you explaining that.",
        "Right, that's a good point.",
        "Okay, that helps me understand.",
        "Interesting — thanks for the context.",
        "That's really helpful.",
        "Makes total sense.",
        "Good to know.",
        "Absolutely.",
        "I hear you."
      ],
      clarify: [
        "Just to make sure I understand —",
        "Let me make sure I've got this right —",
        "To be clear —",
        "Quick question on that —",
        "Just so I'm on the same page —",
        "To make sure I can help properly —"
      ],
      bridge: [
        "Here's something that might help.",
        "Based on what you've shared,",
        "That's actually something we can help with.",
        "This is right in our wheelhouse.",
        "Here's what I'd suggest based on that.",
        "That's a great starting point.",
        "With that in mind,"
      ],
      encourage: [
        "That's a great question.",
        "You're thinking about this the right way.",
        "A lot of businesses face this same challenge.",
        "You're not alone in this — it's more common than you'd think.",
        "That's actually a really smart approach.",
        "The fact that you're looking into this tells me you're serious about growth."
      ],
      redirect: [
        "Perfect — picking up where we were,",
        "Great — coming back to what matters most here,",
        "Good. So continuing on from earlier —",
        "Alright, getting back to the main point —",
        "With that sorted —"
      ],
      softClose: this._buildSoftClosePool(config),
      exit: this._buildExitPool(config)
    };

    // ─── Round-Robin Counters ────────────────────────────────
    this._counters = {};

    // ─── Response Length Limits ──────────────────────────────
    this.MAX_SENTENCES = 3;
  }

  /**
   * Build soft-close pool from config, falling back to generic defaults.
   */
  _buildSoftClosePool(config) {
    if (config.closing_responses && config.closing_responses.soft && config.closing_responses.soft.length > 0) {
      return [...config.closing_responses.soft];
    }
    return [
      "Would you like us to help you with this?",
      "I can arrange a quick consultation if you'd like.",
      "Want me to set something up so our team can dive deeper into this?",
      "Shall we explore this further together?",
      "Does it make sense to take the next step on this?"
    ];
  }

  /**
   * Build exit pool from config, falling back to generic defaults.
   */
  _buildExitPool(config) {
    if (config.closing_responses && config.closing_responses.exit && config.closing_responses.exit.length > 0) {
      return [...config.closing_responses.exit];
    }
    return [
      "No worries at all! Feel free to reach out anytime.",
      "Totally understand. We're here whenever you're ready.",
      "All good! You know where to find us when the time is right.",
      "I appreciate you taking the time. We'll be here when you need us."
    ];
  }

  // ─── Public Methods ───────────────────────────────────────

  /** Get a round-robin greeting */
  getGreeting() {
    return this._roundRobin('_greetings', this._greetings);
  }

  /** Retrieve dynamic phrases filtered via Tone Memory Anchor priorities */
  getPhraseSetByTone(type) {
    if (this.activeToneState === TONE_STATES.URGENT) {
       // Urgent states aggressively skip bridging & cheer phrases natively
       return [];
    }
    if (this.activeToneState === TONE_STATES.EMPATHETIC && type === 'acknowledge') {
       return [
         "I hear you.", 
         "That totally makes sense.", 
         "I completely understand.",
         "Thanks for sharing that.",
         "I know that can be frustrating."
       ];
    }
    return this._phrases[type];
  }

  /** Get a round-robin phrase of a given type prioritizing safe configurations */
  getPhrase(type) {
    const pool = this.getPhraseSetByTone(type);
    if (!pool || pool.length === 0) return '';
    return this._roundRobin(`phrase_${type}`, pool);
  }

  /** Check current active tone state mapping */
  getToneState() {
    return this.activeToneState;
  }

  /**
   * Determine exact tone priority securely.
   */
  _getTonePriority(tone) {
    if (tone === TONE_STATES.URGENT) return 3;
    if (tone === TONE_STATES.EMPATHETIC) return 2;
    return 1;
  }

  /**
   * Fluid tone adaption enforcing anchors, stability ceilings, prioritization rules, and decay.
   */
  updateTone(triggerSignal, reason = "none") {
    this.toneTurnCounter++;
    this.turnsSinceLastChange++;

    if (!triggerSignal) triggerSignal = TONE_STATES.DEFAULT;

    const currentPriority = this._getTonePriority(this.activeToneState);
    const newPriority = this._getTonePriority(triggerSignal);

    let stateChanged = false;

    // Anchor Matrix: Ensure major tone signals dominate
    if (newPriority >= 2) {
      if (!this.toneAnchor || newPriority >= this._getTonePriority(this.toneAnchor)) {
        this.toneAnchor = triggerSignal;
        this.toneTurnCounter = 0;
      }
    }

    // 1. Mandatory Escalation Layer
    if (newPriority > currentPriority) {
      this._commitToneChange(triggerSignal, reason);
      stateChanged = true;
    } 
    // 2. Safe Decay Matrix (Bounded by Anchor expiry & strict stability metrics)
    else if (triggerSignal === TONE_STATES.DEFAULT && this.activeToneState !== TONE_STATES.DEFAULT) {
      if (this.turnsSinceLastChange >= 3 && this.toneTurnCounter >= 2) {
        this.toneAnchor = null;
        this._commitToneChange(TONE_STATES.DEFAULT, "safe decay bounds verified");
        stateChanged = true;
      }
    } 
    // 3. Forced Stability Blocks Oscillation
    else if (triggerSignal !== this.activeToneState && triggerSignal !== TONE_STATES.DEFAULT) {
      if (this.turnsSinceLastChange >= 3) {
        this._commitToneChange(triggerSignal, reason);
        stateChanged = true;
      }
    }

    if (!stateChanged && triggerSignal === this.activeToneState) {
      console.log(`[Tone] Maintained → ${this.activeToneState.toUpperCase()}`);
    }
  }

  _commitToneChange(newState, reason) {
    this.activeToneState = newState;
    this.turnsSinceLastChange = 0;
    console.log(`[Tone] State → ${this.activeToneState.toUpperCase()} (trigger: ${reason})`);
  }

  /** Enforce length limits on strings safely */
  styleResponse(text) {
    if (!text) return text;

    // Trim to max sentences
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0);

    if (sentences.length > this.MAX_SENTENCES) {
      return sentences.slice(0, this.MAX_SENTENCES).join(' ');
    }

    return text;
  }

  /** Build a response with optional acknowledge + body mapped via safe tone architectures */
  compose(body, options = {}) {
    const opts = {
      acknowledge: false,
      bridge: false,
      encourage: false,
      ...options
    };
    
    // TONE ENGINE OVERRIDES
    if (this.activeToneState === TONE_STATES.URGENT) {
      opts.encourage = false; 
      opts.acknowledge = false; 
      opts.bridge = false;
    } else if (this.activeToneState === TONE_STATES.EMPATHETIC) {
      opts.acknowledge = true; // Empathetic anchoring guarantees
    }

    const parts = [];

    // Only add acknowledge prefix if the body doesn't already open with one.
    if (opts.acknowledge && !this._startsWithAck(body)) {
      parts.push(this.getPhrase('acknowledge'));
    }
    if (opts.encourage) parts.push(this.getPhrase('encourage'));
    if (opts.bridge)    parts.push(this.getPhrase('bridge'));
    parts.push(body);

    return this.styleResponse(parts.join(' '));
  }

  /** Check if a string already opens with an acknowledgment-style phrase */
  _startsWithAck(text) {
    if (!text) return false;
    const t = text.toLowerCase().trim();
    const ackStarters = [
      'right,', 'makes sense', 'got it', 'i see', 'exactly', 'understood',
      'okay,', 'ok,', 'sure,', "that's", 'fair enough', 'noted',
      'interesting', 'alright,', 'i understand', 'good to know', 'absolutely',
      'i hear', 'great,', 'perfect,', 'good,', 'yes,', 'indeed', 'of course'
    ];
    return ackStarters.some(s => t.startsWith(s));
  }

  // ─── Private: Deterministic Round-Robin ────────────────────

  _roundRobin(key, pool) {
    if (!this._counters[key]) this._counters[key] = 0;
    const idx = this._counters[key] % pool.length;
    this._counters[key]++;
    return pool[idx];
  }
}
