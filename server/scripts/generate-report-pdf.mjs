/**
 * Generates the MVAIR Market Reality & Survival Research Report as a PDF.
 * Uses Playwright (already a dev dependency).
 * Run: node server/scripts/generate-report-pdf.mjs
 */
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '../../MVAIR-Market-Research-Report.pdf');

// ---------------------------------------------------------------------------
// HTML source
// ---------------------------------------------------------------------------
const html = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MVAIR — Market Reality &amp; Survival Research Report</title>
<style>
/* ─────────────────────────────────────────────────────────────────────────────
   PAGE SETUP
   @page handles margins on EVERY physical page including mid-section breaks.
   Named page "cover-page" gets 0 margin so the dark background bleeds to edge.
───────────────────────────────────────────────────────────────────────────── */
@page            { size: A4; margin: 15mm 17mm; }
@page cover-page { size: A4; margin: 0; }

/* ─────────────────────────────────────────────────────────────────────────────
   RESET & BASE
───────────────────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --dark:    #0C1A20;
  --primary: #0B5563;
  --accent:  #2DD4BF;
  --signal:  #C6F24E;
  --muted:   #5A6B72;
  --danger:  #DA3633;
  --border:  #DDE4E8;
  --text:    #0E1B23;
  --teal-bg: #EFF8FA;
}

html { font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: #fff;
  line-height: 1.65;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COVER — full bleed, 0 page margin, internal padding mirrors body margins
───────────────────────────────────────────────────────────────────────────── */
.cover {
  page: cover-page;
  background: var(--dark);
  color: #fff;
  min-height: 297mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15mm 17mm;
  page-break-after: always;
}

.cover-logo       { display: flex; align-items: center; gap: 10px; }
.logo-mark        { width: 36px; height: 36px; background: var(--accent); border-radius: 8px;
                    display: flex; align-items: center; justify-content: center; }
