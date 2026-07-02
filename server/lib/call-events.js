/**
 * In-process SSE broadcast bus for live call events.
 * Each client entry stores the response stream + the tenant scope so
 * broadcasts are filtered: clinic users only see their own clinic's events.
 */

const clients = new Set();

/**
 * @param {import('express').Response} res
 * @param {string|null} tenantId  — null for super_admin (receives all events)
 */
export function addSseClient(res, tenantId = null) {
  clients.add({ res, tenantId });
}

export function removeSseClient(res) {
  for (const entry of clients) {
    if (entry.res === res) {
      clients.delete(entry);
      break;
    }
  }
}

export function clientCount() {
  return clients.size;
}

/**
 * Broadcast a named SSE event, filtered by tenantId if present in data.
 * @param {string} event  - e.g. 'call:started'
 * @param {object} data   - must include tenantId for filtering to work
 */
export function broadcast(event, data) {
  if (clients.size === 0) return;
  const frame = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const entry of clients) {
    // null tenantId = super_admin scope = receive everything
    if (entry.tenantId !== null && data?.tenantId && entry.tenantId !== data.tenantId) continue;
    try {
      entry.res.write(frame);
    } catch {
      clients.delete(entry);
    }
  }
}
