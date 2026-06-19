import { MvairMark } from '../components/MvairMark';
import { CTAButton } from '../components/CTAButton';

const links = [
  { href: '#product', label: 'Product' },
  { href: '#how', label: 'How it works' },
  { href: '#listen', label: 'Hear it' },
  { href: '#security', label: 'Security' },
];

export function Nav() {
  return (
    <nav className="m-nav sticky top-0 z-20 border-b border-hairline">
      <div className="max-w-[1180px] mx-auto px-10 h-[74px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MvairMark tone="petrol" size={30} />
          <span className="font-display text-[23px] font-semibold tracking-[-0.01em] text-text-primary">
            MVAIR
          </span>
        </div>
        <div className="flex items-center gap-[38px]">
          <div className="hidden md:flex items-center gap-[30px]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="no-underline text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="/login"
            className="text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors no-underline"
          >
            Sign in
          </a>
          <CTAButton href="#demo" variant="petrol" size="sm">
            Book a demo
          </CTAButton>
        </div>
      </div>
    </nav>
  );
}
