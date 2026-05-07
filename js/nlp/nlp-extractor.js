// SEC-03: Maximum input length accepted before regex processing.
// Prevents ReDoS and oversized payload injection through the NLP layer.
const MAX_INPUT_LENGTH = 500;

export function extractSignals(cleanedText, normalizedText) {
  // SEC-03: Enforce length bounds before any regex runs (secondary gate after app.js entry)
  const safeClean = typeof cleanedText   === 'string' ? cleanedText.slice(0, MAX_INPUT_LENGTH)   : '';
  const safeNorm  = typeof normalizedText === 'string' ? normalizedText.slice(0, MAX_INPUT_LENGTH) : '';

  return {
    medical_practice: _extPractice(safeClean),
    care_goal: _extCareGoal(safeNorm),
    problem: _extProblem(safeNorm),
    urgency: _extUrgency(safeNorm),
    care_outcome: _extCareOutcome(safeNorm),
    patient_history: _extHistory(safeNorm)
  };
}

function _extPractice(txt) {
  // Pattern 1: descriptive clinic type (e.g., "dental practice", "medical clinic")
  const blacklist = '(?:ive|been|in|for|am|is|have|was|had|ve|re|ll|m|i|s|the|this|that|with|to|from|my|our|your|an|a|of|help|more|some|just|also|need|really|only)';
  let m = txt.match(new RegExp(`(?:\\b(?:my|our|your|the|a|an)\\b\\s+)?\\b((?!${blacklist}\\b)[a-z0-9]{3,20}(?:\\s+[a-z0-9]{3,20})?)\\s+(?:clinic|practice|hospital|office|center|unit)`, 'i'));
  if (m && m[1] && m[1].length >= 3) return { value: m[1].trim(), type: 'exact' };

  // Pattern 2: "my clinic called X"
  m = txt.match(/(?:my|our|the)\s+(?:clinic|practice|hospital|office|center|unit)(?:\s+(?:is|called|named))?\s+([a-z0-9][a-z0-9\s]{2,28}?)(?:[.,;]|$|\band\b|\bbut\b)/i);
  if (m && m[1] && m[1].trim().length >= 3) return { value: m[1].trim(), type: 'exact' };

  return null;
}

function _extCareGoal(txt) {
  // Goal from care outcome
  if (txt.includes('care_outcome')) return { value: 'recovery', type: 'exact' };

  let m = txt.match(/(?:to|want to|need to|looking to|get)\s+(feel better|recover|improve|fix|schedule|book|check)\s+([a-z0-9\s]{2,20}?)(?:[.,;]|\band\b|\bbut\b|$)/i);
  if (m) return { value: m[2].trim(), type: 'exact' };
  
  m = txt.match(/(?:want to|need to|looking to|want|need|get)\s+(?:more|better|to)?\s*(appointment|checkup|cleaning|exam|treatment|care|help|doctor|specialist|results)/i);
  if (m) return { value: m[1].trim(), type: 'partial' };

  return null;
}

function _extProblem(txt) {
  let m = txt.match(/(?:struggling with|losing|too much|tired of|can't|not working|not getting)\s+([a-z0-9\s]{2,20}?)(?:[.,;]|\band\b|\bbecause\b|$)/i);
  if (m) return { value: m[1].trim(), type: 'exact' };
  
  m = txt.match(/([a-z0-9\s]{2,20}?)\s*(?:not working|aren't working|is not working|are not working|not coming|failing|suck|are down)/i);
  if (m) {
    let val = m[1].trim();
    val = val.replace(/\s+(?:are|is)$/i, '');
    return { value: val, type: 'partial' };
  }

  // Pattern 3: [Symptom] is [Status] (e.g., "pain is severe", "fever is high")
  m = txt.match(/([a-z0-9\s]{2,20}?)\s+(?:is|looks|seems|looks like|is total|is currently)\s+(severe|high|worse|bad|hurting|hurts|throbbing|aching)/i);
  if (m) {
    return { value: m[1].trim(), type: 'exact', problem_type: m[2].trim() };
  }
  
  return null;
}

function _extUrgency(txt) {
  const m = txt.match(/(asap|immediately|right away|as soon as possible|urgent(?:ly)?|(?:this|next)\s+(?:week|month)|(?:within|in)\s+\d+\s+(?:days?|weeks?|months?))/i);
  if (m) return { value: 'high', type: 'exact' };
  return { value: 'normal', type: 'weak' };
}

function _extCareOutcome(txt) {
  if (txt.includes('care_outcome')) return { value: 'health', type: 'exact' };
  return null;
}

function _extHistory(txt) {
  // Pattern 1: Absolute duration (e.g., "10 years", "5 months")
  let m = txt.match(/(\d+\+?\s+(?:years?|months?|weeks?|days?))/i);
  if (m) return { value: m[1].trim(), type: 'exact' };

  if (txt.includes('history_established')) return { value: 'long-term', type: 'exact' };
  if (txt.includes('history_new')) return { value: 'recent', type: 'exact' };
  
  return null;
}
