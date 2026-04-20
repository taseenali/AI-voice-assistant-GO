/**
 * Conversation State Machine
 * Controls the entire conversation lifecycle with strict state transitions,
 * context tracking, and engagement scoring.
 */

// ─── Conversation States ───────────────────────────────────────
export const STATES = {
  IDLE:            'IDLE',
  GREETING:        'GREETING',
  DISCOVERY:       'DISCOVERY',
  INTENT_DETECTED: 'INTENT_DETECTED',
  FLOW_WEBSITE:    'FLOW_WEBSITE',
  FLOW_SEO:        'FLOW_SEO',
  FLOW_AI:         'FLOW_AI',
  FLOW_APP:        'FLOW_APP',
  FLOW_GENERAL:    'FLOW_GENERAL',
  LEAD_CAPTURE:    'LEAD_CAPTURE',
  CLOSING:         'CLOSING',
  OBJECTION:       'OBJECTION',
  FALLBACK:        'FALLBACK',
  ENDED:           'ENDED'
};

// ─── Conversation Goals ────────────────────────────────────────
export const GOALS = {
  IDENTIFY_PROBLEM:  'identify_problem',
  EXPLORE_CONTEXT:   'explore_context',
  POSITION_SOLUTION: 'position_solution',
  CAPTURE_LEAD:      'capture_lead',
  CLOSE:             'close'
};

// ─── Valid State Transitions ───────────────────────────────────
const TRANSITIONS = {
  [STATES.IDLE]: [
    STATES.GREETING
  ],
  [STATES.GREETING]: [
    STATES.DISCOVERY,
    STATES.INTENT_DETECTED,
    STATES.FALLBACK
  ],
  [STATES.DISCOVERY]: [
    STATES.INTENT_DETECTED,
    STATES.FALLBACK,
    STATES.DISCOVERY,
    STATES.ENDED
  ],
  [STATES.INTENT_DETECTED]: [
    STATES.FLOW_WEBSITE,
    STATES.FLOW_SEO,
    STATES.FLOW_AI,
    STATES.FLOW_APP,
    STATES.FLOW_GENERAL,
    STATES.DISCOVERY
  ],
  [STATES.FLOW_WEBSITE]: [
    STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.DISCOVERY,
    STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_WEBSITE
  ],
  [STATES.FLOW_SEO]: [
    STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.DISCOVERY,
    STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_SEO
  ],
  [STATES.FLOW_AI]: [
    STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.DISCOVERY,
    STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_AI
  ],
  [STATES.FLOW_APP]: [
    STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.DISCOVERY,
    STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_APP
  ],
  [STATES.FLOW_GENERAL]: [
    STATES.LEAD_CAPTURE, STATES.FLOW_WEBSITE, STATES.FLOW_SEO,
    STATES.FLOW_AI, STATES.FLOW_APP, STATES.OBJECTION,
    STATES.DISCOVERY, STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_GENERAL
  ],
  [STATES.LEAD_CAPTURE]: [
    STATES.CLOSING, STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.FALLBACK
  ],
  [STATES.CLOSING]: [
    STATES.ENDED, STATES.OBJECTION, STATES.LEAD_CAPTURE, STATES.FALLBACK
  ],
  [STATES.OBJECTION]: [
    STATES.DISCOVERY, STATES.CLOSING, STATES.FLOW_WEBSITE,
    STATES.FLOW_SEO, STATES.FLOW_AI, STATES.FLOW_APP,
    STATES.ENDED, STATES.FALLBACK
  ],
  [STATES.FALLBACK]: [
    STATES.DISCOVERY, STATES.GREETING, STATES.ENDED, STATES.FALLBACK
  ],
  [STATES.ENDED]: [
    STATES.IDLE
  ]
};

// ─── Flow States Set ───────────────────────────────────────────
const FLOW_STATES = new Set([
  STATES.FLOW_WEBSITE, STATES.FLOW_SEO,
  STATES.FLOW_AI, STATES.FLOW_APP, STATES.FLOW_GENERAL
]);

// ─── State Machine Class ──────────────────────────────────────
export class ConversationStateMachine {

  constructor() {
    this._listeners = [];
    this.reset();
  }

  /** Reset to initial state */
  reset() {
    this._state = STATES.IDLE;
    this._context = {
      state:            STATES.IDLE,
      intent:           null,
      intentStrength:   0,
      urgency:          'low',
      engagementScore:  50,
      conversationGoal: GOALS.IDENTIFY_PROBLEM,
      contextMemory:    [],
      leadData: {
        name:          null,
        business:      null,
        goal:          null,
        tenure:        null,
        problem:       null,
        contactMethod: null,
        budget:        null,
        timeline:      null
      },
      history:        [],
      flowStep:       0,
      discoveryDepth: 0,
      fallbackCount:  0,
      turnCount:      0,
      previousState:  null,
      activeFlow:     null
    };
  }

