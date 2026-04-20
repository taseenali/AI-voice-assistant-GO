export class BehaviorEngine {
  static getStrategy(profile) {
    const type = profile.dominantType || 'exploratory';
    
    // Default base strategies
    const strategies = {
      direct: {
        tone: 'direct',
        assertiveness: 0.9,
        explanationDepth: 0.2,
        baseClosingStrength: 0.9
      },
      exploratory: {
        tone: 'guided',
        assertiveness: 0.5,
        explanationDepth: 0.6,
        baseClosingStrength: 0.5
      },
      confused: {
        tone: 'supportive',
        assertiveness: 0.3,
        explanationDepth: 0.4,
        baseClosingStrength: 0.2
      },
      skeptical: {
        tone: 'reassuring',
        assertiveness: 0.4,
        explanationDepth: 0.7,
        baseClosingStrength: 0.3
      }
    };

    const strategy = { ...strategies[type] };

    // 1. Dynamic Closing Escalation Curve
    // If engagement is rising, boost closing strength
    if (profile.engagementTrend === 'rising') {
      strategy.baseClosingStrength = Math.min(1.0, strategy.baseClosingStrength + 0.2);
    } else if (profile.engagementTrend === 'falling') {
      strategy.baseClosingStrength = Math.max(0.1, strategy.baseClosingStrength - 0.2);
    }

    // 2. Confidence scaling
    // If confidence is high, be more assertive
    if (profile.confidenceTrend > 0.8) {
      strategy.assertiveness = Math.min(1.0, strategy.assertiveness + 0.1);
    }

    return {
      ...strategy,
      closingStrength: strategy.baseClosingStrength
    };
  }
}
