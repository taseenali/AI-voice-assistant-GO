/**
 * LLM Proxy Route — /api/llm/chat
 *
 * Security: browser never touches Ollama directly.
 * The ollama_endpoint stays server-side (env var or config).
 *
 * Supports two modes:
 *   - stream=false  → returns { response: string } (default)
 *   - stream=true   → SSE stream, each event is { token: string }, ends with [DONE]
 */

import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// ─── Config ───────────────────────────────────────────────────────────
const OLLAMA_ENDPOINT      = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
const DEFAULT_MODEL        = 'llama3.1:8b';
const INFERENCE_TIMEOUT_MS = 30_000;
const TTS_FLUSH_REGEX      = /[.!?;:\n]/;
const MAX_INPUT_LENGTH     = 2000;
const MAX_MEMORY_TURNS     = 20;

const ALLOWED_MODELS = new Set(['llama3.1:8b', 'llama3.2', 'mistral:7b']);

// Patterns that indicate prompt injection attempts in client-supplied memory
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /forget\s+(all\s+)?previous/i,
  /you\s+are\s+now\b/i,
  /your\s+new\s+(role|instructions)/i,
  /disregard\s+(all\s+)?instructions/i,
  /<\s*\/?\s*system\s*>/i,
  /\[INST\]/i,
];

/**
 * Build a dynamic system prompt from client configuration.
 * Enables multi-tenant LLM customization per client.
 */
function buildSystemPrompt(config, actionContext = null) {
  const services = (config.services || []).map(s => s.display_name).join(', ');

  let prompt = `You are ${config.assistant_name || 'an AI assistant'}, an AI ${config.assistant_role || config.role || 'medical receptionist'} for ${config.company_name || 'the clinic'}.
Your personality: ${config.tone || 'warm, calm, professional'}
Your primary goal: ${config.primary_goal || 'assist patients'}
Services you handle: ${services || 'General medical appointments'}

RULES (non-negotiable):
1. You are NOT a doctor. Never provide medical diagnoses, treatment advice, or clinical opinions.
2. Emergency protocol: If the patient mentions any emergency keywords (chest pain, difficulty breathing, severe bleeding, stroke symptoms, etc.), immediately tell them to call 911 or go to the emergency room. Do NOT try to help them yourself.
3. Always disclose you are an AI assistant when asked directly.
4. Collect only the information needed for appointment booking.
5. Be warm, professional, and concise. Keep responses under 3 sentences.
6. Never repeat information the patient has already provided.
7. Lead qualification: Collect these fields during conversation: ${(config.qualification_fields || ['name', 'reason']).join(', ')}

Tone guidelines:
- Be warm, professional, and empathetic
- Use natural conversational language
- Never make medical diagnoses
- Always confirm information back to the patient
- If you're unsure, offer to transfer to a human receptionist

Response style:
- Keep responses concise (1-2 sentences)
- Ask one question at a time
- Use the patient's name when you have it
- End with a clear next step or question`;

  if (actionContext?.phaseHint) {
    prompt += `\n\n${actionContext.phaseHint}`;
  }

  return prompt;
}

/**
 * Load client config from filesystem.
 * @param {string} clientId - Client identifier (matches config filename)
 * @returns {object} Parsed config object
 */
function loadClientConfig(clientId) {
  const configPath = path.join(process.cwd(), 'configs', `${clientId || 'medical-clinic'}.json`);
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    // Fallback: try loading default config
    const defaultPath = path.join(process.cwd(), 'configs', 'medical-clinic.json');
    return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
  }
}

/**
 * Validate the top-level request fields.
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return { valid: false, error: 'userInput is required and must be a string' };
  }
  if (userInput.trim().length === 0) {
    return { valid: false, error: 'userInput cannot be empty' };
  }
  if (userInput.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `userInput exceeds maximum length of ${MAX_INPUT_LENGTH} characters` };
  }
  return { valid: true, error: null };
}

/**
 * Sanitize the memory array supplied by the client.
 * - Enforces MAX_MEMORY_TURNS limit
 * - Requires valid role ('user' | 'assistant') on every entry
 * - Drops entries with empty content
 * - Drops entries whose content matches known prompt-injection patterns
 *
 * @param {unknown} rawMemory
 * @returns {{ safe: Array<{role:string, content:string}>, dropped: number }}
 */
