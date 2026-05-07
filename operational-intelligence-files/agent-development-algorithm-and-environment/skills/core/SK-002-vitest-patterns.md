# Skill: Vitest Patterns
Standard conventions for writing and running tests in this project.

## 1. Environment
- **Native Vite Integration**: Run `vitest` to use the existing `vite.config.js`.
- **Browser Mode**: Use for UI/Speech API tests to ensure real browser behavior.

## 2. Test Structure
- **Mocking**: Use `vi.mock()` for `AppContext` to inject test-specific configurations.
- **Async**: Use `await` for all state-machine transitions and webhook dispatches.
- **Cleanup**: Ensure `localStorage` and `IndexedDB` are cleared between test runs.

## 3. Pattern: Component Test
```javascript
import { it, expect, vi } from 'vitest';
import { LeadCapture } from '../js/modules/lead-capture.js';

it('should capture medical fields correctly', () => {
  const lc = new LeadCapture();
  lc.capture('dob', '1990-01-01');
  expect(lc.getData().dob).toBe('1990-01-01');
});

## 4. Real Example From This Codebase
- **Scenario**: Migration from Jest to Vitest (G-031, Pass 4).
- **Issue**: Jest was failing to resolve ES Modules and Vite aliases.
- **Fix**: Configured Vitest with `environment: 'jsdom'` and shared the `vite.config.js` for zero-config ESM support.
- **Location**: `package.json`, `vitest.config.js`.
