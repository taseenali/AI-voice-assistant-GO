# Handoff: MVAIR Marketing Landing Page

## Overview
A marketing landing page for **MVAIR**, the AI voice receptionist for medical practices. It
communicates the core promise (24/7 booking + triage that sounds human), explains how the
product works in three steps, lays out four product capabilities, reassures on
reliability/privacy, and drives to a "Book a demo" CTA. The page has two hero variants
(split and centered) toggled by a prop.

## About the Design Files
The files in this bundle are **design references created in HTML** (authored as MVAIR
Design Components, `*.dc.html`). They are prototypes showing intended look and behavior —
**not production code to copy directly.**

The task is to **recreate this design in the `medvoice-dashboard` codebase** using its
existing React environment, the published `MVAIR` component library, and the brand tokens
already in the repo. Where a primitive exists upstream (`Badge`, `StatusDot`, etc.), prefer
it over re-implementing. The marketing sections here (hero, bento, timeline) are net-new
layout and can be built as new components following the patterns documented below.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, shadows, and hover states are
all specified below and should be reproduced precisely. Recreate pixel-for-pixel using the
codebase's React + CSS conventions.

---

## Design Tokens

These come from `tokens/brand.css` in the MVAIR design system — use the repo's existing
custom properties; do not hardcode new hexes if the token exists.

### Color
| Token | Hex | Use |
|---|---|---|
| `--mvair-surface` | `#FBFCFD` | Page background |
| `--mvair-dark` | `#0C1A20` | Hero, CTA, footer surfaces; featured bento tile |
| `--mvair-primary` | `#0B5563` | Petrol teal — eyebrows, step badges, primary button |
| `--mvair-primary-dark` | `#084149` | Primary button hover |
| `--mvair-accent` | `#2DD4BF` | Aqua — accent button, italic accent word, waveform |
| `--mvair-signal` | `#C6F24E` | Chartreuse — single-use micro-pop (live pulse dot only) |
| `--mvair-danger` | `#DA3633` | Emergency icon / accent |
| `--mvair-text-primary` | `#0E1B23` | Headings, body on light |
| `--mvair-text-secondary` | `#5A6B72` | Secondary copy on light |
| `--mvair-border` | `#E3E8EA` | Default hairline border |

**Supporting values used in this design (not yet tokens — add or inline):**
- Card border (refined): `#EAEEF0`
- Icon-chip tint (teal): `#E8FAF6`, icon stroke `#0B7E72`
- Icon-chip tint (danger): `#FCEAEA`, icon stroke `#DA3633`
- Body text on dark: `#A9BAC0`; muted on dark: `#8FA3AA`, `#6E838A`
- Aqua button hover: `#5fe3d3`
- Connector dashes: `#CBD7DB`

### Typography
Two families, loaded from Google Fonts:
- **Newsreader** (serif, optical sizing `6..72`, weights 400/500/600/700 + italic 500/600) —
  all headings, step numbers, eyebrow-adjacent display. Editorial, warm.
- **Hanken Grotesk** (weights 400/500/600/700) — body, nav, buttons, labels.

```
https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500;1,6..72,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap
```

Type scale (all headings Newsreader 600 unless noted; `text-wrap:balance` on display headings):
| Role | Size / line-height / tracking |
|---|---|
| Hero H1 (split) | 62px / 1.04 / -0.025em |
| Hero H1 (centered) | 68px / 1.03 / -0.025em |
| Section H2 | 42px / 1.1 / -0.02em |
| Reassurance H2 | 38px / 1.14 / -0.02em |
| CTA H2 | 50px / 1.06 / -0.025em |
| Featured bento H3 | 30px / -0.015em |
| Card H3 (features) | 23px / -0.01em |
| Step card H3 | 23px / -0.01em |
| Reassurance item H3 | 19px |
| Eyebrow (uppercase) | 13px / 600 / letter-spacing 0.16em (Hanken) |
| Body large | 19px / 1.6 |
| Body | 16px / 1.6–1.65 |
| Nav / button | 15–16px / 500–600 (Hanken) |

**Signature detail:** the word "human" is rendered in *Newsreader italic*, color `#2DD4BF`,
weight 500 — in the hero H1 and the featured bento tile.

