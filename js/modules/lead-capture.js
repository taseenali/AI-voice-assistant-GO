/**
 * Lead Capture Module
 * Maps to: 06_lead_capture.md
 *
 * Collects user information gradually, not all at once.
 * Only captures when user shows engagement or interest.
 *
 * Required: Name, Problem
 * Optional: Business, Contact Method, Budget, Timeline
 *
 * Rule: Natural, not robotic. Never ask all at once.
 */

export class LeadCapture {

  constructor() {
    this._leadData = {
      name:          null,
      business:      null,
      goal:          null,
      problem:       null,
      contactMethod: null,
      budget:        null,
      timeline:      null
    };

    this._capturedFields = new Set();
    this._promptCounters = {};

    // ─── Natural Prompts for Each Field ───────────────────
    this._prompts = {
      name: [
        "By the way, can I get your name? Just so I know who I'm speaking with.",
        "Before we go further — what's your name?",
        "I'd love to know who I'm helping. What should I call you?"
      ],
      business: [
        "And what's your business called?",
        "What's the name of your business, if you don't mind?",
        "Could you share your business name?"
      ],
      goal: [
        "What's the main thing you're trying to improve right now?",
        "What's the biggest goal for your business this quarter?",
        "If everything went perfectly, what result would you want to see?"
      ],
      problem: [
        "Just to summarize — what would you say is the main challenge you're looking to solve?",
        "So if you had to describe the core problem in one sentence, what would it be?"
      ],
      timeline: [
        "Is there a timeline you're working with for this?",
        "When are you looking to get started on this?",
        "Do you have a deadline or timeframe in mind?"
      ],
      contactMethod: [
        "What's the best way for our team to follow up with you?",
        "How would you prefer we reach out — phone, email, or WhatsApp?"
      ],
      budget: [
        "Do you have a rough budget range in mind for this?",
        "Have you set aside a budget for this project?"
      ]
    };

    // ─── Capture Order ────────────────────────────────────
    this._captureOrder = ['name', 'goal', 'problem', 'business', 'timeline'];
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get the next field to capture and its prompt
   * @returns {{ field: string, prompt: string } | null}
   */
  getNextCapture() {
    for (const field of this._captureOrder) {
      if (!this._capturedFields.has(field)) {
        const prompts = this._prompts[field];
        if (!this._promptCounters[field]) this._promptCounters[field] = 0;
        const idx = this._promptCounters[field] % prompts.length;
        this._promptCounters[field]++;
        return {
          field,
          prompt: prompts[idx]
        };
      }
    }
    return null; // All fields captured
  }

  /**
   * Store a captured field value
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  capture(field, value) {
    if (value && value.trim()) {
      this._leadData[field] = value.trim();
      this._capturedFields.add(field);
    }
  }

  /**
   * Get all captured lead data
   */
  getData() {
    return { ...this._leadData };
  }

  /**
   * Get completeness as a percentage (0-100)
   */
  getCompleteness() {
    let score = 0;
    if (this._leadData.name)          score += 25;
    if (this._leadData.goal)          score += 15;
    if (this._leadData.problem)       score += 20;
    if (this._leadData.business)      score += 20;
    if (this._leadData.timeline)      score += 10;
    if (this._leadData.contactMethod) score += 10;
    return score;
  }

  /**
   * Check if minimum required data is captured (name + problem)
   */
  hasMinimumData() {
    return !!(this._leadData.name && this._leadData.problem);
  }

  /**
   * Get the current capture field being asked for
   */
  getCurrentField() {
    for (const field of this._captureOrder) {
      if (!this._capturedFields.has(field)) return field;
    }
    return null;
  }

  /**
   * Check if a specific field has been captured
   */
  hasField(field) {
    return this._capturedFields.has(field);
  }

  /**
   * Save lead data to localStorage
   */
  save() {
    const leads = JSON.parse(localStorage.getItem('go_leads') || '[]');
    leads.push({
      ...this._leadData,
      capturedAt: new Date().toISOString(),
      completeness: this.getCompleteness()
    });
    localStorage.setItem('go_leads', JSON.stringify(leads));
  }

  /**
   * Load all saved leads from localStorage
   */
  static loadAll() {
    return JSON.parse(localStorage.getItem('go_leads') || '[]');
  }

  /**
   * Reset capture state
   */
  reset() {
    this._leadData = {
      name: null, business: null, goal: null, 
      tenure: null, problem: null,
      contactMethod: null, budget: null, timeline: null
    };
    this._capturedFields.clear();
  }
}
