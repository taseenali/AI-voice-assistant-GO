/**
 * Conversation Flows Module
 *
 * Handles structured, multi-step flows for each service:
 *   Website / SEO / AI Systems / App Development / General Inquiry
 *
 * Each flow follows: entry → diagnose → diagnose deeper → position → (close handled by orchestrator)
 * 
 * Prompts are conversational, not scripted. No interrogation.
 */

export class ConversationFlows {

  constructor() {
    this._flows = {
      FLOW_WEBSITE: {
        name: 'Website Development',
        steps: [
          {
            id: 'type',
            prompt: "What kind of website are you thinking — something to showcase your business, an online store, or something else?",
            expect: 'type_of_website'
          },
          {
            id: 'purpose',
            prompt: "Got it. What's the main goal you want it to achieve — attracting clients, showcasing your work, or selling products online?",
            expect: 'purpose'
          },
          {
            id: 'current_situation',
            prompt: "Do you have an existing site that needs a refresh, or would this be starting from scratch?",
            expect: 'current_state'
          },
          {
            id: 'position',
            prompt: "Based on what you've shared, we can build something custom that actually works for your business — not just looks good, but converts visitors into clients. Would you like to explore what that looks like for you specifically?",
            expect: 'interest_signal'
          }
        ]
      },

      FLOW_SEO: {
        name: 'SEO & Visibility',
        steps: [
          {
            id: 'current_channels',
            prompt: "How are you currently getting most of your clients — referrals, social media, ads, or organic search?",
            expect: 'current_strategy'
          },
          {
            id: 'ranking_awareness',
            prompt: "And do you have a sense of where you're showing up on Google right now for the services you offer?",
            expect: 'ranking_awareness'
          },
          {
            id: 'impact',
            prompt: "When potential clients search for what you offer and you're not showing up — those people go to your competitors instead. How much of your revenue do you think comes from people finding you online?",
            expect: 'acknowledgment'
          },
          {
            id: 'position',
            prompt: "We help businesses build consistent organic visibility so leads come to you instead of you chasing them. The best part — it compounds over time, unlike ads. Want to see how we'd approach this for your business specifically?",
            expect: 'interest_signal'
          }
        ]
      },

      FLOW_AI: {
        name: 'AI & Automation',
        steps: [
          {
            id: 'pain_process',
            prompt: "What processes in your business are eating up the most time right now?",
            expect: 'pain_process'
          },
          {
            id: 'current_approach',
            prompt: "And how's your team handling those today — mostly manual, or do you have some tools in place already?",
            expect: 'current_approach'
          },
          {
            id: 'impact',
            prompt: "If those hours were freed up — what would you actually be able to focus on that you can't get to right now?",
            expect: 'acknowledgment'
          },
          {
            id: 'position',
            prompt: "We build systems that handle the repetitive work automatically — client intake, follow-ups, data entry — so your team can focus on what actually grows the business. Want me to show you what that could look like for you?",
            expect: 'interest_signal'
          }
        ]
      },

      FLOW_APP: {
        name: 'App Development',
        steps: [
          {
            id: 'idea',
            prompt: "Interesting — tell me a bit more about the idea. What problem is it solving, or what would it let people do?",
            expect: 'idea_description'
          },
          {
            id: 'core_features',
            prompt: "What are the core things it would need to do? Even a rough idea is fine — we can always refine it.",
            expect: 'features'
          },
          {
            id: 'platform',
            prompt: "Are you thinking mobile, web-based, or both? And is this for your internal team or for your customers?",
            expect: 'platform_preference'
          },
          {
            id: 'position',
            prompt: "We've taken projects from idea to working product more times than I can count. The key is starting lean — build the core, prove it works, then grow it. Would you like to talk through a roadmap for this?",
            expect: 'interest_signal'
          }
        ]
      },

      FLOW_GENERAL: {
        name: 'General Inquiry',
        steps: [
          {
            id: 'overview',
            prompt: "We work across four areas: building websites that convert, increasing online visibility through SEO, AI and automation systems, and custom app development. Which of those feels closest to what you're dealing with?",
            expect: 'service_interest'
          },
          {
            id: 'narrow_down',
            prompt: "What's driving the search right now — is there a specific problem you're trying to solve, or more of a general 'we need to grow' situation?",
            expect: 'problem_or_goal'
          }
        ]
      }
    };
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

  intentToFlow(intent) {
    const mapping = {
      'WEBSITE':         'FLOW_WEBSITE',
      'SEO':             'FLOW_SEO',
      'AI_AUTOMATION':   'FLOW_AI',
      'APP_DEV':         'FLOW_APP',
      'GENERAL_INQUIRY': 'FLOW_GENERAL'
    };
    return mapping[intent] || null;
  }
}
