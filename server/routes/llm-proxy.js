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

const router = express.Router();

// ─── Config ───────────────────────────────────────────────────────────
const OLLAMA_ENDPOINT  = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
const DEFAULT_MODEL    = process.env.OLLAMA_MODEL    || 'llama3.2';
const INFERENCE_TIMEOUT_MS = 30_000;
const TTS_FLUSH_REGEX  = /[.!?;:\n]/;

const MEDICAL_SYSTEM_PROMPT = `You are a professional AI medical receptionist assistant.
Your role is to help patients schedule appointments, answer general practice questions,
and collect preliminary patient information.

RULES (non-negotiable):
1. You are NOT a doctor. Never provide medical diagnoses, treatment advice, or clinical opinions.
2. If a patient describes an emergency (chest pain, difficulty breathing, severe bleeding,
   stroke symptoms), IMMEDIATELY respond with "EMERGENCY_DETECTED" as your first word,
   then direct them to call 911.
3. Always disclose you are an AI assistant when asked directly.
4. Collect only the information needed for appointment booking.
5. Be warm, professional, and concise. Keep responses under 3 sentences.
6. Never repeat information the patient has already provided.

Your responses must be natural, conversational, and medically appropriate.`;

// ─── POST /api/llm/chat ───────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  const { userInput, memory = [], model, stream: wantStream = false } = req.body;

  if (!userInput || typeof userInput !== 'string') {
    return res.status(400).json({ error: 'userInput is required' });
  }

  const llmModel = model || DEFAULT_MODEL;

  const messages = [
    { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
    ...memory.map(m => ({ role: m.role, content: m.text || m.content })),
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
router.get('/health', async (req, res) => {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);
    const r   = await fetch(`${OLLAMA_ENDPOINT}/api/tags`, { signal: controller.signal });
    clearTimeout(tid);
    res.json({ available: r.ok, endpoint: 'configured' });
  } catch {
    res.json({ available: false, endpoint: 'configured' });
  }
});

export default router;
