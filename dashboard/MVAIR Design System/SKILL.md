---
name: mvair-design
description: Use this skill to generate well-branded interfaces and assets for MVAIR / MedVoice (an AI voice-receptionist for medical practices), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. If working on production code, you can copy
assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.

## Quick orientation
- **Two surfaces:** the **MVAIR** marketing site (dark petrol hero, Newsreader serif display) and
  the **MedVoice** clinic dashboard (sidebar app, KPI tiles, session tables). Same identity.
- **Tokens:** link `styles.css`; everything is a `--mvair-*` CSS variable.
- **Color in one line:** petrol teal `#0B5563` + aqua `#2DD4BF` on cool near-white `#FBFCFD`,
  with a petrol-black `#0C1A20` canvas. Chartreuse `#C6F24E` is the rare "live" signal only.
- **Type:** Newsreader (serif) for display + the italic emphasis word; Hanken Grotesk (sans) for
  UI/body; system mono for IDs.
- **Icons:** lucide. **No emoji.**
- **Components** load from `_ds_bundle.js` as `window.MVAIRDesignSystem_*` — see each
  component's `.prompt.md`. Two full UI kits live in `ui_kits/`.
