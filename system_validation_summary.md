# System-Level Validation Summary: WebhookDispatcher

## 🚨 Critical Deficiencies Identified

### 1. Multi-Tenant Leakage (High Risk)
- **Observation**: `_attemptDelivery` currently pulls `webhook_url` from the global `AppContext` at the time of delivery.
- **Impact**: If a user switches tenants (URL param change) while the outbox contains items from a previous tenant, those items will be dispatched to the **wrong** webhook URL.
- **Requirement**: `webhook_url` must be captured and stored **within the outbox record** at the time of dispatch.

### 2. Concurrency Safety Violation
- **Observation**: The `navigator.locks` check has an `unsafe` fallback that allows processing to proceed without a mutex.
- **Impact**: In browsers without Web Locks support, multiple tabs can double-dispatch identical leads.
- **Requirement**: If `navigator.locks` is unavailable, processing MUST remain blocked to ensure deterministic behavior.

### 3. Chronological (FIFO) Integrity
- **Observation**: `getAllProcessable()` uses `store.getAll()`, which does not guarantee temporal ordering. 
- **Impact**: Leads captured later might be sent before leads captured earlier, breaking timeline integrity in the CRM.
- **Requirement**: Use a `createdAt` index to ensure strict FIFO processing.

### 4. Dependency Timing
- **Observation**: `dispatch()` requires `AppContext` to be ready.
- **Impact**: If an event triggers during the rapid boot phase before `loadConfig` finishes, `dispatch()` will fail.
- **Requirement**: Implement a "Ready" barrier or wait for `AppContext.isLoaded()` within the `init()` sequence.

## 🧪 System Sync Status: [FAILING]
The module is functionally correct in isolation but fails system-level synchronization tests for multi-tenancy and fail-safe safety.

## 🛠 Correction Planz
- [ ] Refactor Outbox Schema to include `webhook_url`.
- [ ] Remove unsafe `navigator.locks` fallback.
- [ ] Implement FIFO index-based retrieval.
- [ ] Add `AppContext` readiness guard.
