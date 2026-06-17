# MedVoice AI — LaTeX Documentation

Five technical documents + one master compilation covering Vapi migration, component inventory, external resources, roadmap, and go-to-market strategy.

## Documents

| File | Title |
|------|-------|
| `00-master-document.tex` | Combined executive summary + all chapters |
| `01-vapi-integration.tex` | Exact steps to replace custom orchestration with Vapi |
| `02-component-inventory.tex` | All components, progress %, missing items |
| `03-external-resources.tex` | STT, TTS, LLM, Twilio, Vapi, hosting providers |
| `04-project-roadmap.tex` | Level 0–5 project map with exit criteria |
| `05-gtm-strategy.tex` | Pricing, competitors, privileges, revenue model |

## Compile (Windows)

Requires [MiKTeX](https://miktex.org/) or TeX Live with packages: `tikz`, `pgfplots`, `booktabs`, `geometry`, `hyperref`.

```powershell
cd docs\latex
.\compile.ps1
```

Or compile individually:

```powershell
pdflatex -interaction=nonstopmode 01-vapi-integration.tex
pdflatex -interaction=nonstopmode 02-component-inventory.tex
# ... etc
```

Output PDFs appear in `docs/latex/`.

## Diagrams

All diagrams use TikZ/PGF (no external image files). They render automatically with `pdflatex`.
