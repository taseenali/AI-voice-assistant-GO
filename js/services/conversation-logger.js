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
  }

  log({ turn, role, text, state, intent }) {
    if (!this._enabled) return;

    const config = AppContext.getConfig();
    const payload = {
      sessionId: this._sessionId,
      clientId:  config.client_id || 'unknown',
      turn:      turn  || 0,
      role:      role  || 'unknown',
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
}

export const conversationLogger = new ConversationLogger();
