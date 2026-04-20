export function evaluateUser(tokens, cleanedText) {
  let type = 'exploratory'; // default
  
  const len = tokens.length;
  
  const unsureWords = ['idk', "don't know", "dont know", 'maybe', 'not sure', 'guessing'];
  const skepticWords = ['prove', 'guarantee', 'really', 'expensive', 'sure about that', 'cost'];
  const directWords = ['need', 'want', 'build', 'give me', 'urgent', 'now', 'fast', 'quickly'];

  let unsureCount = unsureWords.filter(w => cleanedText.includes(w)).length;
  let skepticCount = skepticWords.filter(w => cleanedText.includes(w)).length;
  let directCount = directWords.filter(w => cleanedText.includes(w)).length;

  if (unsureCount > 0 || (len <= 3 && hasNoise(cleanedText))) type = 'confused';
  else if (skepticCount > 0) type = 'skeptical';
  else if (directCount > 0 && len < 15) type = 'direct';

  return type;
}

function hasNoise(txt) {
  return /^[a-z]{1,2}$/.test(txt) || txt === 'uh' || txt === 'um' || txt === 'idk';
}
