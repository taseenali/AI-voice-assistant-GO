export function extractSignals(cleanedText, normalizedText) {
  return {
    business: _extBusiness(cleanedText),
    goal: _extGoal(normalizedText),
    problem: _extProblem(normalizedText),
    urgency: _extUrgency(normalizedText),
    growth_outcome: _extGrowthOutcome(normalizedText),
    tenure: _extTenure(normalizedText)
  };
}

function _extBusiness(txt) {
  // Pattern 1: descriptive business type (e.g., "dental practice", "marketing agency")
  // Blacklist prevents functional/possessive words being captured as the business name
  const blacklist = '(?:ive|been|in|for|am|is|have|was|had|ve|re|ll|m|i|s|the|this|that|with|to|from|my|our|your|an|a|of|help|more|some|just|also|need|really|only)';
  let m = txt.match(new RegExp(`(?:\\b(?:my|our|your|the|a|an)\\b\\s+)?\\b((?!${blacklist}\\b)[a-z0-9]{3,20}(?:\\s+[a-z0-9]{3,20})?)\\s+(?:business|company|firm|agency|startup|brand|shop|store|clinic|practice)`, 'i'));
  if (m && m[1] && m[1].length >= 3) return { value: m[1].trim(), type: 'exact' };

  // Pattern 2: "my agency called X" or "my business is X"
  m = txt.match(/(?:my|our|the)\s+(?:business|company|firm|agency|startup|brand|shop|store|clinic|practice)(?:\s+(?:is|called|named))?\s+([a-z0-9][a-z0-9\s]{2,28}?)(?:[.,;]|$|\band\b|\bbut\b)/i);
  if (m && m[1] && m[1].trim().length >= 3) return { value: m[1].trim(), type: 'exact' };

  // Pattern 3: "I run/own/manage a [type]"
  m = txt.match(/(?:i\s+(?:run|own|manage|have))\s+(?:a\s+)?([a-z0-9][a-z0-9\s]{2,28}?)(?:[.,;]|\btried\b|\bmaybe\b|\band\b|\bbut\b|\bneed\b|$)/i);
  if (m && m[1] && m[1].trim().length >= 3) return { value: m[1].trim(), type: 'partial' };

  return null;
}

function _extGoal(txt) {
  // Goal from growth outcome
  if (txt.includes('growth_outcome')) return { value: 'growth', type: 'exact' };

  let m = txt.match(/(?:to|want to|need to|looking to|get)\s+(get more|increase|grow|scale|improve|lower|build|create)\s+([a-z0-9\s]{2,20}?)(?:[.,;]|\band\b|\bbut\b|$)/i);
  if (m) return { value: m[2].trim(), type: 'exact' };
  
  m = txt.match(/(?:want to|need to|looking to|want|need|get)\s+(?:more|better|to)?\s*(leads|sales|website|seo|automation|traffic|clients|customers|growth|revenue|business)/i);
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
  
  return null;
}

function _extUrgency(txt) {
  const m = txt.match(/(asap|immediately|right away|as soon as possible|urgent(?:ly)?|(?:this|next)\s+(?:week|month)|(?:within|in)\s+\d+\s+(?:days?|weeks?|months?))/i);
  if (m) return { value: 'high', type: 'exact' };
  return { value: 'normal', type: 'weak' };
}

function _extGrowthOutcome(txt) {
  if (txt.includes('growth_outcome')) return { value: 'growth', type: 'exact' };
  return null;
}

function _extTenure(txt) {
  // Pattern 1: Absolute duration (e.g., "10 years", "5 months")
  let m = txt.match(/(\d+\+?\s+(?:years?|months?|weeks?|days?))/i);
  if (m) return { value: m[1].trim(), type: 'exact' };

  if (txt.includes('tenure_established')) return { value: 'established', type: 'exact' };
  if (txt.includes('tenure_startup')) return { value: 'startup', type: 'exact' };
  
  return null;
}
