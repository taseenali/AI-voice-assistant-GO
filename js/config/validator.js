/**
 * Config Validator
 * 
 * Responsibilities:
 *  - Ensure provided config meets required structural definitions
 *  - Return validation status, explicit errors, and a safe fail-tolerant config object
 *  - Prevent silent failures by explicitly logging validation errors
 */

const REQUIRED_FIELDS = [
  'company_name',
  'assistant_name',
  'tone',
  'primary_goal',
  'greetings',
  'cta_templates',
  'service_domain_tokens'
];

export function validateConfig(config, fallback) {
  const errors = [];
  const safeConfig = { ...fallback, ...config }; // Start with fallback, overlay config

  if (!config) {
    errors.push('Configuration object is null or undefined.');
    return { valid: false, errors, safeConfig: fallback };
  }

  // 1. Validate required primitive fields
  for (const field of REQUIRED_FIELDS) {
    if (config[field] === undefined || config[field] === null || config[field] === '') {
      errors.push(`Missing or empty required field: "${field}"`);
      safeConfig[field] = fallback[field]; // Ensure safe fallback
    }
  }

  // 2. Validate Arrays
  const arrayFields = ['services', 'greetings', 'cta_templates', 'service_domain_tokens'];
  for (const field of arrayFields) {
    if (!Array.isArray(config[field])) {
      errors.push(`Field "${field}" must be an array.`);
      safeConfig[field] = fallback[field] || [];
    }
  }

  // 3. Fallback edge cases (empty arrays where we strictly require 1 at least)
  if (safeConfig.services.length === 0) {
    // We don't overwrite if intentional, but it's a critical warning.
    errors.push('Config contains 0 services. Flow matching will be disabled.');
  }

  if (safeConfig.cta_templates.length === 0) {
    errors.push('Config contains 0 CTA templates. Injecting safe default.');
    safeConfig.cta_templates = ['Would you like me to help you get started?'];
  }

  // 4. Validate Webhook format (basic checking)
  if (config.webhook_url && typeof config.webhook_url !== 'string') {
    errors.push('webhook_url must be a string.');
    safeConfig.webhook_url = '';
  }

  return {
    valid: errors.length === 0,
    errors,
    safeConfig
  };
}
