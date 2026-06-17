import {
  normalizeToolCallList,
  buildToolCallResponse,
} from '../vapi/normalize-tool-calls.js';
import { executeTool } from './tool-router.js';

/**
 * Vapi tool-calls batch → { results: [{ toolCallId, result }] }
 */
export async function handleToolCalls(message, tenantId, ctx) {
  const toolCalls = normalizeToolCallList(message);
  const resultsById = new Map();

  for (const call of toolCalls) {
    try {
      const result = await executeTool(call.name, tenantId, call.arguments, ctx);
      resultsById.set(call.id, { result });
    } catch (err) {
      resultsById.set(call.id, { error: err.message });
    }
  }

  return buildToolCallResponse(toolCalls, resultsById);
}
