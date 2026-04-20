/**
 * Response Orchestrator v2 — Controlled Adaptive Conversation Engine
 *
 * Every input runs through a strict 6-step pipeline:
 *   1. detect_intent()      → What does the user want?
 *   2. update_context()     → Extract data, score engagement, store memory
 *   3. evaluate_state()     → What's happening? Flags & signals
 *   4. choose_goal()        → What should we be doing this turn?
 *   5. select_action()      → How do we achieve the goal?
 *   6. generate_response()  → What do we say? (acknowledge → guide → advance)
 *
 * Features:
 *   - Auto-extraction (name, business, urgency from ANY input)
 *   - Fast-track mode (engagement > 70 or urgency high)
 *   - Interruption handling (detect pivot, acknowledge, reroute)
 *   - Memory-aware (never re-ask known data, reference stored context)
 *   - Engagement scoring based on input quality
 */

import { STATES, GOALS }            from './state-machine.js';
import { IntentDetector, INTENTS }  from './modules/intent-detector.js';
import { NLPEngine }                from './nlp/nlp-core.js';
import { ServiceMapper }            from './modules/service-mapper.js';
import { DiscoveryEngine }          from './modules/discovery-engine.js';
import { ConversationFlows }        from './modules/conversation-flows.js';
import { LeadCapture }              from './modules/lead-capture.js';
import { ClosingEngine }            from './modules/closing-engine.js';
import { ObjectionHandler }         from './modules/objection-handler.js';
import { FallbackRecovery }         from './modules/fallback-recovery.js';
import { Personality }              from './modules/personality.js';
import { KnowledgeEngine }          from './knowledge/knowledge-engine.js';
import { ResponseBuilder }          from './modules/response-builder.js';
import { ConversationRouter, ROUTE_TYPE } from './router/conversation-router.js';
import { RouterHandlers }           from './router/router-handlers.js';

// ─── Action Types ──────────────────────────────────────────────
const ACT = {
  ASK:        'ask_question',
  CLARIFY:    'clarify',
  POSITION:   'position_solution',
  CAPTURE:    'capture_data',
  OBJECTION:  'handle_objection',
  CLOSE:      'close',
  CLOSE_TRANSITION: 'close_transition',
  FALLBACK:   'fallback',
  REROUTE:    'reroute',
  RESUME:     'resume_flow',
  EXIT:       'exit',
  ENDED:      'ended',
};

// ─── Service Intents Set ───────────────────────────────────────
const SERVICE_INTENTS = new Set([
  INTENTS.WEBSITE, INTENTS.SEO, INTENTS.AI_AUTOMATION, INTENTS.APP_DEV
]);

// ─── Flow Context Map ──────────────────────────────────────────
const FLOW_CTX = {
  [STATES.FLOW_WEBSITE]: 'website',
  [STATES.FLOW_SEO]:     'seo',
  [STATES.FLOW_AI]:      'ai',
  [STATES.FLOW_APP]:     'app',
};


export class ResponseOrchestrator {

  constructor(stateMachine) {
    this.sm = stateMachine;

    // Modules
    this.intent       = new IntentDetector(); // Retained for basic isPositive/isNegative
    this.nlp          = new NLPEngine();
    this.services     = new ServiceMapper();
    this.discovery    = new DiscoveryEngine();
    this.flows        = new ConversationFlows();
    this.leads        = new LeadCapture();
    this.closing      = new ClosingEngine();
    this.objections   = new ObjectionHandler();
    this.fallback     = new FallbackRecovery();
    this.personality  = new Personality();
    this.kb           = new KnowledgeEngine();
    this.builder      = new ResponseBuilder(this.personality);

    // Internal
    this._capField     = null;   // Field currently being captured
    this._unclear      = 0;      // Consecutive unclear inputs

    // ── Conversation Router (pre-pipeline gate) ──────────────
    this.router        = new ConversationRouter();
    this.routerHandlers= new RouterHandlers();
  }


  // ═══════════════════════════════════════════════════════════════
  //  PUBLIC API  (interface consumed by app.js — do not change)
  // ═══════════════════════════════════════════════════════════════

  startConversation() {
    this.sm.transition(STATES.GREETING);
    this.sm.updateContext({ conversationGoal: GOALS.IDENTIFY_PROBLEM });
    const g = this.personality.getGreeting();
    this.sm.addToMemory({ role: 'assistant', text: g });
    return g;
  }

