/**
 * Generates the MVAIR Competitor Landscape & What It Means For Us brief as a PDF.
 * Run: node server/scripts/generate-competitor-brief-pdf.mjs
 */
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '../../MVAIR-Competitor-Brief.pdf');

const html = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MVAIR — Competitor Landscape &amp; What It Means For Us</title>
<style>
/* ─────────────────────────────────────────────────────────────
   PAGE SETUP — @page handles margins on EVERY physical page.
   Named page "cover-page" gets 0 margin for full-bleed dark bg.
───────────────────────────────────────────────────────────── */
@page            { size: A4; margin: 16mm 18mm; }
@page cover-page { size: A4; margin: 0; }

/* ─────────────────────────────────────────────────────────────
   RESET & BASE
───────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --dark:     #0C1A20;
  --primary:  #0B5563;
  --accent:   #2DD4BF;
  --signal:   #C6F24E;
  --muted:    #5A6B72;
  --danger:   #DA3633;
  --border:   #DDE4E8;
  --text:     #0E1B23;
  --teal-bg:  #EFF8FA;
  --warn-bg:  #FFFBEB;
}

html {
  font-size: 10.5pt;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: #fff;
  line-height: 1.68;
}

/* ─────────────────────────────────────────────────────────────
   COVER — zero page margin, internal padding mirrors body
───────────────────────────────────────────────────────────── */
.cover {
  page: cover-page;
  background: var(--dark);
  color: #fff;
  min-height: 297mm;
  display: flex;
  flex-direction: column;
  padding: 16mm 18mm;
  page-break-after: always;
}

/* ── wordmark ── */
.wordmark {
  display: flex;
  align-items: center;
  gap: 10px;
}
.wm-mark {
  width: 34px; height: 34px;
  background: var(--accent);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15pt; font-weight: 900; color: var(--dark); line-height: 1;
}
.wm-name  { font-size: 16pt; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
.wm-sub   { font-size: 7.5pt; color: var(--accent); font-weight: 600;
            letter-spacing: 2px; text-transform: uppercase; }

/* ── hero text ── */
.cover-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18mm 0 10mm;
}

.cover-tag {
  display: inline-block;
  background: rgba(45,212,191,0.15);
  border: 1px solid rgba(45,212,191,0.35);
  color: var(--accent);
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 3px 10px;
  margin-bottom: 18px;
  width: fit-content;
}

.cover-title {
  font-size: 28pt;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 18px;
  max-width: 520px;
  letter-spacing: -0.5px;
}
.cover-title span { color: var(--accent); }

.cover-lead {
  font-size: 12pt;
  color: rgba(255,255,255,0.7);
  max-width: 460px;
  line-height: 1.65;
  font-style: italic;
  margin-bottom: 32px;
}

.cover-date {
  font-size: 8.5pt;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
}
.cover-date strong { color: rgba(255,255,255,0.6); }

/* ── toc strip on cover ── */
.cover-toc {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 18px;
  display: flex;
  gap: 0;
  flex-direction: column;
}
.cover-toc-label {
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 10px;
}
.cover-toc-items {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.toc-pill {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 8pt;
  color: rgba(255,255,255,0.6);
}

/* ─────────────────────────────────────────────────────────────
   BODY — @page margin handles all outer spacing
───────────────────────────────────────────────────────────── */

/* ── part header ── */
.part-header {
  margin-bottom: 22px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--primary);
}
.part-eyebrow {
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}
.part-title {
  font-size: 18pt;
  font-weight: 800;
  color: var(--primary);
  line-height: 1.15;
  letter-spacing: -0.3px;
}

/* ── section break ── */
.section { page-break-before: always; }

/* ── layer cards ── */
.layer {
  margin-bottom: 20px;
  page-break-inside: avoid;
}
.layer-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}
.layer-num {
  background: var(--primary);
  color: #fff;
  font-size: 7.5pt;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 3px 9px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
}
.layer-num.dim  { background: rgba(11,85,99,0.18); color: var(--primary); }
.layer-num.bold { background: var(--primary); }
.layer-title {
  font-size: 11.5pt;
  font-weight: 700;
  color: var(--primary);
}
.layer-subtitle {
  font-size: 8.5pt;
  color: var(--muted);
  margin-top: 1px;
}

p {
  font-size: 10pt;
  line-height: 1.72;
  margin-bottom: 10px;
  color: var(--text);
}
p:last-child { margin-bottom: 0; }

em  { font-style: italic; }
strong { color: var(--primary); }

