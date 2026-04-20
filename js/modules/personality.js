/**
 * Personality & Tone Module
 * Controls how the assistant sounds — professional, friendly, confident,
 * consultative. Never robotic, never aggressive, never scripted.
 * 
 * Uses round-robin selection for deterministic, non-repeating phrase rotation.
 */

export class Personality {

  constructor() {
    // ─── Greeting Pool ──────────────────────────────────────
    this._greetings = [
      "Hey there! Welcome to Genuine Optimum. I help businesses find the right tech solutions to grow. What brings you here today?",
      "Hi! Thanks for reaching out to Genuine Optimum. I'd love to understand what you're looking for — what's on your mind?",
      "Hello! Welcome to Genuine Optimum. We help businesses leverage technology to scale. What challenge can I help you with today?",
      "Hey! Great to have you here. I'm with Genuine Optimum — we help businesses solve real problems with smart technology. What are you working on right now?"
    ];

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
      softClose: [
        "Would you like us to help you with this?",
        "I can arrange a quick consultation if you'd like.",
        "Want me to set something up so our team can dive deeper into this?",
        "Shall we explore this further together?",
        "I'd love to show you how this could work specifically for your business.",
        "Want me to put together a quick plan for you?",
        "Does it make sense to take the next step on this?"
      ],
      exit: [
        "No worries at all! Feel free to reach out anytime.",
        "Totally understand. We're here whenever you're ready.",
        "All good! You know where to find us when the time is right.",
        "I appreciate you taking the time. We'll be here when you need us."
      ]
    };

    // ─── Round-Robin Counters ────────────────────────────────
    this._counters = {};

    // ─── Response Length Limits ──────────────────────────────
    this.MAX_SENTENCES = 4;
  }

  // ─── Public Methods ───────────────────────────────────────

  /** Get a round-robin greeting */
  getGreeting() {
    return this._roundRobin('_greetings', this._greetings);
  }

  /** Get a round-robin phrase of a given type */
  getPhrase(type) {
    const pool = this._phrases[type];
    if (!pool) return '';
    return this._roundRobin(`phrase_${type}`, pool);
  }

  /** Enforce tone rules on a response string */
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

  /** Build a response with optional acknowledge + body */
  compose(body, { acknowledge = false, bridge = false, encourage = false } = {}) {
    const parts = [];
    if (acknowledge) parts.push(this.getPhrase('acknowledge'));
    if (encourage)   parts.push(this.getPhrase('encourage'));
    if (bridge)      parts.push(this.getPhrase('bridge'));
    parts.push(body);

    return this.styleResponse(parts.join(' '));
  }

  // ─── Private: Deterministic Round-Robin ────────────────────

  _roundRobin(key, pool) {
    if (!this._counters[key]) this._counters[key] = 0;
    const idx = this._counters[key] % pool.length;
    this._counters[key]++;
    return pool[idx];
  }
}
