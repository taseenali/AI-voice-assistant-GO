/**
 * Conversation Flows Module
 *
 * Handles structured, multi-step flows for each service.
 * Each flow follows: entry → diagnose → diagnose deeper → position → (close handled by orchestrator)
 * 
 * Prompts are conversational, not scripted. No interrogation.
 *
 * CONFIG-DRIVEN: All flows are built from config.services[].flow_steps and config.general_flow_steps.
 * The flow-to-intent mapping is also dynamically generated from config.
 */

import { AppContext } from '../config/loader.js';
import { STATES } from '../state-machine.js';

export class ConversationFlows {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Build flows from config ────────────────────────────
    this._flows = {};
    this._intentToFlowMap = {};

    if (config.services && Array.isArray(config.services)) {
      config.services.forEach(svc => {
        if (!svc.intent_key) return;
        const flowState = `FLOW_SERVICE_${svc.intent_key.toUpperCase()}`;
        
        if (svc.flow_steps && svc.flow_steps.length > 0) {
          this._flows[flowState] = {
            name: svc.name,
            steps: svc.flow_steps.map(step => ({
              id:     step.id,
              prompt: step.prompt,
              expect: step.expect
            }))
          };
        }

        // Map intent_key → flow state
        this._intentToFlowMap[svc.intent_key] = flowState;
      });
    }

    // ─── General flow (from config) ─────────────────────────
    if (config.general_flow_steps && config.general_flow_steps.length > 0) {
      this._flows[STATES.FLOW_GENERAL] = {
        name: 'General Inquiry',
        steps: config.general_flow_steps.map(step => ({
          id:     step.id,
          prompt: step.prompt,
          expect: step.expect
        }))
      };
    } else if (!this._flows[STATES.FLOW_GENERAL]) {
      // Fallback general flow
      this._flows[STATES.FLOW_GENERAL] = {
        name: 'General Inquiry',
        steps: [
          {
            id: 'overview',
            prompt: config.service_overview || "What can I help you with today?",
            expect: 'service_interest'
          }
        ]
      };
    }

    // Map generic inquiry intent to general flow
    this._intentToFlowMap['GENERAL_INQUIRY'] = STATES.FLOW_GENERAL;
  }

  // ─── Public API ───────────────────────────────────────────

  getStep(flowName, stepIndex) {
    const flow = this._flows[flowName];
    if (!flow) return null;
    if (stepIndex >= flow.steps.length) return null; // Flow complete

    const step = flow.steps[stepIndex];
    return {
      prompt:      step.prompt,
      stepId:      step.id,
      expect:      step.expect,
      isLastStep:  stepIndex === flow.steps.length - 1,
      totalSteps:  flow.steps.length,
      currentStep: stepIndex
    };
  }

  getFlowName(flowName) {
    const flow = this._flows[flowName];
    return flow ? flow.name : null;
  }

  hasFlow(flowName) {
    return !!this._flows[flowName];
  }

  getStepCount(flowName) {
    const flow = this._flows[flowName];
    return flow ? flow.steps.length : 0;
  }

  /**
   * Map an intent key to its flow state.
   * Uses config-driven mapping.
   * @param {string} intent - Intent key (e.g., 'WEBSITE', 'ROOF_REPAIR')
   * @returns {string|null} Flow state key or null
   */
  intentToFlow(intent) {
    return this._intentToFlowMap[intent] || null;
  }

  /**
   * Get all registered intent-to-flow mappings.
   * @returns {object}
   */
  getIntentFlowMap() {
    return { ...this._intentToFlowMap };
  }
}
