/**
 * Intent Detection Module
 * Maps to: 02_intent_detection.md
 *
 * Detects user intent via keyword matching with weighted confidence scoring.
 * Returns intent type, strength, urgency, and matched keywords.
 *
 * Supported intents:
 *   WEBSITE, SEO, AI_AUTOMATION, APP_DEV,
 *   GENERAL_INQUIRY, LOW_INTENT, OBJECTION, POSITIVE, UNKNOWN
 */

export const INTENTS = {
  WEBSITE:          'WEBSITE',
  SEO:              'SEO',
  AI_AUTOMATION:    'AI_AUTOMATION',
  APP_DEV:          'APP_DEV',
  GENERAL_INQUIRY:  'GENERAL_INQUIRY',
  LOW_INTENT:       'LOW_INTENT',
  OBJECTION:        'OBJECTION',
  POSITIVE:         'POSITIVE',
  NEGATIVE:         'NEGATIVE',
  UNKNOWN:          'UNKNOWN'
};

export class IntentDetector {

  constructor() {
    // ─── Keyword Maps ─────────────────────────────────────
    this._intentConfig = {
      [INTENTS.WEBSITE]: {
        keywords: [
          'website', 'site', 'web page', 'webpage', 'online presence',
          'landing page', 'web design', 'redesign', 'new site',
          'e-commerce', 'ecommerce', 'online store', 'web development',
          'wordpress', 'portfolio site'
        ],
        phrases: [
          'need a website', 'build a website', 'want a site',
          'create a website', 'design a website', 'revamp my site',
          'update my website'
        ],
        weight: 1.0
      },

      [INTENTS.SEO]: {
        keywords: [
          'seo', 'search engine', 'ranking', 'google', 'leads',
          'traffic', 'visibility', 'organic', 'search results',
          'keywords', 'backlinks', 'search optimization'
        ],
        phrases: [
          'not getting clients', 'no leads', 'not getting leads',
          'more visibility', 'rank higher', 'show up on google',
          'get more traffic', 'no customers', 'not getting customers',
          'nobody finds us', 'need more clients'
        ],
        weight: 1.0
      },

      [INTENTS.AI_AUTOMATION]: {
        keywords: [
          'automation', 'automate', 'chatbot', 'ai', 'artificial intelligence',
          'bot', 'voice assistant', 'workflow', 'efficiency',
          'repetitive', 'machine learning', 'data system', 'smart system'
        ],
        phrases: [
          'want automation', 'need a chatbot', 'automate my business',
          'too much manual work', 'waste time on', 'need a system',
          'streamline operations', 'reduce manual work'
        ],
        weight: 1.0
      },

      [INTENTS.APP_DEV]: {
        keywords: [
          'app', 'application', 'mobile', 'software', 'platform',
          'tool', 'desktop app', 'mobile app', 'ios', 'android',
          'web app', 'saas', 'custom software'
        ],
        phrases: [
          'build an app', 'need an app', 'create an application',
          'develop software', 'want a platform', 'need a tool',
          'app idea', 'mobile application'
        ],
        weight: 1.0
      },

      [INTENTS.GENERAL_INQUIRY]: {
        keywords: [
          'services', 'what do you do', 'offerings', 'help me',
          'options', 'solutions'
        ],
        phrases: [
          'what do you do', 'what do you offer', 'tell me about',
          'how can you help', 'what can you do', 'what services',
          'what do you guys do', 'how does this work'
        ],
        weight: 0.8
      },

      [INTENTS.LOW_INTENT]: {
        keywords: [
          'browsing', 'curious', 'exploring'
        ],
        phrases: [
          'just checking', 'just looking', 'just browsing',
          'just curious', 'not sure yet', 'looking around'
        ],
        weight: 0.5
      },

      [INTENTS.OBJECTION]: {
        keywords: [
          'expensive', 'cost', 'price', 'budget', 'afford',
          'cheap', 'free', 'discount'
        ],
        phrases: [
          'too expensive', 'how much', 'what does it cost',
          'not sure about this', 'think about it', 'maybe later',
          'not interested', 'no thanks', 'don\'t need',
          'can\'t afford', 'too much money', 'not right now',
          'not ready', 'need to think'
        ],
        weight: 0.9
      },

      [INTENTS.POSITIVE]: {
        keywords: [
          'yes', 'yeah', 'sure', 'absolutely', 'definitely',
          'great', 'perfect', 'awesome', 'sounds good', 'interested',
          'let\'s do it', 'okay', 'ok', 'please', 'go ahead'
        ],
        phrases: [
          'that sounds good', 'i\'d like that', 'let\'s do it',
          'sign me up', 'i\'m interested', 'sounds great',
          'yes please', 'let\'s go', 'i want that', 'go for it'
        ],
        weight: 0.85
      },

      [INTENTS.NEGATIVE]: {
        keywords: [
          'no', 'nope', 'nah', 'not really', 'don\'t'
        ],
        phrases: [
          'no thanks', 'i\'m good', 'not right now',
          'maybe later', 'not interested', 'no need',
          'i don\'t think so', 'not for me'
        ],
        weight: 0.85
      }
    };

    // ─── Urgency Keywords ─────────────────────────────────
    this._urgencyKeywords = {
      high:   ['urgent', 'asap', 'immediately', 'right away', 'need now', 'deadline', 'rush', 'emergency', 'today'],
      medium: ['soon', 'this month', 'this week', 'planning', 'looking to', 'want to start', 'ready to'],
      low:    ['eventually', 'someday', 'just exploring', 'no rush', 'not urgent', 'down the road', 'future']
    };
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Detect intent from user input.
   * @param {string} input - Raw user input text
   * @returns {{ intent: string, confidence: number, keywords: string[], urgency: string, intentStrength: string }}
   */
  detect(input) {
    if (!input || typeof input !== 'string') {
      return this._unknownResult();
    }

    const normalized = input.toLowerCase().trim();

    // Score each intent
    const scores = [];
    for (const [intent, config] of Object.entries(this._intentConfig)) {
      const result = this._scoreIntent(normalized, config);
      if (result.score > 0) {
        scores.push({ intent, ...result, weight: config.weight });
      }
    }

    // Sort by weighted score
    scores.sort((a, b) => (b.score * b.weight) - (a.score * a.weight));

    // No matches
    if (scores.length === 0) {
      return { ...this._unknownResult(), urgency: this._detectUrgency(normalized) };
    }

    const best = scores[0];
    const confidence = Math.min(1.0, best.score * best.weight);

    return {
      intent:         best.intent,
      confidence:     confidence,
      keywords:       best.matched,
      urgency:        this._detectUrgency(normalized),
      intentStrength: confidence > 0.3 ? 'strong' : confidence > 0.15 ? 'moderate' : 'weak',
      allIntents:     scores.map(s => ({ intent: s.intent, confidence: Math.min(1.0, s.score * s.weight) }))
    };
  }

  /**
   * Quick check if input is a positive/agreement response
   */
  isPositive(input) {
    const result = this.detect(input);
    return result.intent === INTENTS.POSITIVE;
  }

  /**
   * Quick check if input is a negative/decline response
   */
  isNegative(input) {
    const result = this.detect(input);
    return result.intent === INTENTS.NEGATIVE;
  }

  // ─── Private ──────────────────────────────────────────────

  _scoreIntent(input, config) {
    let score   = 0;
    const matched = [];

    // Phrase matching (higher value — more specific)
    for (const phrase of (config.phrases || [])) {
      if (input.includes(phrase)) {
        score += 0.4;
        matched.push(phrase);
      }
    }

    // Keyword matching
    for (const kw of config.keywords) {
      // Word boundary check for short keywords to avoid false matches
      if (kw.length <= 3) {
        const regex = new RegExp(`\\b${this._escapeRegex(kw)}\\b`, 'i');
        if (regex.test(input)) {
          score += 0.15;
          matched.push(kw);
        }
      } else if (input.includes(kw)) {
        score += 0.15;
        matched.push(kw);
      }
    }

    return { score, matched };
  }

  _detectUrgency(input) {
    for (const [level, keywords] of Object.entries(this._urgencyKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        return level;
      }
    }
    return 'medium';
  }

  _unknownResult() {
    return {
      intent:         INTENTS.UNKNOWN,
      confidence:     0,
      keywords:       [],
      urgency:        'medium',
      intentStrength: 'weak',
      allIntents:     []
    };
  }

  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
