Health/status dot, optionally pulsing, with an optional text label.

```jsx
import { StatusDot } from './StatusDot';

<StatusDot status="online" label="Operational" />
<StatusDot status="offline" label="Down" />
<StatusDot status="live" label="Live · always answering" />
```

`live` is the only place the chartreuse signal color appears — reserve it for the "always answering" pulse. online & live pulse by default.
