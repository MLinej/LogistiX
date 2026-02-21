
## 💡 What is LogistiX?

LogistiX is a **full-stack fleet management web application** that digitizes and automates the end-to-end lifecycle of a logistics operation:

| Area | What LogistiX Does |
|---|---|
| 🚛 Vehicle Management | Track registration, capacity, odometer, service history, and live status |
| 👤 Driver Management | Manage licenses, safety scores, availability, and compliance |
| 📦 Trip Dispatching | Assign vehicles and drivers to trips with automated validation |
| ⛽ Fuel Monitoring | Log fuel usage, auto-calculate efficiency, flag anomalies |
| 🔧 Maintenance Tracking | Schedule services and auto-mark vehicles as "In Shop" |
| 🔔 Smart Alerts | Auto-generate alerts for license expiry, overload, and anomalies |
| 📊 Analytics Dashboard | Visual charts for fleet utilization, fuel efficiency, and trip history |

---

## ✨ Key Features

### ⚡ Automated Business Logic (Database Triggers)
- **Auto-alert** when a driver's license is expiring within 60 days
- **Auto-set** vehicle status to `In Shop` when a maintenance record is logged
- **Auto-sync** vehicle and driver status (`On Trip` / `Available`) when trip status changes
- **Block dispatch** if cargo weight exceeds vehicle capacity
- **Block dispatch** if the driver's license is expired

### 🛡️ Robust Data Validation
- Indian driving license format enforced via regex (`AA9999999999999`)
- Vehicle registration state code (`[A-Z]{2}`) and RTO code (`[0-9]{2}`) validated
- Odometer and service km cross-validated (service km ≤ odometer)
- Trip locations enforced to be distinct (case-insensitive)
- Fuel efficiency and anomaly flags **auto-generated** as stored computed columns

### 🔐 Secure Authentication
- JWT-based auth with `jsonwebtoken`
- Passwords hashed with `bcryptjs`
- Protected routes via Express middleware

### 📱 Modern UI/UX
- Built with **shadcn/ui** + **Radix UI** for accessible, polished components
- Dark/light mode via `next-themes`
- Responsive layouts with **Tailwind CSS v4**
- Analytics charts with **Recharts**
- Toast notifications with **Sonner**

Contributors :
Nirbhay71
MLinej
darshanNhb
RutsDonda

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                      │
│                                                             │
│   Next.js 16  ·  React 19  ·  TypeScript 5.7               │
│   Tailwind 4  ·  shadcn/ui  ·  Radix UI                    │
│   react-hook-form  ·  zod  ·  recharts  ·  lucide-react     │
└────────────────────────────┬────────────────────────────────┘
                             │  HTTP (REST API)
                             │  JWT token in Authorization header
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                       │
│                                                             │
│   Express 5  ·  Node.js (ESM modules)                      │
│   bcryptjs  ·  jsonwebtoken  ·  cors  ·  dotenv            │
└────────────────────────────┬────────────────────────────────┘
                             │  Prisma Client (type-safe ORM)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATABASE                             │
│   PostgreSQL / any Prisma-supported DB                      │
│   Configured via DATABASE_URL in .env                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Frontend — Detailed Stack

