import { CalendarCheck, AlertTriangle, MonitorSmartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const FEATURE_BARS = [40, 72, 100, 58, 84, 34, 50]; // index 4 is the lighter aqua bar

function FeatureCard({
  Icon,
  chip,
  title,
  body,
}: {
  Icon: LucideIcon;
  chip: 'teal' | 'danger';
  title: string;
  body: string;
}) {
  const chipBg = chip === 'danger' ? 'bg-chip-danger-bg' : 'bg-chip-teal-bg';
  const chipStroke = chip === 'danger' ? 'text-danger' : 'text-chip-teal-stroke';
  return (
    <div className="m-card bg-white border border-card-border rounded-[20px] px-8 py-9">
      <div className={`w-[46px] h-[46px] rounded-[13px] ${chipBg} flex items-center justify-center mb-[22px]`}>
        <Icon className={`w-[23px] h-[23px] ${chipStroke}`} strokeWidth={1.8} />
      </div>
      <h3 className="font-display font-semibold text-[23px] tracking-[-0.01em] m-0 mb-[11px] text-text-primary">
        {title}
      </h3>
      <p className="text-[15.5px] leading-[1.62] text-text-secondary m-0">{body}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="product" className="pb-[118px]">
      <div className="max-w-[1180px] mx-auto px-10">
        <div className="max-w-[620px] mb-[60px]">
          <div className="uppercase tracking-[0.16em] text-[13px] font-semibold text-primary mb-[18px]">
            What it does
          </div>
          <h2 className="font-display font-semibold text-[42px] leading-[1.1] tracking-[-0.02em] m-0 text-text-primary text-balance">
            Built for the realities of a front desk.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6">
          {/* Featured · dark · spans 2 */}
          <div className="m-dark-tile md:col-span-2 relative overflow-hidden bg-sidebar border border-dark-border rounded-[20px] px-10 py-[42px]">
            <div className="m-glow absolute -right-10 -top-[30px] w-[240px] h-[240px] rounded-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-end gap-1 h-12 mb-6">
                {FEATURE_BARS.map((h, i) => (
                  <div
                    key={i}
                    className={`w-[5px] rounded-[3px] ${i === 4 ? 'bg-accent-hover' : 'bg-accent'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <h3 className="font-display font-semibold text-[30px] tracking-[-0.015em] m-0 mb-3 text-white max-w-[460px]">
                A voice that sounds <span className="italic text-accent">human</span>
              </h3>
              <p className="text-[16.5px] leading-[1.65] text-on-dark m-0 max-w-[440px]">
                Natural pacing, real listening, and no robotic menus. Patients talk the way they
                would to your front desk — and never feel handed off to a machine.
              </p>
            </div>
          </div>

          <FeatureCard
            Icon={CalendarCheck}
            chip="teal"
            title="Appointment booking"
            body="Finds the right slot, confirms the details, and writes it back to your schedule — no callback required."
          />

          <FeatureCard
            Icon={AlertTriangle}
            chip="danger"
            title="Emergency detection"
            body="Recognizes urgent language and escalates the call to your team's protocol — quickly and correctly."
          />

          {/* Phone + web · spans 2 · horizontal */}
          <div className="m-card md:col-span-2 bg-white border border-card-border rounded-[20px] p-9 flex items-center gap-[30px]">
            <div className="flex-none w-[46px] h-[46px] rounded-[13px] bg-chip-teal-bg flex items-center justify-center">
              <MonitorSmartphone className="w-[23px] h-[23px] text-chip-teal-stroke" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[23px] tracking-[-0.01em] m-0 mb-[9px] text-text-primary">
                Phone and web, one system
              </h3>
              <p className="text-[15.5px] leading-[1.62] text-text-secondary m-0 max-w-[520px]">
                The same receptionist answers your phone line and your website, with a single view
                of every conversation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
