/* MVAIR marketing landing — faithful recreation of src/marketing.
   Uses DS components (MvairLogo, MvairMark, CTAButton) from the bundle. */
const { MvairMark, MvairLogo, CTAButton } = window.MVAIRDesignSystem_49370a;
const { Phone, UserPlus, CalendarCheck, AlertTriangle, MonitorSmartphone, Check } = window.MvairIcons;

const T = {
  primary: 'var(--mvair-primary)',
  accent: 'var(--mvair-accent)',
  dark: 'var(--mvair-dark)',
  text: 'var(--mvair-text-primary)',
  text2: 'var(--mvair-text-secondary)',
  onDark: 'var(--mvair-on-dark)',
  page: 'var(--mvair-surface)',
  cardBorder: 'var(--mvair-card-border)',
  serif: 'var(--mvair-font-display)',
  sans: 'var(--mvair-font-sans)',
};

function Eyebrow({ children, tone = 'primary' }) {
  return <div style={{ textTransform: 'uppercase', letterSpacing: '.16em', fontSize: 13, fontWeight: 600, color: tone === 'accent' ? T.accent : T.primary, marginBottom: 18 }}>{children}</div>;
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [['#product','Product'],['#how','How it works'],['#listen','Hear it'],['#security','Security']];
  return (
    <nav className="m-nav" style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid var(--mvair-hairline)' }}>
      <div className="wrap" style={{ height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MvairLogo tone="petrol" size={30} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
          <div style={{ display: 'flex', gap: 30 }}>
            {links.map(([h,l]) => <a key={h} href={h} style={{ fontSize: 15, fontWeight: 500, color: T.text2 }}>{l}</a>)}
          </div>
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: T.text2 }}>Sign in</a>
          <CTAButton href="#demo" variant="petrol" size="sm">Book a demo</CTAButton>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
const BARS = [18,30,44,26,58,74,40,90,54,98,62,38,76,46,28,20,34,22];
function HeroVisual() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 132, flex: 1, minWidth: 0 }}>
        {BARS.map((h,i) => <div key={i} className="m-wave-bar" style={{ width: 5, borderRadius: 3, background: T.accent, height: h, animationDelay: `${i*0.08}s` }} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <div style={{ width: 34, height: 1, background: 'rgba(255,255,255,.18)' }} />
        <div className="m-flow-dot" style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--mvair-signal)', boxShadow: '0 0 12px rgba(198,242,78,.6)' }} />
        <div style={{ width: 34, height: 1, background: 'rgba(255,255,255,.18)' }} />
      </div>
      <div style={{ flex: 'none', width: 268, background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '22px 22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 7, height: 7, borderRadius: 999, background: T.accent }} />
          <div style={{ textTransform: 'uppercase', letterSpacing: '.15em', fontSize: 11, fontWeight: 600, color: T.accent }}>Appointment booked</div>
        </div>
        <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 30, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1 }}>Tue · 9:30 am</div>
        <div style={{ fontSize: 14, color: T.onDark, marginTop: 6 }}>New patient visit · Dr. Reyes</div>
        <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '18px 0 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 20, height: 20, borderRadius: 999, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Check size={11} color="var(--mvair-on-accent)" strokeWidth={2.6} />
          </div>
          <div style={{ fontSize: 14, color: T.onDark }}>Confirmed and added to the calendar</div>
        </div>
      </div>
    </div>
  );
}
function Hero() {
  return (
    <header style={{ background: T.dark, color: '#fff', overflow: 'hidden' }}>
      <div className="wrap hero-grid" style={{ paddingTop: 104, paddingBottom: 96, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 64, alignItems: 'center' }}>
        <div>
          <Eyebrow tone="accent">AI voice receptionist for medical practices</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 62, lineHeight: 1.04, letterSpacing: '-.025em', margin: '0 0 24px', color: '#fff' }}>
            24/7 booking and triage that sounds <em style={{ fontStyle: 'italic', fontWeight: 500, color: T.accent }}>human</em>.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: T.onDark, margin: '0 0 36px', maxWidth: 480 }}>
            MVAIR answers every call, books the appointment, and flags urgent cases — day or night, without a human at the desk.
          </p>
          <div style={{ display: 'flex', gap: 14, marginBottom: 30 }}>
            <CTAButton href="#demo" variant="aqua" size="lg">Book a demo</CTAButton>
            <CTAButton href="#listen" variant="ghost" size="lg">See it in action</CTAButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 9, height: 9 }}>
              <div className="m-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--mvair-signal)' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--mvair-signal)' }} />
            </div>
            <span style={{ fontSize: 14, color: 'var(--mvair-on-dark-muted)', letterSpacing: '.02em' }}>Live · always answering</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: '38px 34px' }}>
          <HeroVisual />
        </div>
      </div>
    </header>
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    ['01', Phone, 'Answers the call', 'Picks up on the first ring, around the clock, in a calm and natural voice.'],
    ['02', UserPlus, 'Understands the need', "Confirms the caller's name, the reason for their visit, and how urgent it is — then routes accordingly."],
    ['03', CalendarCheck, 'Books or triages', 'Schedules the visit, or escalates the urgent ones to the right person.'],
  ];
  return (
    <section id="how" style={{ padding: '118px 0 110px' }}>
      <div className="wrap">
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 42, lineHeight: 1.1, letterSpacing: '-.02em', margin: 0, color: T.text }}>Every call handled, start to finish.</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div className="m-connector connector" style={{ position: 'absolute', top: 27, left: '16.66%', right: '16.66%', height: 2, zIndex: 0 }} />
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, position: 'relative', zIndex: 1 }}>
            {steps.map(([n, Icon, title, body]) => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginBottom: 26 }}>
                  <div className="m-step-badge" style={{ width: 54, height: 54, borderRadius: 999, background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 21, fontWeight: 600, border: '4px solid var(--mvair-surface)' }}>{n}</div>
                </div>
                <div className="m-card" style={{ width: '100%', background: '#fff', border: `1px solid ${T.cardBorder}`, borderRadius: 18, padding: '30px 28px' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--mvair-chip-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={22} color="var(--mvair-chip-teal-stroke)" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 23, letterSpacing: '-.01em', margin: '0 0 9px', color: T.text }}>{title}</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: T.text2, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Listen (transcript) ---------- */