| Category | Package | Version | Purpose |
|---|---|---|---|
| Framework | `next` | 16.1.6 | App router, SSR, routing |
| UI Library | `react` / `react-dom` | 19.2.4 | Component rendering |
| Language | `typescript` | 5.7.3 | Type safety |
| Styling | `tailwindcss` | ^4.2.0 | Utility-first CSS |
| Component Library | `@radix-ui/*` (30+ packages) | various | Accessible headless UI |
| Forms | `react-hook-form` | ^7.54.1 | Form state management |
| Validation | `zod` | ^3.24.1 | Schema validation (paired with hook-form) |
| Form Resolvers | `@hookform/resolvers` | ^3.9.1 | Connects zod to react-hook-form |
| Charts | `recharts` | 2.15.0 | Fleet analytics dashboards |
| Icons | `lucide-react` | ^0.564.0 | Icon set |
| Themes | `next-themes` | ^0.4.6 | Dark/light mode |
| Date Picker | `react-day-picker` | 9.13.2 | Scheduling UI |
| Date Utilities | `date-fns` | 4.1.0 | Date formatting/calculations |
| Notifications | `sonner` | ^1.7.1 | Toast notifications |
| Carousel | `embla-carousel-react` | 8.6.0 | Slide components |
| OTP Input | `input-otp` | 1.4.2 | Authentication UI |
| Drawer | `vaul` | ^1.1.2 | Mobile-friendly drawer |
| Command Palette | `cmdk` | 1.1.1 | Search/command UI |
| Resizable Panels | `react-resizable-panels` | ^2.1.7 | Dashboard layout |
| Scroll Area | `@radix-ui/react-scroll-area` | 1.2.10 | Custom scrollbars |
| Analytics | `@vercel/analytics` | 1.6.1 | Usage tracking |
| CSS Utils | `clsx` + `tailwind-merge` | — | Conditional class merging |
| CVA | `class-variance-authority` | ^0.7.1 | Component variant system |
| Animations | `tw-animate-css` | 1.3.3 | CSS animation helpers |
| PostCSS | `@tailwindcss/postcss` | ^4.2.0 | CSS build pipeline |

### Frontend Configuration Files

**`next.config.mjs`**
```js
// TypeScript build errors are ignored (dev-friendly)
typescript: { ignoreBuildErrors: true }
// Images are unoptimized (no Next.js Image Optimization)
images: { unoptimized: true }
```

**`tsconfig.json`** — Key settings:
- Target: `ES6`, Module: `ESNext` (bundler resolution)
- Strict mode enabled
- Path alias: `@/*` → `./*` (used everywhere as `@/components`, `@/lib`, `@/hooks`)
- Includes Next.js plugin for type inference

**`components.json`** — shadcn/ui config:
- Style: `new-york`
- Icon library: `lucide`
- CSS variables for theming (neutral base color)
- Aliases map: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`

### Frontend Folder Structure (inferred)

```
/
├── app/               ← Next.js App Router pages & layouts
│   └── globals.css    ← Tailwind base styles + CSS variables
├── components/
│   └── ui/            ← shadcn/ui generated components
├── hooks/             ← Custom React hooks
├── lib/
│   └── utils.ts       ← clsx + tailwind-merge helper (cn())
├── public/            ← Static assets
├── styles/            ← Additional CSS
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
└── components.json
```

---

## ⚙️ Backend — Detailed Stack

| Category | Package | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js (ESM) | — | `"type": "module"` in package.json |
| Web Framework | `express` | ^5.2.1 | HTTP server & routing |
| ORM | `@prisma/client` | ^7.4.1 | Type-safe DB queries |
| Password Hashing | `bcryptjs` / `bcrypt` | ^3.0.3 / ^6.0.0 | Secure password storage |
| Auth Tokens | `jsonwebtoken` | ^9.0.3 | JWT creation & verification |
| CORS | `cors` | ^2.8.6 | Cross-origin requests from frontend |
| Environment | `dotenv` | ^17.3.1 | `.env` file loading |
| Dev Server | `nodemon` | ^3.1.14 | Auto-restart on file changes |
| DB Schema | `prisma` | ^7.4.1 | Migrations & schema management |

### Backend Configuration Files

**`prisma_config.ts`**
```ts
// Prisma reads schema from prisma/schema.prisma
// Migrations stored in prisma/migrations/
// DATABASE_URL loaded from .env via dotenv
```

**`.gitignore`**
```
node_modules
.env                    ← Never commit secrets
/generated/prisma       ← Auto-generated Prisma client
```

### Backend Folder Structure (inferred)

```
/
├── src/
│   ├── index.js         ← Express server entry point
│   ├── routes/          ← Route handlers
│   ├── controllers/     ← Business logic
│   ├── middleware/      ← JWT auth middleware
│   └── utils/           ← Helpers
├── prisma/
│   ├── schema.prisma    ← DB models (vehicles, drivers, users, etc.)
│   └── migrations/      ← DB migration history
├── .env                 ← Secrets (DATABASE_URL, JWT_SECRET, PORT)
├── prisma_config.ts
├── package.json
└── package-lock.json
```

---

## 🔗 How Frontend & Backend Connect

### 1. Authentication Flow

```
Frontend                              Backend
   │                                     │
   │── POST /api/auth/register ─────────►│ bcryptjs hashes password
   │                                     │ Prisma creates user in DB
   │◄─ { token: "eyJ..." } ─────────────│ jsonwebtoken signs JWT
   │                                     │
   │── POST /api/auth/login ────────────►│ bcryptjs compares password
   │◄─ { token: "eyJ...", user: {...} } ─│ JWT returned on success
   │                                     │
   │── GET /api/vehicles ───────────────►│
   │   Authorization: Bearer eyJ...      │ Middleware verifies JWT
   │◄─ [ { id, plate, status, ... } ] ──│ Prisma queries vehicles
