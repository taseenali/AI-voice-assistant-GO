Centered dialog over a dark scrim. Locks to three widths.

```jsx
import { Modal } from './Modal';

<Modal isOpen={open} onClose={() => setOpen(false)} title="Edit configuration" size="lg">
  …form…
</Modal>
```

Returns null when `isOpen` is false. Scrim is petrol-black at 50%.
