# Marketing UI kit — MVAIR landing page

Faithful recreation of `src/marketing/**`. Open `index.html`.

- `index.html` — loads React, Babel, lucide (CDN), the DS bundle, and `Landing.jsx`.
- `Landing.jsx` — all sections: Nav · Hero (split) · How it works · Listen (transcript) ·
  Features (bento) · Reassurance · Closing CTA · Footer.

Composes DS components `MvairLogo`, `MvairMark`, `CTAButton`; everything else is inline layout
using the design tokens. The animated waveform, pulse dot, and flow dot honor
`prefers-reduced-motion`.
