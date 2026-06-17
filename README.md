# RangeClarity

RangeClarity is a TradingView-first chart-context product for traders who want
a quieter read on trend, support, resistance, range, location, extension, and
volume without trade signals or performance claims.

A full-stack web application built with **Next.js (App Router)** and
**TypeScript**.

## Status

MVP foundation plus a first landing/waitlist slice. The current app renders the
public positioning page, an illustrative dashboard preview, a Pro waitlist form,
lightweight Terms/Privacy pages, and a local-file-backed waitlist endpoint.

The TradingView Starter indicator and Pro product are not built yet.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- React + TypeScript
- ESLint (`next/core-web-vitals`, `next/typescript`)

## Getting Started

Requires Node.js 20+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build
npm run start
npm run lint
npm run typecheck
```

## Environment

Copy `.env.example` to `.env.local` and fill in values as features are added. No
secrets are required yet.

Optional:

```bash
WAITLIST_FILE=.data/waitlist.jsonl
```

By default, local waitlist signups are written to `.data/waitlist.jsonl`. Hosted
production should replace this with a durable waitlist provider or set
`WAITLIST_FILE` to a writable location.

## Project Layout

```text
app/                 App Router routes, pages, and API handlers
  api/waitlist/      Pro waitlist capture endpoint
components/          Landing page UI components
lib/                 Server-side helpers
docs/                Architecture notes and task tracker
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - structure and conventions
- [docs/TASKS.md](docs/TASKS.md) - roadmap and progress
- [RANGECLARITY_MASTER_PLAN.md](RANGECLARITY_MASTER_PLAN.md) - product plan
