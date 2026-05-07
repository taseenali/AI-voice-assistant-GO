# Skill: JS Module Refactoring
Standard patterns for maintaining a clean, modular ES6+ codebase.

## 1. Native ESM Standards
- **Always use `import`/`export`**. No CommonJS (`require`).
- **File Extensions**: Use `.js` with `"type": "module"` in `package.json`.
- **Top-Level Await**: Use for initialization logic (e.g., loading config) rather than factory functions where possible.

## 2. State Encapsulation
- **Singletons**: Use the `AppContext` pattern for global state.
- **Private Fields**: Prefix internal module state with `_` (e.g., `this._leadData`).
- **Immutable Config**: Never modify the object returned by `AppContext.getConfig()`.

## 3. Safe Refactoring Checklist
1. Identify "leaf" modules with no dependencies.
2. Refactor leaf modules first.
3. Use optional chaining (`?.`) and nullish coalescing (`??`) for config reads.

## 4. Real Example From This Codebase
- **Scenario**: Response Orchestrator Pipeline Refactoring (Pass 2).
- **Issue**: Direct functional calls were mixed with async pipeline steps.
- **Fix**: Encapsulated state into private `_context` and used `const` for pipeline result immutability.
- **Location**: `js/response-orchestrator.js`.
