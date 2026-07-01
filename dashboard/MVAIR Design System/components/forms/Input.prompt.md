Labeled text field with the petrol focus ring used across login & config forms.

```jsx
import { Input } from './Input';

<Input label="Email" type="email" placeholder="you@yourclinic.com" />
<Input label="Password" type="password" error="Incorrect password" />
```

Focus shows a 3px ring (petrol at 30%, red on error). Pass `error` for the danger state, `hint` for helper text. Any native input attribute passes through.
