Primary action button — petrol fill by default; use sparingly, one per view.

```jsx
import { Button } from './Button';
import { Phone, ArrowRight } from 'lucide-react';

<Button>Save changes</Button>
<Button variant="aqua" size="lg">Book a demo</Button>
<Button variant="outline" icon={Phone}>Call line</Button>
<Button variant="ghost" icon={ArrowRight} iconRight>See more</Button>
```

Variants: `primary` (petrol, default app action) · `aqua` (marketing CTA, dark backgrounds) · `secondary` (white w/ border) · `outline` (petrol border) · `ghost`.
Sizes: `sm` · `md` (default) · `lg` (marketing). Hover darkens the fill; disabled drops opacity to 0.55.
