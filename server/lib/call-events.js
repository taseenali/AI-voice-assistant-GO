/**
 * In-process SSE broadcast bus for live call events.
 * Keeps a set of active response streams; broadcasts named SSE events to all.
 * Non-blocking: if no clients are connected, broadcast is a no-op.
 */

const clients = new Set();

export function addSseClient(res) {
  clients.add(res);
}

export function removeSseClient(res) {
  clients.delete(res);
}

export function clientCount() {
  return clients.size;
}

/**
 * Broadcast a named SSE event to all connected monitor clients.
 * @param {string} event  - e.g. 'call:started'
 * @param {object} data   - JSON-serialisable payload
 */
export function broadcast(event, data) {
  if (clients.size === 0) return;
  const frame = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(frame);
    } catch {
      // Client disconnected mid-write; will be cleaned up on 'close'
      clients.delete(res);
    }
  }
}
