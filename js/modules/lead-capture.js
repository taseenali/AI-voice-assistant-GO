/**
 * Lead Capture Module
 * Maps to: 06_lead_capture.md
 *
 * Collects user information gradually, not all at once.
 * Only captures when user shows engagement or interest.
 *
 * Required: Name, Reason for Visit
 * Optional: Patient Type, DOB, Insurance
 *
 * Rule: Natural, not robotic. Never ask all at once.
 */

import { AppContext } from '../config/loader.js';
import { webhookDispatcher } from '../services/webhook-dispatcher.js';
import { conversationLogger } from '../services/conversation-logger.js';

/**
 * SEC-07: Generate a hardened, namespaced localStorage key.
 * Format: 'av_leads_v1:[normalized_client_id]'
 * - Versioned prefix prevents accidental cross-version reads.
 * - client_id sourced from config (not guessable from URL alone).
 * - Falls back to 'default_isolate' — never to an empty or shared key.
 * @param {object} config - AppContext config
 * @returns {string}
 */
function _getStorageKey(config) {
  const clientId = (config.company_name || 'default_isolate')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  return `av_leads_v1:${clientId}`;
}

export class LeadCapture {

  constructor() {
    this._leadData = {
      name:               null,
      phone:              null,
      patient_type:       null,
      dob:                null,
      reason_for_visit:   null,
      insurance_provider: null,
      insurance_id:       null,
      urgency:            null,
      contactMethod:      null
    };

    this._capturedFields = new Set();
    this._promptCounters = {};

    // ─── Natural Prompts for Each Field ───────────────────
    this._prompts = {
      name: [
        "By the way, can I get your name? Just so I know who I'm speaking with.",
        "Before we go further — what's your name?",
        "I'd love to know who I'm helping. What should I call you?"
      ],
      reason_for_visit: [
        "What's the main thing you're looking to address today?",
        "Could you describe the reason for your visit?",
        "What symptoms or concerns should the doctor know about?"
      ],
      patient_type: [
        "Are you a new or returning patient?",
        "Have you visited our clinic before?"
      ],
      phone: [
        "What's the best phone number for us to reach you on?",
        "Could I get a callback number for you, just in case?",
        "What number should we call to confirm your appointment?"
      ],
      dob: [
        "Could I get your date of birth, just for our medical records?",
        "What is your date of birth?"
      ],
      insurance_provider: [
        "Who is your primary health insurance provider?",
        "What insurance will you be using for this visit?"
      ],
      insurance_id: [
        "Do you have your insurance member ID number handy?",
        "Could you read me your insurance member ID?"
      ],
      urgency: [
        "How quickly do you need to be seen?",
        "Is this an urgent matter or a routine checkup?"
      ],
      contactMethod: [
        "What's the best way for our clinic to follow up with you?",
        "How would you prefer we reach out — phone or email?"
      ],
    };

    // ─── Capture Order ────────────────────────────────────
    // Mirrors natural receptionist flow: who → why → new/returning → contact → admin
    this._captureOrder = ['name', 'reason_for_visit', 'patient_type', 'phone', 'dob', 'insurance_provider'];
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get the next field to capture and its prompt
   * @returns {{ field: string, prompt: string } | null}
   */
  getNextCapture() {
    for (const field of this._captureOrder) {
      if (!this._capturedFields.has(field)) {
        const prompts = this._prompts[field];
        if (!this._promptCounters[field]) this._promptCounters[field] = 0;
        const idx = this._promptCounters[field] % prompts.length;
        this._promptCounters[field]++;
        return {
          field,
          prompt: prompts[idx]
        };
      }
    }
    return null; // All fields captured
  }

  /**
   * Normalize and validate a phone number.
   * Strips formatting, accepts 10–15 digits (covers NA + international).
   * @param {string} raw
   * @returns {string|null} Normalized digits-only string, or null if invalid
   */
  _validatePhone(raw) {
    if (!raw) return null;
    // Strip all non-digit characters (spaces, dashes, parens, dots, leading +)
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return null;
    // Format for storage: keep raw digits (avoids locale assumptions)
    return digits;
  }

  /**
   * Store a captured field value.
   * Phone values are validated before storing; invalid numbers are silently
   * rejected so the capture loop will re-ask on the next turn.
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  capture(field, value) {
    if (!value || !String(value).trim()) return;

    if (field === 'phone') {
      const normalized = this._validatePhone(value);
      if (!normalized) return; // invalid format — do not mark as captured
      this._leadData.phone = normalized;
      this._capturedFields.add('phone');
      return;
    }

    this._leadData[field] = String(value).trim();
    this._capturedFields.add(field);
  }

  /**
   * Get all captured lead data
   */
  getData() {
    return { ...this._leadData };
  }

  /**
   * Get completeness as a percentage (0-100).
   * Weights reflect capture priority: contact info > clinical info > admin.
   */
  getCompleteness() {
    let score = 0;
    if (this._leadData.name)               score += 25;
    if (this._leadData.reason_for_visit)   score += 25;
    if (this._leadData.patient_type)       score += 15;
    if (this._leadData.phone)              score += 15;
    if (this._leadData.dob)                score += 10;
    if (this._leadData.insurance_provider) score += 10;
    return score;
  }

  /**
   * Check if minimum required data is captured (name + problem)
   */
  hasMinimumData() {
    return !!(this._leadData.name && this._leadData.reason_for_visit);
  }

  /**
   * Get the current capture field being asked for
   */
  getCurrentField() {
    for (const field of this._captureOrder) {
      if (!this._capturedFields.has(field)) return field;
    }
    return null;
  }

  /**
   * Check if a specific field has been captured
   */
  hasField(field) {
    return this._capturedFields.has(field);
  }

  /**
   * Save lead data to localStorage
   */
  save() {
    const config = AppContext.getConfig();
    // SEC-07: Use hardened namespaced key (not predictable company_name string)
    const storageKey = _getStorageKey(config);
    const leads = JSON.parse(localStorage.getItem(storageKey) || '[]');
    leads.push({
      ...this._leadData,
      client_id: config.company_name,
      capturedAt: new Date().toISOString(),
      completeness: this.getCompleteness()
    });
    localStorage.setItem(storageKey, JSON.stringify(leads));

    // ── Dispatch Webhook ──────────────────────────────────
    webhookDispatcher.dispatch('LEAD_CAPTURE', {
      ...this._leadData,
      completeness: this.getCompleteness(),
      url_context: window.location.href
    }).catch(err => {
      console.warn('[LeadCapture] Webhook dispatch failed (it will retry automatically):', err.message);
    });

    // ── ALSO save to backend API ────────────────────────
    this._saveToServer();
  }

  /**
   * POST lead data to the backend API for persistence.
   * Fire-and-forget — never blocks the conversation pipeline.
   */
  async _saveToServer() {
    try {
      const config = AppContext.getConfig();
      const leadData = this.getData();

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: conversationLogger.sessionId || ('session_' + Date.now()),
          client_id: config.client_id || 'medical-clinic',
          ...leadData,
          completeness_score: this.getCompleteness() / 100,
          service: leadData.reason_for_visit || null
        })
      });

      console.log('[LeadCapture] Saved to server');
    } catch (error) {
      console.error('[LeadCapture] Failed to save to server:', error);
      // Continue anyway — localStorage is still the backup
    }
  }

  /** POST snapshot without appending another localStorage row (used for partial qualification). */
  persistToServer() {
    return this._saveToServer();
  }

  /**
   * Load all saved leads from localStorage
   */
  static loadAll() {
    const config = AppContext.getConfig();
    // SEC-07: Read path uses same hardened key — cross-tenant reads structurally impossible
    const storageKey = _getStorageKey(config);
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }

  /**
   * Reset capture state
   */
  reset() {
    this._leadData = {
      name:               null,
      phone:              null,
      patient_type:       null,
      dob:                null,
      reason_for_visit:   null,
      insurance_provider: null,
      insurance_id:       null,
      urgency:            null,
      contactMethod:      null
    };
    this._capturedFields.clear();
    this._promptCounters = {};
  }
}
