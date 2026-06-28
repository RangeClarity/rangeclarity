# RangeClarity — Product Plan + Codex Review Request

**Purpose:** (1) save the approved architecture decision and the first ticket, and (2) request a critical review from Codex on the *product plan*. Founder approved Path E + EN-1 on 2026-06-19. Canonical decision record: `docs/decisions.md` D-006. Nothing is implemented yet.

> Codex: please read everything below, then answer the **Review request** at the end. Be a strict, skeptical reviewer — challenge the architecture, the scoring model, and EN-1. Do not rubber-stamp.

---

## 1. The product (what we are building)
RangeClarity helps **serious swing traders** (clear enough for ambitious beginners) answer one question fast: *is a strong-looking stock at a favorable entry now, or already extended / near resistance / no-edge?*

It must answer, in ~5 seconds, on a **daily** chart:
1. Is the primary trend healthy?  2. Where is price vs strong support/resistance?  3. Above/below the 50/100/200 MA?  4. Are the MAs aligned and rising?  5. Near a favorable entry or extended?  6. What invalidates the setup?  7. State = Favorable / Watch / Extended / No Edge / Structurally Weak?  8. *Why* that state?

**Core differentiator:** separate **Structure Quality** (is the company/chart strong?) from **Entry Quality** (is *now* a good place to buy?). A strong stock can have high structure + low entry — this is how we stop users chasing extended moves. No black-box number: every score exposes components, weights, thresholds, reasons, and data-quality warnings. No price prediction, no buy/sell calls.

**Promise:** "Stop chasing. Know your location before you enter the trade."

## 2. Approved architecture — Path E (Pine-first, anchored by a canonical tested core)
The product surface for the Paid Beta is the **TradingView Pine indicator**. TradingView provides the chart, OHLCV data, MAs, S/R drawing, and alerts. The **website** handles marketing, pricing, payment (Whop), access instructions, education, and support. The **scores live in a pure, tested canonical reference module** (EN-1) so the Pine implementation and any future web engine cannot diverge.

**Weighted decision (1–10, 20 criteria):** E 7.72 > B 7.66 (pure Pine-first) > C 6.55 (hybrid) > A 5.18 (web-native) > D 5.13 (web engine + Pine companion). Full comparison: `docs/analysis-engine-plan.md` + the architecture review.

**Why not web-native now:** the web app has **no charting library and no market-data feed** (deps are only `next/react/react-dom`). A web engine needs a *licensed* market-data feed (commercial **display/redistribution** rights — free feeds prohibit this; paid feeds run ~$10–30+/mo before the commercial license), a charting library, the engine, and auth — weeks of spend + licensing risk *before* a single validating sale. Pine-first reaches paying users fastest with near-zero infra and zero data-licensing risk.

**Revisit Path E when:** users demand multi-ticker scanning/watchlists; manual access management exceeds a few hours/week; or TradingView changes invite-only/alert terms.

## 3. Confirmed repo state (evidence)
- **Pine asset is mature:** `RangeClarity_Core.pine` (465 lines, v6) and `pine/rangeclarity_ultimate_core.pine` (494 lines) compute regime/ADX, RSI, EMA, pivot S/R zones, range position, and 0–100 scores. Deep R&D in `tradingview-research/` + `indicator_research_library/`.
- **Scoring model already documented** (`RANGECLARITY_ALGORITHM_DESIGN.md`): module weights structure .30 / regime .25 / momentum .25 / zone .20, named penalties, "any score explainable in one sentence."
- **Gap vs the new spec:** current Pine uses a single EMA + ADX, **not** 50/100/200-MA structure, and does **not** yet output the five states or the Structure-vs-Entry split.
- **Web app:** Next.js 15 landing page; dashboards are hardcoded mock data (`lib/scenarios.ts`); **no** data provider, charting lib, DB, auth, billing, tests, or CI.

## 4. Key external facts (verified 2026-06)
- Market-data EOD pricing indicative: Tiingo from ~$10/mo, EODHD ~$20, Polygon ~$29 — **commercial display/redistribution licenses are separate and cost more**; free tiers exclude commercial rights.
- TradingView free plan: ~2 indicators/chart, 3 active alerts, and **custom-indicator alerts are no longer on the free tier** → alert-reliant customers will need a paid TradingView plan (their cost, not ours). The indicator itself runs on a free account.

