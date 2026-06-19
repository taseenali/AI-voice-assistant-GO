import './marketing.css';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { HowItWorks } from './sections/HowItWorks';
import { Listen } from './sections/Listen';
import { Features } from './sections/Features';
import { Reassurance } from './sections/Reassurance';
import { ClosingCTA } from './sections/ClosingCTA';
import { Footer } from './sections/Footer';

interface LandingProps {
  /** Hero layout direction (default 'split'). */
  heroVariant?: 'split' | 'centered';
  /** Show the chartreuse "Live · always answering" pulse (default true). */
  showLivePulse?: boolean;
}

export function Landing({ heroVariant = 'split', showLivePulse = true }: LandingProps) {
  return (
    <div className="font-sans text-text-primary bg-page antialiased">
      <Nav />
      <Hero variant={heroVariant} showLivePulse={showLivePulse} />
      <HowItWorks />
      <Listen />
      <Features />
      <Reassurance />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
