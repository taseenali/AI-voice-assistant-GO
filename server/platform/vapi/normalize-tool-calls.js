/**
 * Normalize Vapi tool-call payloads — handles documented shape variance.
 * @see docs/PHASE-3-SPIKE.md Step 6
 */

function parseArguments(raw) {
  if (raw == null) return {};
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * @param {object} message - req.body.message
 * @returns {{ id: string, name: string, arguments: object }[]}
 */
export function normalizeToolCallList(message) {
  const raw =
    message?.toolCallList ||
    message?.toolCalls ||
    message?.toolWithToolCallList?.map((t) => t.toolCall || t).filter(Boolean) ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const nested = item.toolCall || item.function || item;
      const id = item.id || item.toolCallId || nested?.id || nested?.toolCallId;
      const name = item.name || nested?.name || nested?.function?.name;
      const args = parseArguments(
        item.arguments ??
          item.parameters ??
          nested?.arguments ??
          nested?.function?.arguments ??
          nested?.parameters
      );

      return { id, name, arguments: args };
    })
    .filter((c) => c.id && c.name);
}

/**
 * Format tool result for Vapi — result MUST be a single-line string.
 */
export function formatToolResult(value) {
  if (value == null) return '';
  if (typeof value === 'string') {
    return value.replace(/\r?\n/g, ' ').trim();
  }
  return JSON.stringify(value).replace(/\r?\n/g, ' ');
}

/**
 * Build Vapi-required response shape. Always HTTP 200 when sent.
 */
export function buildToolCallResponse(toolCalls, resultsById) {
  return {
    results: toolCalls.map((call) => {
      const entry = resultsById.get(call.id);
      if (entry?.error) {
        return {
          toolCallId: call.id,
          result: formatToolResult(`Error: ${entry.error}`),
        };
      }
      return {
        toolCallId: call.id,
        result: formatToolResult(entry?.result ?? 'Done.'),
      };
    }),
  };
}
