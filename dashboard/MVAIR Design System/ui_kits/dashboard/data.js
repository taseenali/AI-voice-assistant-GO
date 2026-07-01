/* MedVoice Command Center — mock data layer. Plain JS, loaded before React app.
   Exposes window.MV. All figures illustrative; grounded in the MVAIR product
   (5 agent tools: check_availability, get_available_slots, book_appointment,
   capture_lead, log_emergency) and the research (missed-call economics,
   task-completion as hero outcome, BAA gates, Vapi 7.5s budget). */
(function () {
  const pad = (n) => String(n).padStart(2, '0');

  // ---- Tenants (multi-tenant SaaS; super-admin sees all) ----
  const tenants = [
    { id: 'northgate-family-health', name: 'Northgate Family Health', niche: 'Family medicine', plan: 'Growth', tier: 2, status: 'live', mrr: 499, minutes: 4120, minutesCap: 6000, calls30: 1284, baa: 'signed', pms: 'Open Dental', city: 'Portland, OR' },
    { id: 'bayview-dental', name: 'Bayview Dental Group', niche: 'Dental', plan: 'Pro', tier: 3, status: 'live', mrr: 799, minutes: 7350, minutesCap: 9000, calls30: 2210, baa: 'signed', pms: 'Dentrix', city: 'San Diego, CA' },
    { id: 'cedar-pediatrics', name: 'Cedar Pediatrics', niche: 'Pediatrics', plan: 'Growth', tier: 2, status: 'live', mrr: 499, minutes: 3010, minutesCap: 6000, calls30: 940, baa: 'signed', pms: 'athenahealth', city: 'Austin, TX' },
    { id: 'summit-ortho', name: 'Summit Orthopedics', niche: 'Orthopedics', plan: 'Pro', tier: 3, status: 'onboarding', mrr: 0, minutes: 180, minutesCap: 9000, calls30: 64, baa: 'pending', pms: 'Epic', city: 'Denver, CO' },
    { id: 'lakeside-wellness', name: 'Lakeside Wellness', niche: 'Primary care', plan: 'Starter', tier: 1, status: 'trial', mrr: 0, minutes: 420, minutesCap: 2000, calls30: 150, baa: 'not_started', pms: 'None', city: 'Madison, WI' },
  ];

  // ---- KPI snapshot for the active tenant (Northgate) ----
  const kpis = {
    callsToday: 47, callsTodayDelta: 12,
    answeredRate: 100, missedBeforeMvair: 35,
    appointmentsBooked: 21, appointmentsDelta: 8,
    leadsCaptured: 14, leadConvRate: 30,
    emergencies: 2,
    taskCompletion: 92, taskCompletionDelta: 3,   // hero outcome metric
    avgHandle: 222,                                // seconds
    avgLatency: 680,                               // ms (research median)
    afterHoursShare: 38,                           // % of calls after hours
    revenueRecovered: 9450,                        // $ — missed-call recovery
    missedCallValue: 450,                          // $ per missed call (research)
  };

  // ---- 14-day trend series ----
  const trend = {
    calls: [38, 41, 44, 39, 52, 61, 33, 47, 49, 58, 62, 55, 51, 47],
    booked: [14, 18, 17, 15, 22, 27, 12, 19, 21, 25, 28, 24, 22, 21],
    completion: [86, 88, 87, 85, 90, 91, 84, 89, 90, 93, 94, 91, 90, 92],
    latency: [690, 705, 680, 720, 675, 668, 712, 690, 684, 672, 665, 690, 700, 680],
  };

  // ---- Live (in-progress) calls ----
  const liveCalls = [
    { id: 'live-1', caller: '+1 (503) 555-0148', since: 72, intent: 'booking', state: 'collecting details', channel: 'phone', sentiment: 'calm' },
    { id: 'live-2', caller: 'Web widget', since: 31, intent: 'inquiry', state: 'checking availability', channel: 'web', sentiment: 'calm' },
    { id: 'live-3', caller: '+1 (971) 555-0102', since: 8, intent: 'triage', state: 'greeting', channel: 'phone', sentiment: 'urgent' },
  ];
  const liveTranscript = [
    { role: 'aria', t: 'Northgate Family Health, this is Aria. How can I help you today?' },
    { role: 'patient', t: "Hi, I need to get in to see someone about a recurring migraine." },
    { role: 'aria', t: "I'm sorry to hear that. I can get you booked — may I have your name and a callback number?" },
    { role: 'patient', t: 'Diane Okafor, 503-555-0148.' },
    { role: 'aria', t: 'Thank you, Diane. Checking the next available visits with Dr. Reyes…' },
  ];

  // ---- Sessions / calls ----
  const intents = ['booking', 'inquiry', 'followup', 'triage', 'billing', 'general'];
  const intentToBadge = { booking: 'dental', inquiry: 'inquiry', followup: 'followup', triage: 'urgent', billing: 'general', general: 'general' };
  const outcomes = ['booked', 'lead_captured', 'triaged', 'info_only', 'transferred', 'missed'];
  const firstNames = ['Diane', 'Marcus', 'Priya', 'Tom', 'Elena', 'Wei', 'Sofia', 'James', 'Aisha', 'Liam', 'Nora', 'Hassan', 'Grace', 'Ravi'];
  const lastNames = ['Okafor', 'Bell', 'Shah', 'Nguyen', 'Russo', 'Chen', 'Marquez', 'Doyle', 'Khan', 'Park', 'Olsen', 'Reyes', 'Adler', 'Iyer'];
  function rng(seed) { let s = seed; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; }
  const r = rng(42);
  const sessions = [];
  for (let i = 0; i < 64; i++) {
    const channel = r() > 0.32 ? 'phone' : 'web';
    const intent = intents[Math.floor(r() * intents.length)];
    let outcome;
    if (intent === 'booking') outcome = r() > 0.18 ? 'booked' : 'lead_captured';
    else if (intent === 'triage') outcome = 'triaged';
    else if (intent === 'inquiry') outcome = r() > 0.5 ? 'lead_captured' : 'info_only';
    else outcome = outcomes[Math.floor(r() * outcomes.length)];
    const emergency = intent === 'triage' && r() > 0.4;
    const hour = Math.floor(r() * 24);
    const dur = 45 + Math.floor(r() * 320);
    const fn = firstNames[Math.floor(r() * firstNames.length)];
    const ln = lastNames[Math.floor(r() * lastNames.length)];
    sessions.push({
      id: 's-' + (1000 + i).toString(16).toUpperCase() + '-' + (4000 + i * 7).toString(16).toUpperCase(),
      caller: channel === 'phone' ? `+1 (503) 555-${pad(100 + i)}` : 'Web widget',
      name: r() > 0.25 ? `${fn} ${ln}` : null,
      channel, intent, outcome, emergency,
      startTime: `Jun ${pad(30 - (i % 6))}, ${pad(hour)}:${pad(Math.floor(r() * 60))}`,
      hour,
      afterHours: hour < 8 || hour >= 18,
      duration: dur,
      turns: 4 + Math.floor(r() * 22),
      latency: 620 + Math.floor(r() * 180),
      completed: outcome !== 'missed' && outcome !== 'transferred',
      recording: r() > 0.1,
      day: i % 7,
    });
  }

  // ---- A drilled-in session: transcript + tool-call trace ----
  const sampleTranscript = [
    { role: 'aria', state: 'greeting', t: 'Northgate Family Health, this is Aria. How can I help you today?' },
    { role: 'patient', state: 'intent', t: "Hi, I'd like to book an appointment — I've had a sore throat for a few days." },
    { role: 'aria', state: 'collect', t: "I can help with that. May I have your full name and a callback number?" },
    { role: 'patient', state: 'collect', t: 'Marcus Bell, 503-555-0112.' },
    { role: 'aria', state: 'availability', t: "Thanks, Marcus. Let me check the next open visits…" },
    { role: 'tool', tool: 'check_availability', t: 'check_availability(provider="Dr. Reyes", window="3d") → 6 slots', ms: 410, ok: true },
    { role: 'tool', tool: 'get_available_slots', t: 'get_available_slots(date="Jul 02") → ["9:30","11:00","14:15"]', ms: 280, ok: true },
    { role: 'aria', state: 'offer', t: 'I have tomorrow at 9:30 AM or 11:00 AM with Dr. Reyes. Which works?' },
    { role: 'patient', state: 'confirm', t: '9:30 is perfect.' },
    { role: 'tool', tool: 'book_appointment', t: 'book_appointment(slot="Jul 02 09:30", patient="Marcus Bell") → confirmed #A-7741', ms: 520, ok: true },
    { role: 'aria', state: 'confirm', t: "You're booked for tomorrow at 9:30 AM. You'll get a text confirmation. Anything else?" },
    { role: 'patient', state: 'close', t: 'No, thank you!' },
    { role: 'tool', tool: 'capture_lead', t: 'capture_lead(name="Marcus Bell", reason="sore throat") → saved', ms: 190, ok: true },
  ];

  // ---- Appointments ----
  const apptStatus = ['confirmed', 'confirmed', 'pending', 'confirmed', 'rescheduled', 'confirmed', 'cancelled'];
  const providers = ['Dr. Reyes', 'Dr. Chen', 'Dr. Adeyemi', 'NP Whitfield'];
  const reasons = ['New patient visit', 'Follow-up', 'Sore throat eval', 'Annual physical', 'Migraine consult', 'Medication review', 'Lab review'];
  const appointments = [];
  for (let i = 0; i < 18; i++) {
    appointments.push({
      id: 'A-' + (7700 + i),
      patient: `${firstNames[(i * 3) % firstNames.length]} ${lastNames[(i * 5) % lastNames.length]}`,
      provider: providers[i % providers.length],
      reason: reasons[i % reasons.length],
      when: `Jul ${pad(1 + (i % 5))} · ${pad(8 + (i % 9))}:${i % 2 ? '30' : '00'} ${8 + (i % 9) < 12 ? 'AM' : 'PM'}`,
      status: apptStatus[i % apptStatus.length],
      writeback: i % 7 === 3 ? 'pending' : 'synced',
      source: i % 4 === 0 ? 'web' : 'phone',
    });
  }

  // ---- Leads ----
  const leadStages = ['new', 'contacted', 'booked', 'lost'];
  const leads = [];
  for (let i = 0; i < 16; i++) {
    leads.push({
      id: 'L-' + (300 + i),
      name: `${firstNames[(i * 7) % firstNames.length]} ${lastNames[(i * 2) % lastNames.length]}`,
      phone: `+1 (503) 555-${pad(200 + i)}`,
      reason: reasons[(i + 2) % reasons.length],
      stage: leadStages[i % leadStages.length],
      captured: `Jun ${pad(28 - (i % 5))}`,
      channel: i % 3 === 0 ? 'web' : 'phone',
      value: 180 + (i % 6) * 60,
    });
  }

  // ---- Emergencies / escalations ----
  const emergencies = [
    { id: 'E-204', caller: '+1 (971) 555-0102', when: 'Jun 30 · 02:14', flag: 'Chest pain mentioned', action: 'Advised 911 + escalated to on-call', owner: 'Dr. Reyes', status: 'resolved', sla: '1m 40s' },
    { id: 'E-203', caller: '+1 (503) 555-0188', when: 'Jun 29 · 23:47', flag: 'Severe allergic reaction', action: 'Routed to nurse line', owner: 'NP Whitfield', status: 'resolved', sla: '2m 10s' },
    { id: 'E-202', caller: '+1 (503) 555-0151', when: 'Jun 29 · 19:02', flag: 'High fever, infant', action: 'Escalated — awaiting callback', owner: 'Dr. Chen', status: 'open', sla: '—' },
  ];

  // ---- System health (golden signals + habitat) ----
  const health = {
    overall: 'operational',
    services: [
      { name: 'Voice runtime (Vapi)', status: 'up', detail: 'us-west-2', metric: '680ms p50', sub: 'STT · LLM · TTS · telephony', kind: 'rented' },
      { name: 'Webhook server', status: 'up', detail: 'assistant-request 1.2s avg', metric: '99.97%', sub: 'SPOF — tunnel to app server', kind: 'custom' },
      { name: 'Google Calendar', status: 'up', detail: 'write-back live', metric: '320ms', sub: 'Gate 2 — book_appointment', kind: 'external' },
      { name: 'PMS / EHR write-back', status: 'gap', detail: 'not connected', metric: '—', sub: 'Open Dental adapter pending', kind: 'gap' },
      { name: 'LLM (model)', status: 'degraded', detail: 'elevated latency', metric: '1.1s p95', sub: 'failover armed', kind: 'rented' },
      { name: 'Datastore', status: 'up', detail: 'nominal', metric: '12ms', sub: 'sessions · leads · appts', kind: 'custom' },
    ],
    latency: { p50: 680, p95: 1080, p99: 1460, budget: 7500, assistantReq: 1200 },
    signals: [
      { name: 'Latency', value: '680ms', status: 'up' },
      { name: 'Traffic', value: '47 calls', status: 'up' },
      { name: 'Errors', value: '0.4%', status: 'up' },
      { name: 'Saturation', value: '38%', status: 'up' },
    ],
    uptime: 99.97,
  };

  // ---- Trust & compliance (Gate 1) ----
  const compliance = {
    certified: true,
    dataAsOf: '2 min ago',
    posture: [
      { name: 'HIPAA BAA — clinic', status: 'signed', note: 'Northgate ↔ MVAIR, executed Jun 2026' },
      { name: 'SOC 2 Type II', status: 'in_progress', note: 'Observation window — report Q4 2026' },
      { name: 'Encryption', status: 'ok', note: 'TLS 1.3 in transit · AES-256 at rest' },
      { name: 'Audit logging', status: 'ok', note: 'All PHI access logged, tamper-evident' },
      { name: 'Data retention', status: 'ok', note: 'Recordings + transcripts: 90 days, then purge' },
      { name: 'AB-3030 disclosure', status: 'na', note: 'Scheduling/admin — excluded from clinical-disclosure rule' },
    ],
    // The BAA flow-down chain — every subprocessor touching PHI
    baaChain: [
      { from: 'Clinic (covered entity)', to: 'MVAIR', status: 'signed' },
      { from: 'MVAIR', to: 'Vapi (orchestration)', status: 'signed' },
      { from: 'Vapi', to: 'STT provider', status: 'signed' },
      { from: 'Vapi', to: 'LLM provider', status: 'signed' },
      { from: 'Vapi', to: 'TTS provider', status: 'pending' },
      { from: 'Vapi', to: 'Telephony', status: 'signed' },
    ],
    audit: [
      { who: 'dr.reyes@northgate.com', action: 'Viewed session s-103E transcript', when: '14:22', ip: '73.12.x.x' },
      { who: 'system', action: 'Recording s-1041 purged (90-day retention)', when: '03:00', ip: '—' },
      { who: 'office@northgate.com', action: 'Exported leads CSV (14 rows)', when: 'Jun 29 17:40', ip: '73.12.x.x' },
      { who: 'admin@medvoice.ai', action: 'Updated emergency escalation protocol', when: 'Jun 29 11:05', ip: '52.9.x.x' },
    ],
  };

  // ---- Integrations (Gate 2) ----
  const integrations = [
    { name: 'Google Calendar', cat: 'Scheduling', status: 'connected', detail: 'Real-time write-back · primary calendar', icon: 'CalendarDays' },
    { name: 'Open Dental', cat: 'PMS / EHR', status: 'available', detail: 'Deep write-back · ~6–12 wk setup', icon: 'Database' },
    { name: 'Dentrix', cat: 'PMS / EHR', status: 'available', detail: 'Deep write-back · ~6–12 wk setup', icon: 'Database' },
    { name: 'Epic', cat: 'PMS / EHR', status: 'available', detail: 'Enterprise · partner access required', icon: 'Database' },
    { name: 'athenahealth', cat: 'PMS / EHR', status: 'available', detail: 'API write-back', icon: 'Database' },
    { name: 'Twilio SMS', cat: 'Messaging', status: 'connected', detail: 'Appointment confirmations', icon: 'MessageSquare' },
    { name: 'HubSpot CRM', cat: 'CRM', status: 'available', detail: 'Lead sync', icon: 'Users' },
    { name: 'Eligibility (insurance)', cat: 'Verification', status: 'available', detail: 'Real-time benefits check', icon: 'ShieldCheck' },
  ];

  // ---- Aria configuration ----
  const config = {
    name: 'Aria',
    greeting: 'Northgate Family Health, this is Aria. How can I help you today?',
    voice: 'Elliot (warm, neutral)',
    line: '+1 (856) 440-2211',
    hours: 'Mon–Fri 8:00 AM – 6:00 PM · 24/7 answering',
    services: ['New patient booking', 'Follow-up scheduling', 'Prescription refill intake', 'Lead capture', 'Emergency triage'],
    tools: [
      { name: 'check_availability', on: true },
      { name: 'get_available_slots', on: true },
      { name: 'book_appointment', on: true },
      { name: 'capture_lead', on: true },
      { name: 'log_emergency', on: true },
    ],
    escalation: 'If caller mentions chest pain, difficulty breathing, severe bleeding, or suicidal ideation → advise 911 and page on-call provider.',
  };

  // ---- Notifications ----
  const notifications = [
    { id: 'n1', kind: 'emergency', title: 'Emergency flagged', body: 'E-202 high fever, infant — awaiting callback', when: '2m', unread: true },
    { id: 'n2', kind: 'warning', title: 'LLM latency elevated', body: 'p95 at 1.1s — failover armed', when: '18m', unread: true },
    { id: 'n3', kind: 'success', title: '21 appointments booked today', body: '+8 vs yesterday', when: '1h', unread: false },
    { id: 'n4', kind: 'info', title: 'TTS subprocessor BAA pending', body: 'Blocking full Gate-1 certification', when: '3h', unread: false },
  ];

  // ---- Peak-hours heatmap (7 days × 24h call counts) ----
  const heatmap = [];
  const rh = rng(7);
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 24; h++) {
      let base = h >= 8 && h <= 18 ? 6 + Math.floor(rh() * 9) : Math.floor(rh() * 4);
      if (d >= 5) base = Math.floor(base * 0.5);
      row.push(base);
    }
    heatmap.push(row);
  }

  // ---- Outcome funnel ----
  const funnel = [
    { stage: 'Calls answered', value: 1284, pct: 100 },
    { stage: 'Intent understood', value: 1241, pct: 97 },
    { stage: 'Action taken', value: 1118, pct: 87 },
    { stage: 'Booked / captured', value: 912, pct: 71 },
  ];

  const fmtDur = (s) => { const m = Math.floor(s / 60); const ss = s % 60; return m ? `${m}m ${ss}s` : `${ss}s`; };
  const money = (n) => '$' + n.toLocaleString('en-US');

  window.MV = {
    tenants, kpis, trend, liveCalls, liveTranscript, sessions, sampleTranscript,
    appointments, leads, emergencies, health, compliance, integrations, config,
    notifications, heatmap, funnel, intents, intentToBadge, outcomes,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fmtDur, money,
  };
})();
