import { INTENTS } from '../modules/intent-detector.js';

export function detectIntent(tokens, normalizedText, extracted = {}) {
  const scores = {
    [INTENTS.WEBSITE]: 0,
    [INTENTS.SEO]: 0,
    [INTENTS.AI_AUTOMATION]: 0,
    [INTENTS.APP_DEV]: 0,
    [INTENTS.GENERAL_INQUIRY]: 0,
    [INTENTS.POSITIVE]: 0,
    [INTENTS.NEGATIVE]: 0,
    [INTENTS.OBJECTION]: 0
  };

  const dict = {
    [INTENTS.WEBSITE]: ['website', 'site', 'landing page', 'web design', 'rebuild', 'web', 'online presence', 'digital presence', 'domain'],
    [INTENTS.SEO]: ['seo', 'ranking', 'google', 'traffic', 'organic', 'search', 'competitor', 'competitors', 'show up', 'visible', 'visibility', 'found online', 'search engine'],
    [INTENTS.AI_AUTOMATION]: ['automate', 'automation', 'ai', 'bot', 'workflow', 'manual effort', 'chatbot', 'assistant', 'repetitive'],
    [INTENTS.APP_DEV]: ['app', 'software', 'platform', 'mobile', 'ios', 'android', 'application', 'system'],
    [INTENTS.GENERAL_INQUIRY]: ['help', 'services', 'what do you do', 'options', 'clients', 'customers', 'business', 'grow', 'growth'],
    [INTENTS.POSITIVE]: ['yes', 'yeah', 'sure', 'ok', 'okay', 'definitely', 'sounds good', "let's do it", 'absolutely', 'great', 'perfect', 'love it', 'makes sense', 'move forward', 'go ahead'],
    [INTENTS.NEGATIVE]: ['no', 'nah', 'not really', 'nope', 'nevermind', 'not interested', "don't need"],
    [INTENTS.OBJECTION]: ['expensive', 'too much money', "can't afford", 'not in the budget']
  };

  // 1. Base keyword checks
  for (const [intent, words] of Object.entries(dict)) {
    for (const w of words) {
      if (normalizedText.includes(w)) {
         scores[intent] += (w.length > 3 ? 2 : 1);
      }
    }
  }

  // 2. Explicit Intent Priority (regex scans for unmistakable requests)
  const explicitPatterns = {
    [INTENTS.WEBSITE]: /(?:need|want|build|get|redesign|update)\s+(?:a\s+)?(?:website|site|web)/i,
    [INTENTS.SEO]: /(?:need|want|do|get|improve|fix)\s+(?:seo|ranking|visibility)|(?:show up|found|appear)\s+(?:on\s+)?google|not\s+(?:showing|ranking|visible)/i,
    [INTENTS.AI_AUTOMATION]: /(?:need|want|add|build|set up)\s+(?:ai|automation|bots|chatbot)/i,
    [INTENTS.APP_DEV]: /(?:need|want|build|create)\s+(?:an?\s+)?app/i
  };
  for (const [intent, regex] of Object.entries(explicitPatterns)) {
    if (regex.test(normalizedText)) {
      scores[intent] += 5; // Heavy priority
    }
  }

  // 3. Problem/Goal Signal Priority
  if (extracted.problem && extracted.problem.value) {
    const probStr = extracted.problem.value.toLowerCase();
    for (const [intent, words] of Object.entries(dict)) {
      if (words.some(w => probStr.includes(w))) scores[intent] += 3;
    }
  }
  if (extracted.goal && extracted.goal.value) {
    const goalStr = extracted.goal.value.toLowerCase();
    for (const [intent, words] of Object.entries(dict)) {
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
      // Check if secondary is a service intent and not just positive/negative
      if (sorted[1][0].startsWith('INTENT_')) {
        secondary = sorted[1][0];
      }
    }
  }

  return { primaryIntent: primary, secondaryIntent: secondary, intentScores: scores };
}
