# DSA 90 Days

A 90-day Data Structures & Algorithms study tracker. Students register, pick a language track, pledge to the plan, and work through phases, patterns and a Day 0→1 primer while their progress is tracked; an admin panel manages users, quotes and analytics.

**Stack:** Next.js (App Router) · React · TypeScript · MongoDB / Mongoose · NextAuth (Auth.js) · bcryptjs

## Features

- **Auth** — register/login with hashed passwords; separate admin login.
- **Track select** — choose the C++ / Java / Python track.
- **Day 0→1** — beginner lessons per topic (`/day0to1/[topicId]`).
- **Phases** — the 90-day plan split into phases (`/phase/[id]`), sourced from `DSA_90Day_Study_Plan.xlsx` → `data/`.
- **Patterns** — problem-solving pattern library (`/patterns/[slug]`).
- **Progress tracking** — `/api/progress`, `/api/track`, `/api/pledge`, `/api/profile`.
- **Admin** — users, quotes and analytics dashboards under `/admin`.
- Resources, privacy and terms pages.

## Run it

```bash
npm install
# .env.local: MONGODB_URI, AUTH_SECRET, NEXTAUTH_URL
npm run dev                  # http://localhost:3000
```

## Layout

```
app/            routes (admin, day0to1, patterns, phase, profile, api/*)
components/     UI
data/           study plan, patterns, lessons
models/         Mongoose schemas
lib/            db + helpers
auth.ts         Auth.js config
```

Design tokens live in [`DESIGN.md`](DESIGN.md).
