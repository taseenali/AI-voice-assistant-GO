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
 *   - Auto-extraction (name, medical_practice, urgency from ANY input)
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
import { Personality, TONE_STATES }   from './modules/personality.js';
import { KnowledgeEngine }          from './knowledge/knowledge-engine.js';
import { ResponseBuilder }          from './modules/response-builder.js';
import { MemorySynthesis }          from './modules/memory-synthesis.js';
import { ConversationRouter, ROUTE_TYPE } from './router/conversation-router.js';
import { RouterHandlers }           from './router/router-handlers.js';
import { AppContext }               from './config/loader.js';
import { webhookDispatcher }        from './services/webhook-dispatcher.js'; // GAP-ORCH-01 fix
import { llmAdapter }               from './services/llm-adapter.js';        // G-027
import { conversationLogger }       from './services/conversation-logger.js'; // P0-6
import { emergencyDetector }        from './modules/emergency-detector.js';  // G-028
import { extractDateTime }         from './nlp/nlp-temporal-extractor.js'; // GAP-ORCH-02


// ─── Action Types ──────────────────────────────────────────────
const ACT = {
  ASK:        'ask_question',
  CLARIFY:    'clarify',
  POSITION:   'position_solution',
  CAPTURE:    'capture_data',
  OBJECTION:  'handle_objection',
  CLOSE:      'close',
  CLOSE_TRANSITION: 'close_transition',
  BOOKING_CONFIRM:  'booking_confirmation',
  FALLBACK:   'fallback',
  REROUTE:    'reroute',
  RESUME:     'resume_flow',
  EXIT:       'exit',
  ENDED:      'ended',
  CTA:        'cta_injection',
};

