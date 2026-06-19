import { MvairMark } from '../components/MvairMark';
import { CTAButton } from '../components/CTAButton';

const product = [
  { href: '#product', label: 'What it does' },
  { href: '#how', label: 'How it works' },
  { href: '#listen', label: 'See it in action' },
];
const company = [
  { href: '#security', label: 'Privacy & reliability' },
  { href: '#demo', label: 'Book a demo' },
  { href: 'mailto:hello@medvoice.ai', label: 'Contact' },
];

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-on-dark-muted mb-4">{title}</div>
      <div className="flex flex-col gap-[11px]">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="no-underline text-[15px] text-[#C9D6DA] hover:text-accent transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-sidebar text-white border-t border-white/[0.08]">
      <div className="max-w-[1180px] mx-auto px-10 pt-16 pb-14 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-[11px] mb-4">
            <MvairMark tone="aqua" size={28} />
            <span className="font-display text-[21px] font-semibold text-white">MVAIR</span>
          </div>
          <div className="uppercase tracking-[0.18em] text-[11px] font-semibold text-on-dark-dim">
            Medical voice AI receptionist
          </div>
        </div>
        <FooterCol title="Product" links={product} />
        <FooterCol title="Company" links={company} />
        <div>
          <div className="text-[13px] font-semibold text-on-dark-muted mb-4">Get started</div>
          <CTAButton href="#book" variant="aqua" size="sm">
            Book a demo
          </CTAButton>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-10 pt-6 pb-12">
        <div className="border-t border-white/[0.08] pt-6 flex justify-between gap-6 flex-wrap">
          <div className="text-[13px] text-on-dark-dim max-w-[560px] leading-[1.6]">
            MVAIR is built with patient privacy in mind and is not a substitute for emergency care.
            If this is a medical emergency, call your local emergency number.
          </div>
          <div className="text-[13px] text-on-dark-dim">© 2026 MVAIR</div>
        </div>
      </div>
    </footer>
  );
}
