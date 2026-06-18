import { CTAButton } from '../components/CTAButton';
import { HeroVisual } from '../components/HeroVisual';

interface HeroProps {
  variant: 'split' | 'centered';
  showLivePulse: boolean;
}

function LivePulse() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-[9px] h-[9px]">
        <div className="m-pulse-ring absolute inset-0 rounded-full bg-signal" />
        <div className="absolute inset-0 rounded-full bg-signal" />
      </div>
      <span className="text-[14px] text-on-dark-muted tracking-[0.02em]">
        Live · always answering
      </span>
    </div>
  );
}

function Eyebrow() {
  return (
    <div className="uppercase tracking-[0.16em] text-[13px] font-semibold text-accent mb-[26px]">
      AI voice receptionist for medical practices
    </div>
  );
}

function Buttons({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 ${centered ? 'justify-center mb-6' : 'mb-[30px]'}`}>
      <CTAButton href="#demo" variant="aqua" size="lg">
        Book a demo
      </CTAButton>
      <CTAButton href="#listen" variant="ghost" size="lg">
        Hear it in action
      </CTAButton>
    </div>
  );
}

const HEADLINE = (
  <>
    24/7 booking and triage that sounds{' '}
    <em className="font-medium text-accent">human</em>.
  </>
);

const SUBCOPY = 'MVAIR answers every call, books appointments, and flags urgent cases — day or night.';

export function Hero({ variant, showLivePulse }: HeroProps) {
  if (variant === 'centered') {
    return (
      <header className="bg-sidebar text-white overflow-hidden">
        <div className="max-w-[920px] mx-auto px-10 pt-[100px] text-center">
          <Eyebrow />
          <h1 className="font-display font-semibold text-[68px] leading-[1.03] tracking-[-0.025em] m-0 mb-6 text-white text-balance">
            {HEADLINE}
          </h1>
          <p className="text-[19px] leading-[1.6] text-on-dark mx-auto mb-9 max-w-[560px]">
            {SUBCOPY}
          </p>
          <Buttons centered />
          {showLivePulse && (
            <div className="inline-flex">
              <LivePulse />
            </div>
          )}
        </div>
        <div className="max-w-[780px] mx-auto mt-[60px] px-10">
          <div className="bg-white/[0.02] border border-white/[0.08] border-b-0 rounded-t-[22px] pt-10 px-10 pb-11">
            <HeroVisual />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-sidebar text-white overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-10 pt-[104px] pb-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div>
          <Eyebrow />
          <h1 className="font-display font-semibold text-[62px] leading-[1.04] tracking-[-0.025em] m-0 mb-6 text-white text-balance">
            {HEADLINE}
          </h1>
          <p className="text-[19px] leading-[1.6] text-on-dark mb-9 max-w-[480px]">{SUBCOPY}</p>
          <Buttons />
          {showLivePulse && <LivePulse />}
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[22px] py-[38px] px-[34px]">
          <HeroVisual />
        </div>
      </div>
    </header>
  );
}