  // ─── Accessors ─────────────────────────────────────────────

  getState() {
    return this._state;
  }

  getContext() {
    return { ...this._context, leadData: { ...this._context.leadData } };
  }

  getPreviousState() {
    return this._context.previousState;
  }

  // ─── Transition Logic ──────────────────────────────────────

  canTransition(newState) {
    const allowed = TRANSITIONS[this._state];
    return allowed && allowed.includes(newState);
  }

  transition(newState, data = {}) {
    if (!this.canTransition(newState)) {
      console.warn(`[StateMachine] Invalid transition: ${this._state} → ${newState}`);
      return false;
    }

    const oldState = this._state;
    this._context.previousState = oldState;
    this._state = newState;
    this._context.state = newState;
    this._context.turnCount++;

    // Track active flow
    if (FLOW_STATES.has(newState)) {
      this._context.activeFlow = newState;
    }

    // Apply additional data to context
    if (data && typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (key === 'leadData') {
          Object.assign(this._context.leadData, value);
        } else if (key !== 'history' && key !== 'contextMemory') {
          this._context[key] = value;
        }
      }
    }

    // Record transition in history
    this._context.history.push({
      from:      oldState,
      to:        newState,
      turn:      this._context.turnCount,
      timestamp: Date.now(),
      data
    });

    // Notify listeners
    this._notify(oldState, newState);

    return true;
  }

  _notify(oldState, newState) {
    const os = oldState || this._state;
    const ns = newState || this._state;
    this._listeners.forEach(fn => {
      try { fn(os, ns, this.getContext()); }
      catch (e) { console.error('[StateMachine] Listener error:', e); }
    });
  }

  // ─── Context Manipulation ──────────────────────────────────

  updateContext(updates) {
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'leadData') {
        Object.assign(this._context.leadData, value);
      } else {
        this._context[key] = value;
      }
    }
    this._notify();
  }

  updateLeadData(data) {
    Object.assign(this._context.leadData, data);
    this._notify();
  }

  addToMemory(entry) {
    this._context.contextMemory.push({
      ...entry,
      turn:      this._context.turnCount,
      timestamp: Date.now()
    });
  }

  // ─── Engagement Scoring ────────────────────────────────────

  adjustEngagement(delta) {
    this._context.engagementScore = Math.max(
      0, Math.min(100, this._context.engagementScore + delta)
    );
  }

  getEngagementLevel() {
    const score = this._context.engagementScore;
    if (score >= 75) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  // ─── Goal Management ──────────────────────────────────────

  setGoal(goal) {
    if (Object.values(GOALS).includes(goal)) {
      this._context.conversationGoal = goal;
    }
  }

  // ─── Flow Helpers ─────────────────────────────────────────

  isInFlow() {
    return FLOW_STATES.has(this._state);
  }

  advanceFlowStep() {
    this._context.flowStep++;
  }

  resetFlowStep() {
    this._context.flowStep = 0;
  }

  incrementDiscoveryDepth() {
    this._context.discoveryDepth = Math.min(3, this._context.discoveryDepth + 1);
  }

  incrementFallbackCount() {
    this._context.fallbackCount++;
  }

  resetFallbackCount() {
    this._context.fallbackCount = 0;
  }

  // ─── Lead Data Helpers ────────────────────────────────────

  getLeadCompleteness() {
    const ld = this._context.leadData;
    let score = 0;
    if (ld.name)          score += 25;
    if (ld.business)      score += 15;
    if (ld.goal)          score += 15;
    if (ld.tenure)        score += 10;
    if (ld.problem)       score += 20;
    if (ld.contactMethod) score += 5;
    if (ld.timeline)      score += 10;
    return score;
  }

  getNextLeadField() {
    const ld = this._context.leadData;
    if (!ld.name)     return 'name';
    if (!ld.goal)     return 'goal';
    if (!ld.problem)  return 'problem';
    if (!ld.business) return 'business';
    if (!ld.timeline) return 'timeline';
    return null;
  }

  // ─── Event System ─────────────────────────────────────────

  onStateChange(callback) {
    if (typeof callback === 'function') {
      this._listeners.push(callback);
    }
  }

  removeListener(callback) {
    this._listeners = this._listeners.filter(fn => fn !== callback);
  }
}
