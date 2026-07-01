# Dashboard UI kit — MedVoice Command Center

An elite, product-true command center for the MVAIR / MedVoice AI receptionist SaaS.
Open `index.html`. Built to the research brief — it blends all three dashboard genres
(strategic glance · operational real-time · analytical exploration) and every world-class
cross-cutting concern (trust signals, alerting with owners, deep interactivity, role views).

## Files
- `index.html` — theme system (light/dark via `data-theme`), density (`data-density`), loads everything.
- `data.js` → `window.MV` — mock data grounded in the product: 5 agent tools, BAA chain, Vapi 7.5s budget, missed-call economics, multi-tenant.
- `charts.jsx` → `window.MvairUI` — sparkline, bullet graph, line/area, donut, heatmap, funnel + controls (tabs, segmented, switch, select, status pill, RAG dot, MetricStat…).
- `shell.jsx` → `window.Shell` — sidebar, top bar (tenant switcher, date range, freshness + certified pills, ⌘K, notifications, role/theme/density toggles), command palette, notifications drawer.
- `screens1.jsx` — Command Center · Live Monitor · Calls (+ detail drawer: transcript / tool-trace / recording).
- `screens2.jsx` — Appointments (list + calendar) · Leads (pipeline) · Emergencies (escalation log).
- `screens3.jsx` — Analytics (insights, trend, funnel, peak-hours heatmap, intent) · System Health (golden signals, latency vs 7.5s budget, SPOF).
- `screens4.jsx` — Trust & Compliance (BAA flow-down chain, posture, audit) · Integrations (Gate 2 write-back) · Aria Configuration (+ test-the-line, tool toggles) · Clinics · Billing & Usage.
- `app.jsx` — state, routing, keyboard (⌘K / Esc), role-based home screen.

## Product requirements covered
- **3 sales gates** — Trust (Gate 1: BAA chain/HIPAA), Integrations (Gate 2: PMS write-back), Config "Test the line" (Gate 3).
- **5 agent tools** surface as Calls/Appointments/Leads/Emergencies + the tool-trace drawer.
- **Observability** — task-completion as the hero outcome, golden signals, p50/p95/p99 vs the 7.5s assistant-request budget, webhook-tunnel SPOF.
- **Economics** — missed-call recovery ($450/call), per-clinic minutes/margin in Billing.
- **Multi-tenant + RBAC** — super-admin tenant switcher + Clinics screen; role selector reshapes the home view.
- **Trust-first** — "data as of" freshness + certified pills persist across every screen.

## Interactions
Try: ⌘K command palette · role selector (top-right) · theme + density toggles · tenant switcher (super-admin) · click any call row for the detail drawer · sidebar navigation · notifications bell.

Composes the design-system bundle's brand mark + icons (`assets/mvair-icons.js`). All data mocked.