  processInput(userInput) {
    if (!userInput || !userInput.trim()) return null;
    const input = userInput.trim();
    const lower = input.toLowerCase();

    if (this.sm.getState() === STATES.ENDED) {
      return "Thanks for chatting! Click 'New Chat' to start a new conversation.";
    }

    // ── DEMO MODE INTERCEPT ──
    if (lower.includes('demo website') || lower.includes('show website demo') || lower.includes('website demo')) {
      this.sm.transition(STATES.FLOW_WEBSITE);
      this.sm.updateContext({ engagementScore: 100, urgency: 'high', intent: INTENTS.WEBSITE, flowStep: 0, conversationGoal: GOALS.EXPLORE_CONTEXT });
      return `For a business like yours, a strong website brings consistent leads. What kind of site do you need?`;
    } 
    else if (lower.includes('demo seo') || lower.includes('show seo demo') || lower.includes('seo demo')) {
      this.sm.transition(STATES.FLOW_SEO);
      this.sm.updateContext({ engagementScore: 100, urgency: 'high', intent: INTENTS.SEO, flowStep: 0, conversationGoal: GOALS.EXPLORE_CONTEXT });
      return `For a business like yours, better visibility usually solves this. How do you get most clients now?`;
    }

    // ═══ CONVERSATION ROUTER — pre-pipeline gate ═══════════
    // Run a lightweight classification BEFORE any heavy NLP logic.
    // Non-core inputs are handled immediately and returned.
    // Only CORE inputs proceed to the 6-step pipeline.

    // Note: We run a quick pre-NLP route with null nlpData for speed
    const quickRoute = this.router.route(input, null, this._unclear);

    if (quickRoute.type !== ROUTE_TYPE.CORE) {
      // Track unclear streak for escalation
      if (quickRoute.type === ROUTE_TYPE.NOISE) {
        this._unclear++;
      } else {
        this._unclear = 0; // Greetings/meta are intentional — reset streak
      }

      const routeResponse = this.routerHandlers.handle(quickRoute.type, this._unclear);
      this.sm.addToMemory({ role: 'user', text: input });
      this.sm.addToMemory({ role: 'assistant', text: routeResponse });
      return routeResponse;
    }

    // ── CORE input confirmed — reset unclear streak ──────────
    this._unclear = 0;

    // If state is still GREETING (user's first real message), transition to DISCOVERY
    if (this.sm.getState() === STATES.GREETING) {
      this.sm.transition(STATES.DISCOVERY);
    }

    // ═══ 6-STEP PIPELINE ═══

    let ir     = this._step1_detectIntent(input);
    const ctx  = this.sm.getContext();

    // KNOWLEDGE INTEGRATION (Phase KB)
    const kbData = this.kb.analyze(ir, ctx, input, ctx.depthLevel || 1);
    
    // INTENT RESCUE: If NLP is weak, let KB logic take control
    if ((!ir.intent || ir.intent === 'INTENT_UNKNOWN' || ir.confidence.intent < 0.5) && kbData.confidence > 0.6) {
       ir.intent = kbData.recommendedIntent;
    }
    ir.insight = kbData.insight;
    ir.kbOutcome = kbData.outcome;

    this._step2_updateContext(input, ir);
    this._updateDepthLevel(ir); // Update depth based on intent and user state

    const ev   = this._step3_evaluateState(input, ir);
    const goal = this._step4_chooseGoal(ev);
    const act  = this._step5_selectAction(goal, ev, ir);
    const raw  = this._step6_generateResponse(act, ir, input);

    this.sm.addToMemory({ role: 'assistant', text: raw });
    return raw;
  }

  reset() {
    this.sm.reset();
    this.discovery.reset();
    this.leads.reset();
    this.fallback.reset();
    this._capField = null;
    this._unclear  = 0;
    // Router handlers have round-robin state — reset for fresh conversation
    this.routerHandlers = new RouterHandlers();
  }

  getLeadData()         { return this.leads.getData(); }
  getLeadCompleteness() { return this.leads.getCompleteness(); }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 1 — DETECT INTENT
  // ═══════════════════════════════════════════════════════════════

