# RangeClarity Web Style Guide & Polish Plan (source of truth)

> The single source of truth for the public website's copy + design so every screen reads as **one
> product**. Scope: public website UX/UI/copy only. **Out of scope / never touch here:** RC-1 research
> engine, scoring/caps/agree3, Pine, payment/Lemon logic. Production homepage = `app/page.tsx` →
> `app/designs/rangeclarity-fox-brand-v1/page.tsx`. Mobile reference =
> `repo-dropin_mobile/docs/design/RangeClarity Mobile Homepage.dc.html`.

## 1. Brand foundation
- **Tone:** calm, precise, fintech-first, premium. Structure over noise. Never hypey, never advisory.
- **Mood:** dark premium, deep-void background, restrained neon-teal accent, the Fox as a premium
  presence (not a cartoon). One direction, not many.
- **Tokens (`app/globals.css`, already defined — reuse, don't invent):** `--bg #05060a`, `--panel
  #0a0c16`, `--fg #f2f6ff`, `--fg-dim #9aa6c4`, `--accent #2fffd6` (teal), `--bull/--bear` for state,
  `--maxw 1200px`, `--font` (system sans), `--mono`. All public surfaces should pull from these.

## 2. Logo / avatar
- One treatment everywhere: **fox badge** `/brand/fox-badge.png` + wordmark **Range**`Clarity`
  (accent on "Clarity"), linking to `/`. Header size ~24–34px badge. Don't mix the bare `brandMark`
  square and the fox badge — standardize on the **fox badge** (the homepage + updated BetaShell use it).

## 3. Navigation labels (canonical)
- Primary product nav: **Premium Indicators** · **Investor Research Lab**.
- Funnel/contextual nav (beta docs) may stay contextual (Onboarding · How to use · Access · FAQ) but
  its primary button must read **Get Beta Access** (see §4).

## 4. CTA labels + button hierarchy
- **Primary CTA (filled, teal): `Get Beta Access`** → `/beta?plan=beta_29`.
- **Secondary CTA (outline/ghost): `7-Day Free Access`** → `/beta/free-access`.
- One primary per view. Primary = filled accent; secondary = outline; tertiary = text link.
- **Never use:** `Request beta access`, `Join the Beta`/`Join the beta`, `See what it shows`,
  `Free Preview`, `Start Free`, `Get Access`.

## 5. Hero pattern (desktop + mobile must match)
- **Eyebrow:** `Market-structure clarity` (with the small accent dot).
- **Headline (both breakpoints):** `No signals. No noise. Just structure.` (accent on "Just
  structure."). _Desktop and mobile now use the same headline — fixes the prior split where mobile
  said "Read market structure clearly."_
- **Subhead pattern:** lead with `Market-structure clarity for TradingView` then the value: reads
  strong/weak structure, ranges, zones and a visual verdict, so the chart stays simple while the
  engine does the work. Mobile uses a trimmed one-liner.
- **Proof line:** `Private beta · TradingView username required · manual invite within 24–48h.`

## 6. Section headings
- Pattern: short **kicker/eyebrow** (mono, upper, 0.16em tracking) + a 2–5 word **H2** with one
  accent word. Keep verbs descriptive, never directive ("Structure, context, verdict." — yes;
  "Find the trade" — no).

## 7. Beta / access language
- The product is the **invite-only TradingView indicator**, granted **manually** during a **private
  paid beta**. Tiers: **7-Day Free Access ($0)** · **RangeClarity Beta ($29/mo)** · **RangeClarity Pro
  Beta ($49/mo)**. Use these exact names everywhere; never "Free Preview".

## 8. Canonical disclaimer / no-advice line
Use this one sentence (or a trim of it) anywhere a disclaimer appears, so all pages match:
> **RangeClarity is an educational market-structure visualization tool — not financial advice. No
> buy/sell signals, no price predictions, no win-rate or profit promises. Better chart reading, not
> trading advice.**

Short tagline for tight spaces: **"RC Score is permission, not prediction."**

## 9. Preferred core language / avoid-list
**Prefer:** No signals. No noise. Just structure. · Market-structure clarity for TradingView. · Get
Beta Access · 7-Day Free Access · Premium Indicators · Investor Research Lab · RC Score is permission,
not prediction. · Better chart reading, not trading advice.
**Avoid:** Request beta access · Join the Beta · See what it shows · Free Preview · fake "LIVE" ·
"mock" labels on public pages · Range Score /100 · profit / win-rate / prediction / signal / "setup"
language · inconsistent beta wording.

## 10. Mobile spec — from `RangeClarity Mobile Homepage.dc.html`
The design comp shows three hero directions (A Immersive full-bleed fox · B Badge-Forward centered
seal · C Editorial type-led + sticky CTA) and a recommended full homepage. Its own recommendation:
**ship C (Editorial) as default — persistent sticky CTA keeps "Get Beta Access" on-screen the whole
scroll (best mobile conversion), reads fintech-first; borrow A's fox banner as a mid-page brand
moment; keep B for the Beta/onboarding entry.**

**Mobile type scale (target):** H1 33–40px / line-height 1.0, Space Grotesk 700 · Section H 22px ·
body 14–15px / 1.55 · label 10px mono / 0.16em tracking · **tap targets ≥ 48px · gutter 20–22px**.

**Reused (already in production — keep):** the **Editorial sticky-CTA pattern** is already live
(`StickyCtaBar` + the `mobileHero` block) — production already matches the comp's recommended
direction. The fox/dark-premium mood, eyebrow, and teal accent all align.

**Adapted (done this pass):** mobile hero **headline aligned to `No signals. No noise. Just
structure.`** (was "Read market structure clearly.") and subhead aligned to the brand line — so
desktop and mobile now read as the same product. The existing `.mTitle` clamp (2.2–2.7rem / 1.02) and
body (~16/1.5) already sit within the comp's type-scale target, so no risky resize was needed.

**Adapted (recommended, needs your browser to verify — see §12):** add **Space Grotesk 700** for H1
if you want the comp's exact display face (currently system sans — acceptable, but Grotesk is the comp
intent); confirm tap targets ≥48px and gutters 20–22px at 390/430; consider borrowing A's fox banner
as a mid-page brand band.

**Intentionally NOT used (conflicts with approved direction):**
- The comp's secondary CTA **"Free Preview"** → **rejected**; approved production uses **"7-Day Free
  Access"** (and a prior commit already migrated "Free Preview" → "7-Day Free Access"). Cleaner +
  consistent with the beta tiers.
- The ticker module's **"VERDICT Bullish ↗"** directional label → **rejected**; it reads as a
  prediction/signal, which violates the no-signals / no-prediction stance. If a verdict chip is used,
  keep it **structural** (e.g. "Range: holding", "Zone: reclaimed") and non-directional, never
  "Bullish/Bearish ↗".
- The comp's `{{ }}` template placeholders / static chart art are mockups — translate the layout
  intent into the Next.js components; do not paste static HTML.

## 11. Known blocker — EOL churn (must resolve before a site-wide copy commit)
Most beta funnel files currently show **whole-file (CRLF/LF) churn** vs HEAD (BetaShell, faq,
onboarding, feedback, disclaimer, tradingview-access, how-to-use, layout, indicator-guide/data).
Editing any of them to unify copy would bundle that churn into the commit, breaking the "no unrelated
dirty files" rule. **Resolve first on your machine**, e.g. add `.gitattributes` (`* text=auto eol=lf`)
and renormalize, or commit the pending EOL changes separately — then the copy unification below can go
in clean. Files that ARE clean-editable now: the homepage (`rangeclarity-fox-brand-v1/*`), `app/beta/
page.tsx`, `free-access/*`, `welcome/*`, parts of `indicator-guide/_components`.

## 12. Execution checklist
**Copy unification (apply after §11; mostly already compliant):**
- Replace remaining `Join the beta` CTA buttons in `app/beta/_components/BetaShell.tsx:19` and
  `app/beta/tradingview-access/page.tsx:55` → **Get Beta Access** (both are EOL-churned — do with §11).
- `app/beta/page.tsx:149` eyebrow "Join the beta" → optional: keep as section label or → "Beta access".
- Standardize every disclaimer block to the §8 sentence (faq, onboarding, disclaimer, free-access,
  indicator-guide, beta/page footer).
- Reword `indicator-guide` "Illustrative mock" → "Illustration" (keep the honesty, drop "mock").

**Visual / CSS polish (verify in browser at 390 / 430 / 1440):**
- Buttons: one `.btnPrimary` (filled teal) + one `.btn` (outline) style reused across pages; equal
  height, radius, padding; tap height ≥48px on mobile.
- Cards: one radius + border (`--line`) + shadow token; align beta vs homepage cards.
- Type scale: H1 / H2 / body / label consistent with §10; check hero H1 wrap at 390px.
- Spacing: consistent section padding rhythm; gutter 20–22px mobile.
- Remove any visible draft leftovers on public routes (the experiments are already gated).

**Mobile QA matrix (compare against the .dc.html):**
- **390×844** and **430×932**: hero fits first screen with "Get Beta Access" visible (sticky bar);
  H1 wraps cleanly; no clipping/overlap; tap targets ≥48px.
- **1440×900**: desktop hero + lower sections; desktop and mobile feel like one product.

**User-readiness QA:**
- "What is RangeClarity?" understandable in ~3s (eyebrow + H1 + sub).
- Primary CTA path + 7-Day Free Access path both obvious; no misleading test/LIVE/mock language; no
  experimental routes in public nav (`/designs`, `/range-command-premium`, `/variant-codex-section`
  now 404 in prod); no unsupported claims.

## 13. Verify + scoped commit (run on your machine)
```powershell
npm run lint; npm run typecheck; npm run build   # all green
npm run dev                                       # browser QA at 390 / 430 / 1440 vs the .dc.html
# stage ONLY this polish's files (never -A); confirm no research/ .pine lib/payments package-lock
git add app/designs/rangeclarity-fox-brand-v1/page.tsx docs/web/rangeclarity-web-style-guide.md
git commit -m "Polish RangeClarity web experience for beta readiness"
```
