const CACHE_NAME = 'ai-voice-assistant-v3';
const SYNC_EVENT_NAME = 'sync-outbox';

// Install event - minimal caching for now
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('[ServiceWorker] Installed');
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('[ServiceWorker] Activated');
});

// Fetch event - pass through
self.addEventListener('fetch', event => {
  // We're mostly focused on background sync, let normal requests pass
});

// Background Sync - the core of G-015
self.addEventListener('sync', event => {
  if (event.tag === SYNC_EVENT_NAME) {
    console.log('[ServiceWorker] Sync event triggered:', event.tag);
    event.waitUntil(processOutboxSync());
  }
});

// Send a message to all open clients to tell them to process the outbox
async function processOutboxSync() {
  const clients = await self.clients.matchAll({ type: 'window' });
  
  // If we have clients open, ask the first one to process the queue
  // This is safer since IndexedDB + Crypto operations are easier on the main thread
  // with full access to the webhook dispatcher's HMAC logic.
  if (clients && clients.length > 0) {
    console.log('[ServiceWorker] Delegating sync to client thread');
    clients[0].postMessage({ type: 'PROCESS_OUTBOX' });
    return Promise.resolve();
  }

  // If no clients are open, we could attempt to process IndexedDB here,
  // but we lack the config/webhook_secret in SW scope. For true offline
  // background sync while closed, we'd need to store the HMAC signature
  // IN the outbox item before it gets queued.
  // For Pass 3, delegating to the client is the robust path.
  console.log('[ServiceWorker] No active clients available for sync.');
  return Promise.resolve();
}