// ─── Flow Context Map ──────────────────────────────────────────
const FLOW_CTX = {
  // Medical flow contexts are dynamic from config.intent_key
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
    this.memory       = new MemorySynthesis();

    // ── SERVICE_INTENTS: dynamically from config ─────────────
    this.SERVICE_INTENTS = this.intent.getServiceIntentKeys();

    // Internal
    this._capField     = null;   // Field currently being captured
    this._unclear      = 0;      // Consecutive unclear inputs

    // ── Conversion Anchor tracking ──────────────────────────
    this._turnsSinceGoalProgress = 0;
    this._CTA_THRESHOLD = 3;     // Inject CTA after this many turns without progress
    this._ctaShown = false;      // True when CTA was just shown — next positive → capture_lead

    // ── Conversation Router (pre-pipeline gate) ──────────────
    this.router        = new ConversationRouter();
    this.routerHandlers= new RouterHandlers();

    // ── Action Layer ─────────────────────────────────────────
    this._webhookSentPartial = false;
    this._webhookSentFinal   = false;
    this._lastCTATurn        = -5; // prevent immediate fire

    // ── G-027: LLM Adapter reference (singleton — shared across sessions) ──
    this.llm = llmAdapter;

    // ── G-028: Emergency Detector (deterministic guardrail) ──────────────
    this.emergency = emergencyDetector;
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

  async processInput(userInput, onToken = null) {
    if (!userInput || !userInput.trim()) return null;
    const input = userInput.trim();
    const lower = input.toLowerCase();

    // ═══ G-028: EMERGENCY DETECTOR — runs FIRST, before all routing ═════════════
    // Deterministic keyword guardrail. Bypasses entire pipeline on match.
    // NEVER rely on LLM for safety-critical paths (T02 architectural decision).
    const emergencyResult = this.emergency.scan(input);
    if (emergencyResult.detected) {
      this.sm.addToMemory({ role: 'user',      text: input });
      this.sm.addToMemory({ role: 'assistant', text: emergencyResult.response });
      if (onToken) onToken(emergencyResult.voiceResponse || emergencyResult.response);
      return emergencyResult.response;
    }

    if (this.sm.getState() === STATES.ENDED) {
      const resp = "Thanks for chatting! Click 'New Chat' to start a new conversation.";
      if (onToken) onToken(resp);
      return resp;
    }

    // ── DEMO MODE INTERCEPT (Disabled for Medical Purge) ──

    // ═══ CONVERSION ROUTER — pre-pipeline gate ═══════════
    const quickRoute = this.router.route(input, null, this._unclear);

    if (quickRoute.type !== ROUTE_TYPE.CORE) {
      if (quickRoute.type === ROUTE_TYPE.NOISE) {
        this._unclear++;
        this._turnsSinceGoalProgress++;
      } else {
        this._unclear = 0;
      }
      
      if (quickRoute.type === ROUTE_TYPE.INTERRUPT) {
        const resp = this.fallback.getInterruptResponse().response;
        if (onToken) onToken(resp);
        return resp;
      }

      const routeResponse = this.routerHandlers.handle(quickRoute.type, this._unclear);
      this.sm.addToMemory({ role: 'user', text: input });
      this.sm.addToMemory({ role: 'assistant', text: routeResponse });
      if (onToken) onToken(routeResponse);
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

    // ── STEP 5: DEFERRED INTENT RESOLUTION & MULTI-INTENT PROCESSING ──
    if (ir && ir.multiIntents) {
      if (ir.multiIntents.length > 1) {
        console.log(`[Intent] Multiple detected`);
        const primary = ir.multiIntents[0];
        
        console.log(`[Intent] Primary → ${primary.intent}`);

        // Phase 3 Fix: Positional Analysis (Fallback resolution for complex dynamically injected intents)
        const getPos = (intentKey, defaultStr) => {
           const str = intentKey === INTENTS.NEGATIVE ? 'no' : intentKey.replace('FLOW_', '').toLowerCase();
           const idx = input.toLowerCase().search(new RegExp(`\\b${str}\\b`, 'i'));
           return idx !== -1 ? idx : 999;
        };

        const pPos = primary.position !== undefined && primary.position !== 999 ? primary.position : getPos(primary.intent);

        // Fix 3: Loop all remaining sequence intents correctly capturing dense conversational chains
        for (let i = 1; i < ir.multiIntents.length; i++) {
          const secondary = ir.multiIntents[i];
          const sPos = secondary.position !== undefined && secondary.position !== 999 ? secondary.position : getPos(secondary.intent);

          // Rule 3: Override Intent (Latest token wins / replaces all)
          if (secondary.type === 'override') {
            // Rule 3.1: Positional Modifier Check
            if (secondary.intent === INTENTS.NEGATIVE && pPos !== 999 && sPos < pPos) {
               console.log(`[IntentFix] Negative downgraded to modifier`);
               secondary.type = 'modifier'; // Defang the override
               ir.intent = primary.intent; 
            } else {
               console.log(`[IntentFix] Override applied`);
               ir.intent = secondary.intent;
               if (this.sm.hasDeferredIntent()) {
                  // Purge entire stack on true context switch
                  this.sm._deferredIntentStack = []; 
               }
               break; // Halts processing any further intents after a brutal context override
            }
          } 
          // Rule 2 & 4: Dependent/Primary (Defer logic)
          else if (secondary.type === 'dependent' || secondary.type === 'primary') {
            ir.intent = primary.intent; // Execute primary immediately
            this.sm.deferIntent(secondary); 
          }
        }
      }
    }

    // Handle Empty Input / Resolution Flow 
    const isReady = this._isAcknowledgmentReady(input, ir);
    const isStable = this.sm.isCurrentFlowStable();

    if (isReady && isStable && this.sm.hasDeferredIntent()) {
      const deferred = this.sm.popDeferredIntent();
      console.log(`[Intent] Resolved → ${deferred.intent}`);
      ir.intent = deferred.intent;
      ir.isDeferredResolution = true;
    }

    // KNOWLEDGE INTEGRATION (Phase KB)
    const kbData = this.kb.analyze(ir, ctx, input, ctx.depthLevel || 1);
    
    if ((!ir.intent || ir.intent === INTENTS.UNKNOWN || ir.confidence.intent < 0.5) && kbData.confidence > 0.6) {
       ir.intent = kbData.recommendedIntent;
    }
    ir.insight = kbData.insight;
    ir.kbOutcome = kbData.outcome;

    this._step2_updateContext(input, ir);
    this._updateDepthLevel(ir);

    // Update human behavioral state before evaluation
    this.memory.updateUserState(ir);

    // ── TONE TRIGGERS (Step 4 Layer) ──
    let toneTrigger = null;
    let toneReason = "none";
    const lowerInputForTone = input.toLowerCase();
    
    // Evaluate urgency explicit keywords
    const urgentMatch = lowerInputForTone.match(/(emergency|broken|urgent|leaking|crisis|asap|now)/);
    if (urgentMatch) {
      toneTrigger = TONE_STATES.URGENT;
      toneReason = `keyword "${urgentMatch[0]}"`;
    } 
    // Evaluate empathy implicitly
    else if (this._unclear > 0) {
      toneTrigger = TONE_STATES.EMPATHETIC;
      toneReason = "unclear streak";
    } else if (this.memory.getSnapshot().user_state.frustration_strikes > 0) {
      toneTrigger = TONE_STATES.EMPATHETIC;
      toneReason = "frustration strikes metric";
    } else {
      const empMatch = lowerInputForTone.match(/(confused|stuck|help this|not sure|hesitant|hard|difficult)/);
      if (empMatch) {
        toneTrigger = TONE_STATES.EMPATHETIC;
        toneReason = `keyword "${empMatch[0]}"`;
      }
    }

    this.personality.updateTone(toneTrigger, toneReason);

    const ev   = this._step3_evaluateState(input, ir);
    const goal = this._step4_chooseGoal(ev);
    const act  = this._step5_selectAction(goal, ev, ir);
    
    // ── STEP 6: GENERATE RESPONSE ──
    const response = await this._step6_generateResponse(act, ir, input, onToken);

    // Apply deferred resolution transition phrasing
    // Note: LLM responses shouldn't have arbitrary prepends that break the TTS stream,
    // so we handle this carefully. For now, we skip prepending to LLM streams.
    let finalResponse = response;
    if (ir && ir.isDeferredResolution && !this.llm.isEnabled) {
      finalResponse = `Also, regarding your other point... ${response}`;
    }

    // ── CONVERSION ANCHOR: Track goal progress ──────────────
    this._trackGoalProgress(goal, ev);

    // ── ACTION LAYER: Check Partial Lead Capture ─────────────
    // GAP-ORCH-01 fix: route through authenticated outbox dispatcher (not raw fetch)
    if (!this._webhookSentPartial && this.leads.hasMinimumData()) {
      this._webhookSentPartial = true;
      const ctx = this.sm.getContext();
      webhookDispatcher.dispatch('LEAD_PARTIAL', {
        ...this.leads.getData(),
        conversation_stage: 'partial',
        conversation_meta: { intent: ctx.intent || 'none', turn_count: ctx.turnCount || 0 }
      }).catch(err => console.warn('[Orchestrator] Partial webhook dispatch failed:', err.message));
    }

    this.sm.addToMemory({ role: 'assistant', text: finalResponse });

    // P0-6: Fire-and-forget audit log (failures are silent — must not block pipeline)
    const logCtx = this.sm.getContext();
    conversationLogger.log({ turn: logCtx.turnCount, role: 'user',      text: input,         state: logCtx.state, intent: logCtx.intent || '' });
    conversationLogger.log({ turn: logCtx.turnCount, role: 'assistant', text: finalResponse,  state: logCtx.state, intent: act.type      || '' });

    console.log(`[Orchestrator] Action triggered: ${act.type} logic.`);
    return finalResponse;
  }

  /**
   * Determine if the user has implicitly signaled readiness (acknowledgment != hesitation).
   */
  _isAcknowledgmentReady(input, ir) {
    if (!input || !input.trim()) return true;
    
    // Hesitation block
    if (/(hmm|um|uh|maybe|not sure|\bwait\b)/i.test(input)) return false;
    
    // Readiness confirmation
    if (ir && ir.intent === INTENTS.POSITIVE) return true;
    if (/(yeah|yes|okay|cool|sure|right|got it|sounds good)/i.test(input)) return true;
    
    return false;
  }

  reset() {
    this.sm.reset();
    this.discovery.reset();
    this.leads.reset();
    this.fallback.reset();
    this.memory.reset();
    this._capField     = null;
    this._unclear      = 0;
    this._turnsSinceGoalProgress = 0;
    this._lastCTATurn  = -5;
    this._ctaShown     = false;
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
  //  ACTION LAYER — Webhook Dispatch Helper
  //  GAP-ORCH-01 fix: _triggerWebhook() REMOVED.
  //  All webhook delivery now routes through webhookDispatcher.dispatch()
  //  which provides: HMAC auth, IndexedDB outbox, exponential backoff,
  //  dead-letter queue, and idempotency keys. No raw fetch() allowed here.
  // ═══════════════════════════════════════════════════════════════

  /**
   * Dispatch a final lead event through the secure, authenticated outbox.
   * Replaces the removed _triggerWebhook() method.
   * @param {string} stage - 'final' or 'exit'
   */
  _dispatchFinalLead(stage = 'final') {
    if (this._webhookSentFinal) return;
    this._webhookSentFinal = true;
    const ctx = this.sm.getContext();
    webhookDispatcher.dispatch('LEAD_FINAL', {
      ...this.leads.getData(),
      conversation_stage: stage,
      conversation_meta: { intent: ctx.intent || 'none', turn_count: ctx.turnCount || 0 }
    }).catch(err => console.warn('[Orchestrator] Final webhook dispatch failed:', err.message));
  }


  // ═══════════════════════════════════════════════════════════════
  //  STEP 1 — DETECT INTENT
  // ═══════════════════════════════════════════════════════════════

  _step1_detectIntent(input) {
    const ctx = this.sm.getContext();
    const nlpData = this.nlp.analyze(input, ctx);
    
    if (!nlpData) return null;

    // INTEGRATION FIX: Merge keyword-based intent detection (Config-driven services)
    const kwData = this.intent.detect(input);
    const isCorrection = /(actually\b|wait\b|instead\b|no\b|rather\b|not\b)/i.test(input);

    if (kwData.intent !== INTENTS.UNKNOWN && (kwData.confidence >= 0.25 || !nlpData.intent || nlpData.intent === INTENTS.UNKNOWN)) {
      // If keyword engine is confident OR NLP is clueless (e.g. service words only), keyword engine wins
      if (this.SERVICE_INTENTS.has(kwData.intent) || nlpData.intent === INTENTS.UNKNOWN) {
        nlpData.intent = kwData.intent;
        nlpData.intentStrength = kwData.intentStrength;
        nlpData.confidence.intent = kwData.confidence;
        
        // Ensure it's in multiIntents for Step 5 processing
        if (nlpData.multiIntents && !nlpData.multiIntents.some(i => i.intent === kwData.intent)) {
            nlpData.multiIntents.unshift({
                intent: kwData.intent,
                confidence: kwData.confidence,
                type: isCorrection ? 'override' : 'primary',
                position: 0 
            });
        } else if (isCorrection && nlpData.multiIntents) {
            // Upgrade existing intent to override if correction keyword found
            const match = nlpData.multiIntents.find(i => i.intent === kwData.intent);
            if (match) match.type = 'override';
        }
      }
    }

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

    // 2. Safely merge NLP Context (Threshold Gated) & MEMORY STORAGE
    const ld = this.sm.getContext().leadData;
    const turn = this.sm.getContext().turnCount;
     
    if (nlpData.medical_practice) {
      this.memory.storeEntity('medical_practice', nlpData.medical_practice.value, nlpData.confidence.medical_practice || 0.6, turn, input);
      if (!ld.medical_practice || nlpData.confidence.medical_practice > 0.6) {
        this.leads.capture('medical_practice', nlpData.medical_practice.value);
        this.sm.updateLeadData({ medical_practice: nlpData.medical_practice.value });
      }
    }
    
    if (nlpData.care_goal) {
      this.memory.storeEntity('care_goal', nlpData.care_goal.value, nlpData.confidence.care_goal || 0.5, turn, input);
      if (!ld.care_goal || nlpData.confidence.care_goal > 0.5) {
        this.leads.capture('care_goal', nlpData.care_goal.value);
        this.sm.updateLeadData({ care_goal: nlpData.care_goal.value });
      }
    }
    
    if (nlpData.problem) {
      this.memory.storeEntity('problem', nlpData.problem.value, nlpData.confidence.problem || 0.5, turn, input);
      if (!ld.problem || nlpData.confidence.problem > 0.5) {
        this.leads.capture('problem', nlpData.problem.value);
        this.sm.updateLeadData({ problem: nlpData.problem.value });
      }
    }

    if (nlpData.patient_history) {
      this.memory.storeEntity('patient_history', nlpData.patient_history.value, nlpData.confidence.overall || 0.5, turn, input);
      if (!ld.patient_history || nlpData.confidence.overall > 0.5) {
        this.leads.capture('patient_history', nlpData.patient_history.value);
        this.sm.updateLeadData({ patient_history: nlpData.patient_history.value });
      }
    }

    // Name Extraction — strict intro pattern only
    if (!ld.name) {
      const nameBlacklist = new Set([
        'costing', 'trying', 'looking', 'thinking', 'working', 'running',
        'going', 'getting', 'doing', 'using', 'building', 'growing',
        'not', 'just', 'also', 'very', 'really', 'still', 'already'
      ]);
      const m = input.match(/(?:my name is|i am|i'm|this is|call me|name's)\s+([A-Z][a-zA-Z]{1,19})/i);
      if (m) {
        const candidate = m[1].toLowerCase();
        if (!nameBlacklist.has(candidate)) {
          const name = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
          this.memory.storeEntity('name', name, 1.0, turn, input);
          this.leads.capture('name', name);
          this.sm.updateLeadData({ name });
        }
      }
    }

    if (nlpData.urgency && nlpData.urgency.value === 'high') {
      this.memory.storeEntity('urgency', 'high', 1.0, turn, input);
      if (!ld.urgency) {
        this.leads.capture('urgency', 'high');
        this.sm.updateLeadData({ urgency: 'high' });
      }
    }

    // GAP-ORCH-02: Temporal Extraction
    const temporal = extractDateTime(input);
    if (temporal.found) {
      console.log(`[Temporal] Extracted: ${temporal.naturalLanguage} | ISO: ${temporal.iso}`);
      this.leads.capture('appointment_time', temporal.naturalLanguage);
      this.sm.updateLeadData({ 
        appointment_time: temporal.naturalLanguage,
        appointment_iso: temporal.iso 
      });
    }

    // MULTI-SIGNAL HANDLING
    if (nlpData.secondaryIntent) {
      this.memory.storeEntity('secondary_intent', nlpData.secondaryIntent, nlpData.confidence.intent || 0.6, turn, input);
      if (this.SERVICE_INTENTS.has(nlpData.secondaryIntent) && !ld.problem) {
        this.sm.updateLeadData({ problem: `Prior failure/interest in ${nlpData.secondaryIntent}` });
      }
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
      hasLead:         this.leads.getCompleteness() >= 50,
      hasName:         this.leads.hasField('name'),
      hasReason:       this.leads.hasField('reason_for_visit'),
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
    // CTA confirmation: user is responding to "Would you like to book?"
    if (this._ctaShown) {
      if (ev.isPositive) { this._ctaShown = false; return 'capture_lead'; }
      if (ev.isNegative) { this._ctaShown = false; return 'exit'; }
      this._ctaShown = false; // Any other input clears the CTA context — treat as new input
    }

    // Phase 4: Lateral Pivot Logic (High Priority Global Override)
    if (ev.isFlowMismatch) return 'reroute';

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

      case STATES.FLOW_GENERAL:
        if (this.sm.isInFlow() && ev.hasService) return 'position_solution';
        
        { const s = this.flows.getStep(ev.state, ev.flowStep);
          if (!s && ev.flowStep > 0) {
            if (ev.isPositive) return 'close';
            if (ev.isNegative) return 'handle_objection';
            return 'close';
          }
        }

        if (ev.fastTrack && ev.flowStep >= 4 && (ev.hasName || ev.hasReason)) return 'close';

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

      default: {
        // Dynamic service flow states (FLOW_SERVICE_*) — treat as active discovery flow
        if (ev.inFlow) {
          if (ev.isNegative)  return 'handle_objection';
          if (ev.isObjection) return 'handle_objection';
          // Positive response: if flow has more steps continue, otherwise advance to lead capture
          if (ev.isPositive) {
            const nextStep = this.flows.getStep(ev.state, this.sm.getContext().flowStep);
            return nextStep ? 'explore_context' : 'capture_lead';
          }
          return 'explore_context';
        }
        return 'identify_problem';
      }
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

      case 'booking_confirmation':
        return { type: ACT.BOOKING_CONFIRM };

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

  async _step6_generateResponse(act, ir, input, onToken) {
    const ctx = this.sm.getContext();
    const ld  = this.leads.getData();

    // ── G-027: LLM ADAPTER HOOK ────────────────────────────────────
    // If the LLM is enabled, attempt to generate the response via Ollama.
    if (this.llm.isEnabled) {
      // Only use LLM for active conversational turns, not for hard exits
      if (act.type !== ACT.EXIT && act.type !== ACT.ENDED && act.type !== ACT.CLOSE) {
        const history = this.sm.getMemory();
        const llmResponse = await this.llm.generate(input, history, onToken);
        if (llmResponse) {
          return llmResponse;
        }
      }
    }

    // ── FALLBACK TO RULE-BASED ENGINE ──────────────────────────────
    // If LLM is disabled, unavailable, or times out, fall back to templates.
    let responseText = null;

    switch (act.type) {

      // ── EXIT / ENDED ──────────────────────────────────────────
      case ACT.EXIT:
        this._transTo(STATES.ENDED);
        // GAP-ORCH-01 fix: route through authenticated outbox dispatcher
        if (this.leads.getCompleteness() > 0) {
          this._dispatchFinalLead('exit');
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
        const config = AppContext.getConfig();
        if (config.primary_goal === 'book_appointment' && config.calendar_enabled === true) {
          this._transTo(STATES.BOOKING_CONFIRMATION);
          const time = ld.appointment_time || "a time that works for you";
          return `Perfect. To finalize your appointment for ${time}, I just need to confirm your name is ${ld.name || 'correct'}. Shall I book this for you?`;
        }
        const level = this.sm.getEngagementLevel();
        const cl = this.closing.getClose(level);
        this._transTo(STATES.CLOSING);
        // GAP-ORCH-01 fix: route through authenticated outbox dispatcher
        if (this.leads.getCompleteness() > 0) {
          this._dispatchFinalLead('final');
        }
        if (ld.name) return `${ld.name}, ${cl.response.charAt(0).toLowerCase()}${cl.response.slice(1)}`;
        return cl.response;
      }

      case ACT.BOOKING_CONFIRM: {
        // This state is reached after verbal confirmation.
        // In real flow, this would trigger the actual backend booking.
        this._transTo(STATES.ENDED);
        
        // GAP-ORCH-01: Final lead dispatch occurs after booking confirmation
        this._dispatchFinalLead('final');
        
        return "Excellent! I've booked that for you. You'll receive a confirmation email shortly. Take care!";
      }

      // ── CAPTURE LEAD DATA ─────────────────────────────────────
      case ACT.CAPTURE: {
        this._transTo(STATES.LEAD_CAPTURE);
        const next = this.leads.getNextCapture();
        if (!next) {
          // All data captured — GAP-ORCH-01 fix: route through authenticated outbox dispatcher
          this._dispatchFinalLead('final');
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
        this._turnsSinceGoalProgress = 0;
        this._lastCTATurn = this.sm.getContext().turnCount;
        this._ctaShown = true; // Remember we asked — next positive response → capture_lead
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
        const disc = this.discovery.getNextQuestion(flowCtx, ctx.depthLevel, this.memory);

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

    const activeTone = this.personality.getToneState();
    
    // Structure Influence based on Tone
    if (activeTone === TONE_STATES.URGENT) {
       qType = 'CLARIFY'; // Keep questions explicit and direct to force logic forward
    }

    return this.builder.build({
      insight: ir.insight || this.kb.fallbackInsight,
      outcome: ir.kbOutcome,
      leadData: ld,
      depthLevel: ctx.depthLevel || 1,
      questionType: qType,
      intentStrength: ir.intentStrength,
      userType: ir.userType,
      forceShort: this.fallback.interruptCount > 0 || activeTone === TONE_STATES.URGENT
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
