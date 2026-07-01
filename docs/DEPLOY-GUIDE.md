# MedVoice AI — Deployment Guide

This guide gets the server and dashboard onto real URLs so you can run a live demo.

**Prerequisites before starting:**
- Railway account (railway.app) — free tier works for demo
- Vercel account (vercel.com) — free tier works for dashboard
- Google Cloud service account JSON key with Calendar API access
- Vapi account with a phone number configured

---

## Part 1 — Deploy the Server (Railway)

### Step 1 — Create the Railway project

```powershell
# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login
railway login

# From the project root
railway init
# Name: medvoice-server
# Select: Deploy from local repo
```

Or use the Railway web UI: railway.app → New Project → Deploy from GitHub repo → select this repo.

### Step 2 — Set environment variables

In the Railway dashboard → your project → Variables, add every variable from `.env.example`.

**Minimum required for demo:**
```
PORT=3001
NODE_ENV=production
PUBLIC_URL=<paste your Railway URL after first deploy — see Step 3>
JWT_SECRET=<generate: openssl rand -hex 32>
VAPI_WEBHOOK_SECRET=<generate: openssl rand -hex 32>
VAPI_SPIKE_MODE=false
VAPI_LLM_MODEL=gpt-4o-mini
G_CLIENT_EMAIL=<your service account email>
G_PRIVATE_KEY=<your private key — paste including BEGIN/END lines>
PLATFORM_ADMIN_EMAIL=admin@yourdomain.com
PLATFORM_ADMIN_PASSWORD=<choose a strong password>
PLATFORM_CLINIC_EMAIL=clinic@yourclinic.com
ALLOWED_ORIGINS=https://your-dashboard.vercel.app
```

**Leave out for demo** (set after first client signs):
- `TWILIO_*` vars
- `MEDICAL_CLINIC_WEBHOOK_URL` / `MEDICAL_CLINIC_WEBHOOK_SECRET`

### Step 3 — Attach a persistent Volume (required for SQLite)

Railway's filesystem is ephemeral — the database is wiped on every redeploy unless you mount a Volume.

1. Railway dashboard → your project → your service → **Volumes**
2. New Volume → Mount path: `/data`
3. Go back to Variables → add: `SQLITE_PATH=/data/medvoice.db`

The server reads `SQLITE_PATH` on boot and creates the file at that path. On first boot it auto-creates the super_admin from `PLATFORM_ADMIN_EMAIL` / `PLATFORM_ADMIN_PASSWORD`.

> If you skip the Volume, the DB resets to empty on every deploy — all sessions, leads, and users are lost.

### Step 4 — Deploy

```powershell
railway up
```

Railway will print your server URL: `https://medvoice-server-xxxx.up.railway.app`

**Copy this URL.** Go back to Railway Variables and set `PUBLIC_URL` to this URL, then redeploy.

### Step 5 — Smoke test the server

```powershell
curl https://your-server.up.railway.app/health
# Expected: {"status":"ok","timestamp":"..."}
```

If you get a 502, check Railway logs: `railway logs`.

---

## Part 2 — Set up Google Calendar

Before calendar tools will work on live calls, complete this setup:

### Step 1 — Create GCP service account

1. Go to console.cloud.google.com
2. Create a project (or use an existing one)
3. Enable **Google Calendar API** (APIs & Services → Library)
4. Create a **Service Account** (APIs & Services → Credentials → Create Credentials → Service Account)
5. Download the JSON key file

### Step 2 — Share a test calendar with the service account

1. Open Google Calendar
2. Create a new calendar named "MedVoice Demo"
3. Settings → Share with specific people → add the service account email (from `client_email` in the JSON key)
4. Give it **Make changes to events** permission
5. Copy the **Calendar ID** (Settings → Integrate calendar → Calendar ID — looks like `abc123@group.calendar.google.com`)

### Step 3 — Update the clinic config

Open `configs/medical-clinic.json` and replace the placeholder:
```json
"calendar_id": "your-actual-calendar-id@group.calendar.google.com"
```

Then redeploy to Railway (`railway up`) to re-seed the DB with the updated calendar ID.

### Step 4 — Verify calendar is wired

After redeploy, check Railway logs on startup:
```
[Platform] Tenants seeded from configs/
```

---

## Part 3 — Deploy the Dashboard (Vercel)

### Step 1 — Import the project

1. Go to vercel.com → New Project
2. Import this GitHub repo
3. Set **Root Directory** to `dashboard`
4. Framework: Vite (auto-detected)

### Step 2 — Set environment variables in Vercel

In Vercel project → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-server.up.railway.app
```

That's the only required variable for the dashboard.

### Step 3 — Deploy

Vercel deploys automatically on `git push`. Or click **Deploy** manually in the UI.

Your dashboard URL: `https://medvoice-dashboard.vercel.app` (or similar)

### Step 4 — Update server CORS

Go back to Railway → Variables → update `ALLOWED_ORIGINS` to include your Vercel URL:
```
ALLOWED_ORIGINS=https://medvoice-dashboard.vercel.app
```

Redeploy server.

### Step 5 — Test dashboard login

Open your Vercel URL → Login page → enter:
- Email: whatever you set for `PLATFORM_CLINIC_EMAIL`
- Password: whatever you set for `PLATFORM_ADMIN_PASSWORD`

You should land on the Overview panel.

---

## Part 4 — Wire Vapi to the Deployed Server

### Step 1 — Update the phone number server URL

1. Go to dashboard.vapi.ai
2. Phone Numbers → select your number
3. Set **Server URL** to: `https://your-server.up.railway.app/api/vapi/webhook`
4. Set the server secret header: key `x-vapi-secret`, value = your `VAPI_WEBHOOK_SECRET`

### Step 2 — Confirm VAPI_SPIKE_MODE is false

Railway Variables → `VAPI_SPIKE_MODE=false` → redeploy.

---

## Part 5 — Boot Smoke-Test Checklist

Run these before the demo call:

- [ ] `curl https://your-server.up.railway.app/health` → `{"status":"ok"}`
- [ ] Dashboard loads at Vercel URL without errors
- [ ] Login works with clinic credentials
- [ ] `node check-db.js` on local (or Railway console) shows `medical-clinic` tenant with `calendar_enabled=1`
- [ ] Railway logs show no boot errors
- [ ] Vapi phone number server URL points to deployed URL (not ngrok)
- [ ] `VAPI_SPIKE_MODE=false` confirmed in Railway variables

Once all boxes are checked, proceed to the Demo Runbook (`docs/DEMO-RUNBOOK.md`).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `curl /health` → 502 | Server crashed on boot | Check `railway logs` — usually a missing env var |
| Dashboard login fails with 401 | JWT_SECRET mismatch or wrong email | Verify env vars match; check `PLATFORM_CLINIC_EMAIL` |
| Dashboard CORS error | ALLOWED_ORIGINS missing Vercel URL | Update Railway var → redeploy server |
| Call reaches server but no tenant found | Phone number not in `phone_numbers` table | Ensure the Vapi number is seeded — check `check-db.js` output |
| Calendar tool returns error | Google credentials wrong or calendar not shared | Re-check `G_CLIENT_EMAIL`, `G_PRIVATE_KEY`, calendar sharing |
| Agent answers but sounds robotic | ELEVENLABS_API_KEY not set | Expected — using Vapi built-in voice (Elliot). Add key for better voice later. |
