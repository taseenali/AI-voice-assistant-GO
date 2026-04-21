/**
 * Response Orchestrator v3 — Config-Driven Adaptive Conversation Engine
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
 *   - CONFIG-DRIVEN: All modules receive config from AppContext
 *   - CONVERSION ANCHORS: CTA injection after 3+ turns without goal progress
 *   - ACTION LAYER: Webhook trigger on lead capture, calendar URL injection
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
import { AppContext }               from './config/loader.js';

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
  CTA:        'cta_injection',
};

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

    // All modules are initialized with config already loaded via AppContext
    this.intent       = new IntentDetector();
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

    // ── SERVICE_INTENTS: dynamically from config ─────────────
    this.SERVICE_INTENTS = this.intent.getServiceIntentKeys();

    // Internal
    this._capField     = null;   // Field currently being captured
    this._unclear      = 0;      // Consecutive unclear inputs

    // ── Conversion Anchor tracking ──────────────────────────
    this._turnsSinceGoalProgress = 0;
    this._CTA_THRESHOLD = 3;     // Inject CTA after this many turns without progress

    // ── Conversation Router (pre-pipeline gate) ──────────────
    this.router        = new ConversationRouter();
    this.routerHandlers= new RouterHandlers();

    // ── Action Layer ─────────────────────────────────────────
    this._webhookSentPartial = false;
    this._webhookSentFinal   = false;
    this._lastCTATurn        = -5; // prevent immediate fire
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
    // Config-aware: uses first two service flows for demo
    const config = AppContext.getConfig();
    const demoServices = (config.services || []).slice(0, 2);
    
    if (demoServices.length >= 1) {
      const svc0 = demoServices[0];
      const demoKey0 = svc0.intent_key.toLowerCase().replace(/_/g, ' ');
      if (lower.includes(`demo ${demoKey0}`) || lower.includes(`${demoKey0} demo`)) {
        this.sm.transition(STATES.FLOW_WEBSITE);
        this.sm.updateContext({ engagementScore: 100, urgency: 'high', intent: svc0.intent_key, flowStep: 0, conversationGoal: GOALS.EXPLORE_CONTEXT });
        const step = this.flows.getStep(STATES.FLOW_WEBSITE, 0);
        return step ? step.prompt : `Tell me more about what you need regarding ${svc0.name}.`;
      }
    }
    if (demoServices.length >= 2) {
      const svc1 = demoServices[1];
      const demoKey1 = svc1.intent_key.toLowerCase().replace(/_/g, ' ');
      if (lower.includes(`demo ${demoKey1}`) || lower.includes(`${demoKey1} demo`)) {
        this.sm.transition(STATES.FLOW_SEO);
        this.sm.updateContext({ engagementScore: 100, urgency: 'high', intent: svc1.intent_key, flowStep: 0, conversationGoal: GOALS.EXPLORE_CONTEXT });
        const step = this.flows.getStep(STATES.FLOW_SEO, 0);
        return step ? step.prompt : `Tell me more about what you need regarding ${svc1.name}.`;
      }
    }

    // ═══ CONVERSATION ROUTER — pre-pipeline gate ═══════════
    const quickRoute = this.router.route(input, null, this._unclear);

    if (quickRoute.type !== ROUTE_TYPE.CORE) {
      if (quickRoute.type === ROUTE_TYPE.NOISE) {
        this._unclear++;
        this._turnsSinceGoalProgress++;
      } else {
        this._unclear = 0;
      }

      const routeResponse = this.routerHandlers.handle(quickRoute.type, this._unclear);
      this.sm.addToMemory({ role: 'user', text: input });
      this.sm.addToMemory({ role: 'assistant', text: routeResponse });
      return routeResponse;
    }

    // ── CORE input confirmed — reset unclear streak ──────────
    this._unclear = 0;

    if (this.sm.getState() === STATES.GREETING) {
      this.sm.transition(STATES.DISCOVERY);
    }

    // ═══ 6-STEP PIPELINE ═══

    let ir     = this._step1_detectIntent(input);
    const ctx  = this.sm.getContext();

    // KNOWLEDGE INTEGRATION (Phase KB)
    const kbData = this.kb.analyze(ir, ctx, input, ctx.depthLevel || 1);
    
    if ((!ir.intent || ir.intent === INTENTS.UNKNOWN || ir.confidence.intent < 0.5) && kbData.confidence > 0.6) {
       ir.intent = kbData.recommendedIntent;
    }
    ir.insight = kbData.insight;
    ir.kbOutcome = kbData.outcome;

    this._step2_updateContext(input, ir);
    this._updateDepthLevel(ir);

    const ev   = this._step3_evaluateState(input, ir);
    const goal = this._step4_chooseGoal(ev);
    const act  = this._step5_selectAction(goal, ev, ir);
    const raw  = this._step6_generateResponse(act, ir, input);

    // ── CONVERSION ANCHOR: Track goal progress ──────────────
    this._trackGoalProgress(goal, ev);

    // ── ACTION LAYER: Check Partial Lead Capture ─────────────
    if (!this._webhookSentPartial && this.leads.hasMinimumData()) {
      this._webhookSentPartial = true;
      this._triggerWebhook('partial');
    }

    this.sm.addToMemory({ role: 'assistant', text: raw });
    console.log(`[Orchestrator] Action triggered: ${act.type} logic.`);
    return raw;
  }

  reset() {
    this.sm.reset();
    this.discovery.reset();
    this.leads.reset();
    this.fallback.reset();
    this._capField     = null;
    this._unclear      = 0;
    this._turnsSinceGoalProgress = 0;
    this._lastCTATurn  = -5;
    this._webhookSentPartial = false;
    this._webhookSentFinal   = false;
    // Router handlers have round-robin state — reset for fresh conversation
    this.routerHandlers = new RouterHandlers();
  }

  getLeadData()         { return this.leads.getData(); }
  getLeadCompleteness() { return this.leads.getCompleteness(); }


  // ═══════════════════════════════════════════════════════════════
  //  CONVERSION ANCHOR SYSTEM
  // ═══════════════════════════════════════════════════════════════

  /**
   * Track turns since last meaningful goal progress.
   * If threshold exceeded, the next turn will inject a CTA.
   */
  _trackGoalProgress(goal, ev) {
    const progressGoals = ['position_solution', 'close', 'capture_lead', 'reroute'];
    
    if (progressGoals.includes(goal) || ev.isPositive) {
      this._turnsSinceGoalProgress = 0;
    } else {
      this._turnsSinceGoalProgress++;
    }
  }

  /**
   * Check if a CTA should be injected this turn.
   */
  _shouldInjectCTA(ev, ir) {
    const turnCount = this.sm.getContext().turnCount;
    // Cooldown verification to prevent over-pushing (wait at least 2 turns between CTAs)
    if (turnCount - this._lastCTATurn < 2) return false;

    let shouldTrigger = false;

    // 1. User hesitation (skepticism or confusion)
    if (ir && (ir.userType === 'skeptical' || ir.userType === 'confused')) shouldTrigger = true;
    
    // 2. Unclear streak (user keeps giving noise)
    if (this._unclear >= 2) shouldTrigger = true;
    
    // 3. Stalled general progress
    if (this._turnsSinceGoalProgress >= this._CTA_THRESHOLD) shouldTrigger = true;
    
    // 4. Parital qualification achieved but stalled
    const hasLead = this.leads.hasMinimumData();
    if (hasLead && ir && (ir.intent !== 'POSITIVE' && ir.intent !== 'YES') && this._turnsSinceGoalProgress >= 2) shouldTrigger = true;

    return shouldTrigger;
  }

  /**
   * Get a CTA from config templates.
   */
  _getCTA() {
    const config = AppContext.getConfig();
    const templates = config.cta_templates || [];
    if (templates.length === 0) return "Would you like to take the next step?";

    // Round-robin through CTA templates
    if (!this._ctaCounter) this._ctaCounter = 0;
    const idx = this._ctaCounter % templates.length;
    this._ctaCounter++;
    return templates[idx];
  }


  // ═══════════════════════════════════════════════════════════════
  //  ACTION LAYER — Webhook & Booking
  // ═══════════════════════════════════════════════════════════════

  /**
   * Send lead data via webhook. Includes error handling, timeout, and retry.
   * Prevents spam through partial and final tracking.
   */
  async _triggerWebhook(stage = 'final') {
    if (stage === 'final' && this._webhookSentFinal) return;
    if (stage === 'final') this._webhookSentFinal = true;

    const config = AppContext.getConfig();
    const webhookUrl = config.webhook_url;
    
    if (!webhookUrl) {
      console.log(`[ActionLayer] No webhook URL configured for stage: ${stage}. Payload:`, JSON.stringify(this.leads.getData()));
      return;
    }

    const payload = {
      client_id:    config.company_name || 'unknown',
      conversation_stage: stage,
      lead_data:    this.leads.getData(),
      conversation_meta: {
        intent:      this.sm.getContext().intent || 'none',
        turn_count:  this.sm.getContext().turnCount || 0
      },
      timestamp:    new Date().toISOString()
    };

    const attemptFetch = async (retryCount = 0) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (res.ok) {
          console.log(`[ActionLayer] Webhook ${stage} sent successfully.`);
        } else {
          console.warn(`[ActionLayer] Webhook failed (${res.status}).`);
          if (retryCount < 1) {
            console.log(`[ActionLayer] Retrying webhook in 2s...`);
            setTimeout(() => attemptFetch(retryCount + 1), 2000);
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('[ActionLayer] Webhook error:', err.message);
        if (err.name === 'AbortError' && retryCount < 1) {
          console.log(`[ActionLayer] Webhook timed out. Retrying in 2s...`);
          setTimeout(() => attemptFetch(retryCount + 1), 2000);
        }
      }
    };

    attemptFetch(0);
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 1 — DETECT INTENT
  // ═══════════════════════════════════════════════════════════════

  _step1_detectIntent(input) {
    const ctx = this.sm.getContext();
    const nlpData = this.nlp.analyze(input, ctx);
    
    if (!nlpData) return null;

    const cur = ctx.intent;
    const inFlow = this.sm.isInFlow() && this.sm.getState() !== STATES.FLOW_GENERAL;
    let isInterrupt = false;

    // Primary interruption — service intent switch during active flow
    if (this.SERVICE_INTENTS.has(cur) && this.SERVICE_INTENTS.has(nlpData.intent) &&
        nlpData.intent !== cur && nlpData.intentStrength !== 'weak' && inFlow) {
      isInterrupt = true;
    }

    nlpData.isInterruption = isInterrupt;

    // NOISE STABILIZATION
    if (nlpData.intentStrength === 'weak' && nlpData.stableIntent && nlpData.confidenceTrend > 0.6) {
      nlpData.intent = nlpData.stableIntent;
      nlpData.intentStrength = 'moderate';
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
    if (nlpData.secondaryIntent && this.SERVICE_INTENTS.has(nlpData.secondaryIntent) && !ld.problem) {
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

    if (ir.userType === 'confused' || ir.confidence.lowConfidence) {
      depth = Math.max(1, depth - 1);
    }
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

    if (ir.quality.detail === 'high')   d += 8;
    else if (ir.quality.detail === 'medium') d += 4;
    else if (ir.quality.words <= 1 && !this.intent.isPositive(input)) d -= 3;

    if (ir.urgency && ir.urgency.value === 'high') d += 10;
    else if (ir.urgency && ir.urgency.value === 'low') d -= 3;

    if (ir.intentStrength === 'strong' || ir.intentStrength === 'high') d += 5;

    if (this.intent.isPositive(input)) d += 8;
    if (this.intent.isNegative(input)) d -= 10;
    if (ir.intent === INTENTS.OBJECTION) d -= 8;
    
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
      isObjection:     (ir.intent === INTENTS.OBJECTION || this.objections.isObjection(input))
                       && !this.SERVICE_INTENTS.has(ir.intent),
      isPositive:      this.intent.isPositive(input),
      isNegative:      this.intent.isNegative(input),
      hasService:      this.SERVICE_INTENTS.has(ir.intent),
      hasIntent:       ir.intent !== INTENTS.UNKNOWN && ir.intentStrength !== 'weak',
      isGeneral:       ir.intent === INTENTS.GENERAL_INQUIRY,
      isLow:           ir.intent === INTENTS.LOW_INTENT,
      hasLead:         this.leads.hasMinimumData(),
      hasName:         this.leads.hasField('name'),
      hasGoal:         !!ctx.leadData.goal,
      hasProblem:      !!ctx.leadData.problem,
      inFlow:          this.sm.isInFlow(),
      unclearStreak:   this._unclear,
      isFlowMismatch:  this.sm.isInFlow() && this.SERVICE_INTENTS.has(ir.intent) && ir.intentStrength !== 'weak' && this.sm.getState() !== this.flows.intentToFlow(ir.intent),
      
      // Conversion Anchor flag
      needsCTA:        this._shouldInjectCTA(this, ir)
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 4 — CHOOSE GOAL
  // ═══════════════════════════════════════════════════════════════

  _step4_chooseGoal(ev) {
    // Objection overrides everything except ENDED
    if (ev.isObjection && ev.state !== STATES.ENDED) return 'handle_objection';

    // Interruption or flow mismatch overrides flow logic and guarantees a reroute
    if (ev.isInterruption || ev.isFlowMismatch) return 'reroute';

    // ── CONVERSION ANCHOR: inject CTA if stalled ────────────
    if (ev.needsCTA && ev.state !== STATES.GREETING && ev.state !== STATES.ENDED && ev.state !== STATES.CLOSING) {
      return 'inject_cta';
    }

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
        
        { const s = this.flows.getStep(ev.state, ev.flowStep);
          if (!s && ev.flowStep > 0) {
            if (ev.isPositive) return 'close';
            if (ev.isNegative) return 'handle_objection';
            return 'close';
          }
        }

        if (ev.fastTrack && ev.flowStep >= 4 && (ev.hasGoal || ev.hasProblem)) return 'close';

        return 'explore_context';

      case STATES.FLOW_GENERAL:
        if (ev.hasService) return 'position_solution';
        if (ev.flowStep >= 2 && (ev.hasGoal || ev.hasProblem) && ev.isPositive) return 'close';
        return 'explore_context';

      case STATES.LEAD_CAPTURE:
        return ev.hasLead ? 'close' : 'capture_lead';

      case STATES.CLOSING:
        if (ev.isPositive && !ev.hasLead) return 'capture_lead';
        if (ev.isPositive && ev.hasLead) return 'close';
        if (ev.isNegative) return 'exit';
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

      case 'inject_cta':
        return { type: ACT.CTA };

      case 'ended':
        return { type: ACT.ENDED };

      default:
        return { type: ACT.FALLBACK };
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 6 — GENERATE RESPONSE (Module-Routed)
  // ═══════════════════════════════════════════════════════════════

  _step6_generateResponse(act, ir, input) {
    const ctx = this.sm.getContext();
    const ld  = this.leads.getData();

    switch (act.type) {

      // ── EXIT / ENDED ──────────────────────────────────────────
      case ACT.EXIT:
        this._transTo(STATES.ENDED);
        // Trigger webhook on exit if we have lead data
        if (this.leads.getCompleteness() > 0) {
          this._triggerWebhook();
        }
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
        // Trigger webhook on close
        if (this.leads.getCompleteness() > 0) {
          this._triggerWebhook('final');
        }
        if (ld.name) return `${ld.name}, ${cl.response.charAt(0).toLowerCase()}${cl.response.slice(1)}`;
        return cl.response;
      }

      // ── CAPTURE LEAD DATA ─────────────────────────────────────
      case ACT.CAPTURE: {
        this._transTo(STATES.LEAD_CAPTURE);
        const next = this.leads.getNextCapture();
        if (!next) {
          // All data captured — trigger webhook and close
          this._triggerWebhook('final');
          return this.closing.getClose(this.sm.getEngagementLevel()).response;
        }
        this._capField = next.field;
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
            if (ir.insight && ir.insight !== this.kb.fallbackInsight) {
              const ack = this.personality.getPhrase('acknowledge');
              return `${ack} ${ir.insight}. ${step.prompt}`;
            }
            return step.prompt;
          }
        }
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

      // ── CTA INJECTION (Conversion Anchor) ─────────────────────
      case ACT.CTA: {
        this._turnsSinceGoalProgress = 0; // Reset after injection
        this._lastCTATurn = this.sm.getContext().turnCount; // Log invocation
        console.log(`[Orchestrator] Invoking CTA element`);
        const cta = this._getCTA();
        const ack = this.personality.getPhrase('acknowledge');
        return `${ack} ${cta}`;
      }

      // ── ASK QUESTION (Discovery) ──────────────────────────────
      case ACT.ASK: {
        const activeFlow = ctx.activeFlow;

        // ── GENERAL FLOW PIVOT ──
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

        // ── ACTIVE SERVICE FLOW ──
        if (activeFlow && this.flows.hasFlow(activeFlow) && activeFlow !== STATES.FLOW_GENERAL) {
          const step = this.flows.getStep(activeFlow, ctx.flowStep);
          if (step) {
            this.sm.advanceFlowStep();
            if (ir.insight && ir.insight !== this.kb.fallbackInsight) {
              return this.personality.compose(`${ir.insight}. ${step.prompt}`, { acknowledge: true });
            }
            return this.personality.compose(step.prompt, { acknowledge: true });
          }
          return this._bridgeToClose(ld);
        }

        // ── GENERAL FLOW ──
        if (activeFlow === STATES.FLOW_GENERAL) {
          const step = this.flows.getStep(activeFlow, ctx.flowStep);
          if (step) {
            this.sm.advanceFlowStep();
            return this.personality.compose(step.prompt, { acknowledge: true });
          }
        }

        // ── NOT IN A FLOW: use Discovery Engine ──
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

  _transTo(target) {
    if (this.sm.canTransition(target)) {
      this.sm.transition(target);
      return true;
    }
    return false;
  }

  _transToFlow(targetFlow) {
    if (this.sm.getState() === targetFlow) return true;

    if (this.sm.canTransition(targetFlow)) {
      this.sm.transition(targetFlow);
      return true;
    }
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
