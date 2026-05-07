import { it, expect, describe } from 'vitest';
import { validateConfig } from '../js/config/validator.js';

describe('ConfigValidator', () => {
  const fallback = {
    company_name: 'Fallback',
    assistant_name: 'Aria',
    tone: 'professional',
    primary_goal: 'book',
    greetings: ['hi'],
    cta_templates: ['cta'],
    service_domain_tokens: ['med'],
    webhook_secret: 'secret',
    llm_model: 'llama',
    ai_tier: 1,
    ollama_endpoint: 'http://loc',
    emergency_keywords: ['help'],
    emergency_response: 'call 911',
    calendar_id: 'test-id',
    services: []
  };

  it('should pass a valid medical config', () => {
    const validConfig = {
      company_name: 'Med Clinic',
      assistant_name: 'Aria',
      tone: 'warm',
      primary_goal: 'book_appointment',
      greetings: ['Hi AI', 'Hello AI'],
      cta_templates: ['Book now'],
      service_domain_tokens: ['medical'],
      webhook_secret: 'real_secret',
      llm_model: 'llama3.1',
      ai_tier: 2,
      ollama_endpoint: 'http://localhost:11434',
      emergency_keywords: ['stroke', 'chest pain'],
      emergency_response: 'Call 911 now',
      calendar_id: 'test-id@group.calendar.google.com',
      services: [{ name: 'Checkup', intent_key: 'FLOW_CHECKUP' }]
    };

    const result = validateConfig(validConfig, fallback);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should fail if emergency_keywords is missing', () => {
    const invalidConfig = { ...fallback };
    delete invalidConfig.emergency_keywords;
    
    const result = validateConfig(invalidConfig, fallback);
    expect(result.errors.some(e => e.includes('emergency_keywords'))).toBe(true);
  });

  it('should fail if webhook_secret is empty', () => {
    const invalidConfig = { ...fallback, webhook_secret: '' };
    
    const result = validateConfig(invalidConfig, fallback);
    expect(result.errors.some(e => e.includes('webhook_secret'))).toBe(true);
  });
});
