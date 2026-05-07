/**
 * Service Mapping Module
 * Maps to: 03_service_mapping.md
 *
 * Maps detected user problems → client services (from config).
 * Always translates user language into medical solutions.
 *
 * Rule: NEVER say "We offer X." Instead, connect solution to user's stated problem.
 *
 * CONFIG-DRIVEN: All services, outcomes, and problem frames are loaded from AppContext config.
 * No hardcoded service definitions remain.
 */

import { AppContext } from '../config/loader.js';

export class ServiceMapper {

  constructor() {
    const config = AppContext.getConfig();

    // ─── Build services map from config ─────────────────────
    this._services = {};
    this._intentKeys = [];

    if (config.services && Array.isArray(config.services)) {
      for (const svc of config.services) {
        const key = svc.intent_key;
        this._intentKeys.push(key);
        this._services[key] = {
          name:          svc.name,
          tagline:       svc.tagline || '',
          description:   svc.description || '',
          outcomes:      svc.outcomes || [],
          problemFrames: svc.problem_frames || { default: '' }
        };
      }
    }

    // ─── Build service overview from config ──────────────────
    this._serviceOverview = config.service_overview || this._buildDefaultOverview();
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get service info for a detected intent
   * @param {string} intent - The detected intent key
   * @returns {object|null} Service definition or null
   */
  getService(intent) {
    return this._services[intent] || null;
  }

  /**
   * Position a service in terms of the user's problem (outcome-based, not feature-based)
   * @param {string} intent - Service intent
   * @param {string} [problemKey] - Specific problem context key
   * @returns {string} A problem-framed positioning statement
   */
  positionSolution(intent, problemKey) {
    const service = this._services[intent];
    if (!service) return "I'd love to learn more about what you need so I can point you in the right direction.";

    const frame = service.problemFrames[problemKey] || service.problemFrames['default'];
    return frame || service.description;
  }

  /**
   * Get a random outcome statement for a service
   */
  getOutcome(intent) {
    const service = this._services[intent];
    if (!service || !service.outcomes || service.outcomes.length === 0) return null;
    return service.outcomes[Math.floor(Math.random() * service.outcomes.length)];
  }

  /**
   * Get all available services for general inquiry
   * @returns {string} Formatted service overview
   */
  getServiceOverview() {
    return this._serviceOverview;
  }

  /**
   * Get service name by intent
   */
  getServiceName(intent) {
    const service = this._services[intent];
    return service ? service.name : null;
  }

  /**
   * Get all registered intent keys
   * @returns {string[]}
   */
  getIntentKeys() {
    return [...this._intentKeys];
  }

  /**
   * Check if an intent key exists in the config
   * @param {string} intent
   * @returns {boolean}
   */
  hasService(intent) {
    return !!this._services[intent];
  }

  // ─── Private ──────────────────────────────────────────────

  _buildDefaultOverview() {
    if (this._intentKeys.length === 0) return "How can I help you today?";
    const names = this._intentKeys.map(k => this._services[k].name).filter(Boolean);
    if (names.length === 0) return "How can I help you today?";
    if (names.length === 1) return `We specialize in ${names[0]}. How can I help?`;
    const last = names.pop();
    return `We help with ${names.join(', ')}, and ${last}. Which sounds most relevant to you?`;
  }
}
