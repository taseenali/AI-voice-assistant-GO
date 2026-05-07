# SKILL: Twilio Voice Integration
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-013"
SKILL_NAME        = "Twilio Programmable Voice — Inbound Handler"
SKILL_CATEGORY    = "integrations"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-05-01"
SKILL_LAST_USED   = "2026-05-01"
APPLIES_TO_PASS   = "7 onwards"
RELEVANT_FILES    = "server/routes/voice.js"
```

---

## THE PATTERN

### 1. Webhook Security
Always validate the `X-Twilio-Signature` using the Twilio SDK.

```javascript
import twilio from 'twilio';

const validateTwilio = (req, res, next) => {
  const signature = req.headers['x-twilio-signature'];
  const url = process.env.PUBLIC_URL + req.originalUrl;
  const valid = twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, req.body);
  if (!valid) return res.status(403).send('Invalid Signature');
  next();
};
```

### 2. ConversationRelay (Voice 2026)
Use `<Connect>` with `<ConversationRelay>` for real-time AI audio streaming.

```javascript
import { VoiceResponse } from 'twilio';

const response = new VoiceResponse();
const connect = response.connect();
connect.conversationRelay({
  url: `wss://${process.env.DOMAIN}/voice`,
  dtmfDetection: true
});
```

---

## THE RULE

1. **Signature Validation**: All inbound webhooks MUST be validated.
2. **HTTPS Only**: Endpoints must use CA-signed HTTPS certificates.
3. **Environment Secrets**: Manage `Account SID` and `Auth Token` via environment variables.

---

## DO NOT

- **DO NOT** process unauthenticated voice requests (SEC-01).
- **DO NOT** block the event loop with synchronous TwiML generation.
- **DO NOT** hardcode public URLs in signature validation (use `process.env.PUBLIC_URL`).
