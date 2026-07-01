# MedVoice AI (MVAIR) — Market & Product Research Engagement

**Prepared:** 25 June 2026
**Scope:** Research only. No recommendations were forced where the question was descriptive; where a judgment was asked for (Concern 3), it is labelled as such.
**Method:** Integrative synthesis grounded in current (Q1–Q2 2026) public sources — market research firms, vendor documentation, competitor pages, and buyer-side guides. Claims are attributed in-line. Where a fact reflects the present-day state of a fast-moving market, it was verified against sources dated 2026.

---

## How this engagement is organised

The work was commissioned as three deliberately separated concerns. They are kept in separate files because the brief was explicit that context from one should not bleed into another.

| File | Concern | What it answers |
|------|---------|-----------------|
| `01-market-situation.md` | **Market** | How buyers and sellers behave in the AI voice-receptionist market right now; pricing; adoption maturity; and whether buyers will purchase from an unfunded startup. |
| `02-product-anatomy.md` | **Anatomy** | A complete internal structural map of a product like this — layered body plan, data pipelines, runtime habitat, and component coupling. Information-gathering only; no visual. |
| `03-strategy-niche-modularity.md` | **Strategy** | Right product / right niche / right time; the unfunded path to income-then-scale; modular plug-and-change architecture; and the multi-niche question. Includes a labelled judgment on niche sequencing. |

---

## The three load-bearing findings (one-line each)

1. **Market (Concern 1):** Funding is not the gate to selling. Three gates are, and they are absolute: a signed BAA, write-back into the system the clinic actually runs (PMS/EHR, not a side calendar), and a phone line that survives a live adversarial test call.
2. **Anatomy (Concern 2):** The product decomposes into a rented real-time voice engine, a custom integration/webhook server, a niche-agnostic data model, external actuators, a cross-cutting compliance immune-system, an observability layer, and product surfaces. The voice loop is not yours; the integration, compliance, and trust layer is.
3. **Strategy (Concern 3):** MVAIR's *current* build clears its entry gates more easily in home services than in medical, because medical's two gates (BAA + PMS) are exactly the two things not yet built. Modularity should be *extracted* after a second concrete niche, not designed up front; multi-niche learning should be done through cheap parallel discovery, with production shipped one niche at a time.

---

## A note on confidence and freshness

This market is moving fast (production deployments grew several-fold year-on-year through 2025–2026). Pricing, competitor funding, acquisition status, and integration coverage can change within a quarter. Treat specific figures as accurate as of mid-2026 and re-verify anything you intend to put in a contract, a pitch, or a pricing model. Nothing here is legal or financial advice; the BAA and HIPAA points in particular should be confirmed with qualified healthcare counsel before any clinic deployment.