.logo-mark span   { font-size: 16pt; font-weight: 900; color: var(--dark); line-height: 1; }
.logo-text        { font-size: 17pt; font-weight: 700; letter-spacing: -0.5px; color: #fff; }
.logo-sub         { font-size: 8pt; color: var(--accent); font-weight: 600;
                    letter-spacing: 2px; text-transform: uppercase; }

.cover-body       { flex: 1; display: flex; flex-direction: column; justify-content: center;
                    padding: 20mm 0 10mm; }
.cover-eyebrow    { font-size: 8pt; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
.cover-title      { font-size: 32pt; font-weight: 700; line-height: 1.12;
                    color: #fff; margin-bottom: 20px; max-width: 520px; }
.cover-title em   { font-style: italic; font-weight: 400; color: var(--accent); }
.cover-desc       { font-size: 11pt; color: rgba(255,255,255,0.72); max-width: 480px;
                    line-height: 1.65; margin-bottom: 32px; }

.cover-meta       { display: flex; flex-wrap: wrap; gap: 28px; }
.cover-meta-item  { }
.cm-label         { font-size: 7.5pt; color: rgba(255,255,255,0.4); text-transform: uppercase;
                    letter-spacing: 1.2px; display: block; margin-bottom: 2px; }
.cm-value         { font-size: 10pt; color: #fff; font-weight: 600; }

.cover-footer     { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;
                    display: flex; justify-content: space-between; align-items: flex-start;
                    flex-wrap: wrap; gap: 10px; }
.cf-note          { font-size: 8pt; color: rgba(255,255,255,0.38);
                    max-width: 340px; line-height: 1.5; }
.cf-chips         { display: flex; flex-wrap: wrap; gap: 6px; }
.chip             { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 4px; padding: 2px 8px; font-size: 7.5pt;
                    color: rgba(255,255,255,0.55); white-space: nowrap; }

/* ─────────────────────────────────────────────────────────────────────────────
   TABLE OF CONTENTS
───────────────────────────────────────────────────────────────────────────── */
.toc { page-break-before: always; page-break-after: always; }

.toc-head {
  font-size: 20pt; font-weight: 700; color: var(--primary);
  border-bottom: 3px solid var(--primary); padding-bottom: 10px; margin-bottom: 28px;
}

.toc-row          { display: flex; align-items: baseline; gap: 6px; margin-bottom: 10px; }
.toc-num          { font-weight: 800; color: var(--primary); min-width: 24px; font-size: 10pt; }
.toc-label        { font-size: 10.5pt; font-weight: 600; color: var(--text); }
.toc-dots         { flex: 1; border-bottom: 1px dotted var(--border); margin: 0 4px;
                    position: relative; top: -3px; }
.toc-subs         { margin: 4px 0 12px 24px; }
.toc-sub          { font-size: 8.5pt; color: var(--muted); margin-bottom: 2px;
                    padding-left: 10px; position: relative; }
.toc-sub::before  { content: "›"; position: absolute; left: 0; color: var(--accent); }

.toc-verdict-bar  { margin-top: 28px; background: var(--primary); border-radius: 8px;
                    padding: 20px 22px; page-break-inside: avoid; }
.toc-verdict-bar p { font-size: 9.5pt; color: rgba(255,255,255,0.88); line-height: 1.7; }
.toc-verdict-bar strong { color: var(--accent); }

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION PAGES — @page margin handles ALL outer spacing
───────────────────────────────────────────────────────────────────────────── */
.section { page-break-before: always; }

.s-eyebrow {
  font-size: 7.5pt; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 5px;
}
.s-title {
  font-size: 20pt; font-weight: 700; color: var(--primary); line-height: 1.15;
  border-bottom: 3px solid var(--primary); padding-bottom: 10px; margin-bottom: 24px;
}

h3 {
  font-size: 11pt; font-weight: 700; color: var(--primary);
  margin-top: 22px; margin-bottom: 9px;
  padding-bottom: 4px; border-bottom: 1px solid var(--border);
}

p  { font-size: 9.5pt; line-height: 1.7; margin-bottom: 9px; }
em { font-style: italic; }

ul, ol { margin: 8px 0 12px 18px; }
li     { font-size: 9.5pt; line-height: 1.65; margin-bottom: 4px; }
li strong { color: var(--primary); }

/* exec summary */
.exec {
  background: var(--teal-bg); border-left: 4px solid var(--primary);
  border-radius: 0 6px 6px 0; padding: 14px 18px; margin-bottom: 24px;
  font-size: 9.5pt; line-height: 1.72; page-break-inside: avoid;
}
.exec strong { color: var(--primary); }

/* tables */
.tw { border: 1px solid var(--border); border-radius: 6px; overflow: hidden;
      margin: 16px 0; page-break-inside: avoid; width: 100%; }
table { width: 100%; border-collapse: collapse; font-size: 8.5pt; table-layout: fixed; }
thead tr { background: var(--primary); }
thead th { color: #fff; font-weight: 700; text-align: left; padding: 9px 10px;
           font-size: 8pt; }
tbody tr:nth-child(even) { background: #F4F8FA; }
tbody tr:nth-child(odd)  { background: #fff; }
tbody td { padding: 8px 10px; vertical-align: top; border-top: 1px solid var(--border);
           word-break: break-word; }
tbody td strong { color: var(--primary); }

/* severity badges */
.sev-c { background:#FEE2E2; color:#991B1B; border-radius:4px; padding:2px 7px;
         font-weight:800; font-size:7pt; white-space:nowrap; }
.sev-h { background:#FEF3C7; color:#92400E; border-radius:4px; padding:2px 7px;
         font-weight:800; font-size:7pt; white-space:nowrap; }
.sev-m { background:#DBEAFE; color:#1E40AF; border-radius:4px; padding:2px 7px;
         font-weight:800; font-size:7pt; white-space:nowrap; }

/* callout boxes */
.box {
  border-radius: 6px; padding: 13px 16px; margin: 14px 0;
  font-size: 9.5pt; line-height: 1.7; page-break-inside: avoid;
}
.box-warn  { background: #FEF9EC; border-left: 4px solid #F59E0B; }
.box-alert { background: #FEE9E9; border-left: 4px solid var(--danger); }
.box-info  { background: var(--teal-bg); border-left: 4px solid var(--accent); }
.box-dark  { background: var(--dark); color: #fff; border-left: 4px solid var(--accent); }
.box-dark p, .box-dark li { color: rgba(255,255,255,0.88); }
.box-dark strong { color: var(--accent); }
.box-dark ol, .box-dark ul { color: rgba(255,255,255,0.88); }
.box p:last-child { margin-bottom: 0; }

/* milestone items (S6) */
.ms { display: flex; gap: 12px; margin-bottom: 13px; align-items: flex-start;
      page-break-inside: avoid; }
.ms-badge { background: var(--primary); color: #fff; font-size: 7pt; font-weight: 800;
            border-radius: 4px; padding: 3px 8px; white-space: nowrap; flex-shrink: 0;
            margin-top: 1px; letter-spacing: 0.4px; }
.ms-body  { font-size: 9.5pt; line-height: 1.65; }
.ms-body strong { color: var(--primary); }

/* milestone day table */
.day-table { border: 1px solid var(--border); border-radius: 6px; overflow: hidden;
             margin: 16px 0; page-break-inside: avoid; }
.day-row { display: flex; border-top: 1px solid var(--border); }
.day-row:first-child { border-top: none; }
.day-label { background: var(--primary); color: #fff; font-weight: 800; font-size: 8pt;
             padding: 10px 14px; min-width: 80px; display: flex; align-items: flex-start; }
.day-content { padding: 10px 14px; font-size: 9pt; line-height: 1.65; flex: 1; }

/* econ comparison mini-table */
.econ { border: 1px solid var(--border); border-radius: 6px; overflow: hidden;
        margin: 16px 0; page-break-inside: avoid; }
.econ-head { background: var(--dark); color: #fff; display: flex; font-size: 8pt;
             font-weight: 700; }
.econ-head div { padding: 8px 12px; flex: 1; }
.econ-row-e { display: flex; border-top: 1px solid var(--border); font-size: 9pt; }
.econ-row-e:nth-child(odd)  { background: #F4F8FA; }
.econ-row-e:nth-child(even) { background: #fff; }
.econ-row-e div { padding: 8px 12px; flex: 1; }
.neg { color: var(--danger); font-weight: 700; }
.pos { color: #166534;       font-weight: 700; }
.warn-col { color: #92400E;  font-weight: 700; }

/* verdict block */
.verdict {
  background: var(--dark); color: #fff; border-radius: 8px;
  padding: 28px 30px; margin-top: 28px; page-break-inside: avoid;
}
.verdict h2 { font-size: 17pt; font-weight: 700; color: var(--accent); margin-bottom: 14px; }
.verdict p  { color: rgba(255,255,255,0.88); font-size: 9.5pt; line-height: 1.8;
              margin-bottom: 12px; }
.verdict p:last-child { margin-bottom: 0; }
.verdict strong { color: var(--accent); }

/* footer strip on last page */
.report-footer {
  margin-top: 24px; padding-top: 12px; border-top: 1px solid var(--border);
  font-size: 7.5pt; color: var(--muted); text-align: center; line-height: 1.6;
}
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════════════
     COVER PAGE  (named page = 0 margin → full-bleed dark background)
════════════════════════════════════════════════════════════════════ -->
<div class="cover">

  <div class="cover-logo">
    <div class="logo-mark"><span>M</span></div>
    <div>
      <div class="logo-text">MVAIR</div>
      <div class="logo-sub">MedVoice AI Receptionist</div>
    </div>
  </div>

  <div class="cover-body">
    <div class="cover-eyebrow">Confidential — Internal Strategy Document</div>
    <div class="cover-title">Market Reality &amp;<br><em>Survival</em> Research Report</div>
    <div class="cover-desc">
      An honest, evidence-based assessment of where MVAIR stands today, what the market
      demands, the gap between the two, and the 90-day path to a first paying clinic.
    </div>
    <div class="cover-meta">
      <div class="cover-meta-item">
        <span class="cm-label">Prepared</span>
        <span class="cm-value">19 June 2026</span>
      </div>
      <div class="cover-meta-item">
        <span class="cm-label">Scope</span>
        <span class="cm-value">US Primary · CA / UK / AU Secondary</span>
      </div>
      <div class="cover-meta-item">
        <span class="cm-label">Purpose</span>
        <span class="cm-value">Go-to-Market Decision &amp; Pitch Preparation</span>
      </div>
      <div class="cover-meta-item">
        <span class="cm-label">Version</span>
        <span class="cm-value">1.0</span>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <div class="cf-note">
      Confidence key — <strong style="color:rgba(255,255,255,0.7)">H</strong>&nbsp;High (primary / corroborating sources) ·
      <strong style="color:rgba(255,255,255,0.7)">M</strong>&nbsp;Medium (single credible source) ·
      <strong style="color:rgba(255,255,255,0.7)">L</strong>&nbsp;Low (directional / vendor-sourced)
    </div>
    <div class="cf-chips">
      <span class="chip">[CP] Competitor Page</span>
      <span class="chip">[IR] Industry Report</span>
      <span class="chip">[AE] Analyst Estimate</span>
      <span class="chip">[PR] Press / Funding</span>
      <span class="chip">[VG] Vendor Guide</span>
    </div>
  </div>

</div><!-- /cover -->


<!-- ═══════════════════════════════════════════════════════════════════
     TABLE OF CONTENTS
════════════════════════════════════════════════════════════════════ -->
<div class="toc">

  <div class="toc-head">Contents</div>

  <div class="toc-row">
    <span class="toc-num">1.</span>
    <span class="toc-label">Market Reality</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">Market size · Funded competitors · Horizontal AI · Non-AI incumbents · Earliest-adopter specialties · US regulatory gate (HIPAA BAA)</div>
  </div>

  <div class="toc-row">
    <span class="toc-num">2.</span>
    <span class="toc-label">Buyer Psychology &amp; Decision Process</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">Who decides · Trigger events · Objections · Proof required · Sales cycle · Pricing model · Phone number portability</div>
  </div>

  <div class="toc-row">
    <span class="toc-num">3.</span>
    <span class="toc-label">Gap Analysis: MVAIR Today vs. Market Minimum Viable</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">14-dimension gap table — HIPAA, PMS/EHR, reschedule/cancel, recording privacy, auth, uptime, billing, multilingual, SMS, and more</div>
  </div>

  <div class="toc-row">
    <span class="toc-num">4.</span>
    <span class="toc-label">Go-To-Market Reality</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">First-client acquisition ranked · Pilot structure · Freemium decision · Certification / endorsement · Channel partners</div>
  </div>

  <div class="toc-row">
    <span class="toc-num">5.</span>
    <span class="toc-label">Revenue &amp; Scaling Model</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">MRR needed to survive · The Vapi HIPAA cost problem · Unit economics by clinic count · Architecture at scale · Churn drivers</div>
  </div>

  <div class="toc-row">
    <span class="toc-num">6.</span>
    <span class="toc-label">90-Day Survival Plan</span>
    <span class="toc-dots"></span>
  </div>
  <div class="toc-subs">
    <div class="toc-sub">Days 1–30 build priorities · Minimum legal step · What to defer · First sales motion (exact) · Day-30 / 60 / 90 milestones</div>
  </div>

  <div class="toc-row" style="margin-top:10px; border-top:2px solid var(--primary); padding-top:12px;">
    <span class="toc-num" style="color:var(--dark);">★</span>
    <span class="toc-label" style="font-weight:800;">Verdict</span>
    <span class="toc-dots"></span>
  </div>

  <div class="toc-verdict-bar">
    <p><strong>Single most important finding:</strong> MVAIR can survive and earn — but it needs a compliance
    spine (BAA chain + recording proxy + secure auth) before it can legally accept money from a US clinic.
    Once legally sellable, the one action that most increases odds is winning <strong>one paying, BAA-covered,
    PMS-integrated clinic</strong> — because integration is simultaneously the moat, the churn antidote,
    and the proof point that unlocks referrals and any investor conversation.</p>
  </div>

</div><!-- /toc -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 1 — MARKET REALITY
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 1</div>
  <div class="s-title">Market Reality</div>

  <div class="exec">
    The pain MVAIR addresses is real and quantified: independent practices miss 20–38% of inbound calls,
    each missed new-patient call is worth roughly $125–$850 depending on specialty, and annual leakage per
    practice runs from ~$12K to well over $100K. But the category has moved from "early" to
    <strong>contested</strong> — there is a dental-specific, YC-backed incumbent (Arini), an enterprise
    health-system incumbent (Hyro, $95M raised), and a long tail of horizontal AI receptionists priced
    from $65/mo. MVAIR is entering a market where "AI answers the phone" is already table stakes,
    not a differentiator.
  </div>

  <h3>Market Size</h3>
  <ul>
    <li>Practices miss <strong>20–35% of calls</strong>; average missed call ~$125–$200, new-patient calls
        $300–$850 lifetime value; a practice missing ~10 new-patient calls/month loses $100K+/year.
        <em>(M–L [IR]/[VG] — directionally consistent; treat exact dollar figures as marketing-grade.)</em></li>
    <li><strong>US dental front-desk staffing alone</strong> cited by Arini (YC) at ~$7B/year inside a
        ~$220B dental industry. <em>(M [PR].)</em></li>
    <li>Top-down "conversational AI in healthcare": ~$10.8B (2023) → ~$80.5B by 2032 at ~25% CAGR.
        <em>(L [AE] — PR-driven research reports; useful for a pitch slide, not for planning.)</em></li>
    <li><strong>Most credible number for a pitch:</strong> per-practice ROI (recovered missed-call revenue
        vs. subscription cost) — not the inflated top-down TAM.</li>
  </ul>

  <h3>AI Voice Receptionist Competitors — Medical / Dental-Specific</h3>
  <div class="tw">
    <table>
      <colgroup>
        <col style="width:14%"><col style="width:13%"><col style="width:14%">
        <col style="width:35%"><col style="width:16%"><col style="width:8%">
      </colgroup>
      <thead>
        <tr><th>Company</th><th>Focus</th><th>Funding</th><th>Key Differentiators</th><th>Pricing</th><th>Conf.</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Arini</strong></td><td>Dental / DSO</td><td>YC W24, ~$500K seed</td>
          <td>Dentrix, Eaglesoft, Open Dental, Denticon, CareStack; insurance verify; recall; emergency triage; 30-day pilot; "100% HIPAA"</td>
          <td>Mid-three-figures/mo per location</td><td>H [CP][PR]</td>
        </tr>
        <tr>
          <td><strong>Hyro</strong></td><td>Enterprise health systems</td><td>~$95M total</td>
          <td>45+ health systems, 30M+ patients; Epic integration; SOC 2 Type II; not an SMB competitor</td>
          <td>Enterprise / custom</td><td>H [PR]</td>
        </tr>
        <tr>
          <td><strong>Viva AI</strong></td><td>Dental</td><td>Early</td>
          <td>Outbound recall + payments</td><td>~$399–$699/mo</td><td>M [CP]</td>
        </tr>
        <tr>
          <td><strong>AINORA</strong></td><td>Dental</td><td>Early</td>
          <td>Multilingual</td><td>Not public</td><td>M [CP]</td>
        </tr>
        <tr>
          <td><strong>Patientdesk</strong></td><td>Dental</td><td>Early</td>
          <td>Insurance verification</td><td>Not public</td><td>M [CP]</td>
        </tr>
        <tr>
          <td><strong>TensorLinks</strong></td><td>Dental</td><td>Early</td>
          <td>PMS depth (tiered)</td><td>$399–$699/mo</td><td>M [CP]</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>Horizontal AI Competitors (Cross-Vertical, Include Medical Templates)</h3>
  <ul>
    <li><strong>My AI Front Desk</strong> — multi-vertical, ~$65–$200/mo; dental is one of many shallow templates. [CP, M]</li>
    <li><strong>Retell AI / Synthflow / Bland / Goodcall</strong> — infrastructure + no-code builders.
        Retell and Synthflow notably bundle <strong>HIPAA + BAA without an enterprise contract</strong>. [CP/VG, H]</li>
  </ul>
  <div class="box box-warn">
    <strong>Critical infrastructure note:</strong> MVAIR is built on Vapi — meaning MVAIR may compete against
    products built on the same underlying infrastructure. The infrastructure layer is not the moat.
    Retell AI bundles HIPAA + BAA at ~$0.07/min with no $1,000/mo fixed-cost floor; Vapi charges
    ~$1,000–$2,000/mo as a flat add-on. This is the most important economic finding in this report
    (see Section 5).
  </div>

  <h3>Non-AI Incumbents MVAIR Displaces</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:28%"><col style="width:22%"><col style="width:50%"></colgroup>
      <thead><tr><th>Incumbent</th><th>Pricing</th><th>Failure Modes</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>Human answering service</strong></td>
          <td>$500–$3,000/mo medical-grade</td>
          <td>Passive message-taking, callback delay lets leads go cold, one call at a time, after-hours gaps</td>
        </tr>
        <tr>
          <td><strong>In-house receptionist</strong></td>
          <td>$42K–$65K/yr fully loaded</td>
          <td>8×5 coverage only, turnover, sick days, multitasking → missed calls during check-in</td>
        </tr>
        <tr>
          <td><strong>Voicemail / nothing</strong></td>
          <td>"Free"</td>
          <td>62% of callers hang up on voicemail; ~41% of call attempts happen after hours</td>
        </tr>
        <tr>
          <td><strong>Offshore virtual assistants</strong></td>
          <td>Lower-cost human</td>
          <td>Human latency, scheduling/timezone limits, one-at-a-time</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p><em>Pricing M–H [CP]; failure-mode framing M [VG].</em></p>

  <h3>Earliest-Adopter Specialties (US, Ranked)</h3>
  <ol>
    <li><strong>Dental</strong> — clearest ROI math, standardized PMS landscape (Dentrix / Open Dental / Eaglesoft), recall culture. Also where funded competition already is.</li>
    <li><strong>Allied health / physio / chiro</strong> — high call volume, simpler scheduling, Jane App common in CA/AU/UK.</li>
    <li><strong>Dermatology / aesthetics / med-spa</strong> — cash-pay, marketing-driven, conversion-sensitive.</li>
    <li><strong>Mental health</strong> — high demand, but sensitivity and triage risk raise the compliance and liability bar.</li>
    <li><strong>GP / primary care</strong> — high volume but insurance complexity, EHR fragmentation, triage liability make it harder.</li>
  </ol>
  <p><em>Confidence: M–L [CP]/[VG] — competitor vertical focus and dental-specific funding concentration as proxy.</em></p>

  <h3>US Regulatory Environment — The Hard Gate</h3>
  <div class="box box-alert">
    <p><strong>Handling patient name + phone + reason-for-visit on a clinic's behalf makes MVAIR a HIPAA
    Business Associate.</strong> Selling to a US practice legally requires:</p>
    <ol style="margin:8px 0 8px 16px;">
      <li>A signed <strong>BAA between MVAIR and each clinic</strong></li>
      <li>Flow-down BAAs with every subcontractor that touches PHI: Vapi, the LLM provider, TTS provider, Twilio, and the hosting provider</li>
    </ol>
    <p>OCR has issued <strong>six-figure penalties for <em>missing</em> BAAs alone — before any breach
    occurred.</strong> The absence of the agreement is itself the violation. (H [IR] — HHS OCR / Omnibus
    Rule §164.504(e).)</p>
    <p style="margin-top:6px;">Also required: encryption in transit + at rest, audit logging, RBAC,
    breach-notification procedures, US data residency. CA CMIA and some two-party call-recording-consent
    states add a further layer.</p>
  </div>

</div><!-- /section 1 -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 2 — BUYER PSYCHOLOGY
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 2</div>
  <div class="s-title">Buyer Psychology &amp; Decision Process</div>

  <div class="exec">
    For a single independent practice the buyer is the owner-clinician or practice/office manager, and the
    decision is faster and more emotional than enterprise health-IT sales suggest. The dominant emotion is
    <strong>trust and fear of error</strong> ("what if your AI books the wrong thing or mishandles an
    emergency?"), not price. The fastest path to a yes is a live demo call they can hear, a low-risk
    parallel-running pilot, and a peer reference.
  </div>

  <h3>Who Decides (by Clinic Size)</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:28%"><col style="width:36%"><col style="width:36%"></colgroup>
      <thead><tr><th>Clinic Size</th><th>Decision Maker</th><th>Sales Pattern</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>Solo / 1–3 providers</strong></td>
          <td>Owner-dentist/physician (office manager as gatekeeper)</td>
          <td>Short chain; can sign in weeks</td>
        </tr>
        <tr>
          <td><strong>Small group (4–10)</strong></td>
          <td>Practice manager evaluates; owner signs</td>
          <td>2-stakeholder; 4–8 week cycle</td>
        </tr>
        <tr>
          <td><strong>Multi-location / DSO</strong></td>
          <td>Operations / IT + procurement</td>
          <td>Enterprise pattern: long cycle, many stakeholders, RFP likely</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>What Triggers a Search</h3>
  <ul>
    <li>Missed-call pain becoming visible (patient complaints, empty schedule slots)</li>
    <li><strong>Front-desk turnover</strong> — the most common acute trigger</li>
    <li>Opening a second location or a marketing push that outpaces inbound capacity</li>
    <li>After-hours voicemail losing new-patient leads overnight</li>
  </ul>
  <p><em>Confidence: M [VG].</em></p>

  <h3>Objections</h3>
  <ul>
    <li><strong>"Will patients hate talking to a robot?"</strong> — trust in patient experience is the #1 emotional objection</li>
    <li><strong>"Is this HIPAA compliant, will you sign a BAA?"</strong> — a hard yes/no gate; no BAA = no deal</li>
    <li><strong>AI error risk</strong> — wrong bookings, double-bookings, mishandled emergencies, hallucinated answers</li>
    <li><strong>Loss of control</strong> — "what happens to my existing phone number and my PMS?"</li>
  </ul>

  <h3>Proof Required Before Signing</h3>
  <ul>
    <li>A <strong>live demo call</strong> they can place themselves and hear the AI in action</li>
    <li>A <strong>30-day trial/pilot</strong> running alongside existing staff before full cutover</li>
    <li>A <strong>peer reference</strong> from a comparable practice in the same specialty</li>
    <li>Visible <strong>audit logs / call transcripts</strong> reviewable at any time from the dashboard</li>
  </ul>
  <p><em>This is exactly the proof structure Arini productizes. Confidence: H.</em></p>

  <h3>Sales Cycle Length</h3>
  <ul>
    <li><strong>Enterprise medical software:</strong> ~12 months, ~9 decision-makers (M [VG])</li>
    <li><strong>SMB single-clinic (target):</strong> 2–8 weeks from demo to pilot start, then 30 days of monitored pilot before full commitment. Plan around this number, not the enterprise figure.</li>
  </ul>

  <h3>Pricing Model Preference</h3>
  <ul>
    <li>Practices prefer <strong>flat monthly per location</strong> — per-minute billing creates budget anxiety and discourages routing calls to the AI (defeating the purpose)</li>
    <li><strong>Psychologically safe price points:</strong> solo practice $199–$499/mo; group practice $499–$999/mo per location; setup fees $0–$1,500 are normal</li>
    <li><strong>All-in market reality:</strong> $400–$900/mo single location, despite $199 homepage anchors (M [CP])</li>
  </ul>

  <h3>Phone Number Portability — Non-Negotiable</h3>
  <div class="box box-info">
    Clinics <strong>will not re-print signage or re-train patients on a new number.</strong> They must keep
    their existing number. Support <strong>call forwarding</strong> from their carrier (easy, days to set up)
    and <strong>number porting</strong> (harder, paperwork-heavy) as an option. Treat "keep your number"
    as a hard requirement, not a differentiating feature. Confidence: H.
  </div>

</div><!-- /section 2 -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 3 — GAP ANALYSIS
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 3</div>
  <div class="s-title">Gap Analysis: MVAIR Today vs. Market Minimum Viable</div>

  <div class="exec">
    MVAIR has a working contract-first vertical slice (call → book → log → dashboard, validated on real
    calls), which is genuinely ahead of a slide-deck competitor. But against the <strong>market minimum
    to charge a real US clinic</strong>, three gaps are existential: it cannot legally handle PHI (no BAA
    chain), it has no PMS/EHR integration (the only durable moat and #1 retention driver), and it only
    books — it can't reschedule or cancel. Everything else is High or Medium and closeable in days to weeks.
  </div>

  <div class="tw">
    <table>
      <colgroup>
        <col style="width:16%"><col style="width:20%"><col style="width:20%">
        <col style="width:12%"><col style="width:20%">
      </colgroup>
      <thead>
        <tr>
          <th>Capability</th><th>MVAIR Today</th><th>Market Minimum</th>
          <th>Gap Severity</th><th>Est. Effort to Close</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>HIPAA — BAA Chain</strong></td>
          <td>No BAA with clinics; no subcontractor BAAs; Vapi HIPAA add-on not enabled</td>
          <td>Signed BAA w/ clinic + flow-down BAAs (Vapi, LLM, TTS, Twilio, host)</td>
          <td><span class="sev-c">Critical</span></td>
          <td>2–4 wks + legal review + Vapi HIPAA spend or migrate to Retell</td>
        </tr>
        <tr>
          <td><strong>PMS / EHR Integration</strong></td>
          <td>Google Calendar only</td>
          <td>At least one real PMS (Open Dental most accessible; Jane App is approval-only)</td>
          <td><span class="sev-c">Critical (moat + retention)</span></td>
          <td>3–8 wks per integration</td>
        </tr>
        <tr>
          <td><strong>Reschedule / Cancel</strong></td>
          <td>Book only — no reschedule or cancel flows</td>
          <td>Book + reschedule + cancel (table stakes)</td>
          <td><span class="sev-h">High</span></td>
          <td>1–2 wks</td>
        </tr>
        <tr>
          <td><strong>Encryption / Audit / RBAC</strong></td>
          <td>JWT in localStorage (XSS-exposed); SQLite at rest unencrypted; cross-tenant guards exist</td>
          <td>Encryption at rest + transit, audit logs, RBAC, httpOnly cookies</td>
          <td><span class="sev-h">High</span></td>
          <td>1–2 wks</td>
        </tr>
        <tr>
          <td><strong>Recording Privacy</strong></td>
          <td>Audio served from public storage.vapi.ai URLs — accessible to anyone with link</td>
          <td>Proxied, expiring signed URLs; access-logged</td>
          <td><span class="sev-h">High</span></td>
          <td>3–5 days (already scoped)</td>
        </tr>
        <tr>
          <td><strong>Phone Number Portability</strong></td>
          <td>Demo CTAs only; unclear carrier support</td>
          <td>Call forwarding from existing number (min); porting (ideal)</td>
          <td><span class="sev-h">High</span></td>
          <td>Days (forwarding) / Weeks (porting)</td>
        </tr>
        <tr>
          <td><strong>Multilingual — Spanish</strong></td>
          <td>English only</td>
          <td>Spanish at minimum in US market</td>
          <td><span class="sev-h">High</span></td>
          <td>Days (Vapi supports; needs prompt + flow work)</td>
        </tr>
        <tr>
          <td><strong>SMS Confirmation</strong></td>
          <td>Lead capture; phone in calendar event only</td>
          <td>SMS booking confirmation now an expectation</td>
          <td><span class="sev-h">High</span></td>
          <td>3–5 days (Twilio SMS)</td>
        </tr>
        <tr>
          <td><strong>Uptime SLA / Failover</strong></td>
          <td>Manual start; ngrok dependency; single server; no process management</td>
          <td>99.9% target, monitored, no single point of failure</td>
          <td><span class="sev-h">High</span></td>
          <td>1–3 wks (ngrok → real domain, PM2, monitoring)</td>
        </tr>
        <tr>
          <td><strong>Billing / Subscriptions</strong></td>
          <td>None — no ability to charge</td>
          <td>Stripe subscriptions, per-location plans, dunning</td>
          <td><span class="sev-h">High</span></td>
          <td>1 wk</td>
        </tr>
        <tr>
          <td><strong>After-Hours &amp; Holiday Flows</strong></td>
          <td>Business hours enforced in tool + system prompt</td>
          <td>Holiday calendars, after-hours triage / voicemail fallback</td>
          <td><span class="sev-m">Medium</span></td>
          <td>3–5 days</td>
        </tr>
        <tr>
          <td><strong>Multi-Location Within Tenant</strong></td>
          <td>Multi-tenant (clinic-level) only — not multi-location within a tenant</td>
          <td>Shared brand, multiple sites, per-site routing/calendars</td>
          <td><span class="sev-m">Medium</span></td>
          <td>1–2 wks</td>
        </tr>
        <tr>
          <td><strong>Self-Onboarding</strong></td>
          <td>JSON config editor (developer-grade — not usable by a clinic admin)</td>
          <td>Non-technical clinic admin can configure without developer help</td>
          <td><span class="sev-m">Medium</span></td>
          <td>2–4 wks (defer for now)</td>
        </tr>
        <tr>
          <td><strong>Support / Escalation Path</strong></td>
          <td>None defined — no documented support or emergency escalation</td>
          <td>Documented support channel + emergency escalation to clinic staff</td>
          <td><span class="sev-m">Medium</span></td>
          <td>Days (process, not code)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p><em><span class="sev-c">Critical</span> rows = cannot legally or functionally sell without.
  <span class="sev-h">High</span> rows = days-to-weeks to close.
  <span class="sev-m">Medium</span> rows = close after clinic #1 is live.
  The single-server SQLite architecture is NOT a near-term risk (see Section 5).</em></p>

</div><!-- /section 3 -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 4 — GO-TO-MARKET
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 4</div>
  <div class="s-title">Go-To-Market Reality</div>

  <div class="exec">
    A bootstrapped solo founder does not out-market a YC company — you <strong>out-focus</strong> it.
    Win one specialty + one PMS you can actually integrate, sell founder-to-owner with a live demo and
    a 30-day parallel-running pilot, and earn referrals. Freemium would actively damage positioning
    in a trust-sensitive regulated market.
  </div>

  <h3>First-Client Acquisition (Bootstrapped Reality, Ranked)</h3>
  <ol>
    <li><strong>Founder-led direct outreach to a warm niche</strong> — one specialty, ideally a personal
        connection or local proximity. Arini's founders literally went door-to-door to dental practices.</li>
    <li><strong>Referral</strong> — one delighted clinic referring peers is the dominant SMB-healthcare
        acquisition channel; build for it from day one by making the pilot experience remarkable.</li>
    <li><strong>Channel partners (medium-term):</strong> PMS vendors with partner programs, dental/medical
        billing companies, practice-management consultants, healthcare incubators.</li>
    <li><strong>Conferences</strong> — useful for credibility later; expensive and slow at this stage.</li>
  </ol>

  <h3>Pilot Structure That De-Risks the Clinic</h3>
  <div class="box box-info">
    <p><strong>30-day parallel pilot:</strong> AI runs after-hours only first, fully monitored, clinic
    reviews every transcript, gradual cutover to 100% of calls once trust is established. No long-term
    contract during pilot. This is now the <em>expected</em> trial structure — Arini and others have
    trained the market to expect it. Confidence: H [CP].</p>
  </div>

  <h3>Freemium Decision</h3>
  <div class="box box-alert">
    <strong>Freemium: No.</strong> In a regulated, trust-sensitive category a free tier signals "not
    serious about your data" and attracts non-buyers. A <strong>free 30-day pilot</strong> (high-touch,
    time-boxed, BAA-covered) is the correct risk-reducer. An open-ended free tier destroys positioning
    and attracts tyre-kickers who will never convert. Confidence: M.
  </div>

  <h3>Certification / Endorsement</h3>
  <p>Formal medical-association endorsement is slow and not worth chasing pre-revenue. What <em>does</em>
  accelerate sales: <strong>SOC 2 Type I, a clean BAA, a Trust Center page, and named peer references
  from comparable practices.</strong> Confidence: M.</p>

  <h3>Channel Partners Worth Targeting</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:26%"><col style="width:38%"><col style="width:36%"></colgroup>
      <thead><tr><th>Partner Type</th><th>Why</th><th>Note</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>Open Dental</strong></td>
          <td>Accessible API, integration ecosystem, dental-native</td>
          <td>Best first PMS integration target</td>
        </tr>
        <tr>
          <td><strong>Dental / medical billing companies</strong></td>
          <td>Already trusted by clinics — natural upsell</td>
          <td>White-label or referral arrangement</td>
        </tr>
        <tr>
          <td><strong>Practice consultants / brokers</strong></td>
          <td>Influence purchase decisions across many clinics</td>
          <td>Commission-based referral — low overhead</td>
        </tr>
        <tr>
          <td><strong>DSOs / MSOs</strong></td>
          <td>One deal = many locations, lower per-location CAC</td>
          <td>Requires multi-location + PMS integration first</td>
        </tr>
        <tr>
          <td><strong>Jane App</strong></td>
          <td>Dominant in allied health (CA / AU / UK)</td>
          <td><strong>API is approval-only / currently gated</strong> — verify access before targeting allied health</td>
        </tr>
        <tr>
          <td><strong>Healthcare incubators</strong></td>
          <td>Warm intro to vetted early-adopter clinics</td>
          <td>Useful for credibility + deal flow</td>
        </tr>
      </tbody>
    </table>
  </div>

</div><!-- /section 4 -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 5 — REVENUE & SCALING
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 5</div>
  <div class="s-title">Revenue &amp; Scaling Model</div>

  <div class="exec">
    The decisive finding of this report is in the unit economics:
    <strong>building on Vapi saddles MVAIR with a ~$1,000–$2,000/month HIPAA fixed cost that makes the
    first 1–5 clinics structurally unprofitable.</strong> Retell AI (and Synthflow) include HIPAA + BAA
    without that fixed floor. Re-evaluating the voice provider may matter more to survival than any
    feature on the roadmap.
  </div>

  <h3>MRR Needed to Fund a 2-Person Team for 18 Months</h3>
  <p>Lean assumptions: 2 modest founder salaries + infrastructure + tooling ≈ $12K–$20K/mo burn.
  Break-even target: <strong>$15K–$20K MRR.</strong> At common price points:</p>
  <div class="tw">
    <table>
      <colgroup><col style="width:50%"><col style="width:50%"></colgroup>
      <thead><tr><th>Monthly Price / Clinic</th><th>Clinics Needed to Break Even</th></tr></thead>
      <tbody>
        <tr><td>$299 / mo</td><td>~50–67 clinics</td></tr>
        <tr><td>$499 / mo</td><td>~30–40 clinics</td></tr>
        <tr><td>$799 / mo</td><td>~19–25 clinics</td></tr>
      </tbody>
    </table>
  </div>
  <p><em>Note: a deferred-salary solo founder needs far less. Confidence: M.</em></p>

  <h3>The Vapi HIPAA Cost Problem (Critical)</h3>
  <ul>
    <li>Vapi all-in variable cost: ~<strong>$0.13–$0.33/min</strong> (platform + STT + LLM + TTS + telephony).
        A typical clinic's call volume costs only <strong>~$30–$100/mo variable.</strong></li>
    <li>Vapi HIPAA / BAA flat add-on: <strong>~$1,000–$2,000/mo</strong> (H [CP], multiple sources).</li>
    <li>Retell AI alternative: ~<strong>$0.07/min with HIPAA + BAA included</strong>, no enterprise plan, no fixed-cost floor.</li>
  </ul>

  <h3>Unit Economics at $499/mo Plan — Vapi HIPAA Add-On vs. Retell</h3>
  <div class="econ">
    <div class="econ-head">
      <div>Clinics on Platform</div>
      <div>HIPAA Fixed Cost / Clinic</div>
      <div>Variable Cost / Clinic</div>
      <div>Gross Margin / Clinic @ $499 (Vapi)</div>
    </div>
    <div class="econ-row-e">
      <div>1 clinic</div><div>~$1,000</div><div>~$65</div>
      <div class="neg">–$566 &nbsp;(deeply negative)</div>
    </div>
    <div class="econ-row-e">
      <div>5 clinics</div><div>~$200</div><div>~$65</div>
      <div class="warn-col">+$234 &nbsp;(thin)</div>
    </div>
    <div class="econ-row-e">
      <div>10 clinics</div><div>~$100</div><div>~$65</div>
      <div class="pos">+$334 &nbsp;(workable)</div>
    </div>
    <div class="econ-row-e">
      <div>25+ clinics</div><div>~$40</div><div>~$65</div>
      <div class="pos">+$394 &nbsp;(healthy)</div>
    </div>
  </div>

  <div class="box box-dark">
    <p><strong>Resolution options — choose before signing clinic #1:</strong></p>
    <ol style="margin:8px 0 0 16px;">
      <li><strong>Migrate voice layer to Retell AI</strong> — eliminates the $1,000/mo floor; HIPAA + BAA
          bundled; variable cost drops from ~$0.13–$0.33 to ~$0.07/min. Highest impact per hour spent.</li>
      <li>Absorb the Vapi HIPAA cost as customer-acquisition expense for the first cohort and re-evaluate at 10 clinics.</li>
      <li>Price first cohort at $799+/mo (founding-clinic annual rate) to compress the loss window.</li>
    </ol>
  </div>

  <h3>Natural Expansion Revenue Path</h3>
  <p>Solo clinic → multi-location → group practice → <strong>DSO/MSO</strong> (one contract, many locations,
  lower per-location CAC, higher retention). Expansion revenue (add-ons: recall outreach, SMS confirmations,
  analytics reporting) is where vertical SaaS makes its real margin. Confidence: H.</p>

  <h3>Architecture at Scale</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:18%"><col style="width:50%"><col style="width:32%"></colgroup>
      <thead><tr><th>Clinic Count</th><th>Architecture Verdict</th><th>Action</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>1–50</strong></td>
          <td>Single-server SQLite is fine — better-sqlite3 is fast for this read/write profile</td>
          <td>No action needed</td>
        </tr>
        <tr>
          <td><strong>50–200</strong></td>
          <td>Write-concurrency + single-point-of-failure limits appear</td>
          <td>Migrate to managed Postgres; stateless app instances</td>
        </tr>
        <tr>
          <td><strong>500+</strong></td>
          <td>Multi-region, read replicas, observability stack</td>
          <td>A problem worth having — plan path, execute when needed</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p><em>Architecture is <strong>not</strong> a near-term survival risk. Resist premature scaling work.</em></p>

  <h3>Churn Drivers in SMB Vertical SaaS</h3>
  <ul>
    <li>SMB SaaS churns <strong>~3–7%/month (≈30–58%/yr)</strong>; <strong>~70% of churn happens in the
        first 90 days</strong> — onboarding quality is the highest-leverage retention lever. (H [IR].)</li>
    <li><strong>The antidote is PMS integration</strong> — embeds in core operations and makes the product
        too critical to rip out. Solves moat and retention simultaneously.</li>
    <li>Additional mitigants: annual contracts (30–40% lower churn than monthly), fast time-to-first-value
        (&lt;7 days), visible ROI reporting the manager can show the owner.</li>
  </ul>

</div><!-- /section 5 -->


<!-- ═══════════════════════════════════════════════════════════════════
     SECTION 6 — 90-DAY SURVIVAL PLAN
════════════════════════════════════════════════════════════════════ -->
<div class="section">

  <div class="s-eyebrow">Section 6</div>
  <div class="s-title">90-Day Survival Plan</div>

  <div class="exec">
    The next 90 days should be spent making MVAIR <strong>legally and operationally sellable to one real
    clinic</strong> — not adding features. The single most important build is the compliance + PHI-handling
    spine. The single most important non-build is getting one paying, integrated clinic live and generating
    visible ROI.
  </div>

  <h3>Days 1–30 — Become Legally Sellable</h3>

  <div class="ms">
    <div class="ms-badge">Priority 1</div>
    <div class="ms-body"><strong>Voice provider economics decision:</strong> Vapi HIPAA add-on
    (~$1,000–$2,000/mo flat) vs. migrating to Retell AI (~$0.07/min, HIPAA + BAA bundled, no fixed floor).
    This decision gates everything else — the unit model, the BAA chain, and the first invoice.</div>
  </div>
  <div class="ms">
    <div class="ms-badge">Priority 2</div>
    <div class="ms-body"><strong>Recording proxy</strong> — serve audio through
    <code>/api/recordings/:id</code> with expiring signed URLs. Closes the public Vapi URL PHI exposure.
    Already scoped; 3–5 days of work.</div>
  </div>
  <div class="ms">
    <div class="ms-badge">Priority 3</div>
    <div class="ms-body"><strong>Auth hardening</strong> — JWT → httpOnly cookies; encryption at rest
    on SQLite; role-based access control; audit log table. Required for any HIPAA claim.</div>
  </div>
  <div class="ms">
    <div class="ms-badge">Priority 4</div>
    <div class="ms-body"><strong>Reschedule + Cancel flows</strong> — table-stakes product gap.
    No clinic will commit if patients can't cancel or move an appointment via the same AI that booked it.</div>
  </div>
  <div class="ms">
    <div class="ms-badge">Priority 5</div>
    <div class="ms-body"><strong>Production deployment</strong> — Railway + Vercel, replace ngrok with a
    real stable domain, PM2 or equivalent for process management. One real URL to share with a prospect.</div>
  </div>

  <h3>Minimum Legal Step Before Charging Money</h3>
  <div class="box box-alert">
    <p>A signed <strong>BAA between MVAIR and the clinic</strong> + executed BAAs with every PHI-touching
    subcontractor (voice provider, LLM, TTS, Twilio, host). Have your own BAA template
    <strong>reviewed by a healthcare attorney</strong> (a few hundred to low thousands of dollars —
    non-optional).</p>
    <p style="margin-top:6px;">Taking money from a clinic that routes patient data through MVAIR, without
    this in place, is a standalone HIPAA violation exposed to OCR penalties even with zero breaches.</p>
  </div>

  <h3>What to Defer (Do Not Gold-Plate)</h3>
  <ul>
    <li>Visual (non-JSON) config editor — JSON editor works; ship it after first paying client</li>
    <li>Multi-location within a single tenant — needed for DSO; not needed for clinic #1</li>
    <li>Analytics dashboards beyond sessions / leads / appointments panels</li>
    <li>Webhook pingback for on-call provider notification on emergency</li>
    <li>Additional languages beyond Spanish</li>
    <li>Second PMS integration — build it only after clinic #1 proves the model</li>
    <li>Architecture migration (SQLite → Postgres) — not needed until 30–40 clinics</li>
    <li>ElevenLabs voice upgrade — Vapi's built-in voice is sufficient for the demo</li>
  </ul>

  <h3>First Sales Motion (Exact)</h3>
  <div class="box box-info">
    <p><strong>Target:</strong> One specialty + one PMS you can integrate today. Recommended:
    <strong>dental on Open Dental</strong> (accessible API, clear ROI math, standardized scheduling) —
    accepting that Arini is there — <em>or</em> a less-contested allied-health niche where you have
    a warm intro (noting Jane App's API is currently gated, so plan Google Calendar-based booking
    there initially).</p>
    <p style="margin-top:8px;"><strong>Who to call:</strong> Owner-clinicians and practice managers
    of 1–3-provider independents. Local or warm-referred first.</p>
    <p style="margin-top:8px;"><strong>What to say:</strong> <em>"You're losing $X/month to missed
    and after-hours calls. I'll run my AI receptionist alongside your front desk for 30 days, free,
    after-hours first. You review every transcript. If it's not booking real appointments cleanly,
    you owe nothing."</em></p>
    <p style="margin-top:8px;"><strong>What to offer:</strong> Free 30-day monitored parallel pilot →
    convert to a founding-clinic annual rate ($499–$799/mo) with a signed BAA at cutover.</p>
  </div>

  <h3>Day-by-Day Success Milestones</h3>
  <div class="day-table">
    <div class="day-row">
      <div class="day-label">Day 30</div>
      <div class="day-content">Deployed, compliance spine live, BAA template attorney-reviewed, demo line a prospect can call from their phone, recording proxy + reschedule/cancel shipped. One pilot clinic verbally committed to starting.</div>
    </div>
    <div class="day-row">
      <div class="day-label">Day 60</div>
      <div class="day-content">One clinic running a live, monitored pilot (after-hours first), real patient calls booking cleanly, transcripts reviewed weekly with the clinic manager, zero compliance incidents. First PMS integration in progress or complete.</div>
    </div>
    <div class="day-row">
      <div class="day-label">Day 90</div>
      <div class="day-content">First <strong>paying</strong> clinic on a signed BAA + annual plan, running ≥1 week at full call volume, with a documented repeatable provisioning + compliance playbook and one written reference quote for use in outreach.</div>
    </div>
  </div>

  <!-- VERDICT -->
  <div class="verdict">
    <h2>Verdict</h2>
    <p>
      MVAIR can survive and earn — but not as currently positioned, and not yet. The working,
      contract-validated vertical slice (call → book → log → dashboard, proven on real phone calls) is
      a genuine asset that puts it ahead of vaporware competitors. The underlying market pain —
      missed-call revenue leakage — is real and quantifiable at the per-clinic level.
    </p>
    <p>
      However, today the product is a thinner version of what a funded, dental-native incumbent already
      ships, in a market where "AI answers the phone" is no longer a differentiator, sitting on an
      infrastructure choice (Vapi) whose <strong>~$1,000–$2,000/month HIPAA fixed cost makes the first
      handful of clinics structurally unprofitable.</strong> The moat is not voice quality and not price —
      it is <strong>compliance depth plus PMS/EHR integration</strong>, and MVAIR has neither in place yet.
    </p>
    <p>
      <strong>The single thing that would most increase MVAIR's odds in the next 60 days:</strong> get
      <strong>one real, paying, BAA-covered clinic live and integrated with its practice-management
      system.</strong> PMS integration is simultaneously the only durable moat, the dominant defense
      against the 70%-in-90-days SMB churn curve, and the proof point that unlocks referrals, partners,
      and any investor conversation. Resolve the voice-provider HIPAA economics first — it gates the unit
      model — then go win clinic #1.
    </p>
  </div>

  <div class="report-footer">
    Confidence and source-type tags are embedded throughout. Market-size figures from vendor blogs and
    PR-driven research reports should be treated as directional only.<br>
    Competitor pricing and HIPAA/BAA requirements are the highest-confidence findings in this report.<br>
    <strong>MVAIR — Market Reality &amp; Survival Research Report · v1.0 · 19 June 2026 · Confidential</strong>
  </div>

</div><!-- /section 6 -->

</body>
</html>`;

// ---------------------------------------------------------------------------
// Render to PDF
// ---------------------------------------------------------------------------
async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to A4 width at 96dpi so layout matches PDF output
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Give Google Fonts a moment to load
  await page.waitForTimeout(2500);

  await page.pdf({
    path: OUT_PATH,
    format: 'A4',
    printBackground: true,
    // Margins are handled entirely by @page in CSS — DO NOT set margins here
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log(`[PDF] Done → ${OUT_PATH}`);
}

run().catch(err => { console.error('[PDF]', err.message); process.exit(1); });
