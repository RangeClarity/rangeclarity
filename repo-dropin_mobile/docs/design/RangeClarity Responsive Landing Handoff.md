# RangeClarity — Responsive Landing Handoff

> **Design handoff only.** Nothing here modifies the real repo. All code blocks are **reference-only** —
> they show intent (markup, classes, values), not drop-in files. Authored in the Claude Design workspace.
> Copy this into the repo at `docs/design/` and implement in a Claude Code session whose cwd is the repo.

**Direction (locked):**
- **Desktop:** fox hero — *"No signals. No noise. Just structure."*, fox as premium brand presence.
- **Mobile:** Concept **C "Editorial"** — type-led hero, small fox seal, sticky blurred CTA bar. Fintech-first, mascot-second.
- Reference artifacts: `RangeClarity Landing Concepts.dc.html` (desktop, 3 concepts) · `RangeClarity Mobile Homepage.dc.html` (mobile, 3 concepts + full page).
- Fox assets: `public/brand/fox-hero.png` (2172×724, wide cinematic) · `public/brand/fox-badge.png` (1254×1254, circular seal).

---

## 1. Desktop direction

**Hero structure** — full-bleed dark section, single screen.
- Background: `fox-hero.png`, `object-position: right`, `object-fit: cover`.
- Left-side scrim for legibility:
  `linear-gradient(90deg,#0A0D13 0%, rgba(10,13,19,.94) 30%, rgba(10,13,19,.45) 60%, rgba(10,13,19,0) 100%)`.
- Copy column pinned to the **left ~45%** (max-width 640px), vertically centered:
  - eyebrow (mono, teal dot): `MARKET-STRUCTURE CLARITY`
  - H1 (Space Grotesk 700, ~54px): **No signals. / No noise. / Just structure.** (third line teal)
  - sub (≤2 lines): *"A premium market-structure layer for reading ranges, zones and chart context with less noise."*
  - micro stats row: `CLEAN CHART · One readable layer` / `COMPLEX ENGINE · Multi-timeframe context`

**Fox placement** — environmental, bleeds off the right edge. Never foreground, never a sticker. The badge appears only as the 28px nav mark.

**CTA placement** — inline under the sub, left column:
- Primary (teal, filled): **Get Beta Access →** → `/beta?plan=beta_29`
- Secondary (outline): **Free Preview** → `/beta?plan=free_preview`

**Product preview role** — first section *below* the hero: a single wide chart panel with edge-pinned chips (Local S/R, Key Zone, Soft Channel, Market Bias). Demonstrates "the chart, already read." Not a dense dashboard.

**Lower sections to preserve (do not redesign — light spacing/accent only):**
Three modules. One clear call. · One ticker, fully read · From chart to decision in five steps · What RangeClarity is not. · Simple access. Full range clarity · Straight answers · Stop chasing candles. Start reading the range.
Keep **Premium Indicators** and **Investor Research Lab** as their existing sections/pages.

---

## 2. Mobile direction — Concept C "Editorial"

**Hero (type-led, real iPhone @ 390pt):**
- Top bar: fox-badge (24px) + `RangeClarity` wordmark left; hamburger right.
- Seal row: fox-badge (46px) beside a 2-line mono kicker `MARKET-STRUCTURE / CLARITY SYSTEM`.
- H1 Space Grotesk 700, **38–40px / line-height 1.0**, three stacked lines, third teal.
- Sub: one short sentence, ≤300px measure.
- Faint structure chart drifts behind the hero at **~9% opacity** (decorative, `pointer-events:none`).

**Sticky CTA behavior:**
- Fixed bar at the bottom of the viewport, height ~74px, `background: rgba(10,13,19,.82)` + `backdrop-filter: blur(12px)`, top hairline.
- Holds **Get Beta Access →** (flex-grow, teal) + **Free Preview** (outline).
- Visible on **every scroll position** — the hero's own CTAs can be omitted because the bar always carries them. This is the primary mobile conversion mechanism.
- Hide the bar only when the in-page final CTA is on screen (optional `IntersectionObserver`) to avoid duplicate buttons.