const TRANSCRIPT = [
  ['aria',"Valley Medical, this is Aria. How can I help you today?"],
  ['patient',"Hi, I'd like to book an appointment. I've been having persistent headaches."],
  ['aria',"I'm sorry to hear that — let's get you seen. Can I get your name and a callback number?"],
  ['patient',"Emma Thompson. 604-555-0505."],
  ['aria',"Thanks Emma. I'm checking Tuesday at 9:30 AM with Dr. Chen…"],
  ['aria',"That slot is open. Shall I book it for you?"],
  ['patient',"Yes please, Tuesday morning works."],
  ['aria',"Done — you're booked Tuesday the 24th at 9:30 AM. You'll get a confirmation. Anything else?"],
  ['patient',"No, that's great. Thank you!"],
];
function Bubble({ role, text }) {
  const isAria = role === 'aria';
  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: isAria ? 'row' : 'row-reverse' }}>
      {isAria && <div style={{ flex: 'none', width: 28, height: 28, borderRadius: 999, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', marginTop: 2 }}>A</div>}
      <div style={{ maxWidth: '78%', padding: '10px 16px', borderRadius: 16, fontSize: 15, lineHeight: 1.55, background: isAria ? '#fff' : T.primary, color: isAria ? T.text : '#fff', border: isAria ? `1px solid ${T.cardBorder}` : 'none', borderTopLeftRadius: isAria ? 4 : 16, borderTopRightRadius: isAria ? 16 : 4 }}>{text}</div>
    </div>
  );
}
function Listen() {
  return (
    <section id="listen" style={{ padding: '110px 0 118px', background: T.page }}>
      <div className="wrap two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <Eyebrow>Hear it in action</Eyebrow>
          <h2 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 42, lineHeight: 1.1, letterSpacing: '-.02em', margin: '0 0 20px', color: T.text }}>A real booking in under 90 seconds.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: T.text2, marginBottom: 32, maxWidth: 440 }}>This is an actual call flow — not a script, not pre-recorded. Aria listens, checks availability on the clinic's calendar, and writes the appointment in real time.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, background: 'rgba(12,26,32,.05)', border: `1px solid ${T.cardBorder}` }}>
            <div style={{ flex: 'none', width: 36, height: 36, borderRadius: 12, background: 'rgb(var(--mvair-primary-rgb)/.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={16} color={T.primary} strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text }}>Hear it on a live call</p>
              <p style={{ margin: 0, fontSize: 13, color: T.text2 }}>Book a 20-minute demo and we'll run the call together.</p>
            </div>
            <a href="#demo" style={{ marginLeft: 'auto', flex: 'none', padding: '6px 14px', borderRadius: 8, background: T.primary, color: '#fff', fontSize: 13, fontWeight: 600 }}>Book demo</a>
          </div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${T.cardBorder}`, borderRadius: 24, boxShadow: '0 1px 2px rgba(14,27,35,.04)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.cardBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#FF5F57' }} />
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#FEBC2E' }} />
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#28C840' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--mvair-text-muted)', fontWeight: 500 }}>Inbound call · +1 (856) 440-2211</div>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 380, overflowY: 'auto' }}>
            {TRANSCRIPT.map((t,i) => <Bubble key={i} role={t[0]} text={t[1]} />)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, padding: '10px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12 }}>
              <Check size={16} color="#16A34A" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#15803D' }}>Appointment booked · Google Calendar updated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
const FBARS = [40,72,100,58,84,34,50];
function FeatureCard({ Icon, chip, title, body }) {
  const chipBg = chip === 'danger' ? 'var(--mvair-chip-danger-bg)' : 'var(--mvair-chip-teal-bg)';
  const chipStroke = chip === 'danger' ? 'var(--mvair-danger)' : 'var(--mvair-chip-teal-stroke)';
  return (
    <div className="m-card" style={{ background: '#fff', border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: '36px 32px' }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
        <Icon size={23} color={chipStroke} strokeWidth={1.8} />
      </div>
      <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 23, letterSpacing: '-.01em', margin: '0 0 11px', color: T.text }}>{title}</h3>
      <p style={{ fontSize: 15.5, lineHeight: 1.62, color: T.text2, margin: 0 }}>{body}</p>
    </div>
  );
}
function Features() {
  return (
    <section id="product" style={{ paddingBottom: 118 }}>
      <div className="wrap">
        <div style={{ maxWidth: 620, marginBottom: 60 }}>
          <Eyebrow>What it does</Eyebrow>
          <h2 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 42, lineHeight: 1.1, letterSpacing: '-.02em', margin: 0, color: T.text }}>Built for the realities of a front desk.</h2>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 24 }}>
          <div className="m-dark-tile span2" style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden', background: T.dark, border: '1px solid var(--mvair-dark-border)', borderRadius: 20, padding: '42px 40px' }}>
            <div className="m-glow" style={{ position: 'absolute', right: -40, top: -30, width: 240, height: 240, borderRadius: 999, pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48, marginBottom: 24 }}>
                {FBARS.map((h,i) => <div key={i} style={{ width: 5, borderRadius: 3, background: i === 4 ? 'var(--mvair-accent-hover)' : T.accent, height: `${h}%` }} />)}
              </div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 30, letterSpacing: '-.015em', margin: '0 0 12px', color: '#fff', maxWidth: 460 }}>A voice that sounds <span style={{ fontStyle: 'italic', color: T.accent }}>human</span></h3>
              <p style={{ fontSize: 16.5, lineHeight: 1.65, color: T.onDark, margin: 0, maxWidth: 440 }}>Natural pacing, real listening, and no robotic menus. Patients talk the way they would to your front desk — and never feel handed off to a machine.</p>
            </div>
          </div>
          <FeatureCard Icon={CalendarCheck} chip="teal" title="Appointment booking" body="Finds the right slot, confirms the details, and writes it back to your schedule — no callback required." />
          <FeatureCard Icon={AlertTriangle} chip="danger" title="Emergency detection" body="Recognizes urgent language and escalates the call to your team's protocol — quickly and correctly." />
          <div className="m-card span2" style={{ gridColumn: 'span 2', background: '#fff', border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 36, display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ flex: 'none', width: 46, height: 46, borderRadius: 13, background: 'var(--mvair-chip-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MonitorSmartphone size={23} color="var(--mvair-chip-teal-stroke)" strokeWidth={1.8} />
            </div>
            <div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 23, letterSpacing: '-.01em', margin: '0 0 9px', color: T.text }}>Every call, documented</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.62, color: T.text2, margin: 0, maxWidth: 520 }}>Session transcript, patient details, and booking status logged automatically — no manual entry, no gaps, no calls lost to voicemail.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reassurance ---------- */
function Reassurance() {
  const items = [
    ['Always on', 'Answers nights, weekends, and overflow — so no call ever goes to voicemail.'],
    ['HIPAA pathway', 'A signed Business Associate Agreement is required before any live patient traffic. We are transparent about that gate and prepared to move through it with you.'],
    ['Your protocols', 'Follows the booking rules, emergency escalation paths, and business hours your practice already uses.'],
  ];
  return (
    <section id="security" style={{ paddingBottom: 120 }}>
      <div className="wrap">
        <div className="m-panel" style={{ background: '#fff', border: `1px solid ${T.cardBorder}`, borderRadius: 24, padding: '72px 64px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <Eyebrow>Reliability &amp; privacy</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 38, lineHeight: 1.14, letterSpacing: '-.02em', margin: '0 0 18px', color: T.text }}>Designed for clinical workflows, with patient privacy in mind.</h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: T.text2, margin: 0 }}>MVAIR is built to be dependable when your practice is closed and busy when it's open — with careful handling of the conversations it has on your behalf.</p>
          </div>
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 56, paddingTop: 48, borderTop: '1px solid var(--mvair-hairline)' }}>
            {items.map(([title, body]) => (
              <div key={title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <span style={{ flex: 'none', width: 24, height: 24, borderRadius: 999, background: 'var(--mvair-chip-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} color="var(--mvair-chip-teal-stroke)" strokeWidth={2.6} />
                  </span>
                  <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 19, margin: 0, color: T.text }}>{title}</h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: T.text2, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing CTA + Footer ---------- */
function ClosingCTA() {
  return (
    <section id="demo" style={{ background: T.dark, color: '#fff' }}>
      <div className="wrap" style={{ paddingTop: 104, paddingBottom: 100, textAlign: 'center' }}>
        <h2 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 50, lineHeight: 1.06, letterSpacing: '-.025em', margin: '0 auto 20px', color: '#fff', maxWidth: 620 }}>Bring MVAIR to your front desk.</h2>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: T.onDark, margin: '0 auto 36px', maxWidth: 480 }}>Book a 20-minute demo. We'll run a live call together — you'll see it answer, book, and document in real time.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
          <CTAButton href="#book" variant="aqua" size="lg">Book a demo</CTAButton>
          <CTAButton href="#" variant="ghost" size="lg">Send us a message</CTAButton>
        </div>
        <p style={{ fontSize: 13, color: 'var(--mvair-on-dark-dim)' }}>No commitment. 20 minutes. We'll call the line live with you.</p>
      </div>
    </section>
  );
}
function Footer() {
  const cols = [
    ['Product', [['#product','What it does'],['#how','How it works'],['#listen','See it in action']]],
    ['Company', [['#security','Privacy & reliability'],['#demo','Book a demo'],['#','Contact']]],
  ];
  return (
    <footer style={{ background: T.dark, color: '#fff', borderTop: '1px solid rgba(255,255,255,.08)' }}>
      <div className="wrap footer-grid" style={{ paddingTop: 64, paddingBottom: 56, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <MvairLogo tone="aqua" size={28} />
          <div style={{ textTransform: 'uppercase', letterSpacing: '.18em', fontSize: 11, fontWeight: 600, color: 'var(--mvair-on-dark-dim)', marginTop: 16 }}>Medical voice AI receptionist</div>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mvair-on-dark-muted)', marginBottom: 16 }}>{title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {links.map(([h,l]) => <a key={l} href={h} style={{ fontSize: 15, color: '#C9D6DA' }}>{l}</a>)}
            </div>
          </div>
        ))}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mvair-on-dark-muted)', marginBottom: 16 }}>Get started</div>
          <CTAButton href="#book" variant="aqua" size="sm">Book a demo</CTAButton>
        </div>
      </div>
      <div className="wrap" style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: 'var(--mvair-on-dark-dim)', maxWidth: 560, lineHeight: 1.6 }}>MVAIR is built with patient privacy in mind and is not a substitute for emergency care. If this is a medical emergency, call your local emergency number.</div>
          <div style={{ fontSize: 13, color: 'var(--mvair-on-dark-dim)' }}>© 2026 MVAIR</div>
        </div>
      </div>
    </footer>
  );
}

window.MvairLanding = function MvairLanding() {
  return (
    <div style={{ fontFamily: T.sans, color: T.text, background: T.page }}>
      <Nav /><Hero /><HowItWorks /><Listen /><Features /><Reassurance /><ClosingCTA /><Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<window.MvairLanding />);
