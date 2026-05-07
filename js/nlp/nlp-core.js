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
      intentStrength: (confidence.intent * 0.4) + (confidence.problem * 0.3) + (confidence.care_goal * 0.15) + (confidence.medical_practice * 0.15) > 0.4 ? "moderate" : "weak",
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
      intentStrength: (() => {
        let densityScore = 0;
        if (ext.medical_practice) densityScore += 0.1;
        if (ext.care_outcome) densityScore += 0.15;
        if (ext.care_goal) densityScore += 0.1;
        if (ext.problem) densityScore += 0.1;
        if (ext.urgency && ext.urgency.type !== 'weak') densityScore += 0.1;
        return densityScore > 0.3 ? "high" : densityScore > 0.1 ? "moderate" : "weak";
      })(),
      medical_practice: ext.medical_practice,
      care_goal: ext.care_goal,
      problem: ext.problem,
      urgency: ext.urgency,
      care_outcome: ext.care_outcome,
      patient_history: ext.patient_history,
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
