Zero-data placeholder — large tinted icon, title, copy, optional action button.

```jsx
import { EmptyState } from './EmptyState';
import { Calendar } from 'lucide-react';

<EmptyState
  icon={Calendar}
  title="No session data available"
  description="Sessions appear here from inbound phone calls and the browser voice widget."
  action={{ label: 'Refresh', onClick: reload }}
/>
```

Icon color follows `variant` (info/warning/success).
