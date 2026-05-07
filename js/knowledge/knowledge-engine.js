import { AppContext } from '../config/loader.js';

export class KnowledgeEngine {
  constructor() {
    this.insights = {};

    // ─── INTEGRATION: Load client-specific problem frames as insights ───
    const config = AppContext.getConfig();
    if (config.services) {
      config.services.forEach(svc => {
        if (svc.problem_frames) {
          for (const [key, text] of Object.entries(svc.problem_frames)) {
             const insightKey = `${svc.intent_key}_${key.toUpperCase()}`;
             this.insights[insightKey] = {
               variants: [{ text, tone: "professional", depth: 1 }],
               intent: svc.intent_key,
               triggerTokens: svc.keywords || []
             };
          }
        }
      });
    }

    this.fallbackInsight = config.service_overview || "I'm here to help you coordinate your care. Could you tell me more about what you're experiencing?";
    this._variantCounters = {};
    this._outcomeCounters = {};

    // Standard Outcome Mapping (Medical Focus)
    this.outcomes = {
      CARE: [
        { text: "you get the care and attention you deserve", focus: "care" },
        { text: "we address your symptoms thoroughly and effectively", focus: "treatment" },
        { text: "our medical team can provide you with clear next steps", focus: "guidance" }
      ]
    };
  }

  analyze(nlpData, contextMemory, rawInput, currentDepth = 1) {
    const text = (rawInput || "").toLowerCase();
    let bestMatch = null;

    for (const [key, data] of Object.entries(this.insights)) {
      const matchFound = data.triggerTokens.some(token => text.includes(token));
      if (matchFound) {
        bestMatch = { key, ...data };
        break;
      }
    }

    if (!bestMatch) {
      return {
        insight: this.fallbackInsight,
        outcome: this._getOutcome('CARE'),
        recommendedIntent: null,
        confidence: 0
      };
    }

    // Round-robin variant selection
    const pool = bestMatch.variants;
    if (!this._variantCounters[bestMatch.key]) this._variantCounters[bestMatch.key] = 0;
    const idx = this._variantCounters[bestMatch.key] % pool.length;
    this._variantCounters[bestMatch.key]++;
    const variant = pool[idx];

    return {
      insight: variant.text,
      outcome: this._getOutcome('CARE'),
      metadata: { tone: variant.tone, depth: variant.depth },
      recommendedIntent: bestMatch.intent,
      confidence: 0.85
    };
  }

  _getOutcome(category) {
    const pool = this.outcomes[category] || this.outcomes.CARE;
    if (!this._outcomeCounters[category]) this._outcomeCounters[category] = 0;
    const idx = this._outcomeCounters[category] % pool.length;
    this._outcomeCounters[category]++;
    return pool[idx].text;
  }
}
