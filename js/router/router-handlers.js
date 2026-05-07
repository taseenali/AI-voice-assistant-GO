/**
 * Router Handlers
 * 
 * Clean, short responses for non-core input types.
 * Every response:
 *   - ≤ 2 sentences
 *   - ≤ 1 guiding question
 *   - redirects toward clinical context
 * 
 * Uses round-robin selection — no consecutive repetition.
 *
 * CONFIG-DRIVEN: All response pools are loaded from AppContext config.
 * Template variables ({{company_name}}, {{service_summary}}) are interpolated at runtime.
 */

import { AppContext } from '../config/loader.js';

export class RouterHandlers {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Build service summary for template interpolation ────
    this._serviceSummary = this._buildServiceSummary(config);

    // ── Greeting Responses (from config) ─────────────────────
    this._greetings = this._interpolatePool(
      config.greeting_responses || [
        "Hi! Welcome to {{company_name}}. How can I assist you with your health today?",
        "Hey there! I'm here to help. What's the main health concern you're working on right now?",
        "Hello! Good to have you here. Are you looking to schedule an appointment or ask a question?",
        "Hi — great timing. What can I help you with today regarding your care?"
      ],
      config
    );

    // ── Noise / Unclear Responses (from config) ──────────────
    this._noise = this._interpolatePool(
      config.noise_responses || [
        "Just to be clear, is there a specific symptom or concern you'd like to address first?",
        "What's the one thing you'd most want to discuss with the doctor?",
        "If you could address one health concern tomorrow, what would it be?",
        "What would you say is the biggest health challenge for you right now?"
      ],
      config
    );

    // ── Noise Escalation (from config) ───────────────
    this._noiseEscalated = this._interpolatePool(
      config.noise_escalated_responses || [
        "Let me simplify — are you looking for help with your medical care?",
        "We specialize in {{service_summary}}. Does any of that sound relevant to you?",
        "Happy to help — I just need a bit more to go on. What kind of care are you looking for?"
      ],
      config
    );

    // ── Meta Responses (from config) ─────────────────────────
    this._meta = this._interpolatePool(
      config.meta_responses || [
        "I'm an AI medical assistant for {{company_name}}. How can I assist you?",
        "I'm here to help with your healthcare needs. What's on your mind?",
        "{{company_name}} provides expert medical care. What health concern are you facing?",
        "Think of me as your health guide. What area would you like to explore?"
      ],
      config
    );

    // ── Out-of-Scope Responses (from config) ─────────────────
    this._outOfScope = this._interpolatePool(
      config.out_of_scope_responses || [
        "That's outside what I can help with. What medical needs are you looking to address?",
        "I'm focused on {{service_summary}}. Is there something along those lines I can help with?",
        "That's not our area, but I'd love to help with your healthcare needs. What's the concern?",
        "We don't cover that — but I can help with {{service_summary}}. What symptoms are you experiencing?"
      ],
      config
    );

    // ── Round-Robin Counters ─────────────────────────────────
    this._counters = {};
  }

  /**
   * Get the appropriate handler response for a route type.
   * @param {string} routeType - One of: GREETING, NOISE, META, OUT_OF_SCOPE, INTERRUPT
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
    if (!pool || pool.length === 0) return "How can I help you?";
    if (!this._counters[key]) this._counters[key] = 0;
    const idx = this._counters[key] % pool.length;
    this._counters[key]++;
    return pool[idx];
  }

  // ── Private: Template Interpolation ───────────────────────

  /**
   * Replace {{company_name}} and {{service_summary}} in a pool of strings.
   */
  _interpolatePool(pool, config) {
    if (!Array.isArray(pool)) return [];
    return pool.map(text => this._interpolate(text, config));
  }

  _interpolate(text, config) {
    if (!text) return text;
    return text
      .replace(/\{\{company_name\}\}/g, config.company_name || 'our team')
      .replace(/\{\{service_summary\}\}/g, this._serviceSummary)
      .replace(/\{\{assistant_name\}\}/g, config.assistant_name || 'Assistant');
  }

  /**
   * Build a human-readable summary of services from config.
   * e.g., "websites, SEO, AI automation, and app development"
   */
  _buildServiceSummary(config) {
    if (!config.services || !Array.isArray(config.services) || config.services.length === 0) {
      return 'medical care';
    }

    const names = config.services.map(s => s.display_name || s.name).filter(Boolean);
    if (names.length === 0) return 'medical care';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;

    const last = names.pop();
    return `${names.join(', ')}, and ${last}`;
  }
}
