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

export function detectIntent(tokens, normalizedText, extracted = {}) {
  // Use generic categories that are always present in INTENTS
  const scores = {};
  
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
    [INTENTS.GENERAL_INQUIRY]: ['help', 'services', 'what do you do', 'options', 'clients', 'customers', 'business', 'grow', 'growth'],
    [INTENTS.POSITIVE]: ['yes', 'yeah', 'sure', 'ok', 'okay', 'definitely', 'sounds good', "let's do it", 'absolutely', 'great', 'perfect', 'love it', 'makes sense', 'move forward', 'go ahead'],
    [INTENTS.NEGATIVE]: ['no', 'nah', 'not really', 'nope', 'nevermind', 'not interested', "don't need"],
    [INTENTS.OBJECTION]: ['expensive', 'too much money', "can't afford", 'not in the budget']
  };

  // 1. Base keyword checks for generic intents
  for (const [intent, words] of Object.entries(genericDict)) {
    for (const w of words) {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      if (regex.test(normalizedText)) {
         scores[intent] += (w.length > 3 ? 2 : 1);
      }
    }
  }

  // 2. Service intent scoring is now handled by IntentDetector.detect()
  //    This NLP layer only handles generic/behavioral intents.

  // 3. Problem/Goal Signal Priority — boost general inquiry for problem statements
  if (extracted.problem && extracted.problem.value) {
    const probStr = extracted.problem.value.toLowerCase();
    for (const [intent, words] of Object.entries(genericDict)) {
      if (words.some(w => probStr.includes(w))) scores[intent] += 3;
    }
  }
  if (extracted.goal && extracted.goal.value) {
    const goalStr = extracted.goal.value.toLowerCase();
    for (const [intent, words] of Object.entries(genericDict)) {
      if (words.some(w => goalStr.includes(w))) scores[intent] += 1.5;
    }
  }

  const sorted = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  let primary = INTENTS.UNKNOWN;
  let secondary = null;

  if (sorted.length > 0) {
    primary = sorted[0][0];
    if (sorted.length > 1 && sorted[1][1] > 0) {
      secondary = sorted[1][0];
    }
  }

  return { primaryIntent: primary, secondaryIntent: secondary, intentScores: scores };
}
