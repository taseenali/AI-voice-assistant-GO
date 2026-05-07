# SKILL: Google Calendar API Integration
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-012"
SKILL_NAME        = "Google Calendar Integration — Real-time Booking"
SKILL_CATEGORY    = "integrations"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-05-01"
SKILL_LAST_USED   = "2026-05-01"
APPLIES_TO_PASS   = "7 onwards"
RELEVANT_FILES    = "server/routes/calendar.js, js/services/calendar-adapter.js"
```

---

## THE PATTERN

### 1. Authentication (Service Account)
Use Google Service Accounts for B2B clinic integrations. The clinic admin shares their calendar with the service account email.

```javascript
const auth = new google.auth.JWT(
  process.env.G_CLIENT_EMAIL,
  null,
  process.env.G_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/calendar']
);
```

### 2. Availability Check (FreeBusy)
Always check availability before inserting to prevent double-bookings.

```javascript
const check = await calendar.freebusy.query({
  requestBody: {
    timeMin: startTime, // ISO UTC
    timeMax: endTime,   // ISO UTC
    items: [{ id: calendarId }]
  }
});
const isBusy = check.data.calendars[calendarId].busy.length > 0;
```

### 3. Event Creation (Insert)
```javascript
const event = {
  summary: `MedVoice: ${patientName}`,
  description: `Lead ID: ${leadId}\nReason: ${reason}`,
  start: { dateTime: startTime },
  end: { dateTime: endTime },
  reminders: { useDefault: true }
};
```

---

## THE RULE

1. **Pre-Check Mandatory**: Perform `freebusy.query` immediately before `events.insert`.
2. **UTC Normalization**: All timestamps must be ISO 8601 UTC.
3. **Optimistic Locking**: Handle `409 Conflict` as "already booked".
4. **Backend-Only**: Never call Google APIs directly from the browser (SEC-02).

---

## DO NOT

- **DO NOT** store PHI (DOB, SSN) in calendar descriptions.
- **DO NOT** allow the user to book a slot that has not been verified as free within the last 30 seconds.
- **DO NOT** use personal OAuth2 flows for service-owned clinic calendars.
