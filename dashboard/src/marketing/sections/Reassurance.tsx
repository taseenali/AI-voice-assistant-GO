import { Check } from 'lucide-react';

const items = [
  { title: 'Always on', body: 'Answers nights, weekends, and overflow so no call goes to voicemail.' },
  {
    title: 'Privacy-minded',
    body: 'Built with patient privacy in mind and clear records of every interaction.',
  },
  {
    title: 'Your protocols',
    body: 'Follows the booking rules and escalation paths your practice already uses.',
  },
];

export function Reassurance() {
  return (
    <section id="security" className="pb-[120px]">
      <div className="max-w-[1180px] mx-auto px-10">
        <div className="m-panel bg-white border border-card-border rounded-[24px] px-16 py-[72px]">
          <div className="max-w-[680px] mx-auto text-center">
            <div className="uppercase tracking-[0.16em] text-[13px] font-semibold text-primary mb-5">
              Reliability &amp; privacy
            </div>
            <h2 className="font-display font-semibold text-[38px] leading-[1.14] tracking-[-0.02em] m-0 mb-[18px] text-text-primary text-balance">
              Designed for clinical workflows, with patient privacy in mind.
            </h2>
            <p className="text-[18px] leading-[1.65] text-text-secondary m-0">
              MVAIR is built to be dependable when your practice is closed and busy when it's open —
              with careful handling of the conversations it has on your behalf.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 pt-12 border-t border-hairline">
            {items.map((it) => (
              <div key={it.title}>
                <div className="flex items-center gap-2.5 mb-[9px]">
                  <span className="flex-none w-6 h-6 rounded-full bg-chip-teal-bg flex items-center justify-center">
                    <Check className="w-[13px] h-[13px] text-chip-teal-stroke" strokeWidth={2.6} />
                  </span>
                  <h3 className="font-display font-semibold text-[19px] m-0 text-text-primary">
                    {it.title}
                  </h3>
                </div>
                <p className="text-[15px] leading-[1.6] text-text-secondary m-0">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
