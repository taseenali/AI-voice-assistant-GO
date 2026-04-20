/**
 * Discovery Engine Module
 * Maps to: 04_discovery_engine.md
 *
 * Understands the user's problem, business context, and urgency.
 * Moves from Vague → Specific → Actionable.
 *
 * Rules:
 *   - Ask 1 question at a time
 *   - Do NOT interrogate
 *   - Keep it conversational
 *
 * Depth Levels:
 *   Level 1: Basic need
 *   Level 2: Business context
 *   Level 3: Pain points
 */

export class DiscoveryEngine {

  constructor() {
    // ─── Question Banks by Depth ──────────────────────────

    this._questions = {
      // Level 1: Open discovery — understand the basic need
      1: [
        "What challenge are you facing right now with your business?",
        "What's the main thing you're looking to solve or improve?",
        "What brought you here today? I'd love to understand what you're working on.",
        "Is there a specific area of your business you'd like to improve?"
      ],

      // Level 2: Business context — understand the environment
      2: [
        "Can you tell me a bit about your business — what do you do?",
        "How are you currently handling this in your business?",
        "Have you tried anything so far to address this?",
        "What does your current setup look like for this?",
        "Who are your typical clients or customers?"
      ],

      // Level 3: Pain points — dig into the real problem
      3: [
        "What's the biggest impact this problem is having on your business right now?",
        "How much time or money do you think this is costing you?",
        "If this were solved tomorrow, what would change for your business?",
        "What would an ideal solution look like for you?"
      ]
    };

    // ─── Context-Specific Follow-ups ──────────────────────

    this._contextQuestions = {
      website: [
        "Do you currently have a website, or would this be your first?",
        "What's the main goal for your website — getting leads, selling products, or showcasing your work?",
        "Is there a timeline you're working with for this?"
      ],
      seo: [
        "How are you currently getting your clients — referrals, online, or something else?",
        "Do you have any idea how you rank on Google right now?",
        "How important is online visibility to your revenue?"
      ],
      ai: [
        "What tasks or processes are taking up the most time in your business?",
        "Have you looked into automation before, or is this new territory for you?",
        "How many people on your team are handling these repetitive tasks?"
      ],
      app: [
        "Tell me more about the idea — what problem would this app solve?",
        "Have you thought about which platforms you'd want it on — mobile, web, or both?",
        "Is this something for your internal team or for your clients?"
      ]
    };

    this._currentDepth    = 0;
    this._questionsAsked  = [];
    this._insightsGained  = [];
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get the next discovery question based on depth and context.
   * @param {string|null} context - Optional context key ('website', 'seo', 'ai', 'app')
   * @param {number} externalDepth - Current depth from orchestrator (1-5)
   * @returns {{ question: string, depth: number }}
   */
  getNextQuestion(context = null, externalDepth = null) {
    // Use external depth if provided (preferred — synced with orchestrator)
    const targetDepth = externalDepth
      ? Math.min(3, Math.max(1, externalDepth))
      : Math.min(3, this._currentDepth + 1);

    // If a specific context is provided, prefer those questions first
    if (context && this._contextQuestions[context]) {
      const available = this._contextQuestions[context]
        .filter(q => !this._questionsAsked.includes(q));
      if (available.length > 0) {
        const question = available[0];
        this._questionsAsked.push(question);
        this._currentDepth = targetDepth;
        return { question, depth: targetDepth };
      }
    }

    // Depth-based questions — try at target depth, fall back to adjacent depths
    for (let d = targetDepth; d >= 1; d--) {
      const pool      = this._questions[d] || [];
      const available = pool.filter(q => !this._questionsAsked.includes(q));
      if (available.length > 0) {
        const question = available[0];
        this._questionsAsked.push(question);
        this._currentDepth = d;
        return { question, depth: d };
      }
    }

    // All questions exhausted — return a generic forward-mover
    return {
      question: "What else can you tell me about the situation? The more context, the better I can help.",
      depth: targetDepth
    };
  }

  /**
   * Record an insight gained from user input
   * @param {string} insight - The insight text
   * @param {string} category - The category (need, context, pain)
   */
  addInsight(insight, category = 'general') {
    this._insightsGained.push({ insight, category, timestamp: Date.now() });
  }

  /**
   * Advance to next depth level
   */
  advanceDepth() {
    this._currentDepth = Math.min(3, this._currentDepth + 1);
  }

  /**
   * Get current discovery depth
   */
  getDepth() {
    return this._currentDepth;
  }

  /**
   * Get all recorded insights
   */
  getInsights() {
    return [...this._insightsGained];
  }

  /**
   * Check if discovery is deep enough to proceed
   * (at least 2 questions asked and depth >= 2)
   */
  isReadyToAdvance() {
    return this._questionsAsked.length >= 2 && this._currentDepth >= 2;
  }

  /**
   * Reset the discovery engine
   */
  reset() {
    this._currentDepth   = 0;
    this._questionsAsked = [];
    this._insightsGained = [];
  }
}
