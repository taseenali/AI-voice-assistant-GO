# Skill: Ollama Integration
Patterns for high-performance LLM streaming in the browser.

## 1. Punctuation Buffering
- **Rule**: Never send partial words or sentences to TTS.
- **Pattern**: Buffer tokens until a punctuation mark (`.`, `!`, `?`, `:`) is detected.
- **Regex**: `/[.!?;:\n]/`

## 2. API Usage
- **Endpoint**: `/api/chat`
- **Stream**: `true` (always)
- **Options**: Set `temperature: 0.7` and `num_predict: 200` for conversational balance.

## 3. Graceful Fallback
- **Check**: Use a 3s timeout on `/api/tags` to verify Ollama availability.
- **Failure**: If unavailable, return `null` from the adapter.

## 4. Real Example From This Codebase
- **Scenario**: GAP-06 Initialization Race Condition (Pass 4).
- **Issue**: `isEnabled` was reading `ai_tier` at import time, before `loadConfig()` updated the `AppContext` singleton.
- **Fix**: Refactored `isEnabled` into a dynamic getter that performs a lazy check of `AppContext.getConfig()` at call-time.
- **Location**: `js/services/llm-adapter.js` (Lines 172-189).