### Spacing & layout
- Content max-width: **1180px**, side padding **40px** (hero centered variant uses 920px).
- Nav height: **74px**, sticky, `background:rgba(251,252,253,0.86)` + `backdrop-filter:blur(12px)`, bottom border `#E3E8EA`.
- Section vertical rhythm: ~110–120px top/bottom.
- Grid gaps: 24–30px.

### Border radius
- Buttons: 8–9px · Cards: 18–20px · Large panels (reassurance): 24px · Icon chips: 12–13px · Step badge / dots: 50%.

### Shadows (elevation system — the core upgrade)
- **Card rest:** `0 1px 2px rgba(14,27,35,0.04), 0 12px 30px -16px rgba(14,27,35,0.14)`
- **Card hover:** `0 2px 4px rgba(14,27,35,0.05), 0 22px 48px -18px rgba(14,27,35,0.22)` + `transform:translateY(-4px)`
- **Dark featured tile rest:** `0 1px 2px rgba(14,27,35,0.06), 0 24px 60px -28px rgba(12,26,32,0.55)`
- **Dark featured tile hover:** `0 2px 4px rgba(14,27,35,0.08), 0 34px 70px -26px rgba(12,26,32,0.7)` + `translateY(-4px)`
- **Reassurance panel:** `0 1px 2px rgba(14,27,35,0.04), 0 30px 70px -34px rgba(14,27,35,0.22)`
- **Step badge:** `0 8px 20px -6px rgba(11,85,99,0.5)`, plus a 4px `#FBFCFD` ring border so it sits over the connector line.
- Card hover transition: `transform .25s ease, box-shadow .25s ease`.

---

## Screens / Views

This is a single scrolling page. Sections top to bottom:

### 1. Nav (sticky)
Logo (waveform SVG mark + "MVAIR" in Newsreader 23/600) left; nav links
(Product, How it works, Pricing, Security — Hanken 15/500, `#5A6B72`, hover `#0E1B23`) and a
solid petrol "Book a demo" button right.

### 2. Hero — two variants (prop `heroVariant`)
Dark surface `#0C1A20`, white text.
- **split** (default): two columns `1.05fr / 0.95fr`, 64px gap, 104px top padding. Left: eyebrow
  (aqua, uppercase), H1 62px with italic "human", 19px subcopy (`#A9BAC0`, max 480px), button
  row (aqua primary `#2DD4BF` text `#06222A`; ghost outline button), and a live-pulse row.
  Right: a `rgba(255,255,255,0.02)` panel (1px `rgba(255,255,255,0.08)`, radius 22px) holding
  the **HeroVisual** waveform component.
- **centered**: single 920px column, H1 68px, everything centered; HeroVisual sits in a panel
  that bleeds off the bottom edge of the hero.
- **Live pulse** (prop `showLivePulse`): 9px chartreuse `#C6F24E` dot with an expanding ring —
  `@keyframes mvairPulse { 0%{scale1,opacity1} 70%{scale2.6,opacity0} 100%{opacity0} }`, 2.2s ease-out
  infinite. Respect `prefers-reduced-motion: reduce` (disable animation). Label: "Live · always answering".

### 3. How it works — process timeline (3 steps)
Eyebrow + H2 "Every call handled, start to finish." Then a 3-column grid (30px gap) on a
`position:relative` track:
- A **dashed connector line** sits behind, absolutely positioned `top:27px; left:16.66%;
  right:16.66%` (runs between the three badge centers): `background:repeating-linear-gradient(90deg,#CBD7DB 0 7px,transparent 7px 15px); height:2px`.
- Each column: a centered **54px circular petrol badge** (`#0B5563`, white Newsreader 21/600,
  badge shadow + 4px surface ring) over a white card. Card: radius 18px, border `#EAEEF0`,
  padding ~30px, card shadow + hover lift. Inside: a 42px teal icon chip (`#E8FAF6`), H3, body.
- Steps & icons: **01 Answers the call** (phone icon) · **02 Captures the patient** (user-plus
  icon) · **03 Books or triages** (calendar-check icon). Icons are 22px line SVGs, stroke `#0B7E72`, width 1.8.

