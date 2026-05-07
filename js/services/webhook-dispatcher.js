/**
 * WebhookDispatcher Service
 * Responsible for reliable event delivery to external systems (n8n).
 * Follows the Transactional Outbox pattern with strict data integrity rules.
 */

import { outboxDB, OutboxStatus } from './outbox-db.js';
import { AppContext } from '../config/loader.js';

const QUEUE_CAP = 100;

class WebhookDispatcher {
  constructor() {
    this._isInitialized = false;
    this._isProcessing = false;
    this._lock = null;
  }

  /**
   * Initialize the dispatcher
   */
  async init() {
    if (this._isInitialized) return;
    
    try {
      await outboxDB.init();
      this._isInitialized = true;
      console.log('WebhookDispatcher: Initialized');
      
      // Initial trigger to clear any stale items
      this.triggerProcessing();
    } catch (err) {
      console.error('WebhookDispatcher: Failed to initialize persistence', err);
      // Fail-fast principle: We do not set _isInitialized to true
    }
  }

  /**
   * Dispatch a new event to the outbox
   * @param {string} eventType - The type of event (e.g. 'LEAD_CAPTURE')
   * @param {object} data - The payload to send
   * @returns {Promise<void>}
   */
  async dispatch(eventType, data) {
    // 0. Readiness Barrier (Ensure config is loaded)
    await AppContext.waitForConfig();

    if (!this._isInitialized) {
      await this.init();
      if (!this._isInitialized) {
        throw new Error('WebhookDispatcher: System unavailable (Persistence failure)');
      }
    }

    // 1. Queue Cap Check
    const count = await outboxDB.getCount();
    if (count >= QUEUE_CAP) {
      console.error('WebhookDispatcher: Queue capacity exceeded (100 items)');
      throw new Error('WebhookDispatcher: Queue capacity exceeded');
    }

    // 2. Package Payload (Image 8 Schema)
    const config = AppContext.getConfig();
    const payload = {
      client_id: config.company_name || 'unknown',
      webhook_url: config.webhook_url, // CAPTURE AT SOURCE
      event_type: eventType,
      data: data,
      timestamp: new Date().toISOString(),
      idempotency_key: crypto.randomUUID()
    };

    // 3. Persist to Outbox (Atomic Transaction)
    try {
      await outboxDB.add(payload);
      console.log(`WebhookDispatcher: Event ${eventType} queued successfully`);
      
      // 4. Trigger Processing Loop (Async)
      this.triggerProcessing();
    } catch (err) {
      console.error('WebhookDispatcher: Failed to queue event', err);
      throw err;
    }
  }

