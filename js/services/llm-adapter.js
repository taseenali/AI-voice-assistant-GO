/**
 * LLM Adapter — Ollama Provider (G-027)
 * Pass 3 — Medical AI Receptionist Platform
 *
 * Architecture: Provider Pattern (adapter interface)
 * Allows swapping Ollama → Claude/GPT-4o without orchestrator changes.
 *
 * Features:
 *   - Ollama REST API streaming (stream: true)
 *   - Token buffering at punctuation marks before TTS (T02 finding: prevents stuttering)
 *   - Medical system prompt with safety guardrails
 *   - Graceful fallback to rule-based responses if Ollama unavailable
 *   - Timeout + abort controller (10s)
 *
 * Integration point: _step6_generateResponse() in response-orchestrator.js
 * Config fields required: llm_model, ai_tier, ollama_endpoint
 */

import { AppContext } from '../config/loader.js';
import { LocalModelProvider } from './local-model-runner.js';

// ─── Backend Proxy Provider ─────────────────────────────────────
// All LLM calls go through /api/llm/chat — browser never touches Ollama directly.

const AVAILABILITY_RECHECK_MS = 30_000;

class ProxyProvider {
  constructor(config) {
    this.model      = config.llm_model || 'llama3.2';
    this._available = null;
    this._lastCheck = 0;
  }

  async checkAvailability() {
    if (this._available !== null && Date.now() - this._lastCheck < AVAILABILITY_RECHECK_MS) {
      return this._available;
    }
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('/api/llm/health', { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const body = await res.json();
        this._available = body.available === true;
      } else {
        this._available = false;
      }
    } catch {
      this._available = false;
    }
    this._lastCheck = Date.now();
    if (!this._available) {
      console.warn('[LLMAdapter] Proxy/Ollama unavailable — falling back to rule-based engine.');
    }
    return this._available;
  }

  async generate(userMessage, history = [], onToken = null, actionContext = null) {
    const available = await this.checkAvailability();
    if (!available) return null;

    const wantStream = typeof onToken === 'function';
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 32000);

    try {
      const cfg = AppContext.getConfig();
      const res = await fetch('/api/llm/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          userInput:      userMessage,
          memory:         history,
          model:          this.model,
          stream:         wantStream,
          client_id:      cfg.client_id || 'medical-clinic',
          action_context: actionContext || undefined,
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        console.warn(`[LLMAdapter] Proxy returned ${res.status} — falling back.`);
        clearTimeout(timeoutId);
        return null;
      }

      if (wantStream) {
        // ── SSE streaming — proxy sends "data: {token}" events ──
        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText  = '';
        let buf       = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          const lines = buf.split('\n');
          buf = lines.pop(); // keep incomplete last line

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') break;
            try {
              const { token } = JSON.parse(payload);
              if (token) {
                fullText += token;
                onToken(token);
              }
            } catch { /* skip */ }
          }
        }

        clearTimeout(timeoutId);
        return fullText.trim() || null;

      } else {
        // ── Non-streaming — single JSON response ─────────────
        const body = await res.json();
        clearTimeout(timeoutId);
        return body.response || null;
      }

    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn('[LLMAdapter] Proxy request timed out — falling back.');
      } else {
        console.error('[LLMAdapter] Proxy error:', err.message);
      }
      return null;
    }
  }
}

// ─── LLM Adapter (Public Interface) ────────────────────────────

export class LLMAdapter {
  constructor() {
    this._provider = null;
  }

  /**
   * Check if the LLM adapter is active for this configuration.
   * G-032: Dynamic check ensures activation after loadConfig() completes.
   */
  get isEnabled() {
    const config = AppContext.getConfig();
    const tier   = config.ai_tier || 1;
    
    if (tier >= 2) {
      // Lazy-initialize provider if not already present
      if (!this._provider) {
        if (tier === 3) {
          this._provider = new LocalModelProvider(config);
        } else {
          this._provider = new ProxyProvider(config);
        }
        console.log(`[LLMAdapter] LLM layer ACTIVATED (Tier: ${tier}) with model: ${config.llm_model || 'llama3.2'}`);
      }
      return true;
    }
    return false;
  }

  /**
   * Generate a response using the LLM provider.
   * Returns null if unavailable — orchestrator falls back to rule-based engine.
   *
   * @param {string}   userInput  - Sanitized user input
   * @param {Array}    memory     - Conversation memory from state machine
   * @param {Function} onToken    - Optional TTS streaming callback
   * @returns {Promise<string|null>}
   */
  async generate(userInput, memory = [], onToken = null, actionContext = null) {
    if (!this.isEnabled) return null;

    try {
      const response = await this._provider.generate(userInput, memory, onToken, actionContext);
      if (response) {
        console.log('[LLMAdapter] Response generated successfully.');
      }
      return response;
    } catch (err) {
      console.error('[LLMAdapter] Generation failed:', err.message);
      return null;
    }
  }
}

// Singleton export
export const llmAdapter = new LLMAdapter();
