export class NLPTemporal {
  constructor() {
    this.history = [];
    this.limit = 7;
    this.decayFactor = 0.85;
  }

  process(currentNlp, contextMemory) {
    // 1. Add current to history
    this._addToHistory(currentNlp);

    // 2. Intent Stability Analysis
    const stability = this._getStableIntent();

    // 3. Contradiction Detection
    const contradiction = this._detectContradiction(currentNlp, stability.stableIntent);

    // 4. Behavioral Profile Update
    const userProfile = this._evaluateBehavioralTrend();

    return {
      stableIntent: stability.stableIntent,
      confidenceTrend: stability.confidenceTrend,
      contradiction: contradiction.isPivot,
      pivotAcknowledgment: contradiction.acknowledgment,
      userProfile
    };
  }

  _addToHistory(nlp) {
    this.history.push({
      intent: nlp.intent,
      intentStrength: nlp.intentStrength,
      confidence: nlp.confidence.intent,
      overallConfidence: nlp.confidence.overall,
      userType: nlp.userType,
      inputLength: nlp.quality ? nlp.quality.chars : 0,
      timestamp: Date.now()
    });
    if (this.history.length > this.limit) {
      this.history.shift();
    }
  }

  _getStableIntent() {
    if (this.history.length === 0) return { stableIntent: null, confidenceTrend: 0 };

    const scores = {};
    let totalWeight = 0;

    // Weight recent turns higher
    this.history.forEach((entry, index) => {
      if (!entry.intent || entry.intent === 'INTENT_UNKNOWN') return;

      const recencyWeight = Math.pow(this.decayFactor, this.history.length - 1 - index);
      scores[entry.intent] = (scores[entry.intent] || 0) + (entry.confidence * recencyWeight);
      totalWeight += recencyWeight;
    });

    const entries = Object.entries(scores);
    if (entries.length === 0) return { stableIntent: null, confidenceTrend: 0 };

    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const stableIntent = sorted[0][0];
    const confidenceTrend = sorted[0][1] / (totalWeight || 1);

    return { stableIntent, confidenceTrend };
  }

  _detectContradiction(current, stableIntent) {
    const result = { isPivot: false, type: 'none', acknowledgment: null };

    const isServiceIntent = (intent) => ['INTENT_WEBSITE', 'INTENT_SEO', 'INTENT_AI_AUTOMATION', 'INTENT_APP_DEV'].includes(intent);

    if (stableIntent && current.intent !== stableIntent && isServiceIntent(current.intent)) {
      // 1. HARD PIVOT (Explicit actually/no/instead + high confidence)
      if (current.confidence.intent > 0.6) {
        result.isPivot = true;
        result.type = 'hard_pivot';
        const cleanName = current.intent.replace('INTENT_', '').replace('_', ' ');
        result.acknowledgment = `Got it—${cleanName} instead.`;
      } 
      // 2. SOFT PIVOT (Weak signals)
      else if (current.confidence.intent > 0.4) {
        result.isPivot = true;
        result.type = 'soft_pivot';
      }
      // 3. UNCERTAIN SHIFT
      else {
        result.type = 'uncertain_shift';
      }
    }

    return result;
  }

  _evaluateBehavioralTrend() {
    if (this.history.length === 0) return { dominantType: 'exploratory', trend: 'stable' };

    // 1. Weighted Dominant Type (last 3-5 turns)
    const windowSize = Math.min(5, this.history.length);
    const window = this.history.slice(-windowSize);
    
    const typeScores = {};
    window.forEach((h, i) => {
      const weight = (i + 1) / windowSize; // Recent turns weigh more
      typeScores[h.userType] = (typeScores[h.userType] || 0) + weight;
    });

    const dominant = Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0][0];

    // 2. Immediate Overrides (Strong skepticism or confusion)
    const latest = this.history[this.history.length - 1];
    let activeType = dominant;
    
    if (latest.userType === 'skeptical' && latest.confidence > 0.6) activeType = 'skeptical';
    if (latest.userType === 'confused' && latest.confidence > 0.6) activeType = 'confused';

    // 3. Engagement Trend (Input length and clarity)
    let engTrend = 'stable';
    if (this.history.length >= 2) {
      const prev = this.history[this.history.length - 2];
      const diff = latest.inputLength - prev.inputLength;
      if (diff > 15) engTrend = 'rising';
      else if (diff < -20) engTrend = 'falling';
    }

    return {
      dominantType: activeType,
      consistencyScore: typeScores[dominant] / windowSize,
      trend: activeType === dominant ? 'stable' : 'shifting',
      engagementTrend: engTrend,
      confidenceTrend: latest.overallConfidence
    };
  }
}
