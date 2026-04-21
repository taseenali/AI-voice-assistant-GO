export function scoreConfidence(extracted, intentData, contextMemory) {
  let baseScore = intentData.primaryIntent !== 'UNKNOWN' ? (intentData.intentScores[intentData.primaryIntent] || 0) : 0;
  
  // Normalize baseScore
  baseScore = Math.min(1.0, baseScore * 0.1); 

  // Density (Multi-reinforcing signals)
  let densityScore = 0;
  if (extracted.business) densityScore += 0.1;
  if (extracted.growth_outcome) densityScore += 0.15; // Growth outcomes are strong indicators
  if (extracted.goal) densityScore += 0.1;
  if (extracted.problem) densityScore += 0.1;
  if (extracted.urgency && extracted.urgency.type !== 'weak') densityScore += 0.1;

  // Context Consistency / Contradiction
  let contextMatchBonus = 0;
  let contradictionPenalty = 0;
  
  if (contextMemory && contextMemory.intent) {
    if (intentData.primaryIntent === contextMemory.intent) {
      contextMatchBonus = 0.2;
    } else if (intentData.primaryIntent !== 'UNKNOWN' && !['GENERAL_INQUIRY', 'POSITIVE', 'NEGATIVE'].includes(intentData.primaryIntent)) {
      contradictionPenalty = 0.25;
    }
  }

  let finalIntentConf = baseScore + densityScore + contextMatchBonus - contradictionPenalty;
  finalIntentConf = Math.max(0, Math.min(1.0, finalIntentConf));

  // Determine property confidences using their NLP extractor exactness matches
  const propConf = (prop) => {
    if (!prop) return 0;
    if (prop.type === 'exact') return 0.95;
    if (prop.type === 'partial') return 0.75;
    return 0.4;
  };

  const conf = {
    business: Math.min(1.0, propConf(extracted.business)),
    goal: Math.min(1.0, propConf(extracted.goal)),
    problem: Math.min(1.0, propConf(extracted.problem)),
    intent: finalIntentConf,
    contradiction: contradictionPenalty > 0
  };

  // Higher weighting for intent and problem clarity
  const overall = (conf.intent * 0.4) + (conf.problem * 0.3) + (conf.goal * 0.15) + (conf.business * 0.15);

  return {
    ...conf,
    overall: Math.max(0, Math.min(1.0, overall)),
    lowConfidence: overall < 0.4,
    highConfidence: overall > 0.75,
    intentStrength: finalIntentConf > 0.7 ? 'strong' : finalIntentConf > 0.4 ? 'medium' : 'weak'
  };
}
