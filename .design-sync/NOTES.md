# design-sync run notes — MedVoice AI dashboard

## Build command
```
node .ds-sync/package-build.mjs \
  --config design-sync.config.json \
  --node-modules dashboard/node_modules \
  --entry dashboard/src/components/shared/index.ts \
  --inputs . \
  --out ./ds-bundle
```

## Key gotchas

- **`cssEntry` is bounded to PKG_DIR (= `dashboard/`)**: brand + Tailwind CSS must live inside `dashboard/tokens/`. Combined file is `dashboard/tokens/mvair-styles.css`. Rebuilding Tailwind: `cd dashboard && npx tailwindcss -i src/styles/globals.css -o tokens/dashboard-components.css`, then re-concat with brand.css.

- **`tokensGlob` without `tokensPkg` is a no-op**: Token files appear in `ds-bundle/tokens/` only by manual copy after build. Workaround: after each rebuild, run `cp tokens/brand.css ds-bundle/tokens/brand.css` and update `ds-bundle/styles.css` to `@import "./tokens/brand.css";`.

- **No `dist/`** — synth-entry mode. The `--entry` flag points at `dashboard/src/components/shared/index.ts` (barrel). The converter bundles from TypeScript source via esbuild.

- **No installed `typescript` in `.ds-sync/`**: DTS parse check skipped each run. Props interfaces are generic (`[key: string]: unknown`). Components with LucideIcon props (KPICard, EmptyState) had to have previews hand-edited.

- **`tsconfig: "dashboard/tsconfig.json"` not found**: tsconfig resolution is relative to PKG_DIR (= `dashboard/`) but the path given is also relative to `dashboard/`. esbuild resolves imports without tsconfig (no `@/` aliases in shared components).

- **Inter font**: sourced from Google Fonts at runtime — `[FONT_REMOTE]` is expected and non-blocking.

- **MVAIR brand fonts (Fraunces, Hanken Grotesk)**: not in any npm package — runtime-loaded. Declared in `runtimeFontPrefixes` to suppress `[FONT_MISSING]`.

## Preview overrides (hand-edited, marker removed)
Badge, EmptyState, KPICard, LoadingState, Modal, StatusDot, Table, Toast — all in `.design-sync/previews/`.
Auto-generated previews passed no props; components with LucideIcon or function props crashed with empty mounts.
