/**
 * Objection Handler Module
 * Maps to: 08_objection_handling.md
 *
 * Handles resistance, price concerns, uncertainty, and disinterest.
 *
 * Rules:
 *   - Do NOT argue
 *   - Stay calm
 *   - Redirect to value
 */

import { INTENTS } from './intent-detector.js';

export class ObjectionHandler {

  constructor() {
    // ─── Objection Types & Responses ──────────────────────

    this._objections = {
      price: {
        keywords: ['expensive', 'afford', 'cheap', 'budget', 'too much', 'money'],
        phrases: ['how much does it cost', 'what does it cost', "what's the price", 'too expensive', "can't afford", 'out of budget'],
        responses: [
          "I completely understand — cost is a factor. The good news is we accept many insurance plans and find solutions for our patients. The real question is: how soon can we address this to get you feeling better?",
          "That's a fair concern. We find that early intervention often prevents more costly treatments later on. Would it help to understand the typical insurance coverage for this?",
          "I hear you. Rather than thinking of it as a cost, think of it as an investment in your health and well-being. We can always explore the most cost-effective treatment options."
        ]
      },


      uncertainty: {
        keywords: ['not sure', 'think about it', 'maybe', 'need time', 'consider', 'unsure'],
        responses: [
          "That's completely fine — it's a big decision. Would it help if I shared a bit more about how this typically works? No pressure at all.",
          "Totally understand. A lot of our patients had the same feeling before they saw the results. What specific part are you unsure about?",
          "No rush at all. What if we scheduled a quick, no-commitment consultation? That way, you can get all your questions answered before making any decisions."
        ]
      },

      exploring: {
        keywords: ['just looking', 'just checking', 'exploring', 'browsing', 'no commitment'],
        responses: [
          "Absolutely, exploring your options is a great first step! While you're here, is there a particular health concern you've been thinking about?",
          "No problem at all! A lot of our patients started exactly where you are. What's one thing about your health that you wish was better?",
          "That's smart — doing your research first. I'm here to answer any questions and share some insights that might help. What caught your interest?"
        ]
      },

      notInterested: {
        keywords: ['not interested', 'no thanks', 'no need', 'don\'t need', 'pass'],
        responses: [
          "No worries at all! I appreciate you taking the time. If anything changes, we're always here to help.",
          "Completely understand. Thanks for chatting! Feel free to reach out anytime.",
          "All good! I hope I was at least able to give you a sense of what we do. Door's always open."
        ]
      },

      timing: {
        keywords: ['not right now', 'later', 'not ready', 'next month', 'next year', 'eventually'],
        responses: [
          "Timing is important, I get that. Just so we're ready when you are — what timeframe are you thinking?",
          "Makes sense. A lot of patients plan ahead. Want me to keep your details so we can reconnect when you're ready?",
          "No rush! Would it be helpful if we scheduled a brief chat for when the timing is better?"
        ]
      }
    };

    this._pickCounters = {};
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Detect objection type and return appropriate response
   * @param {string} input - User input text
   * @returns {{ type: string, response: string, shouldExit: boolean }}
   */
  handle(input) {
    const normalized = input.toLowerCase().trim();

    for (const [type, config] of Object.entries(this._objections)) {
      const kwMatch = config.keywords.some(kw => normalized.includes(kw));
      const phraseMatch = config.phrases ? config.phrases.some(ph => normalized.includes(ph)) : false;
      if (kwMatch || phraseMatch) {
        return {
          type,
          response: this._pick(config.responses, type),
          shouldExit: type === 'notInterested'
        };
      }
    }

    // Generic objection handling
    return {
      type: 'generic',
      response: "I appreciate you sharing that. Every situation is different, and we always aim to find the best care for you. Would it help to discuss this with our medical team?",
      shouldExit: false
    };
  }

  /**
   * Check if input contains an objection
   * @param {string} input
   * @returns {boolean}
   */
  isObjection(input) {
    const normalized = input.toLowerCase().trim();
    for (const config of Object.values(this._objections)) {
      const kwMatch = config.keywords.some(kw => normalized.includes(kw));
      const phraseMatch = config.phrases ? config.phrases.some(ph => normalized.includes(ph)) : false;
      if (kwMatch || phraseMatch) return true;
    }
    return false;
  }

  // ─── Private ──────────────────────────────────────────────

  _pick(arr, key = 'default') {
    if (!this._pickCounters[key]) this._pickCounters[key] = 0;
    const idx = this._pickCounters[key] % arr.length;
    this._pickCounters[key]++;
    return arr[idx];
  }
}