### 4. Features — pinwheel bento (4 tiles)
Eyebrow + H2 "Built for the realities of a front desk." 3-column grid, `grid-auto-rows:1fr`, 24px gap:
- **Featured tile** — `grid-column:span 2`, **dark** `#0C1A20`, radius 20px. A static 7-bar aqua
  waveform (heights 40/72/100/58/84/34/50%, one bar `#5fe3d3`), H3 30px "A voice that sounds
  *human*" (italic aqua), 16.5px body `#A9BAC0`. Decorative aqua radial glow top-right
  (`radial-gradient(circle, rgba(45,212,191,0.16), transparent 68%)`, 240px, `overflow:hidden` on tile).
- **Appointment booking** — white card, teal icon chip (calendar-check).
- **Emergency detection** — white card, **danger** icon chip `#FCEAEA` + alert-triangle stroke `#DA3633`.
- **Phone and web, one system** — `grid-column:span 2`, white card, horizontal layout (icon chip
  left, text right), devices icon.
- All tiles: hover lift + shadow per the elevation system.

### 5. Reassurance panel
Full-width white panel (max 1180), radius 24px, padding 72/64px, panel shadow. Centered eyebrow
+ H2 "Designed for clinical workflows, with patient privacy in mind." + 18px subcopy. Below a
top hairline (`#E3E8EA`), a 3-column row (40px gap): each item = a 24px teal check-circle
(`#E8FAF6` bg, `#0B7E72` check) + Newsreader 19px H3 + 15px body. Items: **Always on**,
**Privacy-minded**, **Your protocols**.

### 6. Closing CTA
Dark `#0C1A20` section. Centered H2 50px "Bring MVAIR to your front desk.", 19px subcopy,
aqua primary + ghost button row.

### 7. Footer
Dark, top border `rgba(255,255,255,0.08)`. 4-column grid `1.4fr 1fr 1fr 1fr`: brand block
(aqua-mark logo + tagline), Product links, Company links, "Get started" aqua button. Below a
hairline: a privacy/emergency disclaimer (left) and `© 2026 MVAIR` (right). Link hover → aqua.

---

## Interactions & Behavior
- **Hover** on every card/tile: `translateY(-4px)` + deeper shadow, 0.25s ease.
- **Buttons:** primary petrol → `#084149` on hover; aqua → `#5fe3d3`; ghost outline → border becomes aqua.
- **Nav links / footer links:** color shift to `#0E1B23` (nav) / `#2DD4BF` (footer) on hover.
- **Live pulse:** expanding-ring keyframe, infinite; **must** honor `prefers-reduced-motion: reduce`.
- **HeroVisual waveform:** bars animate with a staggered `mvairWave` ease-in-out loop (see component file).
- No client-side routing; anchor links (`#product`, `#how`, `#pricing`, `#security`, `#demo`) scroll to sections.

## State Management
Minimal — presentational page. Two props drive variants:
- `heroVariant: 'split' | 'centered'` (default `'split'`)
- `showLivePulse: boolean` (default `true`)

In a real app these become component props / CMS flags. No data fetching.

## Assets
- **Logo mark:** inline SVG (3-bar + waveform path), petrol on light / aqua on dark. No external file.
- **Icons:** inline line SVGs (phone, user-plus, calendar-check, alert-triangle, devices, check),
  24px viewBox, 1.8 stroke. Swap for the repo's existing icon set (e.g. Lucide) — these match
  Lucide's visual weight.
- **Fonts:** Newsreader + Hanken Grotesk via Google Fonts (link above), or self-host.
- No raster images.

## Files
In this bundle (design references):
- `Landing.dc.html` — the full landing page (all sections, both hero variants, props).
- `HeroVisual.dc.html` — the animated hero waveform component embedded in the hero.
- `brand.css` — the MVAIR brand tokens (source of truth for color).

> `*.dc.html` are MVAIR "Design Component" files: the markup between `<x-dc>…</x-dc>` is plain
> HTML you can read directly; styling is inline. Ignore the `support.js` runtime — it's only the
> preview harness, not part of the design. Read the markup for exact structure, then rebuild as
> React components in `medvoice-dashboard`.