## 5. EN-1 — approved first ticket (pure, tested scoring & state engine)
- **User problem:** traders can't tell if a strong stock is a good entry now or extended; the product must answer this transparently and identically everywhere it runs.
- **Objective:** a pure TypeScript module mapping a normalized analysis input → Structure Score, Entry Score, setup state, and a full explanation. The single source of truth for the scores; Pine implements it; a future web engine reuses it.
- **Scope:** `lib/engine/` types; `score()` (Structure + Entry); `classifyState()` (Favorable/Watch/Extended/No Edge/Structurally Weak); `explain()` (components/weights/thresholds/reasons + missing-data/confidence warnings); JSON fixtures; unit tests; a Node demo runner; `docs/scoring-spec.md`.
- **Non-scope:** market-data fetching; computing MAs/S-R from raw OHLCV (next ticket — EN-1 consumes normalized inputs from fixtures); charting/UI; auth/billing; Pine code; watchlist; alerts; any web API.
- **Typed I/O:** `AnalysisInput { trend; ma:{p50,p100,p200:{value,priceVs,slopePctPerBar}}; alignment; location; distToSupportPct; distToResistancePct; extensionAtr; volume; dataQuality }` → `AnalysisResult { structureScore 0–100; entryScore 0–100; state; components:[{name,value,weight,threshold,contribution,reason}]; warnings:string[]; confidence 0–100 }`.
- **Formula:** Structure from trend + MA alignment + slope + structure quality; Entry from location + extension + distance-to-support + reward:risk + volume; state via a documented decision tree with guards (near-resistance + far-above-support ⇒ Extended even when Structure is high). Seed weights from `RANGECLARITY_ALGORITHM_DESIGN.md`. Never predicts price.
- **Fixtures (6):** extended uptrend near resistance (IONQ-like) ⇒ Extended (Structure high/Entry low); pullback to rising support ⇒ Favorable; choppy mid-range ⇒ No Edge; clean downtrend ⇒ Structurally Weak; constructive base ⇒ Watch; missing-data ⇒ warnings + low confidence.
- **Acceptance:** pure & deterministic; types exported; all 6 fixtures hit the expected state/score-band/reasons; every score exposes components/weights/thresholds/reasons; missing-data warnings + confidence; demo prints a readable breakdown; `npm test`/`typecheck`/`lint`/`build` green; qa-engineer review; **founder validates the 6 verdicts match expert reading.**
- **Verification:** `npm test` · `node scripts/engine-demo.mjs` · `npm run typecheck` · `npm run lint` · `npm run build`.
- **Effort:** ~1–1.5 days. Delivers one demonstrable capability (a transparent verdict on real setups), not infrastructure.

## 6. Next two tickets
- **PINE-1** — implement the new-spec indicator in Pine (50/100/200 MAs, S/R zones, location, EN-1's Structure/Entry/state dashboard, alerts); reconcile the two Pine files into one canonical script; parity check (same fixture inputs ⇒ Pine state/score matches EN-1).
- **ACCESS-1** — Whop product + checkout, invite-only TradingView publish, Discord access, written grant/revoke runbook (manual for first 5).

## 7. Open founder decisions
O-002 offer + price; O-006 which Pine file is canonical; O-007 how much of the formula to expose. (None block starting EN-1.)

---

## Review request (Codex — please answer these)
Be blunt and specific. Cite where you disagree.

1. **Architecture:** is Pine-first + canonical core (Path E) right for reaching 5 paying users, or are we underrating web-native / hybrid? What would change your mind?
2. **EN-1 scope:** is a pure TS scoring core the right *first* build, or is it premature/over-engineered for a Pine-first product? Should EN-1 instead be the Pine work, or a thinner artifact?
3. **Scoring model:** critique the Structure-vs-Entry split and the seed weights (structure .30 / regime .25 / momentum .25 / zone .20). Is the decomposition sound? What components/penalties are missing or wrong? How should `state` be decided from the two scores?
4. **Pine feasibility:** can the full new spec (50/100/200 MAs, S/R zones, five states, two transparent scores, alerts) run **reliably and without repaint** in Pine v6? Any Pine limits we're underestimating (arrays, security calls, table/label budgets, alert granularity)?
5. **S/R algorithm:** best **deterministic** zone-detection approach that can be implemented with parity in both Pine and TS?
6. **Formula parity & divergence:** is "EN-1 reference + fixtures + parity test in PINE-1" a sufficient guard, or will Pine and TS drift anyway?
7. **IP exposure:** how much of the formula should be visible to customers? Real cloning risk?
8. **Ops/access:** invite-only + Whop + Discord at 5–50 users — what breaks first? Cancellation/revocation pitfalls?
9. **Pricing:** is $29–49/mo realistic for this product and audience?
10. **Disposability:** is any part of this plan a rebuild-it-later trap?

**Please return:**
- Agree / disagree on Path E (and why).
- Concrete changes to EN-1 (scope, I/O, fixtures, acceptance).
- A scoring-model critique with specific weight/threshold suggestions.
- A Pine-feasibility verdict (can it do the full spec, and what to cut if not).
- Top 3 risks + the single biggest risk.
- A clear **go / no-go** on starting EN-1 as specified.

## How to share with Codex
Paste this file's contents into Codex, or run it through your Codex CLI (e.g. `codex -f docs/product-plan-codex-review.md` or pipe the file in). Then drop Codex's response back to the Chief of Staff and we'll reconcile it into `docs/decisions.md` before EN-1 starts.
