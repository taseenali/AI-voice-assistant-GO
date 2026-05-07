/**
 * Config Loader — Dynamic Client Configuration System
 *
 * Responsibilities:
 *   - Read client ID from URL param (?client=medical-clinic)
 *   - Fetch /configs/{clientId}.json
 *   - Fallback to /configs/default.json on failure
 *   - Validate config structure
 *   - Expose global AppContext for engine-wide access
 *
 * Rules:
 *   - Must be async
 *   - Must never crash the app
 *   - Must ALWAYS return a valid config object
 */

import { validateConfig } from './validator.js';

// ─── Global Application Context ─────────────────────────────────
export const AppContext = {
  _config: null,
  _readyPromise: null,
  _readyResolve: null,

  /**
   * Initialize the readiness promise
   */
  _initReady() {
    if (this._readyPromise) return;
    this._readyPromise = new Promise(resolve => {
      this._readyResolve = resolve;
    });
  },

  /**
   * Store the loaded config globally.
   * @param {object} config - Validated client configuration
   */
  setConfig(config) {
    this._config = Object.freeze(config);
    if (this._readyResolve) {
      this._readyResolve();
    } else {
      // If setConfig called before initReady (unlikely but safe)
      this._readyPromise = Promise.resolve();
    }
  },

  /**
   * Retrieve the global config. Every module uses this.
   * @returns {object} The frozen config object
   */
  getConfig() {
    if (!this._config) {
      console.error('[AppContext] Config not loaded. Call loadConfig() first.');
      return {};
    }
    return this._config;
  },

  /**
   * Check if a config is loaded.
   * @returns {boolean}
   */
  isLoaded() {
    return this._config !== null;
  },

  /**
   * Wait for the configuration to be loaded.
   * @returns {Promise<void>}
   */
  async waitForConfig() {
    this._initReady();
    if (this.isLoaded()) return;
    return this._readyPromise;
  }
};

/**
 * Extract client ID from URL query parameters.
 * @returns {string} Client ID or 'default'
 */
export function getClientFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('client') || 'default';
  } catch {
    return 'default';
  }
}

/**
 * Load client configuration.
 *
 * Priority:
 *   1. /configs/{clientId}.json
 *   2. /configs/default.json (fallback)
 *
 * @param {string} clientId - Client identifier
 * @returns {Promise<object>} Validated config object
 */
export async function loadConfig(clientId) {
  let config = null;

  // ── Attempt client-specific config ──────────────────────
  if (clientId && clientId !== 'default') {
    try {
      const res = await fetch(`/api/config?client=${clientId}`);
      if (res.ok) {
        config = await res.json();
        console.log(`[ConfigLoader] Loaded client config: ${clientId}`);
      } else {
        console.warn(`[ConfigLoader] Client config "${clientId}" not found (${res.status}). Falling back to default.`);
      }
    } catch (err) {
      console.warn(`[ConfigLoader] Failed to fetch client config "${clientId}":`, err.message);
    }
  }

  // ── Fallback to default config ──────────────────────────
  if (!config) {
    try {
      const res = await fetch('/api/config?client=default');
      if (res.ok) {
        config = await res.json();
        console.log('[ConfigLoader] Loaded default config.');
      } else {
        console.error('[ConfigLoader] Default config not found. Using emergency fallback.');
        config = getEmergencyFallback();
      }
    } catch (err) {
      console.error('[ConfigLoader] Failed to fetch default config:', err.message);
      config = getEmergencyFallback();
    }
  }

  // ── Validate ────────────────────────────────────────────
  const { valid, errors, safeConfig } = validateConfig(config, getEmergencyFallback());
  
  if (!valid) {
    console.error('[ConfigLoader] Configuration is invalid or missing required fields:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.warn('[ConfigLoader] Falling back to safe default layers where necessary.');
  }

  return safeConfig;
}



/**
 * Emergency fallback config — used when ALL fetches fail.
 * Ensures the app never crashes due to missing config.
 */
function getEmergencyFallback() {
  return {
    company_name: 'AI Assistant',
    assistant_name: 'Assistant',
    tone: 'professional',
    primary_goal: 'capture_lead',
    secondary_goals: ['qualify_customer'],
    role: 'AI medical receptionist',
    services: [],
    service_definitions: {},
    greetings: [
      'Hello! How can I help you today?'
    ],
    cta_templates: [
      'Would you like to take the next step?'
    ],
    meta_responses: [
      "I'm an AI assistant here to help you. What can I do for you?"
    ],
    greeting_responses: [
      'Hello! What can I help you with today?'
    ],
    noise_responses: [
      "Could you tell me more about what you're looking for?"
    ],
    noise_escalated_responses: [
      "Let me help — what type of help are you looking for?"
    ],
    out_of_scope_responses: [
      "That's outside my area, but I'd love to help with your healthcare needs."
    ],
    service_domain_tokens: [
      'health', 'medical', 'doctor', 'clinic', 'appointment', 'care'
    ],
    webhook_url: '',
    // SSYNC-03/SYNC-01: DO NOT hardcode real secrets here.
    // Emergency fallback must never contain production credentials.
    // webhook_secret is injected at runtime via env vars (Option A per SSYNC-03).
    webhook_secret: '',
    calendar_url: '',
    ai_tier: 1,            // SYNC-01 fix: required per SYNC-MAP shape spec
    llm_model: 'llama3.2', // G-027
    ollama_endpoint: "http://localhost:11434",
    emergency_keywords: [],
    emergency_response: 'Please call 911 immediately for medical emergencies.',
    qualification_fields: ['name', 'patient_type', 'reason_for_visit', 'dob', 'insurance_provider'],
    knowledge_base: {},
    closing_responses: {
      soft: ['Would you like to take this forward?'],
      direct: ["Let's get you started."],
      confirmations: ['Great! We will be in touch shortly.'],  // SYNC-01 fix: was missing from fallback
      exit: ['Thanks for chatting! Feel free to reach out anytime.']
    },
    emergency_keywords: [],
    emergency_response: 'Please call 911 immediately for medical emergencies.',
    calendar_id: '',
    calendar_enabled: false
  };
}
