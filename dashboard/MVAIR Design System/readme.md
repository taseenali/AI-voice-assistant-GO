# MVAIR Design System

The design system for **MVAIR / MedVoice** — an AI voice-receptionist product for medical
practices. It answers every inbound call, books appointments, captures leads, and flags
emergencies, then logs everything to a clinic-facing admin dashboard. The persona that
patients speak to is named **Aria**.

There are two product surfaces, both represented here:

1. **Marketing site** — the public landing page ("MVAIR"). Dark petrol hero, serif display
   type, animated waveform/booking visual, conversational transcript demo.
2. **Clinic / Admin dashboard** — the signed-in app ("MedVoice"). Sidebar-led, KPI tiles,
   session/lead/appointment tables, an emergency log, and a system-health view. Data is
   strategic-to-operational: it tells a clinic *what happened on the phones* and *what needs
   attention now*.

> **Brand naming note.** The marketing wordmark is **MVAIR**; the dashboard product label is
> **MedVoice** (`APP_NAME`). Both share one visual identity. Aria is the AI receptionist's name.

## Source

Recreated from the product codebase mounted read-only at `src/` (the MVAIR React/Vite app):
- `src/styles/brand.css`, `src/styles/globals.css` — the locked color tokens (mirrored into `tokens/`).
- `src/marketing/**` — the landing page (Nav, Hero, HowItWorks, Listen, Features, Reassurance, ClosingCTA, Footer) and its components (`MvairMark`, `CTAButton`, `HeroVisual`).
- `src/components/**` — dashboard shell (`Sidebar`, `PageHeader`, `MainLayout`) and shared primitives (`Badge`, `KPICard`, `Table`, `Modal`, `Toast`, `StatusDot`, `EmptyState`, `ChannelBadge`).
- `src/lib`, `src/types`, `src/pages/LoginPage.tsx` — supporting types & screens.

**Not available to this rebuild:** the project's `tailwind.config.js` lives outside the mounted
`src/` folder, so the named Tailwind theme tokens it defines (`rounded-card`, `text-kpi`,
`text-page-title`, `bg-sidebar`, `intent-*`, …) were **inferred from usage** rather than read
directly. Values are sensible reconstructions consistent with the source; see *Caveats* below.

Icons throughout the source are **lucide-react**.

---

## CONTENT FUNDAMENTALS

**Voice — calm, plain-spoken, reassuring; clinical without being cold.** Copy is written to put
a busy front desk (and an anxious patient) at ease. It favors short declarative sentences and
concrete outcomes over hype.

- **Person & address.** Marketing speaks to the clinic as **"you / your practice / your front
  desk."** It describes the product in the third person ("MVAIR answers every call…", "Aria
  listens…"). It never says "I."
- **Tone.** Confident and outcome-led, not boastful. Headlines make a plain promise:
  *"24/7 booking and triage that sounds human."*, *"Every call handled, start to finish."*,
  *"A real booking in under 90 seconds."* The one recurring rhetorical move is a single
  *italic emphasis word* in a headline — almost always **"human"** — set in the aqua accent.
- **Honesty as a feature.** The brand is deliberately transparent about limits. The HIPAA gate
  is stated plainly rather than hidden: *"A signed Business Associate Agreement is required
  before any live patient traffic. We are transparent about that gate…"* The footer carries a
  safety disclaimer: *"…not a substitute for emergency care."* This candor is part of the voice.
- **Casing.** Sentence case for headlines and body. **UPPERCASE only** for tracked eyebrows
  ("HOW IT WORKS", "WHAT IT DOES"), KPI labels ("TOTAL CALLS TODAY"), table headers, and
  sidebar section dividers ("ANALYTICS", "SAFETY", "SYSTEM", "LIVE").
- **Dashboard copy** is terse and functional: nouns for nav ("Overview", "Leads", "Sessions",
  "Emergency Log", "System Health"), status words for state ("Captured", "Escalated", "UP",
  "DEGRADED"), and an em-dash "—" as the standard placeholder for an empty field.
- **Numbers.** Phone numbers formatted `+1 (856) 440-2211`; durations as `3m 42s`; percentages
  with the metric ("58% capture rate"). Session IDs render in monospace.
- **Emoji:** none. Not used anywhere in product or marketing. Meaning is carried by lucide icons
  and color, never emoji.
