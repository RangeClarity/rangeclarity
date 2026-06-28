# RangeClarity — Fox Homepage v1 (implementation spec)

> Portable handoff. This was authored in the **Claude Design** workspace (uploads-only).
> It is NOT the RangeClarity repo. Copy this file into `docs/design/` in the real repo,
> and run the build steps there (Claude Code with cwd = `C:\Users\USER\Claude\Projects\RangeClarity`).

## What to copy into the repo first
From the Claude Design workspace, copy these into the repo:

| Source (Claude Design) | Destination (repo) | Use |
|---|---|---|
| `assets/fox-hero.png` (2172×724) | `public/brand/fox-hero.png` | Hero background — fox arms-crossed, navy, left negative space |
| `assets/fox-badge.png` (1254×1254) | `public/brand/fox-badge.png` | Circular fox seal / nav mark |
| `RangeClarity Landing Concepts.dc.html` | `docs/design/` (reference only) | The 3-concept board this spec is built from |

If those files are not present when you start in the repo, **stop and report** — do not regenerate the fox art.

## Goal (confirmed by user)
- Take **only** the hero direction from the concept: **"No signals. No noise. Just structure."** with the fox as a premium brand presence.
- **Do NOT** replace the homepage with the full concept page.
- Build a **new** version; do not delete/modify existing designs. Only switch `app/page.tsx` after the new route works **and** the user confirms.

## New route to create
`app/designs/rangeclarity-fox-brand-v1/page.tsx`

Compose it as: **new fox hero** → then **reuse the existing lower homepage sections** (import the same components `app/page.tsx` already uses — do not fork/duplicate them):
1. Three modules. One clear call.
2. One ticker, fully read
3. From chart to decision in five steps
4. What RangeClarity is not.
5. Simple access. Full range clarity
6. Straight answers
7. Stop chasing candles. Start reading the range.

Light-touch only on these: spacing/accent tokens to match the hero. No content/logic changes.

## Hero spec (the only net-new section)
Dark premium fintech. Reference: Concept A ("The Operator") in the concept board.

- **Background:** `public/brand/fox-hero.png`, `object-fit: cover; object-position: right`. Left gradient scrim for legibility:
  `linear-gradient(90deg,#0A0D13 0%,rgba(10,13,19,.94) 30%,rgba(10,13,19,.45) 60%,rgba(10,13,19,0) 100%)`.
- **Copy block** in the left ~45% (max-width ~640px):
  - eyebrow (mono): `Market-structure clarity`
  - H1: **No signals. No noise. Just structure.**
  - sub: market-structure clarity — reads strong/weak structure, ranges, zones and a visual verdict, so the chart stays simple while the engine does the work.
  - micro row: `CLEAN CHART · One readable layer` / `COMPLEX ENGINE · Multi-timeframe context`
- **CTAs:**
  - Primary: **Get Beta Access →** → `/beta?plan=beta_29`
  - Secondary: **Free Preview** → `/beta?plan=free_preview`
- Do not duplicate the concept's Pricing/Beta card here — `/beta` already owns that.

## Design tokens
- base `#0A0D13` · panel `#0D121B` · hairline `rgba(255,255,255,.07)`
- text `#EAEEF4` · dim `#9AA3B2`
- **clarity teal `#2DD4BD`** (primary CTA/links) · **strong `#34D9A0`** · **weak/noise `#EF5A60`** · fox amber `#F0922E` · soft-channel blue `#38BDF8`
- Fonts: Space Grotesk (display) · IBM Plex Sans (body) · IBM Plex Mono (data/labels)
- Primary button: bg teal, text `#04221E`, radius 9px.

## Public nav (unchanged rules)
Show: RangeClarity logo (fox-badge mark) · Premium Indicators · Investor Research Lab · **Get Beta Access** CTA.
Do NOT show: Indicator Terminal, Bold Hero.

## Safety language
Allowed: market structure, clarity, range, zones, context, visual verdict, less noise, stronger structure reading.
Banned: buy/sell signals, guaranteed profit, win rate, price prediction, exact entries/exits, financial advice, get-rich language.

## Do NOT touch
Payment logic · pricing logic · beta signup/admin APIs · beta checkout · DB/Supabase · webhooks. Linking to `/beta?...` only.

## QA checklist (run in repo)
- [ ] `npm run lint`
- [ ] `eslint app lib components`
- [ ] `tsc --noEmit -p tsconfig.check.json`
- [ ] dev server → open `/designs/rangeclarity-fox-brand-v1` (desktop + mobile)
- [ ] `/beta?plan=beta_29` and `/beta?plan=free_preview` resolve (no 404)
- [ ] existing `app/page.tsx` still renders unchanged

## Switch-over
Leave `app/page.tsx` pointing at the current homepage. Only after the new route passes QA **and** the user says go, repoint `app/page.tsx` to render the new fox homepage (keep the old version as its own route/component).

## End-of-run report template (fill in the repo)
files created · files modified · new design route · app/page.tsx switched? · lower sections preserved · where fox asset is used · concept sections deferred to Beta · commands run · blockers · safe to commit?