/* ── Arini card ── */
.arini-card {
  background: var(--teal-bg);
  border: 1px solid rgba(11,85,99,0.18);
  border-left: 4px solid var(--primary);
  border-radius: 0 8px 8px 0;
  padding: 18px 20px;
  margin: 16px 0 20px;
  page-break-inside: avoid;
}
.arini-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.arini-logo {
  font-size: 14pt;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: -0.5px;
}
.arini-badge {
  background: var(--primary);
  color: #fff;
  font-size: 7pt;
  font-weight: 700;
  border-radius: 4px;
  padding: 2px 8px;
  letter-spacing: 0.5px;
}
.arini-rows {}
.arini-row {
  display: flex;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(11,85,99,0.1);
  font-size: 9.5pt;
  line-height: 1.5;
}
.arini-row:last-child { border-bottom: none; padding-bottom: 0; }
.arini-label {
  color: var(--muted);
  min-width: 130px;
  flex-shrink: 0;
  font-size: 9pt;
}
.arini-value { color: var(--text); flex: 1; }
.arini-value strong { color: var(--primary); }

/* ── callout boxes ── */
.box {
  border-radius: 6px;
  padding: 14px 18px;
  margin: 16px 0;
  font-size: 10pt;
  line-height: 1.7;
  page-break-inside: avoid;
}
.box-info  { background: var(--teal-bg); border-left: 4px solid var(--accent); }
.box-warn  { background: var(--warn-bg); border-left: 4px solid #F59E0B; }
.box-alert { background: #FEE9E9;        border-left: 4px solid var(--danger); }
.box-dark  {
  background: var(--dark); color: #fff;
  border-left: 4px solid var(--accent);
  border-radius: 6px;
}
.box-dark p       { color: rgba(255,255,255,0.88); font-size: 10pt; }
.box-dark strong  { color: var(--accent); }
.box p:last-child { margin-bottom: 0; }

/* ── centre quote ── */
.centre-quote {
  margin: 22px 0;
  padding: 20px 24px;
  border-left: 4px solid var(--accent);
  background: var(--teal-bg);
  border-radius: 0 8px 8px 0;
  page-break-inside: avoid;
}
.centre-quote p {
  font-size: 12pt;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.5;
  margin: 0;
}

/* ── numbered move cards ── */
.move {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  page-break-inside: avoid;
}
.move-num {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13pt;
  font-weight: 800;
  flex-shrink: 0;
}
.move-body {}
.move-title {
  font-size: 11.5pt;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6px;
  line-height: 1.3;
}
.move-body p {
  font-size: 10pt;
  line-height: 1.7;
  margin: 0;
}

/* ── one-line takeaway ── */
.takeaway {
  background: var(--dark);
  color: #fff;
  border-radius: 8px;
  padding: 28px 30px;
  margin-top: 28px;
  page-break-inside: avoid;
}
.takeaway-eyebrow {
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.takeaway p {
  font-size: 11pt;
  color: rgba(255,255,255,0.92);
  line-height: 1.75;
  margin: 0;
}
.takeaway strong { color: var(--accent); }

/* ── divider ── */
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 24px 0;
}

/* ── footer ── */
.report-footer {
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 7.5pt;
  color: var(--muted);
  text-align: center;
  line-height: 1.6;
}
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════
     COVER
════════════════════════════════════════════════════ -->
<div class="cover">

  <div class="wordmark">
    <div class="wm-mark">M</div>
    <div>
      <div class="wm-name">MVAIR</div>
      <div class="wm-sub">MedVoice AI Receptionist</div>
    </div>
  </div>

  <div class="cover-hero">
    <div class="cover-tag">Internal Brief</div>
    <div class="cover-title">Competitor Landscape &amp;<br><span>What It Means For Us</span></div>
    <div class="cover-lead">
      A learning brief, not an exhaustive report.<br>Read once, get a clear head, act.
    </div>
    <div class="cover-date">
      <strong>As of June 2026.</strong>&ensp;Competitor features and prices change fast — verify before quoting in a pitch.
    </div>
  </div>

  <div class="cover-toc">
    <div class="cover-toc-label">This brief covers</div>
    <div class="cover-toc-items">
      <span class="toc-pill">Part 1 — Who the competitors actually are</span>
      <span class="toc-pill">Part 2 — How we compete when everyone rents</span>
      <span class="toc-pill">Part 3 — What this means we have to do</span>
      <span class="toc-pill">One-line takeaway</span>
    </div>
  </div>

</div><!-- /cover -->


<!-- ═══════════════════════════════════════════════════
     PART 1 — WHO THE COMPETITORS ACTUALLY ARE
════════════════════════════════════════════════════ -->

<div class="part-header">
  <div class="part-eyebrow">Part 1</div>
  <div class="part-title">Who the competitors actually are</div>
</div>

<p>There are three layers in this market. Knowing which layer someone sits in tells you whether they're a competitor, a peer, or a supplier.</p>

<!-- Layer 1 -->
<div class="layer">
  <div class="layer-head">
    <span class="layer-num dim">Layer 1</span>
    <div>
      <div class="layer-title">Infrastructure (the plumbing) — NOT our competitors</div>
      <div class="layer-subtitle">Vapi · Retell · Synthflow · Bland</div>
    </div>
  </div>
  <p>These rent out the raw voice stack — speech-to-text + LLM + text-to-speech + telephony, glued together with interruption handling and low latency. We rent from Vapi. A competitor could rent from Retell and build a MedVoice clone in a weekend. So these aren't rivals — they're the supply layer we all stand on. Nobody in this market builds their own voice models; that's a multi-year infrastructure problem, and stitching it from scratch costs ~$25K–$60K and 3–6 months even on top of these platforms. Renting is the normal, correct model.</p>
  <div class="box box-warn">
    <p><strong>Note for us specifically:</strong> of these, Retell bundles HIPAA + a BAA with no enterprise contract (~$0.07/min), while Vapi charges a flat ~$1,000–$2,000/month HIPAA add-on. This is the single biggest cost difference affecting our early margins — covered in Part 2.</p>
  </div>
</div>

<!-- Layer 2 -->
<div class="layer">
  <div class="layer-head">
    <span class="layer-num dim">Layer 2</span>
    <div>
      <div class="layer-title">Horizontal AI receptionists — Loose competitors</div>
      <div class="layer-subtitle">My AI Front Desk · Goodcall · AINORA · Voicify</div>
    </div>
  </div>
  <p>Same business model as us: rent infrastructure, wrap it in a product, sell to businesses. The difference from us is only packaging and focus — most serve many industries with a "dental template" rather than going deep. My AI Front Desk is the cheapest entry point (~$65–$200/mo) but trades away dental/medical depth for breadth. These compete with us on price at the shallow end, but they don't own the clinic workflow.</p>
</div>

<!-- Layer 3 -->
<div class="layer">
  <div class="layer-head">
    <span class="layer-num bold">Layer 3</span>
    <div>
      <div class="layer-title">Vertical, clinic-native products — Our real competitor</div>
      <div class="layer-subtitle">Arini is the one to study</div>
    </div>
  </div>
</div>

<!-- Arini card -->
<div class="arini-card">
  <div class="arini-card-head">
    <div class="arini-logo">Arini</div>
    <span class="arini-badge">YC W24</span>
  </div>
  <div class="arini-rows">
    <div class="arini-row">
      <div class="arini-label">Company</div>
      <div class="arini-value">YC W24, ~$500K seed; founded 2024; ~15 staff; San Francisco</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">Focus</div>
      <div class="arini-value">Dental-specific. Deployed across hundreds of practices/DSOs.</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">Published results</div>
      <div class="arini-value"><strong>$56K in booked appointments</strong> in one clinic's first month; <strong>12% revenue lift</strong> at another</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">PMS integrations</div>
      <div class="arini-value"><strong>Open Dental, Eaglesoft, Dentrix, Denticon, CareStack, Cloud9</strong> — writes appointments directly into the practice's system, no manual step</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">Capabilities</div>
      <div class="arini-value">~300ms response latency · emergency triage · insurance verification · recall campaigns · SMS confirmations</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">Compliance</div>
      <div class="arini-value">"100% HIPAA," BAAs with all subcontractors, a Trust Center — notably does <em>not</em> publicly list SOC 2 Type II</div>
    </div>
    <div class="arini-row">
      <div class="arini-label">Go-to-market</div>
      <div class="arini-value">30-day monitored pilot, gradual cutover. Pricing: mid-three-figures/month per location, quote-only</div>
    </div>
  </div>
</div>

<p>Others in this tier: <strong>Viva AI, TensorLinks, Dentina, TrueLark, Peerlogic</strong> — varying on omnichannel (email/web chat), languages, payments, and SOC 2.</p>

<div class="box box-info">
  <p><strong>Hyro</strong> is in a category of its own: ~$95M raised, 45+ health systems, 30M+ patients, deep Epic integration, and a proprietary engine (it doesn't just rent). It's enterprise-only — not our competitor, but proof of where the ceiling is.</p>
</div>


<!-- ═══════════════════════════════════════════════════
     PART 2 — HOW WE COMPETE WHEN EVERYONE RENTS
════════════════════════════════════════════════════ -->
<div class="section">

  <div class="part-header">
    <div class="part-eyebrow">Part 2</div>
    <div class="part-title">So how are we even "competitors" if everyone rents?</div>
  </div>

  <p>This was your question, and it's the most important idea in this whole brief:</p>

  <div class="centre-quote">
    <p>Renting the voice layer is normal. It is not what separates winners from losers. What separates them is everything built on top of the rented layer.</p>
  </div>

  <p>Arini rents plumbing just like we do. Their advantage isn't voice quality — it's:</p>

  <ul style="margin: 0 0 14px 20px; font-size:10pt; line-height:1.75;">
    <li><strong>Deep PMS integration</strong> (writes straight into Dentrix/Open Dental).</li>
    <li><strong>A complete compliance chain</strong> (BAAs everywhere, Trust Center).</li>
    <li><strong>Funding, a team, and named references.</strong></li>
  </ul>

  <p>That's the competition. Not "whose AI sounds more human" — they all sound fine now, all using the same neural voices. The fight is over <strong>workflow depth, compliance, and trust</strong>. Voice quality has been commoditized away from everyone.</p>

  <div class="box box-alert">
    <p><strong>The uncomfortable read:</strong> today we are a thinner version of Arini — we book to Google Calendar, not to a real PMS, and we don't yet have a BAA chain. We're at Layer 2 trying to reach Layer 3.</p>
  </div>

</div><!-- /section -->


<!-- ═══════════════════════════════════════════════════
     PART 3 — WHAT THIS MEANS WE HAVE TO DO
════════════════════════════════════════════════════ -->
<div class="section">

  <div class="part-header">
    <div class="part-eyebrow">Part 3</div>
    <div class="part-title">What this means we have to do</div>
  </div>

  <p>Given where we sit, four moves — in order.</p>

  <!-- Move 1 -->
  <div class="move">
    <div class="move-num">1</div>
    <div class="move-body">
      <div class="move-title">Settle the voice-provider economics (decide first, it gates everything)</div>
      <p>Vapi's ~$1,000–$2,000/mo HIPAA add-on makes our first 1–5 clinics lose money. It only turns healthy past ~10 clinics. Retell includes HIPAA + BAA with no fixed floor. Before building anything else, decide: absorb Vapi's HIPAA cost as a launch expense, or migrate the voice layer to Retell. <strong>This is an economic decision, not a feature.</strong></p>
    </div>
  </div>

  <!-- Move 2 -->
  <div class="move">
    <div class="move-num">2</div>
    <div class="move-body">
      <div class="move-title">Build the moat we don't have: one real PMS integration</div>
      <p>Google Calendar is not a moat — Arini writes into the actual practice system. Pick one PMS we can realistically integrate (<strong>Open Dental has the most accessible API</strong>; Jane App's is approval-only and currently closed) and integrate it. PMS integration is simultaneously (a) the only durable moat, and (b) the #1 defense against churn — ~70% of SMB SaaS churn happens in the first 90 days, and being embedded in the clinic's core system makes us "too critical to rip out."</p>
    </div>
  </div>

  <!-- Move 3 -->
  <div class="move">
    <div class="move-num">3</div>
    <div class="move-body">
      <div class="move-title">Close the compliance chain so we can legally charge</div>
      <p>Signed BAA with the clinic plus flow-down BAAs with every subcontractor touching patient data. Add the recording proxy and secure auth. <strong>Without this we cannot legally take money from a clinic — full stop.</strong></p>
    </div>
  </div>

  <!-- Move 4 -->
  <div class="move">
    <div class="move-num">4</div>
    <div class="move-body">
      <div class="move-title">Don't try to out-feature Arini. Out-focus them.</div>
      <p>We will not win on breadth or budget against a funded YC team. We win by going narrow — one specialty, one PMS, one delighted reference clinic — then expanding by referral. Match the proof structure the market already expects: a free 30-day monitored pilot, after-hours first, gradual cutover. That's exactly how Arini sells; meet the bar, don't reinvent it.</p>
    </div>
  </div>

  <!-- Takeaway -->
  <div class="takeaway">
    <div class="takeaway-eyebrow">The one-line takeaway</div>
    <p>Everyone rents the voice. The product is what you build on top — <strong>integration + compliance + trust</strong>. Arini has it; we don't yet. Our entire near-term job is to get <strong>one paying, BAA-covered clinic live and wired into its PMS</strong> — that single proof point is the moat, the churn defense, and the thing that makes us a real competitor instead of a demo.</p>
  </div>

  <div class="report-footer">
    MVAIR — Competitor Landscape &amp; What It Means For Us &ensp;·&ensp; Internal Brief &ensp;·&ensp; June 2026 &ensp;·&ensp; Confidential
  </div>

</div><!-- /section -->

</body>
</html>`;

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.pdf({
    path: OUT_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();
  console.log(`[PDF] Done → ${OUT_PATH}`);
}

run().catch(err => { console.error('[PDF]', err.message); process.exit(1); });
