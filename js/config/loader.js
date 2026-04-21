/**
 * Config Loader — Dynamic Client Configuration System
 *
 * Responsibilities:
 *   - Read client ID from URL param (?client=abc-roofing)
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

  /**
   * Store the loaded config globally.
   * @param {object} config - Validated client configuration
   */
  setConfig(config) {
    this._config = Object.freeze(config);
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
      const res = await fetch(`/configs/${clientId}.json`);
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
      const res = await fetch('/configs/default.json');
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
    role: 'AI business consultant',
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
      "That's outside my area, but I'd love to help with your business needs."
    ],
    service_domain_tokens: [
      'business', 'help', 'service', 'solution'
    ],
    webhook_url: '',
    calendar_url: '',
    qualification_fields: ['name', 'goal', 'problem', 'business', 'timeline'],
    knowledge_base: {},
    closing_responses: {
      soft: ['Would you like to take this forward?'],
      direct: ["Let's get you started."],
      exit: ['Thanks for chatting! Feel free to reach out anytime.']
    }
  };
}
