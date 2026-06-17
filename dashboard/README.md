# MedVoice Admin Dashboard

**Production-Grade Medical Dashboard for MedVoice AI Receptionist**

## Overview

This is a React 18 + TypeScript dashboard built with Vite and TailwindCSS for managing the MedVoice AI Receptionist system. It provides:

- **System Health Monitoring** — Live server + LLM health checks with auto-refresh
- **Client Configuration Viewer** — Visual and JSON views of the active clinic configuration
- **Empty State Panels** — Overview, Leads, Sessions, and Emergency Log ready for API integration
- **Enterprise Architecture** — TypeScript types, custom hooks, reusable components, Toast notifications

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | TailwindCSS 3 + Custom Design System |
| Routing | React Router v6 |
| Icons | Lucide React |
| HTTP Client | Fetch API with custom APIClient class |
| State | React Context API (Toast notifications) |

## Quick Start

### Prerequisites

- Node.js 18+
- MedVoice server running on port 3000 (for health + config panels)

### Install

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

Opens on **http://localhost:5173** with:
- `/health` + `/api/*` proxied to the MedVoice server on port 3000
- Hot Module Replacement (HMR) enabled

### Production Build

```bash
npm run build
```

Outputs optimized static files to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, MainLayout, PageHeader
│   │   ├── shared/          # KPICard, EmptyState, Table, Badge, Toast, Modal, etc.
│   │   └── panels/          # Feature panels (Overview, Leads, Sessions, etc.)
│   ├── hooks/               # Custom React hooks (useServerHealth, useConfig, etc.)
│   ├── context/             # ToastContext for notification system
│   ├── types/               # TypeScript interfaces (API, Config, Session, Lead)
│   ├── lib/                 # API client, constants
│   ├── styles/              # Global CSS with Tailwind directives
│   ├── App.tsx              # Root component with routing
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Currently Active Panels

| Panel | Route | Status |
|-------|-------|--------|
| System Health | `/health` | ✅ Live — fetches from server |
| Configuration | `/config` | ✅ Live — fetches from server |
| Overview | `/` | 🚧 Empty state — awaiting API |
| Leads | `/leads` | 🚧 Empty state — awaiting API |
| Sessions | `/sessions` | 🚧 Empty state — awaiting API |
| Emergency Log | `/emergency` | 🚧 Empty state — awaiting API |

## Connecting to the MedVoice Server

The dashboard proxies requests to the MedVoice server:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:3000' },
    '/health': { target: 'http://localhost:3000' },
  },
}
```

Start the server first:
```bash
node server/index.js
```

Then start the dashboard:
```bash
cd dashboard && npm run dev
```

## Design System

This dashboard implements a custom design system specified in `DASHBOARD-DESIGN-SPEC.txt`:

- **Font**: Inter (Google Fonts)
- **Colors**: 30+ custom colors for backgrounds, text, intents, and semantic states
- **Typography**: 8 distinct font sizes (11px badges to 32px KPIs)
- **Spacing**: 6-level spacing scale (4px to 48px)
- **Components**: Cards, badges, status dots with animations, shimmer loading

## Developer Notes

### Sessions API (Not Yet Available)

The `useSessions()` hook returns an empty array. When the server implements `GET /api/sessions`, uncomment the fetch logic in `src/hooks/useSessions.ts`.

### Leads API (Not Yet Available)

The `useLeads()` hook returns an empty array. When the server implements `GET /api/leads`, uncomment the fetch logic in `src/hooks/useLeads.ts`.

### Production Deployment

Built files in `dist/` can be served:
- By the Node.js server from a `/admin` route
- Via nginx reverse proxy
- Deployed to Vercel / Netlify / Cloudflare Pages

## HIPAA Considerations

- No PHI in URLs (uses slide-over panels for detail views)
- Environment variable configuration (no hardcoded secrets)
- Ready for auth token integration via API client headers
- Clean separation between frontend and backend

## License

Proprietary — MedVoice Healthcare Solutions
