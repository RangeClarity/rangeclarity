# Architecture

This document describes how the RangeClarity codebase is organized and the
conventions we follow.

## Overview

RangeClarity is a TradingView-first chart-context product. The web app is the
public landing, compliance, and waitlist surface while the TradingView Starter
indicator remains the core product to build next.

The frontend and backend are served together by Next.js using the App Router.
Server-side logic lives alongside the UI until there is a concrete reason to
split it out.

## Stack and Rationale

- **Next.js (App Router)** - full-stack React framework for pages and API routes.
- **TypeScript (strict)** - type safety from day one; `strict` is enabled in
  `tsconfig.json`.
- **ESLint** - `next/core-web-vitals` and `next/typescript` rule sets.

## Directory Structure

```text
app/                 App Router. Each route is a folder; layout.tsx wraps pages.
  layout.tsx         Root layout and shared metadata.
  page.tsx           Landing page and waitlist entry point.
  privacy/page.tsx   Lightweight MVP privacy page.
  terms/page.tsx     Lightweight MVP terms page.
  api/waitlist/      Pro waitlist capture endpoint.
  globals.css        Global styles.
components/          Reusable UI pieces for the landing page.
  ChartInstrument.tsx  Interactive hero centerpiece: animated SVG chart with a
                       synced dashboard read-out and a scenario switcher.
  Sparkline.tsx        Small static SVG chart used in the Use Cases cards.
  UseCases.tsx         Scenario cards that drive the instrument via scenarioBus.
  Reveal.tsx           IntersectionObserver reveal-on-scroll wrapper.
  scenarioBus.ts       Tiny pub/sub linking Use Cases to the instrument.
  WaitlistForm.tsx     Client waitlist form posting to /api/waitlist.
lib/                 Server-side helpers and shared data.
  scenarios.ts         Deterministic sample chart data + projection helpers.
  waitlist.ts          Waitlist persistence (file-based MVP bridge).
docs/                Project documentation.
public/              Static assets served as-is when needed.
```

The `@/*` path alias maps to the project root, so imports can be written as
`@/components/...` rather than long relative paths.

## Conventions

- TypeScript everywhere; no plain `.js` source files.
- Keep the app small until a feature needs more structure.
- Each meaningful change updates `docs/TASKS.md`.
- Product copy must avoid profit promises, win-rate claims, trade calls, and
  signal-like language.
- The local JSONL waitlist is an MVP bridge. For hosted production,
  `lib/waitlist.ts` is the replacement point for a durable provider.

## Decisions Log

- **2026-06-14** - App type: full-stack web app. Stack: TypeScript + Next.js
  (App Router). First step scope: repo scaffold + docs only.
- **2026-06-15** - Landing page, waitlist API, and local-file waitlist
  persistence exist as the first usable web slice.
- **2026-06-15** - Added Terms and Privacy pages so public footer links resolve
  and the waitlist flow has basic compliance framing.
- **2026-06-15** - Landing page redesigned ("instrument-grade" direction):
  off-black surface, hairline rules, mono-forward type, restrained accent with
  color reserved for Bias/State. Hero centerpiece is an interactive chart
  instrument (deterministic sample data in `lib/scenarios.ts`, rendered as SVG)
  whose read-out updates as you switch situations. Motion is tasteful and fully
  gated behind `prefers-reduced-motion`. Sample charts are clearly labelled
  illustrative; no signals, targets, or performance claims. The static
  `DashboardMock` is superseded by `ChartInstrument` and no longer imported.