- **Vibe in one line:** *a trustworthy clinical instrument with a warm voice* — competent,
  unflashy, quietly modern.

---

## VISUAL FOUNDATIONS

**Overall feel.** Cool, clinical, and calm — petrol teal + aqua on cool near-white, with a deep
petrol-black canvas for hero/sidebar moments. Editorial serif headlines paired with a clean
grotesque sans give it an authoritative-but-human character that sets it apart from typical
"tech blue" SaaS.

**Color.**
- **Primary — petrol teal `#0B5563`** (and `#084149` dark). The brand's anchor: logo, primary
  buttons, active nav, links, eyebrows on light sections.
- **Accent — aqua `#2DD4BF`** (hover `#5FE3D3`). The lively counterpart: CTAs, the waveform,
  italic emphasis words, accents on the dark canvas. `on-accent` text is near-black `#06222A`.
- **Signal — chartreuse `#C6F24E`.** Deliberately rare. Reserved for the **"Live · always
  answering" pulse dot** and the hero flow-dot. Never use it as a fill or for large areas.
- **Dark canvas — `#0C1A20`.** Hero, footer, closing CTA, and the dashboard sidebar all share
  this petrol-black. On it, text steps down a ramp: `#fff → on-dark #A9BAC0 → muted #8FA3AA →
  dim #6E838A`.
- **Surfaces.** Page is cool near-white `#FBFCFD`; cards are pure white `#FFFFFF`.
- **Semantics.** success `#168F67` (cool emerald, shares the blue undertone), warning `#E0922A`
  (warm amber, intentional temperature contrast), danger `#DA3633`. Status badges are a **15%
  tint of the color behind full-strength text** (e.g. `bg success/15 + text success`).
- **Imagery temperature:** the palette is cool overall; the only warm note is the amber warning.
  There is essentially no photography in the product — visuals are abstract (waveforms,
  transcript chrome) rather than imagery.

**Type.** A two-family system:
- **Newsreader** (optical-size **serif**) for *display*: hero H1 (62px), section H2 (42px),
  card/feature H3 (23px), the dashboard page title (28px, medium), and the "MVAIR" wordmark.
  Its **italic** is the emphasis device (the aqua "human").
- **Hanken Grotesk** (grotesque **sans**) for all UI/body: body 15px/1.6, lede 19px, KPI numbers
  (30px bold), labels, table cells, forms.
- **Monospace** (system stack) for session IDs, tenant slugs, and technical values.
- Tracking is tight & negative on big serif display (−0.02 to −0.025em) and wide & positive on
  uppercase micro-labels (eyebrow .16em, labels/headers .06em).

**Spacing & layout.** 4px base scale. Marketing container maxes at **1180px** (40px gutters);
dashboard content at **1400px** beside a fixed **220px** sidebar. Generous vertical rhythm on
marketing (sections ~110–120px tall); denser, card-gridded on the dashboard (24px gaps, 4-up
KPI row). White space does the grouping work; separators are used sparingly.

**Corner radii.** Tighter on controls, larger on marketing surfaces: badge 6px, button 8px,
app card 12px, marketing card 18px, hero/panel 22px, reassurance panel 24px, pills/dots full.

**Shadows / elevation.** Cool-tinted (rgba `14 27 35`), built in **two layers** — a tight 1–2px
contact shadow + a soft, far-throw ambient (e.g. `0 12px 30px -16px`). Marketing cards **lift
−4px on hover** with a deeper shadow. The dark featured tile gets a heavier ambient throw. Cards
on the dashboard are calmer (resting `shadow-card`, no lift).

**Borders.** Hairline and cool: `#EAEEF0` on cards, `#E3E8EA` default, `#EEF1F2` faint dividers.
On the dark canvas, borders are white at low alpha (`rgba(255,255,255,.08–.12)`).

**Backgrounds & motifs.** No gradients as decoration except two purposeful ones: a **dashed
timeline connector** behind the "How it works" steps (`repeating-linear-gradient`) and a soft
**aqua radial glow** on the dark featured tile. The **audio waveform** (animated bars) is the
signature brand motif, echoed in the logo mark. The sticky nav is **frosted glass**
(`rgba(251,252,253,.86)` + `blur(12px)`).

