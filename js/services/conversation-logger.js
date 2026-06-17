/**
 * Conversation Logger — client-side turn logging
 *
 * Fires-and-forgets POST /api/log/conversation for each conversation turn.
 * Failures are silent — logging must never block the conversation pipeline.
 */

import { AppContext } from '../config/loader.js';

export class ConversationLogger {
  constructor() {
    this._sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this._enabled   = true;
    /** Monotonic row index per session (DB requires user|assistant roles). */
    this._seq = 0;
  }

  /**
   * Call when starting a new chat (same browser tab / reset) so server rows line up.
   */
  resetSession() {
    this._sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this._seq = 0;
  }

  log({ turn, role, text, state, intent }) {
    if (!this._enabled) return;

    const safeRole = role === 'user' || role === 'assistant' ? role : 'user';
    this._seq += 1;

    const config = AppContext.getConfig();
    const payload = {
      sessionId: this._sessionId,
      clientId:  config.client_id || 'unknown',
      turn:      typeof turn === 'number' && turn > 0 ? turn : this._seq,
      role:      safeRole,
      text:      text  || '',
      state:     state || '',
      intent:    intent || '',
      timestamp: new Date().toISOString()
    };

    // Fire-and-forget — never await, never throw
    fetch('/api/log/conversation', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    }).catch(() => { /* silent — logging must not interrupt conversation */ });
  }

  disable() { this._enabled = false; }
  enable()  { this._enabled = true;  }

  getSessionId() { return this._sessionId; }

  /**
   * Exposed property getter — allows app.js to bind session IDs to lead saves.
   */
  get sessionId() { return this._sessionId; }
}

export const conversationLogger = new ConversationLogger();
