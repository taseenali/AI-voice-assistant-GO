import { Check } from 'lucide-react';

const BAR_HEIGHTS = [
  18, 30, 44, 26, 58, 74, 40, 90, 54, 98, 62, 38, 76, 46, 28, 20, 34, 22,
];

/** Animated hero waveform → flow dot → "appointment booked" confirmation card. */
export function HeroVisual() {
  return (
    <div className="flex items-center gap-7 w-full">
      {/* Waveform */}
      <div className="flex items-center gap-[5px] h-[132px] flex-1 min-w-0">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="m-wave-bar w-[5px] rounded-[3px] bg-accent"
            style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      {/* Flow connector */}
      <div className="flex items-center gap-2 flex-none">
        <div className="w-[34px] h-px bg-white/[0.18]" />
        <div
          className="m-flow-dot w-[9px] h-[9px] rounded-full bg-signal"
          style={{ boxShadow: '0 0 12px rgba(198,242,78,0.6)' }}
        />
        <div className="w-[34px] h-px bg-white/[0.18]" />
      </div>

      {/* Booking confirmation card */}
      <div className="flex-none w-[268px] bg-white/[0.045] border border-white/[0.12] rounded-[16px] pt-[22px] px-[22px] pb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[7px] h-[7px] rounded-full bg-accent" />
          <div className="uppercase tracking-[0.15em] text-[11px] font-semibold text-accent">
            Appointment booked
          </div>
        </div>
        <div className="font-display font-medium text-[30px] text-white tracking-[-0.02em] leading-[1.1]">
          Tue · 9:30 am
        </div>
        <div className="text-[14px] text-on-dark mt-1.5">New patient visit · Dr. Reyes</div>
        <div className="h-px bg-white/10 mt-[18px] mb-[14px]" />
        <div className="flex items-center gap-[9px]">
          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-none">
            <Check className="w-[11px] h-[11px] text-on-accent" strokeWidth={2.2} />
          </div>
          <div className="text-[14px] text-on-dark">Confirmed and added to the calendar</div>
        </div>
      </div>
    </div>
  );
}