**Animation.** Restrained and ease-based (`ease`, ~0.25s). Three branded loops, all on marketing
only: a **pulse ring** (live dot, scales to 2.6× & fades), **waveform bars** (scaleY 0.34↔1,
staggered 0.08s), and a **flow dot** (drifts ±6px). All are disabled under
`prefers-reduced-motion`. The dashboard uses only functional motion: status-dot pulse, skeleton
shimmer, toast slide-in.

**Interaction states.** Hover = a **darker fill** for solid buttons (primary→primary-dark,
aqua→accent-hover) or a faint tinted wash for low-emphasis; nav rows lighten and gain a left
accent border. Links shift petrol→darker / on-dark→aqua. Focus = a **3px petrol ring at 30%**
(`box-shadow 0 0 0 3px`). Disabled = opacity ~0.55–0.6. There is no "press shrink."

**Cards, recapped.** White, 1px cool hairline border, 12px radius (app) / 18–24px (marketing),
two-layer cool shadow. KPI cards: uppercase label top-left, variant-colored lucide icon
top-right, big bold number, muted subtitle.

---

## ICONOGRAPHY

- **System:** **[lucide-react](https://lucide.dev)** — the product's only icon set. Clean,
  consistent 24×24 line icons at **~1.8–2px stroke**, rounded caps/joins. In the dashboard they
  render at 16px (nav, cells) and 20px (KPI). On marketing, feature/step icons sit at 22–23px
  inside rounded "chip" tiles (teal `chip-teal-bg` or danger `chip-danger-bg`).
- **Common glyphs in use:** `LayoutDashboard, Users, MessageSquare, CalendarDays, AlertTriangle,
  Activity, Settings, Building2, Radio, ExternalLink, LogOut, Phone, UserCheck, Clock, Mic,
  Calendar, Globe, Check, CheckCircle, AlertCircle, Info, X` (and on marketing `UserPlus,
  CalendarCheck, MonitorSmartphone`).
- **How to load:** in cards & kits, lucide is pulled from CDN (`lucide-react` UMD →
  `window.LucideReact`) and icons are passed to components as the `icon` prop. The three DS
  components that need a glyph internally (`Toast`, `Modal`, `ChannelBadge`) inline tiny
  lucide-equivalent SVGs so they bundle without an npm dependency.
- **Brand mark:** the **MVAIR waveform** — three rising bars + a heartbeat-like waveform stroke,
  recreated faithfully in `components/brand/MvairMark.jsx` (petrol on light, aqua on dark). The
  dashboard's compact mark is a petrol rounded-square with a serif **"M"** and a thin aqua ring.
- **Emoji / unicode:** not used. The em-dash "—" is the one unicode character used semantically
  (empty-field placeholder).

---

## Index / manifest

**Root**
- `styles.css` — global entry point (`@import` manifest only). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `layout.css` (radii/shadow/spacing), `fonts.css`
  (Google Fonts), `base.css` (element defaults + `.mvair-*` helpers).
- `readme.md` — this file. · `SKILL.md` — portable skill entry.

**Components** (`window.MVAIRDesignSystem_*`) — each dir has `.jsx` + `.d.ts` + `.prompt.md` + a `@dsCard` html:
- `components/core/` — **Button, Card, Badge, StatusDot**
- `components/forms/` — **Input**
- `components/data/` — **KPICard, Table, ChannelBadge**
- `components/feedback/` — **Toast, Modal, EmptyState**
- `components/brand/` — **MvairMark, MvairLogo, CTAButton**

**Foundation cards** (`guidelines/`) — Colors (4), Type (4), Spacing/radii/elevation (3).

**UI kits**
- `ui_kits/marketing/` — full landing page recreation (`index.html` + `Landing.jsx`).
- `ui_kits/dashboard/` — clinic admin dashboard with switchable screens (`index.html` + `DashboardApp.jsx`).

---

## Caveats

- **Tailwind theme values are inferred.** `tailwind.config.js` was outside the mounted `src/`,
  so the exact pixel values for named tokens (`text-kpi`, `rounded-card`, `intent-*`, sidebar
  color names, etc.) are best-effort reconstructions from how they're used. They look right and
  are internally consistent, but if you can share the real config the tokens can be made exact.
- **Intent badge colors** (`general/dental/followup/urgent/inquiry/unknown`) were not defined in
  the readable source; they're assigned here from within the brand family for distinctness.
  Confirm against your real palette.
- **Fonts** are served from Google Fonts (matching the source's `@import`), not self-hosted.