**Section order (top → bottom):**
1. Hero (Editorial) 2. Product preview 3. Three modules 4. One ticker, fully read 5. Five-step timeline 6. What RangeClarity is not 7. Pricing 8. FAQ (accordion) 9. Final CTA.

**Mobile type scale:**
- H1 38–40 / 1.0 · Section H 22 / 1.15 · body 14–15 / 1.55 · label 10 mono / 0.16em tracking · micro/legal 9.5–11.5.
- Never below 12px for reading content (legal/mono labels excepted).

**Spacing rhythm:**
- Page gutter 20–22px. Section top padding ~30px. Cards: 14–20px internal padding, 12px gaps between stacked cards.
- One idea per card; mono eyebrow → tight header → ≤2 body lines. No horizontal scroll anywhere.

**Tap targets:** all interactive elements ≥ **48px** height. CTA buttons 13–15px padding block. FAQ rows full-width tap.

**Product preview simplification:** ONE chart, **max four labels** — Strong Zone, Weak Structure, Range Context, Visual Verdict — as chips pinned to chart edges. Chunky candles, faint gridlines, footer row `VISUAL VERDICT · Bullish ↗`. No multi-pane desktop dashboard.

**Pricing mobile layout:** three **stacked** cards (not a row).
- Free Preview $0 (outline CTA) → `/beta?plan=free_preview`
- **Beta Access $29** — emphasized: teal border, teal-tint bg, `MOST POPULAR` tab, filled teal CTA → `/beta?plan=beta_29`
- Pro Beta $49 (outline CTA, "adds Investor Research Lab") → `/beta?plan=pro_beta_49`

**FAQ accordion behavior:** single-open accordion. Tap a row → expand its answer (`max-height` transition ~0.25s), `+` rotates to `×` (45°). Tapping the open row closes it. Keep answers ≤3 lines.

**Final CTA:** teal-glow card, fox-badge (52px), H2 **"Stop chasing candles. / Start reading the range."**, full-width **Get Beta Access →**. Mono legal line underneath (no signals / no prediction / not advice).

---

## 3. Shared design system

**Colors**
| Token | Value | Use |
|---|---|---|
| Base | `#0A0D13` | page bg |
| Panel | `#0D121B` | cards |
| Panel-2 | `#0a0e15` | nested wells |
| Hairline | `rgba(255,255,255,.07–.08)` | borders/dividers |
| Text | `#EAEEF4` / `#F4F7FA` | headings/body |
| Dim | `#9AA3B2` | secondary text |
| Muted | `#6b7280` | labels/legal |
| **Clarity teal** | `#2DD4BD` | primary action, links, accents |
| Strong | `#34D9A0` | strong structure / bullish |
| Weak / noise | `#EF5A60` | weak structure / invalidation |
| Soft channel | `#38BDF8` | channel / research accent |
| Fox amber | `#F0922E` | sparing brand accent only |
| Button text | `#04221E` | text on teal fills |

**Typography** — Space Grotesk (display/headings, 600–700) · IBM Plex Sans (body, 400–600) · IBM Plex Mono (labels, data, legal). Tight tracking on display (`-0.02em`); wide tracking on mono labels (`0.16em`), uppercase.

**Spacing** — 4px base. Card padding 14–24px. Section padding: desktop 56–70px, mobile 22–34px. Gutters: desktop 56px, mobile 20–22px.

**Card radius** — cards 13–14px · large/feature cards 16–18px · phone screen 34px · chips/wells 9–11px · buttons 9–12px.

**Button styles**
- Primary: bg `#2DD4BD`, text `#04221E`, weight 600, radius 9–12px, shadow `0 8px 22px rgba(45,212,189,.28)`.
- Secondary: transparent, 1px `rgba(255,255,255,.16–.18)`, text `#D4DAE2`.
- Min height 48px (mobile). Label uses `→` affordance on primary.

