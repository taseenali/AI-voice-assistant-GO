# MedVoice AI — Demo Runbook

This is the single document for running a live demo. Follow it in order. If anything in the pre-call checklist fails, fix it before dialling — a broken demo is worse than no demo.

---

## Pre-Call Checklist

Complete every item before calling the demo number.

### Server
- [ ] `curl https://your-server.up.railway.app/health` returns `{"status":"ok"}`
- [ ] Railway logs show no errors on last boot
- [ ] `VAPI_SPIKE_MODE=false` confirmed in Railway environment variables
- [ ] `VAPI_LLM_MODEL=gpt-4o-mini` (or `gpt-4o`) confirmed

### Calendar
- [ ] Google Calendar service account credentials are set in Railway (`G_CLIENT_EMAIL`, `G_PRIVATE_KEY`)
- [ ] Demo calendar is shared with the service account email (Editor permission)
- [ ] Calendar ID in `configs/medical-clinic.json` matches your actual demo calendar
- [ ] `calendar_enabled: true` is in `configs/medical-clinic.json`
- [ ] Quick manual test: `node check-db.js` shows `calendar_enabled=1` for `medical-clinic` tenant

### Dashboard
- [ ] Dashboard loads at your Vercel URL
- [ ] Login works with clinic credentials (`PLATFORM_CLINIC_EMAIL` / `PLATFORM_ADMIN_PASSWORD`)
- [ ] Sessions, Leads, Appointments panels are visible (may be empty — that's fine)

### Vapi
- [ ] Phone number server URL = `https://your-server.up.railway.app/api/vapi/webhook`
- [ ] `x-vapi-secret` header matches `VAPI_WEBHOOK_SECRET` in Railway
- [ ] You have the demo phone number ready to dial

---

## Demo Call Script

This is the exact conversation to run. Do not improvise on the first test — establish this baseline first.

**Call the demo number.** After the greeting:

| Turn | You say | Expected AI behaviour |
|---|---|---|
| 1 | *"Hi, I'd like to book an appointment."* | Asks for your name |
| 2 | *"My name is James Smith."* | Thanks you, asks for reason for visit |
| 3 | *"I need a general check-up."* | Asks for callback phone number |
| 4 | *"My number is [your real number]."* | Repeats number back digit-by-digit, confirms. Calls `capture_lead`. Asks what date works. |
| 5 | *"How about next Tuesday?"* | Says "Let me check what times are open." → calls `get_available_slots` → reads out available times |
| 6 | *"10 AM works for me."* | Confirms "Tuesday the Nth at 10 AM — does that work for you?" |
| 7 | *"Yes, perfect."* | Calls `book_appointment` → confirms booking aloud |
| 8 | *"Great, thanks."* | Wraps up, closes the call warmly |

**Hang up.** The `end-of-call-report` fires ~5 seconds after hang-up.

---

## Post-Call Verification (do this before showing the client)

Open the dashboard and verify all 4 data points appeared:

| Panel | What to check | Pass / Fail |
|---|---|---|
| Sessions | New row — channel: `phone`, duration > 0, caller number populated | |
| Leads | New row — name: `James Smith`, phone: [your number], reason_for_visit: `general check-up` | |
| Appointments | New row — date/time matches what was booked, status: `confirmed` | |
| Google Calendar | Open your demo calendar — event exists at the booked time | |

All 4 must pass before showing this to a prospect.

---

## If Something Breaks

### Agent doesn't answer / call goes to voicemail
- Vapi phone number server URL is not pointing to your deployed server
- Check: Vapi dashboard → Phone Numbers → Server URL

### "No tenant mapped for this phone number"
- Your Vapi phone number is not in the `phone_numbers` DB table
- Fix: add it to `configs/medical-clinic.json` doesn't help (the seed only uses the hardcoded spike numbers)
- Fix: run SQL directly:
  ```sql
  INSERT INTO phone_numbers (phone_number, tenant_id, label)
  VALUES ('+1YOUR_VAPI_NUMBER', 'medical-clinic', 'Demo line');
  ```
  Or use `check-db.js` to inspect what numbers are seeded.

### Agent answers but doesn't check the calendar ("I can't access the schedule")
- Calendar credentials missing or wrong in Railway env
- `calendar_enabled` may still be `false` in the DB (server hasn't restarted since the config change)
- Fix: Railway → Deployments → Redeploy (forces re-seed from JSON)

### Lead saved but phone is null
- The system prompt or tool schema change hasn't deployed yet
- Fix: confirm Railway has the latest `server/platform/` code deployed

### Appointments panel is empty but calendar event exists
- `calendar_enabled: false` in `tenant_config` DB row — `GET /api/appointments` returns empty
- Fix: redeploy to re-seed with `calendar_enabled: true`

### Dashboard shows CORS error
- `ALLOWED_ORIGINS` in Railway doesn't include your Vercel URL
- Fix: add it, redeploy server

---

## Live Demo Flow (for prospect meetings)

After passing all post-call checks, here is the suggested demo sequence for a clinic prospect:

1. **30 seconds:** Show the dashboard overview — "This is what you see after every call."
2. **2 minutes:** Call the demo number on speaker, run the call script above live.
3. **30 seconds:** Refresh the dashboard — show the new session, lead, and appointment that just appeared.
4. **30 seconds:** Open Google Calendar — show the event that the AI just created.
5. **Close:** "Every call your clinic gets, 24 hours a day, does exactly this automatically."

Total demo time: ~4 minutes. Keep it that tight. The product sells itself once they see the data appear.

---

## Call #2 — Calendar Latency Measurement

After Call #1 passes (all 4 post-call checks green), run Call #2 specifically to measure calendar latency.

**Goal:** Measure the dead-air gap between the caller finishing their sentence and the agent responding after `check_availability`.

**Target:** < 3 seconds.

If > 3 seconds:
1. Check Railway region — choose the region closest to your users
2. Add a Vapi filler message on `check_availability`:
   In `assistant-builder.js`, the `messages` block on `check_availability` already has:
   `{ type: 'request-start', content: 'Let me check the schedule for you.' }`
   This filler plays while the tool call is in flight. Verify it's audible on the call.

Log results in `docs/SPIKE-DISCREPANCY-LOG.md` under a new `## [date] — calendar latency` section.