  _step1_detectIntent(input) {
    const ctx = this.sm.getContext();
    const nlpData = this.nlp.analyze(input, ctx);
    
    if (!nlpData) return null; // empty

    const cur = ctx.intent;
    const inFlow = this.sm.isInFlow() && this.sm.getState() !== STATES.FLOW_GENERAL;
    let isInterrupt = false;

    // Primary interruption
    if (SERVICE_INTENTS.has(cur) && SERVICE_INTENTS.has(nlpData.intent) &&
        nlpData.intent !== cur && nlpData.intentStrength !== 'weak' && inFlow) {
      isInterrupt = true;
    }

    // Secondary interruption mapping using userType
    if (inFlow && nlpData.userType === 'confused' && !nlpData.business && !nlpData.goal) {
       // Confusion during flow -> handled natively via fallback check if intent missing
    }

    nlpData.isInterruption = isInterrupt;

    // NOISE STABILIZATION (Phase NLP-3)
    // If current intent is unknown/weak but history has a stable trend, stick to stability
    if (nlpData.intentStrength === 'weak' && nlpData.stableIntent && nlpData.confidenceTrend > 0.6) {
      nlpData.intent = nlpData.stableIntent;
      nlpData.intentStrength = 'moderate'; // promoted from history
    }

    return nlpData;
  }

  // ═══════════════════════════════════════════════════════════════
  //  STEP 2 — UPDATE CONTEXT
  // ═══════════════════════════════════════════════════════════════

