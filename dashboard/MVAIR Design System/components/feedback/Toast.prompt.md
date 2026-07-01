Transient notification — left accent bar in the status color, slides in from the right. Stack in a fixed bottom-right container.

```jsx
import { Toast } from './Toast';

<Toast type="success" message="Configuration saved." onClose={dismiss} />
<Toast type="error" message="Could not reach the server." onClose={dismiss} />
```

Types: success · error · warning · info (default).