```

### 2. Data Flow for Fleet Operations

```
UI Action (React)
    │
    ├── react-hook-form captures input
    ├── zod validates schema
    └── fetch/axios POST to Express API
            │
            ├── cors middleware allows origin
            ├── JWT middleware verifies token
            └── Prisma Client writes to DB
                    │
                    └── DB response → JSON → React state
                                              │
                                              └── recharts renders dashboard
```

### 3. Environment Variables (Required)

Create a `.env` file in the **backend** root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fleetflow"

# Auth
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
```

Create a `.env.local` file in the **frontend** root:

```env
# Points to backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔄 Shared Contracts (Frontend ↔ Backend)

The frontend's **zod schemas** should mirror the backend's **Prisma models**. Here's how they align:

| Prisma Model | zod Schema (Frontend) | shadcn Form Component |
|---|---|---|
| `User` (id, email, password, role) | `loginSchema`, `registerSchema` | Login/Register form |
| `Vehicle` (id, plate, type, status) | `vehicleSchema` | Add/Edit Vehicle form |
| `Driver` (id, name, licenseNo) | `driverSchema` | Driver management form |
| `Trip` (id, vehicleId, driverId, start, end) | `tripSchema` | Trip scheduling form |
| `Maintenance` (id, vehicleId, date, notes) | `maintenanceSchema` | Maintenance log form |

---

## 🚀 Running the Full Stack

### 1. Start Backend
```bash
cd backend
npm install
npx prisma migrate dev      # run DB migrations
npm run dev                 # nodemon starts Express on PORT 5000
```

### 2. Start Frontend
```bash
cd frontend
pnpm install                # uses pnpm-lock.yaml
pnpm dev                    # Next.js starts on http://localhost:3000
```

### 3. Monorepo Option (run both together)
Add a root `package.json`:
```json
{
  "scripts": {
    "dev:frontend": "cd frontend && pnpm dev",
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\""
  }
}
```

---

## 📦 Dependency Summary

| | Frontend | Backend |
|---|---|---|
| **Runtime** | Browser + Node.js (Next.js) | Node.js (ESM) |
| **Package Manager** | pnpm | npm |
| **Language** | TypeScript 5.7 | JavaScript (ESM) |
| **HTTP** | Native fetch / Next.js routes | Express 5 |
| **Validation** | zod | Prisma schema |
| **Auth** | JWT stored in memory/cookie | jsonwebtoken + bcryptjs |
| **Database** | — | Prisma + PostgreSQL |
| **Dev Tool** | Next.js HMR | nodemon |
| **Styling** | Tailwind 4 + shadcn/ui | — |
| **Analytics** | Vercel Analytics | — |

---

## 🛡️ Security Considerations

- **CORS** — `cors` package must whitelist the frontend origin (`http://localhost:3000` in dev, production domain in prod)
- **JWT** — Token signed with `JWT_SECRET`, verified in Express middleware before protected routes
- **Passwords** — Never stored in plain text; `bcryptjs` hashes before DB write
- **Environment** — `.env` is gitignored on both sides; never commit secrets
- **TypeScript** — Frontend is fully typed, reducing runtime errors from malformed API responses

---

*Generated from: `frontend/package.json`, `backend/package.json`, `next.config.mjs`, `tsconfig.json`, `components.json`, `prisma_config.ts`, `.gitignore`*
