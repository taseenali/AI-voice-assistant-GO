import { Phone, UserPlus, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  n: string;
  Icon: LucideIcon;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    n: '01',
    Icon: Phone,
    title: 'Answers the call',
    body: 'Picks up on the first ring, around the clock, in a calm and natural voice.',
  },
  {
    n: '02',
    Icon: UserPlus,
    title: 'Captures the patient',
    body: "Confirms who's calling, why they're calling, and how urgent it is.",
  },
  {
    n: '03',
    Icon: CalendarCheck,
    title: 'Books or triages',
    body: 'Schedules the visit, or escalates the urgent ones to the right person.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="pt-[118px] pb-[110px]">
      <div className="max-w-[1180px] mx-auto px-10">
        <div className="max-w-[620px] mb-16">
          <div className="uppercase tracking-[0.16em] text-[13px] font-semibold text-primary mb-[18px]">
            How it works
          </div>
          <h2 className="font-display font-semibold text-[42px] leading-[1.1] tracking-[-0.02em] m-0 text-text-primary text-balance">
            Every call handled, start to finish.
          </h2>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="m-connector hidden md:block absolute top-[27px] left-[16.66%] right-[16.66%] h-0.5 z-0"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] relative z-[1]">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-start">
                <div className="flex w-full justify-center mb-[26px]">
                  <div className="m-step-badge w-[54px] h-[54px] rounded-full bg-primary text-white flex items-center justify-center font-display text-[21px] font-semibold border-4 border-page">
                    {s.n}
                  </div>
                </div>
                <div className="m-card w-full bg-white border border-card-border rounded-[18px] px-7 py-[30px]">
                  <div className="w-[42px] h-[42px] rounded-[12px] bg-chip-teal-bg flex items-center justify-center mb-5">
                    <s.Icon className="w-[22px] h-[22px] text-chip-teal-stroke" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display font-semibold text-[23px] tracking-[-0.01em] m-0 mb-[9px] text-text-primary">
                    {s.title}
                  </h3>
                  <p className="text-[16px] leading-[1.6] text-text-secondary m-0">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
