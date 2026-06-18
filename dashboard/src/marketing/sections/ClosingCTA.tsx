import { CTAButton } from '../components/CTAButton';

export function ClosingCTA() {
  return (
    <section id="demo" className="bg-sidebar text-white">
      <div className="max-w-[1180px] mx-auto px-10 pt-[104px] pb-[100px] text-center">
        <h2 className="font-display font-semibold text-[50px] leading-[1.06] tracking-[-0.025em] mx-auto mb-5 text-white max-w-[620px] text-balance">
          Bring MVAIR to your front desk.
        </h2>
        <p className="text-[19px] leading-[1.6] text-on-dark mx-auto mb-9 max-w-[480px]">
          See how it answers, books, and triages a real call — in a 20-minute demo.
        </p>
        <div className="flex items-center justify-center gap-3.5">
          <CTAButton href="#book" variant="aqua" size="lg">
            Book a demo
          </CTAButton>
          <CTAButton href="#listen" variant="ghost" size="lg">
            Hear it in action
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