**Fox usage rules**
- ✅ Allowed: desktop hero (environmental, off right edge) · nav mark (24–28px) · mobile seal (46px) · final-CTA badge (52px) · Beta/onboarding entry (larger, B "Badge Forward").
- ✅ Mid-page brand moment: A's fox-hero banner strip (gradient-masked top & bottom).
- ❌ Banned: comic/meme panels on the landing page · the goat / owl / human variants (off-brand mixing) · fox as a foreground cartoon sticker · childish poses · more than one fox instance competing on a single screen.
- Tone: intelligent, calm, premium, sharp, slightly futuristic. Fintech first, mascot second.

**Chart / interface visual language**
- Dark panel, faint gridlines (`rgba(255,255,255,.05)`), chunky candles (strong `#34D9A0` / weak `#EF5A60`).
- Structure overlays: dashed S/R lines, teal-tint zone rect, dotted soft-channel, one `MARKET BIAS` chip.
- Labels are mono chips pinned to chart edges. Vocabulary: Strong Zone, Weak Structure, Range Context, Key Zone, Soft Channel, Visual Verdict, Market Bias. Never entry/exit/target/signal labels.

**Accessibility notes**
- Body text ≥ 12px; primary copy 14px+. Contrast: teal `#2DD4BD` on `#0A0D13` ≈ 8:1; dim `#9AA3B2` on base ≈ 6:1 — both pass AA.
- Tap targets ≥ 48px; FAQ rows and nav are full-width tappable.
- Don't encode meaning in color alone — pair strong/weak color with text ("Strong Zone", "Weak Structure") and the ×/+ icons in FAQ.
- Sticky CTA must not overlap the final CTA (observer toggle). Respect `prefers-reduced-motion` for accordion/transition.
- Faint background chart is decorative: `aria-hidden`, `pointer-events:none`.

---

## 4. Implementation mapping for Claude Code

Implement later, in the repo, in this order of safety:

1. **Mobile hero + sticky CTA (first step — see §below).** Replace/improve the homepage hero at the mobile breakpoint only, with the C "Editorial" treatment + sticky bar. Safe, self-contained.
2. **Desktop hero** — apply the fox-hero treatment at `md+`. Improve only; don't restructure the page.
3. **Preserve original lower homepage sections unchanged** (reuse existing components):
   Three modules. One clear call. · One ticker, fully read · From chart to decision in five steps · What RangeClarity is not. · Simple access. Full range clarity · Straight answers · Stop chasing candles. Start reading the range.
4. **Keep Premium Indicators** and **Keep Investor Research Lab** sections/pages.
5. **Keep beta / payment / signup / admin routes untouched** — link only.

