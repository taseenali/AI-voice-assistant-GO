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
  FLOW_GENERAL:    'FLOW_GENERAL',
  LEAD_CAPTURE:         'LEAD_CAPTURE',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  CLOSING:              'CLOSING',
  OBJECTION:            'OBJECTION',
  FALLBACK:             'FALLBACK',
  ENDED:                'ENDED'
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
    STATES.ENDED,
    STATES.LEAD_CAPTURE  // Patient confirms booking intent → skip ahead to data collection
  ],
  [STATES.INTENT_DETECTED]: [
    STATES.FLOW_GENERAL,
    STATES.DISCOVERY,
    STATES.LEAD_CAPTURE  // Direct booking confirmation from intent gate
  ],

  [STATES.FLOW_GENERAL]: [
    STATES.LEAD_CAPTURE, STATES.OBJECTION,
    STATES.DISCOVERY, STATES.CLOSING, STATES.FALLBACK, STATES.FLOW_GENERAL
  ],
  [STATES.LEAD_CAPTURE]: [
    STATES.CLOSING, STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.FALLBACK, STATES.BOOKING_CONFIRMATION
  ],
  [STATES.BOOKING_CONFIRMATION]: [
    STATES.ENDED, STATES.CLOSING, STATES.FALLBACK
  ],
  [STATES.CLOSING]: [
    STATES.ENDED, STATES.OBJECTION, STATES.LEAD_CAPTURE, STATES.FALLBACK, STATES.BOOKING_CONFIRMATION
  ],
  [STATES.OBJECTION]: [
    STATES.DISCOVERY, STATES.CLOSING,
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
  STATES.FLOW_GENERAL
]);

// ─── State Machine Class ──────────────────────────────────────
export class ConversationStateMachine {

  constructor(config = null) {
    this._listeners = [];
    this._deferredIntentStack = [];
    this.maxStackSize = 3;

    if (config) {
      this.initFromConfig(config);
    }
    this.reset();
  }

  /** Dynamically register service states */
  initFromConfig(config) {
    const services = config.services || [];
    services.forEach(svc => {
      if (!svc.intent_key) return;
      const stateName = `FLOW_SERVICE_${svc.intent_key.toUpperCase()}`;
      
      // Inject to STATES
      STATES[stateName] = stateName;
      FLOW_STATES.add(stateName);

      // Inject to TRANSITIONS
      TRANSITIONS[STATES.INTENT_DETECTED].push(stateName);
      TRANSITIONS[STATES.FLOW_GENERAL].push(stateName);
      TRANSITIONS[STATES.OBJECTION].push(stateName);
      
      const allServiceStates = services.filter(s => s.intent_key).map(s => `FLOW_SERVICE_${s.intent_key.toUpperCase()}`);

      TRANSITIONS[stateName] = [
        STATES.LEAD_CAPTURE, STATES.OBJECTION, STATES.DISCOVERY,
        STATES.CLOSING, STATES.FALLBACK, stateName,
        ...allServiceStates // Enable lateral switches to any other service flow
      ];
    });
  }

  /** Reset to initial state */
  reset() {
    this._state = STATES.IDLE;
    this._deferredIntentStack = [];
    this._resolvedIntents = new Set();
    this._context = {
      state:            STATES.IDLE,
      intent:           null,
      intentStrength:   0,
      urgency_level:    'low',
      engagementScore:  50,
      conversationGoal: GOALS.IDENTIFY_PROBLEM,
      contextMemory:    [],
      leadData: {
        name:               null,
        patient_type:       null,
        dob:                null,
        reason_for_visit:   null,
        insurance_provider: null,
        insurance_id:       null,
        urgency:            null,
        contactMethod:      null
      },
      confirmations: ['Great! We will be in touch shortly.'],
      exit: ['Thanks for chatting! Feel free to reach out anytime.'],
      emergency_keywords: [
        "chest pain", "heart attack", "crushing pain", "squeezing chest",
        "can't breathe", "difficulty breathing", "trouble breathing", "choking",
        "stroke", "face drooping", "arm weakness", "sudden confusion",
        "severe bleeding", "bleeding heavily", "blood loss", "uncontrolled bleeding",
        "suicide", "kill myself", "want to die", "end my life",
        "labor", "baby coming", "water broke", "contractions",
        "baby not breathing", "child unconscious", "infant not moving",
        "car accident", "severe burn", "overdose", "poisoning"
      ],
      leadPrompts: {
        patient_type: [
          "Are you a new or returning patient?",
          "Have you visited our clinic before?"
        ],
        dob: [
          "Could I get your date of birth, just for our medical records?",
          "What is your date of birth?"
        ],
        reason_for_visit: [
          "What's the main thing you're looking to address today?",
          "Could you describe the reason for your visit?",
          "What symptoms or concerns should the doctor know about?"
        ],
        insurance_provider: [
          "Who is your primary health insurance provider?",
          "What insurance will you be using for this visit?"
        ],
        urgency: [
          "How quickly do you need to be seen?",
          "Is this an urgent matter or a routine checkup?"
        ]
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

  // ─── DEFERRED INTENT SYSTEM (Step 5 Layer) ──────────────────────────

  deferIntent(intentObj) {
    if (!intentObj || !intentObj.intent) return;
    
    // Prevent duplicate deferred triggers (edge case 3)
    if (this._resolvedIntents && this._resolvedIntents.has(intentObj.intent)) {
       console.log(`[Intent] Duplicate deferred rejected → ${intentObj.intent} (already resolved)`);
       return;
    }

    this._deferredIntentStack.push(intentObj);
    
    // Max Stack Bounds Enforcement
    if (this._deferredIntentStack.length > this.maxStackSize) {
      // Discard lowest priority (currently just truncating the oldest shifted queue item per FIFO limit)
      const dropped = this._deferredIntentStack.shift();
      console.warn(`[Intent] Dropping deferred intent due to size limit: ${dropped.intent}`);
    }
    
    console.log(`[Intent] Deferred → ${intentObj.intent}`);
  }

  popDeferredIntent() {
    const popped = this._deferredIntentStack.pop();
    if (popped) {
      this._resolvedIntents = this._resolvedIntents || new Set();
      this._resolvedIntents.add(popped.intent);
    }
    return popped;
  }

  hasDeferredIntent() {
    return this._deferredIntentStack.length > 0;
  }

  isCurrentFlowStable() {
    const state = this.getState();
    // Flow is stable if not in the middle of active sequence or gating steps
    return state !== STATES.LEAD_CAPTURE && state !== STATES.OBJECTION && state !== STATES.FLOW_GENERAL;
  }

  // ─── EVENTS ──────────────────────────────────────────────────

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

    console.log(`[StateMachine] Transition: ${oldState} \u2192 ${newState}`);

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

  getMemory() {
    return [...this._context.contextMemory];
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
    if (ld.name)               score += 25;
    if (ld.patient_type)       score += 15;
    if (ld.reason_for_visit)   score += 25;
    if (ld.dob)                score += 15;
    if (ld.insurance_provider) score += 10;
    if (ld.urgency)            score += 10;
    return score;
  }

  getNextLeadField() {
    const ld = this._context.leadData;
    if (!ld.name)               return 'name';
    if (!ld.patient_type)       return 'patient_type';
    if (!ld.reason_for_visit)   return 'reason_for_visit';
    if (!ld.dob)                return 'dob';
    if (!ld.insurance_provider) return 'insurance_provider';
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