  _step2_updateContext(input, nlpData) {
    if (!nlpData) return;

    // 1. Memory
    this.sm.addToMemory({ role: 'user', text: input });
    this.discovery.addInsight(input, 'user_response');

    // 2. Safely merge NLP Context (Threshold Gated)
    const ld = this.sm.getContext().leadData;
     
    if (nlpData.business && (!ld.business || nlpData.confidence.business > 0.6)) {
      this.leads.capture('business', nlpData.business.value);
      this.sm.updateLeadData({ business: nlpData.business.value });
    }
    if (nlpData.goal && (!ld.goal || nlpData.confidence.goal > 0.5)) {
      this.leads.capture('goal', nlpData.goal.value);
      this.sm.updateLeadData({ goal: nlpData.goal.value });
    }
    if (nlpData.problem && (!ld.problem || nlpData.confidence.problem > 0.5)) {
      this.leads.capture('problem', nlpData.problem.value);
      this.sm.updateLeadData({ problem: nlpData.problem.value });
    }

    if (nlpData.tenure && (!ld.tenure || nlpData.confidence.overall > 0.5)) {
      this.leads.capture('tenure', nlpData.tenure.value);
      this.sm.updateLeadData({ tenure: nlpData.tenure.value });
    }

    // Name Extraction — strict intro pattern only
    if (!ld.name) {
      const nameBlacklist = new Set([
        'costing', 'trying', 'looking', 'thinking', 'working', 'running',
        'going', 'getting', 'doing', 'using', 'building', 'growing',
        'not', 'just', 'also', 'very', 'really', 'still', 'already'
      ]);
      const m = input.match(/(?:my name is|i am|this is|call me|name's)\s+([A-Z][a-zA-Z]{1,19})/i);
      if (m) {
        const candidate = m[1].toLowerCase();
        if (!nameBlacklist.has(candidate)) {
          const name = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
          this.leads.capture('name', name);
          this.sm.updateLeadData({ name });
        }
      }
    }

    if (!ld.timeline && nlpData.urgency && nlpData.urgency.value === 'high') {
      this.leads.capture('timeline', 'asap');
      this.sm.updateLeadData({ timeline: 'asap' });
    }

    // MULTI-SIGNAL HANDLING
    if (nlpData.secondaryIntent && SERVICE_INTENTS.has(nlpData.secondaryIntent) && !ld.problem) {
      this.sm.updateLeadData({ problem: `Prior failure/interest in ${nlpData.secondaryIntent}` });
    }

    // 3. Update intent in state machine (only if meaningful)
    const dominated = nlpData.intent !== INTENTS.UNKNOWN &&
                      nlpData.intent !== INTENTS.POSITIVE &&
                      nlpData.intent !== INTENTS.NEGATIVE &&
                      nlpData.intentStrength !== 'weak';
                      
    if (dominated) {
      if (nlpData.confidence.intent > 0.5 || !this.sm.getContext().intent) {
        this.sm.updateContext({ 
          intent: nlpData.intent, 
          intentStrength: nlpData.intentStrength, 
          urgency: nlpData.urgency ? nlpData.urgency.value : 'normal' 
        });
      }
    }

    if (nlpData.urgency && nlpData.urgency.value === 'high') {
      this.sm.updateContext({ urgency: 'high' });
    }

    // Save user model trace
    this.sm.updateContext({ userType: nlpData.userType });

    // 4. Engagement scoring
    this._scoreEngagement(input, nlpData);

    // 5. Unclear-input tracking
    if (nlpData.intent === INTENTS.UNKNOWN && nlpData.quality.detail === 'low') {
      this._unclear++;
    } else if (dominated || nlpData.userType === 'direct') {
      this._unclear = 0;
      this.fallback.reset();
      this.sm.resetFallbackCount();
    }
  }

  /** Update conversation depth logic (Alignment + Regression) */
  _updateDepthLevel(ir) {
    const ctx = this.sm.getContext();
    let depth = ctx.depthLevel || 1;

    // 1. REGRSSION: If confused or confidence dropped, step back
    if (ir.userType === 'confused' || ir.confidence.lowConfidence) {
      depth = Math.max(1, depth - 1);
    }
    // 2. ALIGNMENT: Max depth constrained by intent strength
    else {
      const limits = { weak: 2, medium: 3, strong: 5 };
      const maxAllowed = limits[ir.intentStrength] || 2;
      
      if (depth < maxAllowed) {
        depth++;
      }
    }

    this.sm.updateContext({ depthLevel: depth });
  }

  /** Dynamically score engagement based on input quality and signals */
  _scoreEngagement(input, ir) {
    let d = 0;

    // Input quality
    if (ir.quality.detail === 'high')   d += 8;
    else if (ir.quality.detail === 'medium') d += 4;
    else if (ir.quality.words <= 1 && !this.intent.isPositive(input)) d -= 3;

    // Urgency
    if (ir.urgency && ir.urgency.value === 'high') d += 10;
    else if (ir.urgency && ir.urgency.value === 'low') d -= 3;

    // Intent clarity
    if (ir.intentStrength === 'strong' || ir.intentStrength === 'high') d += 5;

    // Sentiment (retained from old intent structure fallback map)
    if (this.intent.isPositive(input)) d += 8;
    if (this.intent.isNegative(input)) d -= 10;
    if (ir.intent === INTENTS.OBJECTION) d -= 8;
    
    // UserType Tone Map
    if (ir.userType === 'direct') d += 5;
    if (ir.userType === 'exploratory') d += 2;
    if (ir.userType === 'skeptical') d -= 5;
    if (ir.userType === 'confused') d -= 2;

    this.sm.adjustEngagement(d);
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 3 — EVALUATE STATE
  // ═══════════════════════════════════════════════════════════════

  _step3_evaluateState(input, ir) {
    const ctx = this.sm.getContext();
    return {
      state:           this.sm.getState(),
      engagement:      ctx.engagementScore,
      level:           this.sm.getEngagementLevel(),
      flowStep:        ctx.flowStep,
      activeFlow:      ctx.activeFlow,
      intent:          ctx.intent,
      turnCount:       ctx.turnCount,

      // Flags
      fastTrack:       ctx.engagementScore > 65 || ctx.urgency === 'high',
      isInterruption:  ir.isInterruption,
      // Objection only dominates when no stronger service intent exists
      isObjection:     (ir.intent === INTENTS.OBJECTION || this.objections.isObjection(input))
                       && !SERVICE_INTENTS.has(ir.intent),
      isPositive:      this.intent.isPositive(input),
      isNegative:      this.intent.isNegative(input),
      hasService:      SERVICE_INTENTS.has(ir.intent),
      hasIntent:       ir.intent !== INTENTS.UNKNOWN && ir.intentStrength !== 'weak',
      isGeneral:       ir.intent === INTENTS.GENERAL_INQUIRY,
      isLow:           ir.intent === INTENTS.LOW_INTENT,
      hasLead:         this.leads.hasMinimumData(),
      hasName:         this.leads.hasField('name'),
      hasGoal:         !!ctx.leadData.goal,
      hasProblem:      !!ctx.leadData.problem,
      inFlow:          this.sm.isInFlow(),
      unclearStreak:   this._unclear,
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 4 — CHOOSE GOAL
  // ═══════════════════════════════════════════════════════════════

  _step4_chooseGoal(ev) {
    // Objection overrides everything except ENDED
    if (ev.isObjection && ev.state !== STATES.ENDED) return 'handle_objection';

    // Interruption overrides flow
    if (ev.isInterruption) return 'reroute';

    switch (ev.state) {

      case STATES.GREETING:
        if (ev.hasService)  return 'position_solution';
        if (ev.isGeneral)   return 'position_solution';
        if (ev.isLow)       return 'identify_problem';
        if (ev.hasIntent)   return 'identify_problem';
        return 'identify_problem';

      case STATES.DISCOVERY:
        if (ev.hasService)  return 'position_solution';
        if (ev.isGeneral)   return 'position_solution';
        if (ev.isNegative)  return 'exit';
        if (ev.unclearStreak >= 2) return 'clarify';
        return 'identify_problem';

      case STATES.INTENT_DETECTED:
        return 'explore_context';

      case STATES.FLOW_WEBSITE:
      case STATES.FLOW_SEO:
      case STATES.FLOW_AI:
      case STATES.FLOW_APP:
        if (ev.state === STATES.FLOW_GENERAL && ev.hasService) return 'position_solution';
        
        // Check if flow is EXHAUSTED (all steps including positioning have been shown)
        { const s = this.flows.getStep(ev.state, ev.flowStep);
          if (!s && ev.flowStep > 0) {
            // All flow steps delivered — now close based on sentiment
            if (ev.isPositive) return 'close';
            if (ev.isNegative) return 'handle_objection';
            return 'close'; // Default: attempt soft close after full flow
          }
        }

        // Fast-path close ONLY after ALL flow steps have been shown + high engagement
        if (ev.fastTrack && ev.flowStep >= 4 && (ev.hasGoal || ev.hasProblem)) return 'close';

        return 'explore_context';

      case STATES.FLOW_GENERAL:
        // If a specific service intent is detected, pivot to that flow
        if (ev.hasService) return 'position_solution';
        // Only close after all general flow steps done AND we have enough context
        if (ev.flowStep >= 2 && (ev.hasGoal || ev.hasProblem) && ev.isPositive) return 'close';
        return 'explore_context';

      case STATES.LEAD_CAPTURE:
        return ev.hasLead ? 'close' : 'capture_lead';

      case STATES.CLOSING:
        // User agreed → capture lead data if needed
        if (ev.isPositive && !ev.hasLead) return 'capture_lead';
        if (ev.isPositive && ev.hasLead) return 'close';
        if (ev.isNegative) return 'exit';
        // User provided new info while in closing → acknowledge and re-explore
        if (ev.hasService || ev.hasIntent) return 'explore_context';
        return 'close';

      case STATES.OBJECTION:
        if (ev.isPositive) return ev.activeFlow ? 'resume' : 'explore_context';
        if (ev.isNegative) return 'exit';
        return 'identify_problem';

      case STATES.FALLBACK:
        if (ev.hasService || ev.isGeneral) return 'position_solution';
        if (ev.hasIntent)    return 'identify_problem';
        return 'clarify';

      case STATES.ENDED:
        return 'ended';

      default:
        return 'identify_problem';
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 5 — SELECT ACTION
  // ═══════════════════════════════════════════════════════════════

  _step5_selectAction(goal, ev, ir) {
    switch (goal) {

      case 'identify_problem':
        if (ev.isLow) return { type: ACT.ASK, style: 'light' };
        if (ev.unclearStreak >= 2) return { type: ACT.FALLBACK };
        return { type: ACT.ASK };

      case 'explore_context':
        if (ev.state === STATES.INTENT_DETECTED) {
          const f = this.flows.intentToFlow(ev.intent);
          return { type: ACT.POSITION, flow: f };
        }
        if (ev.state === STATES.OBJECTION) {
          return ev.activeFlow
            ? { type: ACT.RESUME }
            : { type: ACT.ASK };
        }
        return { type: ACT.ASK, flowCtx: FLOW_CTX[ev.state] || null };

      case 'position_solution':
        return { type: ACT.POSITION, flow: this.flows.intentToFlow(ir.intent) };

      case 'capture_lead':
        return { type: ACT.CAPTURE };

      case 'close':
        return { type: ACT.CLOSE };

      case 'close_transition':
        return { type: ACT.CLOSE_TRANSITION };

      case 'handle_objection':
        return { type: ACT.OBJECTION };

      case 'reroute':
        return { type: ACT.REROUTE, newIntent: ir.intent };

      case 'resume':
        return { type: ACT.RESUME };

      case 'exit':
        return { type: ACT.EXIT };

      case 'clarify':
        return { type: ACT.FALLBACK };

      case 'ended':
        return { type: ACT.ENDED };

      default:
        return { type: ACT.FALLBACK };
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 6 — GENERATE RESPONSE
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  //  STEP 6 — GENERATE RESPONSE (Module-Routed)
  // ═══════════════════════════════════════════════════════════════

  _step6_generateResponse(act, ir, input) {
    const ctx = this.sm.getContext();
    const ld  = this.leads.getData();
    let response;

    switch (act.type) {

      // ── EXIT / ENDED ──────────────────────────────────────────
      case ACT.EXIT:
        this._transTo(STATES.ENDED);
        return this.closing.getExit();

      case ACT.ENDED:
        return "Thanks for chatting! Click 'New Chat' to start a new conversation.";

      // ── OBJECTION ─────────────────────────────────────────────
      case ACT.OBJECTION: {
        const obj = this.objections.handle(input);
        if (obj.shouldExit) this._transTo(STATES.ENDED);
        else this._transTo(STATES.OBJECTION);
        return obj.response;
      }

      // ── CLOSE ─────────────────────────────────────────────────
      case ACT.CLOSE: {
        const level = this.sm.getEngagementLevel();
        const cl = this.closing.getClose(level);
        this._transTo(STATES.CLOSING);
        // If we know their name, personalize
        if (ld.name) return `${ld.name}, ${cl.response.charAt(0).toLowerCase()}${cl.response.slice(1)}`;
        return cl.response;
      }

      // ── CAPTURE LEAD DATA ─────────────────────────────────────
      case ACT.CAPTURE: {
        this._transTo(STATES.LEAD_CAPTURE);
        const next = this.leads.getNextCapture();
        if (!next) {
          // All data captured — transition to close
          return this.closing.getClose(this.sm.getEngagementLevel()).response;
        }
        this._capField = next.field;
        // Add a warm bridge before the capture question
        const bridge = this.personality.getPhrase('bridge');
        return `${bridge} ${next.prompt}`;
      }

      // ── POSITION SOLUTION (Enter a flow) ──────────────────────
      case ACT.POSITION: {
        if (act.flow && this._transToFlow(act.flow)) {
          this.sm.resetFlowStep();
          const step = this.flows.getStep(act.flow, 0);
          if (step) {
            this.sm.advanceFlowStep();
            // If we have an insight, lead with it, then ask the flow question
            if (ir.insight && ir.insight !== this.kb.fallbackInsight) {
              const ack = this.personality.getPhrase('acknowledge');
              return `${ack} ${ir.insight}. ${step.prompt}`;
            }
            return step.prompt;
          }
        }
        // Fallthrough: use builder if flow entry fails
        return this._buildInsightResponse(ir, ctx, ld);
      }

      // ── RESUME FLOW ───────────────────────────────────────────
      case ACT.RESUME: {
        const activeFlow = ctx.activeFlow;
        if (activeFlow) {
          const step = this.flows.getStep(activeFlow, ctx.flowStep);
          if (step) {
            this.sm.advanceFlowStep();
            const redirect = this.personality.getPhrase('redirect');
            return `${redirect} ${step.prompt}`;
          }
        }
        // Flow complete — bridge to close
        return this._bridgeToClose(ld);
      }

      // ── REROUTE (User changed topic) ──────────────────────────
      case ACT.REROUTE: {
        const newFlow = this.flows.intentToFlow(act.newIntent);
        if (newFlow && this._transToFlow(newFlow)) {
          this.sm.resetFlowStep();
          const step = this.flows.getStep(newFlow, 0);
          if (step) {
            this.sm.advanceFlowStep();
            return `Absolutely — let's talk about that instead. ${step.prompt}`;
          }
        }
        return this._buildInsightResponse(ir, ctx, ld);
      }

      // ── ASK QUESTION (Discovery) ──────────────────────────────
      case ACT.ASK: {
        const activeFlow = ctx.activeFlow;

        // ── GENERAL FLOW PIVOT: if service intent detected, switch to that flow ──
        if (activeFlow === STATES.FLOW_GENERAL) {
          const serviceFlow = this.flows.intentToFlow(ir.intent);
          if (serviceFlow && this._transToFlow(serviceFlow)) {
            this.sm.resetFlowStep();
            const step = this.flows.getStep(serviceFlow, 0);
            if (step) {
              this.sm.advanceFlowStep();
              const ack = this.personality.getPhrase('acknowledge');
              return `${ack} ${step.prompt}`;
            }
          }
        }

        // ── ACTIVE SERVICE FLOW: use the flow's questions ────────
        if (activeFlow && this.flows.hasFlow(activeFlow) && activeFlow !== STATES.FLOW_GENERAL) {
          const step = this.flows.getStep(activeFlow, ctx.flowStep);
          if (step) {
            this.sm.advanceFlowStep();
            if (ir.insight && ir.insight !== this.kb.fallbackInsight) {
              return this.personality.compose(`${ir.insight}. ${step.prompt}`, { acknowledge: true });
            }
            return this.personality.compose(step.prompt, { acknowledge: true });
          }
          // Flow questions exhausted — bridge to close
          return this._bridgeToClose(ld);
        }

        // ── GENERAL FLOW: use the general flow's own steps ───────
        if (activeFlow === STATES.FLOW_GENERAL) {
          const step = this.flows.getStep(activeFlow, ctx.flowStep);
          if (step) {
            this.sm.advanceFlowStep();
            return this.personality.compose(step.prompt, { acknowledge: true });
          }
        }

        // ── NOT IN A FLOW: use Discovery Engine ──────────────────
        const flowCtx = act.flowCtx || null;
        const disc = this.discovery.getNextQuestion(flowCtx, ctx.depthLevel);

        if (ir.insight && ir.insight !== this.kb.fallbackInsight) {
          return this.personality.compose(`${ir.insight}. ${disc.question}`, { acknowledge: true });
        }
        return this.personality.compose(disc.question, { acknowledge: act.style !== 'light' });
      }

      // ── FALLBACK ──────────────────────────────────────────────
      case ACT.FALLBACK: {
        const fb = this.fallback.getResponse();
        if (fb.shouldEscalate) {
          this._transTo(STATES.FALLBACK);
        }
        return fb.response;
      }

      // ── DEFAULT: Use ResponseBuilder for KB insight turns ─────
      default:
        return this._buildInsightResponse(ir, ctx, ld);
    }
  }

  /** Build a KB-enriched insight response (used as fallback assembly) */
  _buildInsightResponse(ir, ctx, ld) {
    let qType = 'DIAGNOSE';
    if ((ctx.depthLevel || 1) <= 1) qType = 'CLARIFY';
    if ((ctx.depthLevel || 1) >= 4) qType = 'CONFIRM';
    if ((ctx.depthLevel || 1) >= 5) qType = 'CLOSE';

    return this.builder.build({
      insight: ir.insight || this.kb.fallbackInsight,
      outcome: ir.kbOutcome,
      leadData: ld,
      depthLevel: ctx.depthLevel || 1,
      questionType: qType,
      intentStrength: ir.intentStrength,
      userType: ir.userType,
      forceShort: false
    });
  }

  /** Bridge from exhausted flow to closing transition */
  _bridgeToClose(ld) {
    const level = this.sm.getEngagementLevel();
    if (level === 'high') {
      return this.closing.getClose('high').response;
    }
    const bridge = this.personality.getPhrase('softClose');
    return bridge;
  }

  // ═══════════════════════════════════════════════════════════════
  //  TRANSITION HELPERS
  // ═══════════════════════════════════════════════════════════════

  /** Try a single transition. Returns true on success. */
  _transTo(target) {
    if (this.sm.canTransition(target)) {
      this.sm.transition(target);
      return true;
    }
    return false;
  }

  /** Navigate to a flow state through whatever path is available. */
  _transToFlow(targetFlow) {
    // Already there
    if (this.sm.getState() === targetFlow) return true;

    // Direct
    if (this.sm.canTransition(targetFlow)) {
      this.sm.transition(targetFlow);
      return true;
    }
    // Via INTENT_DETECTED
    if (this.sm.canTransition(STATES.INTENT_DETECTED)) {
      this.sm.transition(STATES.INTENT_DETECTED, { intent: this.sm.getContext().intent });
      if (this.sm.canTransition(targetFlow)) {
        this.sm.transition(targetFlow);
        return true;
      }
    }
    return false;
  }
}

