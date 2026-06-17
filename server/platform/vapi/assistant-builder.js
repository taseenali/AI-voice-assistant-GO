/**
 * Build Vapi assistant object for assistant-request response.
 * @see https://docs.vapi.ai/server-url/events
 * @see contracts/vapi/spike-assistant.out.json
 */

function webhookUrl() {
  const publicUrl = (process.env.PUBLIC_URL || 'http://localhost:3001').replace(/\/$/, '');
  return `${publicUrl}/api/vapi/webhook`;
}

function toolServerBlock() {
  const block = { url: webhookUrl() };
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    block.headers = { 'x-vapi-secret': secret };
  }
  return block;
}

/**
 * Minimal spike assistant — capture_lead only, no calendar round-trip.
 * Active when VAPI_SPIKE_MODE=true
 */
export function buildSpikeAssistantResponse(tenantBundle) {
  const { tenant_id } = tenantBundle;
  const server = toolServerBlock();

  return {
    assistant: {
      name: 'Spike Receptionist',
      firstMessage: 'Thanks for calling the clinic — how can I help you today?',
      model: {
        provider: 'openai',
        model: process.env.VAPI_LLM_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a clinic receptionist. Get the caller name and reason for visit, then call capture_lead. Keep replies to one sentence.',
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'capture_lead',
              description: "Save the caller's name, phone, and reason for visit.",
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string', description: "Patient's callback phone number" },
                  reason_for_visit: { type: 'string' },
                },
                required: ['name', 'phone', 'reason_for_visit'],
              },
            },
            server,
            messages: [
              {
                type: 'request-start',
                content: 'One moment while I save that.',
              },
            ],
          },
        ],
      },
      serverUrl: webhookUrl(),
      metadata: { tenant_id },
    },
  };
}

/**
 * Full production assistant from tenant_config.
 */
export function buildAssistantResponse(tenantBundle) {
  if (process.env.VAPI_SPIKE_MODE === 'true') {
    return buildSpikeAssistantResponse(tenantBundle);
  }

  const { tenant_id, config } = tenantBundle;
  const server = toolServerBlock();

  return {
    assistant: {
      name: config.assistant_name || 'Aria',
      firstMessage: config.first_message,
      model: {
        provider: 'openai',
        model: process.env.VAPI_LLM_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: config.system_prompt,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'check_availability',
              description: 'Check if a date and time is available on the clinic calendar.',
              parameters: {
                type: 'object',
                properties: {
                  date: { type: 'string', description: 'YYYY-MM-DD' },
                  time: { type: 'string', description: 'HH:MM 24h' },
                  duration_minutes: { type: 'number' },
                },
                required: ['date', 'time'],
              },
            },
            server,
            messages: [{ type: 'request-start', content: 'Let me check the schedule for you.' }],
          },
          {
            type: 'function',
            function: {
              name: 'book_appointment',
              description: 'Book an appointment after availability is confirmed.',
              parameters: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  time: { type: 'string' },
                  patient_name: { type: 'string' },
                  reason_for_visit: { type: 'string' },
                },
                required: ['date', 'time', 'patient_name'],
              },
            },
            server,
            messages: [{ type: 'request-start', content: 'Booking that appointment now.' }],
          },
          {
            type: 'function',
            function: {
              name: 'capture_lead',
              description: 'Save patient contact information and reason for visit. Always collect phone before calling this.',
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: "Patient's full name" },
                  phone: { type: 'string', description: "Patient's callback phone number in E.164 format" },
                  reason_for_visit: { type: 'string', description: 'Brief reason for the appointment' },
                },
                required: ['name', 'phone', 'reason_for_visit'],
              },
            },
            server,
          },
          {
            type: 'function',
            function: {
              name: 'log_emergency',
              description: 'Log a medical emergency — backup to deterministic detection.',
              parameters: {
                type: 'object',
                properties: {
                  user_message: { type: 'string' },
                  pattern_matched: { type: 'string' },
                },
                required: ['user_message'],
              },
            },
            server,
          },
        ],
      },
      voice: process.env.ELEVENLABS_API_KEY
        ? { provider: '11labs', voiceId: config.voice_id || 'EXAVITQu4vr4xnSDxMaL' }
        : { provider: 'vapi', voiceId: 'Elliot' },
      serverUrl: webhookUrl(),
      metadata: { tenant_id },
    },
  };
}
