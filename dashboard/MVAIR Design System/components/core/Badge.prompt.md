Soft-tint pill — a 15% color wash behind full-strength text. Two color modes.

```jsx
import { Badge } from './Badge';

<Badge label="Captured" variant="success" />
<Badge label="Yes" variant="danger" />
<Badge label="dental" intent="dental" />
```

`variant` for status (default/success/warning/danger/neutral); `intent` for session categories (general/dental/followup/urgent/inquiry/unknown) — intent wins if both are set. Keep labels to 1–2 words.
