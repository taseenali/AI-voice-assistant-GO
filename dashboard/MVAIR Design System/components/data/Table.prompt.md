Card-wrapped data table with uppercase headers and hover rows. Compose cells with `render` (drop in Badge / ChannelBadge).

```jsx
import { Table } from './Table';
import { Badge } from '../core/Badge';

<Table
  columns={[
    { key: 'caller', header: 'Caller' },
    { key: 'intent', header: 'Intent', render: (r) => <Badge label={r.intent} intent={r.intent} /> },
    { key: 'id', header: 'Session ID', className: 'mono' },
  ]}
  data={rows}
  keyExtractor={(r) => r.id}
  onRowClick={(r) => openSession(r)}
/>
```

Empty data renders `emptyMessage` inside the same card shell.
