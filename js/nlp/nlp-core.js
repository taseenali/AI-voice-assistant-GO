import { preprocess } from './nlp-preprocess.js';
import { normalizeSemantics } from './nlp-semantic.js';
import { extractSignals } from './nlp-extractor.js';
import { detectIntent } from './nlp-intent.js';
import { evaluateUser } from './nlp-user-model.js';
import { scoreConfidence } from './nlp-confidence.js';
import { NLPTemporal } from './nlp-temporal.js';
import { BehaviorEngine } from './nlp-behavior.js';

export class NLPEngine {
  constructor() {
    this.temporal = new NLPTemporal();
  }

  analyze(input, contextMemory) {
    if (!input || !input.trim()) return null;

    const { tokens, cleanedText } = preprocess(input);
    const normalizedText = normalizeSemantics(cleanedText);
    
    // 1. Unpack Signals (with exactness grades)
    const ext = extractSignals(cleanedText, normalizedText);
    
    // 2. Discover Intent (now parsing Ext signals for priority)
    const intentData = detectIntent(tokens, normalizedText, ext);

    // 3. User Tone Model
    const userType = evaluateUser(tokens, normalizedText);

    // 4. Confidence Mapping (now contextual)
    const confidence = scoreConfidence(ext, intentData, contextMemory);

    // 5. Temporal Reasoning (Multi-turn stabilization)
    const temporalData = this.temporal.process({
      intent: intentData.primaryIntent,
      intentStrength: confidence.intent > 0.7 ? "high" : confidence.intent > 0.4 ? "moderate" : "weak",
      confidence,
      userType
    }, contextMemory);

    // 6. Behavior Strategy Mapping
    const strategy = BehaviorEngine.getStrategy(temporalData.userProfile);

    // Return the aggregated NLP snapshot
    return {
      intent: intentData.primaryIntent,
      secondaryIntent: intentData.secondaryIntent,
      stableIntent: temporalData.stableIntent,
      confidenceTrend: temporalData.confidenceTrend,
      contradiction: temporalData.contradiction,
      pivotAcknowledgment: temporalData.pivotAcknowledgment,
      userProfile: temporalData.userProfile,
      strategy,
      intentStrength: confidence.intent > 0.7 ? "high" : confidence.intent > 0.4 ? "moderate" : "weak",
      business: ext.business,
      goal: ext.goal,
      problem: ext.problem,
      urgency: ext.urgency,
      growth_outcome: ext.growth_outcome,
      tenure: ext.tenure,
      userType,
      multiIntents: intentData,
      confidence,
      quality: {
        chars: input.length,
        words: tokens.length,
        detail: input.length >= 80 || tokens.length >= 15 ? 'high' :
                input.length >= 25 || tokens.length >= 5  ? 'medium' : 'low'
      }
    };
  }
}
