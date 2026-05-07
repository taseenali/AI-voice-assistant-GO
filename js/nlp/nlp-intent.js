/**
 * NLP Intent Detection — Keyword + Pattern Scoring
 * 
 * This module provides a secondary intent scoring layer used by the NLP pipeline.
 * It uses generic intent categories that work regardless of which services are configured.
 * 
 * Config-compatible: Does NOT reference service-specific INTENTS constants.
 * Instead, it returns generic service categories that the IntentDetector can map.
 */

import { INTENTS } from '../modules/intent-detector.js';

export const INTENT_RELATIONS = {
  FLOW_SERVICE: "primary",
  META_PRICING: "dependent",
  CONFIRMATION: "override",
  INTERRUPTION: "interrupt"
};

export function detectIntent(tokens, normalizedText, extracted = {}) {
  // Use generic categories that are always present in INTENTS
  const scores = {};
  const positions = {};
  
  // Initialize scores for known generic intents (always exist)
  scores[INTENTS.GENERAL_INQUIRY] = 0;
  scores[INTENTS.POSITIVE]        = 0;
  scores[INTENTS.NEGATIVE]        = 0;
  scores[INTENTS.OBJECTION]       = 0;

  // Initialize scores for any dynamically registered service intents
  for (const key of Object.keys(INTENTS)) {
    if (!(key in scores)) {
      scores[key] = 0;
    }
  }

  // Generic keyword dictionaries (engine-level, not config-specific)
  const genericDict = {
    [INTENTS.GENERAL_INQUIRY]: ['help', 'services', 'options', 'clinic', 'doctor', 'appointment', 'care', 'medical', 'health'],
    [INTENTS.POSITIVE]: ['yes', 'yeah', 'sure', 'ok', 'okay', 'definitely', 'sounds good', "let's do it", 'absolutely', 'great', 'perfect', 'love it', 'makes sense', 'move forward', 'go ahead'],
    [INTENTS.NEGATIVE]: ['no', 'nah', 'not really', 'nope', 'nevermind', 'not interested', "don't need"],
    [INTENTS.OBJECTION]: ['expensive', 'too much money', "can't afford", 'insurance coverage']
  };

  // 1. Base keyword checks for generic intents
  for (const [intent, words] of Object.entries(genericDict)) {
    for (const w of words) {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      const match = normalizedText.match(regex);
      if (match) {
         scores[intent] += (w.length > 3 ? 2 : 1);
         if (positions[intent] === undefined || match.index < positions[intent]) {
           positions[intent] = match.index;
         }
      }
    }
  }

  // 2. Service intent scoring is now handled by IntentDetector.detect()
  //    This NLP layer only handles generic/behavioral intents.

  // 3. Problem/Goal Signal Priority — boost general inquiry for problem statements
  if (extracted.problem && extracted.problem.value) {
    const probStr = extracted.problem.value.toLowerCase();
    for (const [intent, words] of Object.entries(genericDict)) {
      if (words.some(w => probStr.includes(w))) {
        scores[intent] += 3;
        const idx = normalizedText.indexOf(probStr);
        if (idx !== -1 && (positions[intent] === undefined || idx < positions[intent])) {
           positions[intent] = idx;
        }
      }
    }
  }
  if (extracted.goal && extracted.goal.value) {
    const goalStr = extracted.goal.value.toLowerCase();
    for (const [intent, words] of Object.entries(genericDict)) {
      if (words.some(w => goalStr.includes(w))) {
        scores[intent] += 1.5;
        const idx = normalizedText.indexOf(goalStr);
        if (idx !== -1 && (positions[intent] === undefined || idx < positions[intent])) {
           positions[intent] = idx;
        }
      }
    }
  }

  const sorted = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  let multiIntents = sorted.map(([key, score]) => {
     let rel = "dependent";
     
     // Apply relationship maps safely
     if (key.includes('FLOW_') || key.includes('SERVICE') || key === INTENTS.GENERAL_INQUIRY) rel = INTENT_RELATIONS.FLOW_SERVICE;
     if (key === INTENTS.POSITIVE || key === INTENTS.NEGATIVE) rel = INTENT_RELATIONS.CONFIRMATION;
     if (key === 'INTERRUPTION') rel = INTENT_RELATIONS.INTERRUPTION;
     if (key === 'META_PRICING' || key === INTENTS.OBJECTION) rel = INTENT_RELATIONS.META_PRICING;

     const rawConf = Math.min(1.0, score / 10);
     const bonusConf = (rel === 'override') ? 0.2 : 0; // Push overrides up
     let intentWeight = 0.1; // GENERIC base
     if (rel === INTENT_RELATIONS.FLOW_SERVICE) intentWeight = 0.3;
     if (rel === INTENT_RELATIONS.META_PRICING) intentWeight = 0.2;
     
     return { 
       intent: key, 
       confidence: Math.min(1.0, rawConf + bonusConf + intentWeight), 
       type: rel,
       position: positions[key] !== undefined ? positions[key] : 999
     };
  });

  // Sort strictly by confidence & priority tie-breaker
  multiIntents.sort((a, b) => {
    if (a.type === 'override' && b.type !== 'override') return -1;
    if (b.type === 'override' && a.type !== 'override') return 1;
    return b.confidence - a.confidence;
  });

  console.log(`[Intent] Detected → [${multiIntents.map(i => i.intent).join(', ')}]`);

  // Phase 3, Fix 3: Remove Slice & Drop arbitrary constraint. Support deep intent clusters natively.
  const finalIntents = multiIntents;

  let primary = finalIntents.length > 0 ? finalIntents[0].intent : INTENTS.UNKNOWN;
  let secondary = finalIntents.length > 1 ? finalIntents[1].intent : null;

  // Backwards compatibility for NLPEngine core dependencies
  finalIntents.primaryIntent = primary;
  finalIntents.secondaryIntent = secondary;
  finalIntents.intentScores = scores;

  return finalIntents;
}