**Reference-only** hero sketch (NOT a repo file — illustrates structure/classes only):
```tsx
// reference-only — adapt to the repo's components & conventions
<section className="relative min-h-[88svh] bg-[#0A0D13] overflow-hidden md:min-h-screen">
  {/* desktop fox bleed */}
  <img src="/brand/fox-hero.png" alt="" aria-hidden
       className="hidden md:block absolute inset-0 h-full w-full object-cover object-right" />
  <div className="hidden md:block absolute inset-0
       bg-[linear-gradient(90deg,#0A0D13_0%,rgba(10,13,19,.94)_30%,rgba(10,13,19,.45)_60%,transparent_100%)]" />
  {/* mobile faint structure backdrop */}
  <StructureGlyph aria-hidden className="md:hidden absolute inset-0 opacity-[.09] pointer-events-none" />

  <div className="relative mx-auto max-w-6xl px-5 md:px-14 pt-6 pb-28 md:py-0
       md:min-h-screen md:flex md:flex-col md:justify-center">
    <div className="flex items-center gap-3 md:hidden mb-5">
      <img src="/brand/fox-badge.png" alt="RangeClarity" className="h-12 w-12 rounded-full" />
      <p className="font-mono text-[10px] tracking-[.16em] uppercase text-[#9AA3B2] leading-7">
        Market-structure<br/>clarity system</p>
    </div>
    <h1 className="font-[Space_Grotesk] font-bold tracking-[-.025em] text-[#F4F7FA]
        text-[38px] leading-[1.0] md:text-[54px] md:max-w-xl">
      No signals.<br/>No noise.<br/><span className="text-[#2DD4BD]">Just structure.</span></h1>
    <p className="mt-4 max-w-[300px] md:max-w-md text-[14px] md:text-base leading-[1.55] text-[#AEB6C2]">
      A premium market-structure layer for reading ranges, zones and chart context with less noise.</p>
    {/* desktop inline CTAs (mobile uses the sticky bar) */}
    <div className="mt-7 hidden md:flex gap-3.5">
      <a href="/beta?plan=beta_29" className="rounded-[10px] bg-[#2DD4BD] px-6 py-3.5 font-semibold text-[#04221E]">Get Beta Access →</a>
      <a href="/beta?plan=free_preview" className="rounded-[10px] border border-white/20 px-6 py-3 text-[#D4DAE2]">Free Preview</a>
    </div>
  </div>

  {/* mobile sticky CTA */}
  <div className="md:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 px-4 h-[74px]
       bg-[#0A0D13]/80 backdrop-blur-md border-t border-white/8">
    <a href="/beta?plan=beta_29" className="flex-1 text-center rounded-[11px] bg-[#2DD4BD] py-3.5 font-semibold text-[#04221E]">Get Beta Access →</a>
    <a href="/beta?plan=free_preview" className="rounded-[11px] border border-white/20 px-4 py-3.5 text-[#D4DAE2] whitespace-nowrap">Free Preview</a>
  </div>
</section>
```

---

## 5. CTA routing
| Action | Route |
|---|---|
| Primary CTA / Beta Access / Pricing $29 | `/beta?plan=beta_29` |
| Free Preview / Pricing $0 | `/beta?plan=free_preview` |
| Pro Beta / Pricing $49 | `/beta?plan=pro_beta_49` |

All are links into the **existing** beta flow. No new APIs, no checkout/pricing logic changes.

---

## 6. Copy safety
**Never:** buy/sell signals as a feature · guaranteed profit · win rate · price prediction · exact entries/exits · financial advice · get-rich language.
**Use:** market structure · clarity · range · zones · context · visual verdict · less noise · stronger structure reading.
Every pricing/CTA/compliance block must carry a quiet line: *structure & context tools only — no signals, no price prediction, not financial advice.*

---

## What NOT to change
- Payment / pricing / checkout logic · beta signup / admin APIs · DB / Supabase · webhooks.
- Existing lower homepage sections (content/logic) — visual polish only.
- Public nav contents: **do not** re-add Indicator Terminal or Bold Hero. Nav = logo · Premium Indicators · Investor Research Lab · Get Beta Access.
- Don't introduce the goat/owl/human mascots or comic panels.

---

## Visual references
- Desktop concepts board: `docs/design/RangeClarity Landing Concepts.dc.html` (Concept A = chosen hero).
- Mobile concepts board: `RangeClarity Mobile Homepage.dc.html` (Concept C = chosen mobile system; full 9-section phone = target page).
- Static frames: `docs/design/refs/` (if exported alongside this doc).

---

## ✅ Recommended first implementation step
**Implement the mobile C "Editorial" hero + sticky CTA bar**, preserving the existing lower sections and the beta/payment/signup flow.
- Scope: homepage hero at the mobile breakpoint + a fixed bottom CTA bar. Desktop hero untouched in this step.
- CTAs → `/beta?plan=beta_29` and `/beta?plan=free_preview`.
- Acceptance: hero + CTA visible without scrolling on a 390×844 viewport; sticky bar persists on scroll and doesn't overlap the final CTA; lower sections, Premium Indicators, Investor Research Lab, and all beta/payment routes unchanged; `lint` / `tsc` clean.

> Tiny Claude Code prompt to pair with this doc:
> *"Implement mobile C hero + sticky CTA, preserve lower sections, don't touch beta/payment."*
