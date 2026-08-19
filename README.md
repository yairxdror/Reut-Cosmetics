# Reut Cosmetics

Website skeleton with a Next.js (App Router, TypeScript) frontend and an Express (Node) backend, sharing one global design system. Next.js was chosen over a plain Vite SPA for the SEO and performance benefits (server rendering, fast first paint) a client-facing site needs.

## Design system

- Background: cream (`#faf8f2` → `#f6f1e6` gradient)
- Body text: near-black (`#1a1712`)
- Headings / accents: gold (`#a97f1e`)
- Primary buttons: rounded, glass (blurred, translucent) with a blue, red, or black border + matching text color, subtle color shift on hover
- Utility buttons (language / home / back / hamburger): glass with a thin gold border

All of this lives in [frontend/src/app/globals.css](frontend/src/app/globals.css) as CSS variables and `.btn`, `.btn-blue`, `.btn-red`, `.btn-black`, `.btn-glass-thin` classes, so new pages/components stay visually consistent by reusing those classes.

## Structure

```
backend/    Express API (health declarations, admin login, health check)
frontend/   Next.js app (App Router, language toggle, glass UI components)
```

## Run with Docker Desktop

```bash
docker compose up --build
```

This builds and starts both services:

- Frontend: http://localhost:3001 (container listens on 3000; mapped to 3001 on the host to avoid clashing with other local projects)
- Backend: http://localhost:4001

Source folders (`backend/src`, `frontend/src`, `frontend/public`) are mounted into the containers, so edits on the host are picked up live (Express `--watch`, Next.js Fast Refresh). Stop with `docker compose down`.

## Run locally (without Docker)

**Backend** (http://localhost:4001)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend** (http://localhost:3000, or set `-p` to another port if 3000 is taken locally)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The frontend calls the backend via `NEXT_PUBLIC_API_BASE_URL` (see `frontend/.env.example`).

## What's included

- Backend: `GET /api/health`, `POST /api/health-declarations`, `POST /api/auth/login` (rate-limited admin login, see [backend/.env.example](backend/.env.example) for required env vars)
- Frontend pages: Home, FAQ, Health Declaration (full questionnaire + agreement), Care Instructions, Private Courses, Login, Privacy Policy, Terms, Contact (`src/app/*/page.tsx`)
- A slide-in sidebar menu linking all secondary pages (`src/components/Sidebar.tsx`)
- A language toggle (Hebrew ⇄ English) with a dropdown picker that also flips text direction (RTL/LTR) on `<html>`
- Reusable `Button` component (`variant="blue" | "red"`) and `LanguageButton` / `HomeButton` / `BackButton` / `HamburgerButton` nav controls (`src/components/`)

## Notes

- `frontend-vite-backup/` holds the previous Vite implementation, kept temporarily in case anything needs to be cross-checked. Safe to delete once you're confident in the Next.js version.
