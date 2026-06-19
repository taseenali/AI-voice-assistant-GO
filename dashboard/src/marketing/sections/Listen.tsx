const TRANSCRIPT = [
  { role: 'aria',    text: "Valley Medical, this is Aria. How can I help you today?" },
  { role: 'patient', text: "Hi, I'd like to book an appointment. I've been having persistent headaches." },
  { role: 'aria',    text: "I'm sorry to hear that — let's get you seen. Can I get your name and a callback number?" },
  { role: 'patient', text: "Emma Thompson. 604-555-0505." },
  { role: 'aria',    text: "Thanks Emma. I'm checking Tuesday at 9:30 AM with Dr. Chen…" },
  { role: 'aria',    text: "That slot is open. Shall I book it for you?" },
  { role: 'patient', text: "Yes please, Tuesday morning works." },
  { role: 'aria',    text: "Done — you're booked Tuesday the 24th at 9:30 AM for a headache evaluation. You'll get a confirmation. Is there anything else?" },
  { role: 'patient', text: "No, that's great. Thank you!" },
];

function Bubble({ role, text }: { role: 'aria' | 'patient'; text: string }) {
  const isAria = role === 'aria';
  return (
    <div className={`flex gap-3 ${isAria ? '' : 'flex-row-reverse'}`}>
      {isAria && (
        <div className="flex-none w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
          A
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[15px] leading-[1.55] ${
          isAria
            ? 'bg-white border border-card-border text-text-primary rounded-tl-sm'
            : 'bg-primary text-white rounded-tr-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export function Listen() {
  return (
    <section id="listen" className="pt-[110px] pb-[118px] bg-page">
      <div className="max-w-[1180px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="uppercase tracking-[0.16em] text-[13px] font-semibold text-primary mb-[18px]">
              Hear it in action
            </div>
            <h2 className="font-display font-semibold text-[42px] leading-[1.1] tracking-[-0.02em] m-0 mb-5 text-text-primary text-balance">
              A real booking in under 90 seconds.
            </h2>
            <p className="text-[17px] leading-[1.65] text-text-secondary mb-8 max-w-[440px]">
              This is an actual call flow — not a script, not pre-recorded. Aria listens, checks
              availability on the clinic's calendar, and writes the appointment in real time.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-sidebar/5 border border-card-border">
              <div className="flex-none w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Hear it on a live call</p>
                <p className="text-[13px] text-text-secondary">Book a 20-minute demo and we'll run the call together.</p>
              </div>
              <a
                href="#demo"
                className="ml-auto flex-none px-3.5 py-1.5 rounded-lg bg-primary text-white text-[13px] font-semibold no-underline hover:bg-primary-dark transition-colors"
              >
                Book demo
              </a>
            </div>
          </div>

          {/* Right — transcript mockup */}
          <div className="bg-white border border-card-border rounded-[24px] shadow-sm overflow-hidden">
            {/* Phone chrome */}
            <div className="px-5 py-3 border-b border-card-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center text-[12px] text-text-muted font-medium">
                Inbound call · +1 (856) 440-2211
              </div>
            </div>
            {/* Transcript */}
            <div className="px-5 py-5 flex flex-col gap-3 max-h-[380px] overflow-y-auto">
              {TRANSCRIPT.map((t, i) => (
                <Bubble key={i} role={t.role as 'aria' | 'patient'} text={t.text} />
              ))}
              {/* Booking confirmation badge */}
              <div className="flex items-center justify-center gap-2 mt-2 py-2.5 px-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                <svg className="w-4 h-4 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-[13px] font-semibold text-[#15803D]">
                  Appointment booked · Google Calendar updated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