function sanitizeMemory(rawMemory) {
  if (!Array.isArray(rawMemory)) return { safe: [], dropped: 0 };

  const VALID_ROLES = new Set(['user', 'assistant']);
  let dropped = 0;

  const safe = rawMemory
    .slice(-MAX_MEMORY_TURNS)
    .filter(entry => {
      if (!entry || typeof entry !== 'object') { dropped++; return false; }

      if (!VALID_ROLES.has(entry.role)) { dropped++; return false; }

      const content = String(entry.text || entry.content || '').trim();
      if (!content) { dropped++; return false; }

      if (INJECTION_PATTERNS.some(p => p.test(content))) {
        console.warn('[LLMProxy] Dropped memory entry matching injection pattern.');
        dropped++;
        return false;
      }

      return true;
    })
    .map(entry => ({
      role:    entry.role,
      content: String(entry.text || entry.content).trim(),
    }));

  return { safe, dropped };
}

// ─── POST /api/llm/chat ───────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  const { userInput, memory = [], model, stream: wantStream = false, client_id, action_context } = req.body;

  // ── Input validation ────────────────────────────────────────
  const inputCheck = validateInput(userInput);
  if (!inputCheck.valid) {
    console.warn(`[LLMProxy] Rejected request — ${inputCheck.error}`);
    return res.status(400).json({ error: inputCheck.error });
  }

  // ── Model allowlist — silently coerce invalid models to default ──
  const llmModel = ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL;
  if (model && !ALLOWED_MODELS.has(model)) {
    console.warn(`[LLMProxy] Rejected model "${model}" — using default.`);
  }

  // ── Memory sanitization ──────────────────────────────────────
  const { safe: safeMemory, dropped } = sanitizeMemory(memory);
  if (dropped > 0) {
    console.warn(`[LLMProxy] Dropped ${dropped} memory entries (invalid role, empty content, or injection pattern).`);
  }

  // Load client config and build dynamic system prompt
  const config = loadClientConfig(client_id);
  const systemPrompt = buildSystemPrompt(config, action_context);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...safeMemory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userInput }
  ];

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), INFERENCE_TIMEOUT_MS);

  try {
    const ollamaRes = await fetch(`${OLLAMA_ENDPOINT}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model:    llmModel,
        messages: messages,
        stream:   true,
        options:  { temperature: 0.7, num_predict: 200 }
      }),
      signal: controller.signal
    });

    if (!ollamaRes.ok) {
      clearTimeout(timeoutId);
      return res.status(502).json({ error: `Ollama returned ${ollamaRes.status}` });
    }

    const reader  = ollamaRes.body.getReader();
    const decoder = new TextDecoder();

    if (wantStream) {
      // ── SSE streaming mode ──────────────────────────────────
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let ttsBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(l => l.trim())) {
          try {
            const parsed = JSON.parse(line);
            const token  = parsed?.message?.content || '';
            if (!token) continue;

            ttsBuffer += token;
            if (TTS_FLUSH_REGEX.test(token) && ttsBuffer.trim()) {
              res.write(`data: ${JSON.stringify({ token: ttsBuffer.trim() })}\n\n`);
              ttsBuffer = '';
            }
          } catch { /* malformed JSON chunk — skip */ }
        }
      }

      if (ttsBuffer.trim()) {
        res.write(`data: ${JSON.stringify({ token: ttsBuffer.trim() })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();

    } else {
      // ── Non-streaming mode — return full response ───────────
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(l => l.trim())) {
          try {
            const parsed = JSON.parse(line);
            const token  = parsed?.message?.content || '';
            if (token) fullText += token;
          } catch { /* skip */ }
        }
      }

      clearTimeout(timeoutId);
      return res.json({ response: fullText.trim() || null });
    }

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn('[LLMProxy] Ollama request timed out.');
      return res.status(504).json({ error: 'LLM inference timeout' });
    }
    console.error('[LLMProxy] Error:', err.message);
    return res.status(502).json({ error: 'LLM unavailable' });
  }
});

// ─── GET /api/llm/health ──────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({ available: false, provider: 'vapi', note: 'LLM hosted by Vapi — no local endpoint' });
});

export default router;