  /**
   * Trigger the processing loop
   */
  triggerProcessing() {
    if (this._isProcessing) return;

    // G-015: Request background sync if ServiceWorker is available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        return reg.sync.register('sync-outbox');
      }).catch(err => {
        console.log('[WebhookDispatcher] Sync registration failed, falling back to local processing:', err);
        this._triggerLocalProcessing();
      });
    } else {
      this._triggerLocalProcessing();
    }
  }

  _triggerLocalProcessing() {
    if (this._isProcessing) return;
    
    // Use Web Locks API to ensure only one tab processes the outbox at a time.
    // If unavailable, we block processing to maintain fail-safe integrity.
    if (!navigator.locks) {
      console.error('WebhookDispatcher: Web Locks API unavailable. Processing blocked for data integrity.');
      return;
    }

    navigator.locks.request('webhook_outbox_mutex', { ifAvailable: true }, async (lock) => {
      if (!lock) return; // Another tab is already leader
      
      this._isProcessing = true;
      try {
        await this._processQueue();
      } finally {
        this._isProcessing = false;
      }
    });
  }

  /**
   * The core processing loop
   */
  async _processQueue() {
    if (!navigator.onLine) return; // Wait for connection

    const items = await outboxDB.getAllProcessable();
    if (items.length === 0) return;

    console.log(`WebhookDispatcher: Processing ${items.length} items...`);

    for (const item of items) {
      // 1. Check if eligible for retry (exponential backoff with jitter)
      if (!this._isEligibleForRetry(item)) continue;

      // 2. Mark as PROCESSING (Item-level FSM)
      await outboxDB.update(item.id, { 
        status: OutboxStatus.PROCESSING, 
        lastAttempt: Date.now() 
      });

      try {
        await this._attemptDelivery(item);
        // 3a. Success -> Remove from outbox
        await outboxDB.delete(item.id);
        console.log(`WebhookDispatcher: Item ${item.id} delivered successfully.`);
      } catch (err) {
        // 3b. Failure -> Update attempts and backoff
        const newAttempts = item.attempts + 1;
        if (newAttempts >= 5) {
          await outboxDB.update(item.id, { 
            status: OutboxStatus.DEAD_LETTER, 
            attempts: newAttempts 
          });
          console.error(`WebhookDispatcher: Item ${item.id} moved to DEAD-LETTER after 5 failures.`);
        } else {
          await outboxDB.update(item.id, { 
            status: OutboxStatus.PENDING, 
            attempts: newAttempts 
          });
          console.warn(`WebhookDispatcher: Item ${item.id} failed attempt ${newAttempts}. Retrying later.`);
        }
      }
    }

    // Check again after a small delay if there's more work
    setTimeout(() => this.triggerProcessing(), 5000);
  }

  /**
   * Exponential backoff with Full Jitter
   */
  _isEligibleForRetry(item) {
    if (item.attempts === 0) return true;
    
    const baseDelay = 1000; // 1s
    const maxDelay = 3600000; // 1h
    
    // delay = min(maxDelay, baseDelay * 2^attempts)
    const exponentialDelay = Math.min(maxDelay, baseDelay * Math.pow(2, item.attempts));
    
    // Add Full Jitter (random between 0 and delay)
    // This prevents "Thundering Herd" on server recovery.
    const jitteredDelay = Math.random() * exponentialDelay;
    
    return Date.now() - item.lastAttempt > jitteredDelay;
  }

  /**
   * HMAC-SHA256 signature helper (SEC-01)
   * Signs: timestamp + '.' + rawBody
   * Returns: { signature: hexString, timestamp: epochMs }
   */
  async _signPayload(secret, rawBody) {
    if (!secret) {
      console.warn('[WebhookDispatcher] webhook_secret is missing — payload sent unsigned. Set secret per SSYNC-03.');
      return { signature: null, timestamp: null };
    }
    const timestamp = Date.now().toString();
    const message   = `${timestamp}.${rawBody}`;
    const encoder   = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const sigHex = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return { signature: sigHex, timestamp };
  }

  /**
   * Actual HTTP POST logic — SEC-01 hardened
   */
  async _attemptDelivery(item) {
    const url = item.webhook_url; // MUST be captured at dispatch time — tenant isolation

    // BUG-01 fix (SEC-06): Hard fail on missing URL. Do NOT fall back to current config.
    // Falling back would deliver the payload to a different tenant's webhook endpoint.
    if (!url) {
      throw new Error(
        `WebhookDispatcher: Item ${item.id} has no captured webhook_url. ` +
        `Tenant isolation violation prevented. Check dispatch() call site.`
      );
    }

    // SEC-01: Sign the payload with HMAC-SHA256 + timestamp (replay protection)
    const rawBody = JSON.stringify(item);
    const { signature, timestamp } = await this._signPayload(item.webhook_secret, rawBody);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Build auth headers — only attach if secret is present (SSYNC-03 compliant)
    const authHeaders = {};
    if (signature && timestamp) {
      authHeaders['X-Webhook-Signature'] = signature;
      authHeaders['X-Webhook-Timestamp'] = timestamp;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': item.client_id,
          'X-Idempotency-Key': item.idempotency_key,
          ...authHeaders
        },
        body: rawBody,
        signal: controller.signal
      });

      if (!response.ok) {
        // SEC-01: Reject on 401/403 — server-side signature validation failed
        if (response.status === 401 || response.status === 403) {
          throw new Error(`WebhookDispatcher: Signature rejected by server (${response.status}). Check webhook_secret alignment.`);
        }
        throw new Error(`Server responded with ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get current outbox statistics for observability
   */
  async getStats() {
    const db = await outboxDB.init();
    return {
      total: await outboxDB.getCount(),
      pending: (await outboxDB.getByStatus(OutboxStatus.PENDING)).length,
      processing: (await outboxDB.getByStatus(OutboxStatus.PROCESSING)).length,
      deadLetter: (await outboxDB.getByStatus(OutboxStatus.DEAD_LETTER)).length,
      initialized: this._isInitialized
    };
  }
}

// Add system listeners
window.addEventListener('online', () => webhookDispatcher.triggerProcessing());
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    webhookDispatcher.triggerProcessing();
  }
});
// Heartbeat every 60s
setInterval(() => webhookDispatcher.triggerProcessing(), 60000);

export const webhookDispatcher = new WebhookDispatcher();
