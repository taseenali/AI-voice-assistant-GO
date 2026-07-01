# World-Class Dashboards — The Standard, By Genre
## Deliverable 2, Part 1 of 3 — The STRATEGIC Dashboard

*This deliverable re-cuts the same 17 aspects from Deliverable 1, re-weighted and re-specified for one genre at a time. Part 1 covers the **strategic** dashboard.*

---

## What a strategic dashboard is, and what it optimizes for

A strategic dashboard gives **executives and the board a top-level, periodically-reviewed read on progress against long-term goals** — its one question is *"are we on track against the plan?"* (Nielsen Norman Group's definition of the strategic type). It is a **steering instrument, not a monitoring screen**: where an operational dashboard answers "what needs my attention right now?", the strategic dashboard answers "are our chosen bets paying off over quarters and years?"

Its canonical framework is the **Balanced Scorecard** (Kaplan & Norton, 1992), which deliberately blends financial and non-financial measures across **four perspectives — Financial, Customer, Internal Processes, and Learning & Growth** — so leadership doesn't manage on lagging financials alone. A related artifact, the **strategy map**, lays out 15–25 causally-linked strategic objectives top-down. This top-down origin is the genre's signature: a strategic dashboard is **designed down from strategy** (global objectives → KPIs), whereas operational dashboards are built bottom-up from whatever metrics are available.

The core design tension is **radical simplicity vs. the executive's need to understand "why"** — resolved not by adding density but by attaching *narrative context and the connected initiative* to each KPI.

Below, each of the 17 aspects is given its strategic-genre standard, flagged where the bar rises, falls, or shifts versus the general standard.

---

## Foundations cluster

**A. Purpose, Strategy & Scope — bar RISES; most genre-defining.** The purpose is to track the *vital few* strategic objectives and align the organization to them. Scope is ruthlessly narrow: the Balanced Scorecard's perspectives or a handful of strategic themes, not a catalog of everything measurable. The 5-second glance test is at its strictest here, because the audience has the least time and the least patience.

**B. Audience & Context — the C-suite and board, the highest-stakes / lowest-tolerance-for-clutter audience.** Standard: **3–5 KPIs, reviewed monthly or quarterly**, in the language of business outcomes rather than operational jargon. Consumption context is distinctive — often a **board pre-read / governance-ready packet**, a meeting projection, or a between-meetings mobile glance — so the dashboard must survive being exported to a deck and read by directors and investors (the genre's true "hidden stakeholders").

**C. Data Foundation & Engineering — freshness bar FALLS, certification bar RISES.** Strategic data is **periodic, not real-time** (financials follow the monthly-close cadence), so sub-minute latency is irrelevant. What rises is **trusted accuracy**: these decisions are high-stakes and hard to reverse. The defining failure mode is the **manual-update death spiral** — "month one someone dutifully updates every metric; by month three the dashboard shows stale data, leadership stops trusting it, and the entire investment is wasted." The world-class fix is an automation hierarchy: **automate data collection first; semi-automate judgment-based metrics with structured forms, reminders, and escalation; leave only genuinely manual items last** — all on validated, certified, aggregated data.

**D. Metrics & KPIs — bar RISES; the heart of the genre.** Beyond the general 3–5 limit, strategic KPIs are **balanced across the four BSC perspectives** so the picture isn't financial-only, and they **blend leading indicators (the "weather forecast" for what's coming) with lagging indicators (what's been accomplished).** Each KPI carries the full strategic payload: a **precise target/threshold shown numerically**, a **named accountable owner**, **narrative context** (what changed, why, and what's being done about it), and an explicit **initiative connection** — the work expected to move the metric shown right beside it. A world-class strategic scorecard is "not a long list of metrics"; it connects KPIs to priorities, owners, risks, and the review cadence where decisions happen. And the metric set **evolves as strategy evolves** — what mattered in January may be irrelevant by July.

---

## Structure & Encoding cluster

**E. Information Architecture & Layout — maximal simplicity.** Single screen, big bold headline numbers, generous white space, RAG status prominent, low density — the visual opposite of an analytical dashboard. Often organized **by BSC perspective or strategic theme**, with the headline outcome top-left. The whole layout is engineered to be absorbed in seconds by a non-analyst.

**F. Data Visualization & Chart Design — simple, unambiguous encodings only.** Big-number KPI tiles, **bullet graphs** (Few's actual-vs-target-vs-bands form is tailor-made for "KPI against goal"), trend sparklines, and variance bars. RAG status indicators for at-a-glance health. Exploratory or complex chart types belong to the analytical genre, not here — every element must read instantly to an executive.

**G. Visual Design & Consistency — presentation-grade.** Because it is shown to the board and exported into decks, polish and restraint matter more than in any other genre: disciplined RAG semantics, large legible tabular figures, and conformance to corporate/board reporting conventions. This is the genre where **IBCS / ISO 24896 notation is most mature and most valuable** — consistent actual/plan/forecast/prior-year notation so every quarter's pack reads identically.

**H. Cognition & Perception — tuned for the time-poorest audience.** Instant comprehension is paramount; big numbers exploit preattentive salience, and the 3–5 KPI ceiling *is* the cognitive-load strategy. There is no room here for anything that requires study.

---

## Behavior & Engineering cluster

**I. Interactivity & Behavior — bar FALLS sharply; the clearest genre delta.** Strategic dashboards are largely **view-only**, with at most a period selector and a single shallow drill for the curious executive. **Static export to PDF/deck is a primary mode of use, not an afterthought.** Building analytical-grade filtering and cross-filtering here is over-engineering — it adds friction for an audience that wants the answer, not a sandbox.

**J. Alerting & Actionability — status and variance, resolved in the review.** The actionability mechanism is distinctive: rather than operational push-alerts, the strategic dashboard surfaces **RAG status and variance-against-plan**, and converts it to action through **narrative context + the connected initiative + a named owner**, with decisions made in the periodic strategy review. The health check is whether the dashboard drives *action*, not passive viewing — one platform reports a 7:1 update-to-login ratio as evidence that "every session drives real data action."

**K. Performance & Technical Quality — reliability over raw speed.** Periodic use makes sub-second latency unnecessary, but the dashboard must still **load fast for impatient executives, render cleanly for projection and export, and refresh reliably on its periodic schedule.** Mobile rendering for between-meeting glances matters (the Gartner mobile-BI trend).

**L. Accessibility & Inclusivity — baseline plus governance scrutiny.** The full WCAG standard applies, with added weight because **board and executive materials face governance and sometimes legal scrutiny** and are frequently exported — so RAG status must never be color-alone, contrast must survive the deck, and exported artifacts must retain alt text and reading order. High-contrast big numbers help everyone.

---

## Trust & Operations cluster

**M. Trust, Integrity & Transparency — bar at its HIGHEST of any genre.** Executives stake the company on these numbers, so a **certified-dataset badge, a "data as of" timestamp, and validation before board distribution** are mandatory, and the figures must reconcile to finance's single source of truth. The narrative-context field doubles as a trust mechanism. The manual-update staleness spiral isn't just an annoyance here — it's fatal to the dashboard's credibility.

**N. Security, Privacy & Governance — among the most sensitive data in the company.** Executive/board content (financials, strategy, M&A, ESG/compliance KPIs) warrants the tightest controls: restricted distribution, row/object-level security, audit trails, board-portal-grade protection, and alignment with financial-reporting governance.

**O. Standards & Comparability — period-over-period comparability is essential.** The board must read each quarter's pack the same way and compare *this period vs. last vs. plan*, so consistent notation (IBCS/ISO 24896) and a stable scorecard structure are core, not optional. The BSC framework itself functions as a comparability standard.

**P. Lifecycle, Maintenance & Adoption — evolves with strategy; lives or dies on automation.** The metric set rotates as strategic priorities shift; ownership sits at the executive level; and adoption is measured by whether the leadership team actually **runs its operating rhythm off the dashboard** rather than rebuilding status in disconnected decks. Avoiding competing "shadow" executive decks (a sprawl variant) and defeating the manual-update spiral through automation are the central lifecycle tasks.

**Q. Validation & Research — validated against strategy and decisions, not just usability.** The key tests: do the KPIs genuinely map to the strategy map's objectives, and does the dashboard actually **change what the leadership team decides and does** in its reviews? Validation is done with the real executives/board, confirming each metric connects to a decision someone will make.

---

## The strategic genre in one line

**Optimize for an instant, trustworthy, board-grade read on the vital few strategic objectives — radically simple, periodically refreshed, certification-heavy, interactivity-light — where the dashboard's job is to steer the leadership rhythm, not to be explored.**

The two aspects where the strategic bar is *highest* are **Metrics** (the balanced vital few, fully contextualized) and **Trust** (certified, reconciled, board-grade). The two where it is *lowest* are **Interactivity** and **data Freshness**. That trade-off profile is precisely what distinguishes it from the next genre.

**Coming next — Deliverable 2, Part 2: the OPERATIONAL dashboard**, where the profile inverts: freshness and alerting become paramount, real-time is the default, and the audience shifts from the boardroom to the front line.
