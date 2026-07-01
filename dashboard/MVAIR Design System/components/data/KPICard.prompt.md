Big-number metric tile for the dashboard overview. Use in a 4-up grid.

```jsx
import { KPICard } from './KPICard';
import { Phone, UserCheck, AlertTriangle } from 'lucide-react';

<KPICard title="Total Calls Today" value={128} subtitle="92 phone · 36 web" icon={Phone} />
<KPICard title="Emergencies" value={2} subtitle="Requiring escalation" icon={AlertTriangle} variant="danger" />
```

Variant colors only the icon and reads as the tile's "health." Value can be a string ("4m 12s") or number.
