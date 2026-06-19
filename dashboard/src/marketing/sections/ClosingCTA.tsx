import { CTAButton } from '../components/CTAButton';

export function ClosingCTA() {
  return (
    <section id="demo" className="bg-sidebar text-white">
      <div className="max-w-[1180px] mx-auto px-10 pt-[104px] pb-[100px] text-center">
        <h2 className="font-display font-semibold text-[50px] leading-[1.06] tracking-[-0.025em] mx-auto mb-5 text-white max-w-[620px] text-balance">
          Bring MVAIR to your front desk.
        </h2>
        <p className="text-[19px] leading-[1.6] text-on-dark mx-auto mb-9 max-w-[480px]">
          Book a 20-minute demo. We'll run a live call together — you'll see it answer, book, and
          document in real time.
        </p>
        <div className="flex items-center justify-center gap-3.5 mb-8">
          <CTAButton href="#book" variant="aqua" size="lg">
            Book a demo
          </CTAButton>
          <CTAButton href="mailto:hello@medvoice.ai" variant="ghost" size="lg">
            Send us a message
          </CTAButton>
        </div>
        <p className="text-[13px] text-on-dark-dim">
          No commitment. 20 minutes. We'll call the line live with you.
        </p>
      </div>
    </section>
  );
}
