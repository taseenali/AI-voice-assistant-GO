/**
 * Discovery Engine Module
 * Maps to: 04_discovery_engine.md
 *
 * Understands the user's health concern, clinical context, and urgency.
 * Moves from Vague → Specific → Actionable.
 *
 * Rules:
 *   - Ask 1 question at a time
 *   - Do NOT interrogate
 *   - Keep it conversational
 *
 * Depth Levels:
 *   Level 1: Basic health need
 *   Level 2: Clinical context
 *   Level 3: Severity & Pain points
 *
 * CONFIG-DRIVEN: Context-specific questions are loaded from config.services[].discovery_questions.
 * Depth-based generic questions remain engine-level (they are universal).
 */

import { AppContext } from '../config/loader.js';

export class DiscoveryEngine {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Question Banks by Depth (engine-level — universal) ──

    this._questions = {
      // Level 1: Open discovery — understand the medical need
      1: [
        "What brings you in to see us today?",
        "How can I help you with your health concerns today?",
        "Are you experiencing any specific symptoms you'd like to discuss?",
        "Is this for a new health issue or a follow-up on an existing one?"
      ],

      // Level 2: Clinical context — understand the situation
      2: [
        "How long has this been bothering you?",
        "Have you seen a doctor about this before?",
        "Are you currently taking any medications for this?",
        "Does anything make the symptoms better or worse?",
        "Have you had any similar issues in the past?"
      ],

      // Level 3: Severity — dig into the impact
      3: [
        "On a scale of 1 to 10, how would you rate your discomfort right now?",
        "Is this affecting your daily activities or sleep?",
        "Are you experiencing any other related symptoms, like a fever or dizziness?",
        "What are you hoping to achieve with today's visit?"
      ]
    };

    // ─── Context-Specific Follow-ups (from config) ──────────
    this._contextQuestions = {};

    if (config.services && Array.isArray(config.services)) {
      config.services.forEach((svc) => {
        const ctxKey = svc.intent_key.toLowerCase();
        if (svc.discovery_questions && svc.discovery_questions.length > 0) {
          this._contextQuestions[ctxKey] = [...svc.discovery_questions];
        }
      });
    }

    this._currentDepth    = 0;
    this._questionsAsked  = [];
    this._insightsGained  = [];
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get the next discovery question based on depth and context.
   * @param {string|null} context - Optional context key ('website', 'seo', 'ai', 'app', or any custom key)
   * @param {number} externalDepth - Current depth from orchestrator (1-5)
   * @param {MemorySynthesis|null} memory - The memory layer instance
   * @returns {{ question: string, depth: number }}
   */
  getNextQuestion(context = null, externalDepth = null, memory = null) {
    // Use external depth if provided (preferred — synced with orchestrator)
    const targetDepth = externalDepth
      ? Math.min(3, Math.max(1, externalDepth))
      : Math.min(3, this._currentDepth + 1);

    // If memory proves we already know core entities securely, skip basic depth questions
    let skipLevel1 = false;
    let skipLevel2 = false;
    
    if (memory) {
      const probNode = memory.getEntityWithMeta('reason_for_visit');
      const practiceNode = memory.getEntityWithMeta('medical_practice');
      if (probNode && probNode.confidence >= 0.6) skipLevel1 = true;
      if (practiceNode && practiceNode.confidence >= 0.6) skipLevel2 = true;
    }

    let effectiveTargetDepth = targetDepth;
    
    if (effectiveTargetDepth === 1 && skipLevel1) effectiveTargetDepth = 2;
    if (effectiveTargetDepth === 2 && skipLevel2) effectiveTargetDepth = 3;

    // If a specific context is provided, prefer those questions first
    if (context && this._contextQuestions[context]) {
      const available = this._contextQuestions[context]
        .filter(q => !this._questionsAsked.includes(q));
      if (available.length > 0) {
        const question = available[0];
        this._questionsAsked.push(question);
        this._currentDepth = effectiveTargetDepth;
        return { question, depth: effectiveTargetDepth };
      }
    }

    // Depth-based questions — try at target depth, fall back to adjacent depths
    for (let d = effectiveTargetDepth; d >= 1; d--) {
      // Respect memory skips
      if (d === 1 && skipLevel1) continue;
      if (d === 2 && skipLevel2) continue;

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
      depth: effectiveTargetDepth
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
