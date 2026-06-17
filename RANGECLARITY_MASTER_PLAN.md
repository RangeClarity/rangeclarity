# RangeClarity - Master Plan

**Status:** Planning phase only. No production code, no landing page, no Pine Script yet.  
**Owner:** Dean  
**Last updated:** 2026-06-14 (revision 2 — review pass applied)  
**Domain:** RangeClarity.com  
**Core message:** No signals. No hype. Just chart clarity.

> Revision 2 note: A strict review pass was applied on 2026-06-14. The intended external (Codex) review output was not available, so the review was performed in-house; refinements are summarized in `REVIEW_AND_PHASE1.md`. Items marked "(recommended, pending approval)" below are not yet locked.

This document is the operating plan for RangeClarity. It is intentionally scoped down for a clean Phase 1. When a feature makes the product louder, more signal-like, harder to explain, or harder to launch, it is deferred.

---

## 1. Executive Summary

RangeClarity is a clean TradingView dashboard that helps traders understand chart context: trend, support, resistance, range, location, extension, volume, and momentum.

The product does not provide buy or sell signals. It does not promise profits, accuracy, win rate, or trade outcomes. Its purpose is to make the chart easier to read before the trader makes their own decision.

The refined MVP is deliberately smaller than the original concept:

- Launch first with a free public TradingView Starter script.
- Use the Starter script to validate whether traders value the clarity layer.
- Use RangeClarity.com for a simple landing page, waitlist, and disclosure.
- Use Discord only for onboarding, support, education, and feedback.
- Defer Pro, Whop automation, advanced VWAP/AVWAP, multi-timeframe layers, alerts, and complex scoring until the Starter product is trusted.

The wedge is not "another indicator." The wedge is calm chart context without hype.

---

## 2. Product Vision

RangeClarity should become the simplest trustworthy way for a TradingView user to answer:

- What is the current chart bias?
- Is price near support, resistance, or the middle of a range?
- Is the move extended?
- Is the range clean or messy?
- Is volume helping or not?
- Is this chart worth attention, or should I wait?

The long-term product can grow into a Pro dashboard inspired by Mark Minervini and Brian Shannon, but Phase 1 must stay narrow. The first job is to prove that a trader wants this kind of clarity and trusts the product language.

**Product promise:** Clean chart context in seconds.  
**Product boundary:** Educational decision-support only. No recommendations.

---

## 3. Brand Positioning

**Positioning:** A clean TradingView dashboard for traders who want trend, support, resistance, range, location, and risk context without noisy charts.

**Main tagline:** No signals. No hype. Just chart clarity.

**Supporting lines:**

- "Know where price is before deciding what matters."
- "Trend, range, location, and extension in one calm dashboard."
- "Context for disciplined traders."

**Tone:**

- Calm
- Precise
- Plain-spoken
- Professional
- Skeptical of hype

**Tone boundary (meme / internet-native):** A lighter, internet-native voice is allowed in *social content only* (short posts, clips). The product UI, dashboard, landing page, and any disclosure stay strictly calm and premium. Memes never appear in the product or near risk language, where they would undercut trust in a scam-heavy category.

**Approved product language:**

- Bias
- Context
- Location
- Range
- Extension
- Support zone
- Resistance zone
- Mixed
- Constructive
- Extended
- Wait
- Watch
- Educational decision-support

**Banned or restricted language:**

- Buy
- Sell
- Entry
- Exit
- Signal
- Guaranteed
- Profit
- Win rate
- Accuracy
- High probability
- Easy money
- Beat the market

If a phrase sounds like a recommendation, remove it.

---

## 4. Target Users

**Primary users:**

- Self-directed retail swing traders
- Position traders focused on daily charts
- TradingView users who already understand basic support, resistance, moving averages, and risk
- Traders who follow Minervini/Shannon-style discipline but want a cleaner workflow

**Secondary users:**

- Newer traders learning chart structure
- Part-time traders scanning many symbols
- Educators who want a clean visual framework

**Not the target user:**

- Scalpers who need tick-level decisions
- Signal buyers who want exact trades
- Quant traders who want raw data or backtests
- Users expecting the product to tell them what to do

The first beachhead should be US equities on daily swing-trading charts. Other assets can work later, but the initial defaults should be tuned for that use case.

---

## 5. MVP Definition

The MVP exists to validate one question:

**Do traders value a clean chart-context dashboard enough to install it, use it repeatedly, and ask for more?**

### Phase 1 MVP Product

Phase 1 should produce the spec and readiness for a single public TradingView Starter indicator.

The Starter indicator should include:

- Bias: Bullish / Bearish / Neutral
- State: Wait / Watch / Constructive / Strong Trend / Extended
- Context Score: 0-100, secondary to State
- Nearest support zone
- Nearest resistance zone
- Distance to support %
- Distance to resistance %
- Range width %
- Position inside range %
- ATR extension
- Volume / RVOL status
- Momentum status
- One plain-English interpretation sentence

### MVP Surfaces

Required for first launch:

- Free public TradingView Starter script
- One-page RangeClarity.com landing page
- Waitlist capture for Pro
- Basic Discord server for onboarding and support
- Standard disclosure and prohibited-language rules

### Not In The MVP

Defer all of the following:

- Invite-only Pro build
- Whop checkout automation
- Advanced Pro Mode
- Anchored VWAP automation
- Multi-timeframe dashboard
- Squeeze/VCP module
- Alerts
- Backtesting
- User accounts
- Custom SaaS backend
- Supabase or database
- AI features
- Paid ads
- Affiliate program
- Multiple pricing tiers
- Testimonials

Pro remains part of the business model, but not part of the first product validation milestone.

---

## 6. Indicator Spec

The indicator must feel like a dashboard, not a signal engine.

### Clean Mode Only For V1

Starter V1 has one mode: Clean Mode.

Visible by default:

- Compact dashboard
- EMA 50 trend reference
- Nearest support zone
- Nearest resistance zone

Hidden or deferred:

- Extra moving averages
- ATR bands
- Supertrend
- Market-structure labels
- VWAP/AVWAP layers
- Multiple support/resistance zones
- Alerts
- Squeeze/VCP visuals

### Dashboard Rows

**Refinement (recommended, pending approval):** 13 rows is too many for a 10-second read and conflicts with "fewer, cleaner" — the plan's own "What To Avoid" warns against too many rows. Starter Clean Mode targets ~7 lines by consolidating related metrics:

1. Bias
2. State
3. Support / Resistance (both zone values on one line)
4. Location (distance to support %, distance to resistance %, position in range %)
5. Range Width %
6. Extension + Volume (ATR extension state; RVOL/volume state)
7. Interpretation sentence

Momentum feeds State and the Interpretation sentence internally rather than taking its own Starter row. The first visible read is State + Bias. Context Score is **recommended Pro-only / internal in V1** (see below) and is not shown as a row in Starter.

### Bias

Bias is descriptive, not directive.

- Bullish: price and trend structure are constructive.
- Bearish: price and trend structure are weak.
- Neutral: trend, structure, or location is mixed.

Bias must never be paired with action language.

### State

Use state labels that describe chart condition:

- **Wait:** unclear, weak, poor location, or insufficient structure.
- **Watch:** improving but not clean enough.
- **Constructive:** trend and location are reasonable, but not a command.
- **Strong Trend:** strong trend context, only if location is not poor.
- **Extended:** trend may be strong, but current location carries chase risk.

Avoid "Favorable" in V1 because it sounds too close to a recommendation.

### Context Score

**Refinement (recommended, pending approval — resolves Open Question 3):** Do not display the numeric 0-100 score in Starter V1. A precise number next to a chart reads as odds or a trade rating no matter how it is labeled, which is the single biggest "is this a signal tool?" risk. Compute it internally to drive State and ordering, but surface only the State in Starter. If a number is ever shown (Pro), it stays secondary and is named **Context Score**, never "setup score" or "trade score."

The score model below is the internal logic, regardless of whether the number is displayed.

Suggested starting weights:

- Trend: 25
- Moving average relationship: 15
- Range location: 20
- ATR extension: 15
- Volume / RVOL: 10
- Momentum: 10
- Data quality / range quality: 5

Hard caps:

- If price is Extended, State must be Extended regardless of score.
- If no clean support/resistance range exists, State cannot be Strong Trend.
- If data is insufficient, State must be Wait or Insufficient Data.
- If price is too close to resistance in a bullish context, State cannot be Strong Trend.
- If price is too close to support in a bearish context, State cannot be Strong Trend.

The score should explain context. It should not imply odds.

### Trend

V1 trend logic should be simple:

- Price relative to EMA 50
- EMA 50 slope
- Optional EMA 200 relationship if enough bars exist
- Recent swing structure where available

Do not attempt a full Minervini Stage 1-4 model in V1. Use a simpler trend read first.

Relative strength versus a benchmark (a Minervini signature) is **intentionally deferred** from V1: it requires a benchmark symbol via `request.security` and adds complexity and another repaint surface. It is a strong Pro candidate, not a V1 requirement.

### Momentum

Momentum should be classified, not over-modeled:

- Improving
- Flat
- Weakening

Use a simple method such as rate of change, slope, or smoothed oscillator behavior. Do not turn momentum into a directional signal.

### Volume / RVOL

V1 volume should show:

- RVOL compared with a rolling average
- Volume above / normal / below average

Do not overstate volume "confirmation." Prefer "volume is elevated," "volume is normal," or "volume is light."

### ATR Extension

ATR extension should answer:

**Is price stretched from a reasonable trend reference?**

Use distance from EMA 50 in ATR multiples as the V1 reference. VWAP/AVWAP extension can come later.

Example states:

- Normal
- Stretched
- Extended

When extension is high, the dashboard should warn about location, not predict reversal.

---

## 7. Support / Resistance Engine Spec

The support/resistance engine must be simple, explainable, and stable. V1 should show fewer, better levels.

### V1 Approach

Use confirmed swing pivots:

- Pivot highs become resistance candidates.
- Pivot lows become support candidates.
- A pivot is confirmed only after bars close on both sides.
- Confirmed pivots avoid obvious repainting behavior.

Cluster nearby levels:

- Merge nearby pivots into zones.
- Use ATR-based tolerance, optionally with a small percent-of-price floor.
- Prefer recent and repeated levels.

Show only:

- Nearest meaningful support below price
- Nearest meaningful resistance above price

### Zone Rules

Support/resistance should be zones, not exact lines.

Zone quality should consider:

- Recency
- Number of touches
- Reaction size
- Distance from current price
- Whether the level is too noisy or too thin

Do not add volume profile, anchored VWAP levels, or multi-timeframe zones in V1.

### Distance Metrics

Display:

- Distance to support %
- Distance to resistance %
- Range width %
- Position inside range %

Rules:

- If support is missing, show "No nearby support."
- If resistance is missing, show "No nearby resistance."
- If both are missing, show "Range undefined."
- If resistance is less than or equal to support, suppress range metrics.
- Clamp position inside range for display, and label price as Below Range or Above Range when needed.

### Edge Cases

The spec must explicitly handle:

- IPOs or new listings with limited history
- Symbols with too few bars
- Illiquid tickers
- Gaps
- Very low-priced symbols
- All-time highs with no overhead resistance
- Breakdown lows with no nearby support
- Extremely wide ranges
- Noisy crypto or low-float charts

If the engine cannot find clean levels, it should say so. Bad levels are worse than no levels.

---

## 8. Dashboard UX Principles

The dashboard is the product. The chart should remain clean.

### Information Hierarchy

Top section:

- Bias
- State

(Context Score is internal in V1 and not shown here — see Section 6.)

Middle section:

- Support / Resistance (one line)
- Location (distance to support %, distance to resistance %, position in range %)
- Range Width %

Bottom section:

- Extension + Volume (ATR extension state; RVOL/volume state)
- Interpretation sentence

### UX Rules

- State is primary. Score is secondary.
- Use neutral language.
- Use restrained color only for Bias and State.
- Keep rows stable so the dashboard does not visually jump.
- Show unavailable values as "N/A" or a clear label, not zero.
- Never use arrows that imply action.
- Never flash or animate.
- Avoid too many chart overlays.
- Keep the interpretation sentence short.

### Safer Interpretation Examples

Approved:

- "Trend is constructive, but price is extended from support."
- "Range is unclear; wait for cleaner structure."
- "Price is near resistance, so location is less attractive."
- "Volume is light and momentum is flat."
- "Price is near support inside a defined range."

Avoid:

- "Buy the breakout."
- "Strong long setup."
- "High probability move."
- "Great entry here."
- "This should run."

---

## 9. Landing Page Plan

The landing page should be one static page. Its job is to explain the product, build trust, and route users to Starter or the Pro waitlist.

### Hero

Headline:

**RangeClarity**

Subheadline:

**A clean TradingView dashboard for trend, support, resistance, range, location, and extension. No signals. No hype. Just chart clarity.**

Primary CTA:

**Get Free Starter**

Secondary CTA:

**Join Pro Waitlist**

### Required Sections

1. Product screenshot or mockup
2. What it shows
3. Who it is for
4. Who it is not for
5. Starter now / Pro later
6. How it works at a high level
7. Disclosure block
8. Footer with terms, privacy, contact, and Discord

### Landing Page Restrictions

Do not include:

- Profit screenshots
- P&L examples
- Win-rate claims
- Urgency countdowns
- Fake scarcity
- Testimonials before real usage
- Multiple pricing tables
- AI or Elite tier language
- "Signal" language

The landing page should sell trust, not fantasy.

---

## 10. Go-To-Market Plan

The first go-to-market motion is organic trust-building through the free TradingView script and educational chart-context content.

### First Channel

TradingView organic discovery should be the first channel:

- Publish the free Starter script.
- Use a clear, compliant script description.
- Link to RangeClarity.com where allowed.
- Respond to comments with education and support.
- Avoid spammy vendor behavior.

### First Content Motion

Create weekly chart-context breakdowns:

- 3 to 5 charts per post
- Focus on trend, range, location, extension, and support/resistance
- No predictions
- No "what to buy" content
- Repurpose to X, YouTube Shorts, TikTok, Discord, and email

### Fastest Realistic Path To First 100 Users

1. Recruit 10 manual feedback users before launch.
2. Build the free Starter script after specs are approved.
3. Publish Starter publicly on TradingView.
4. Post 10 educational chart breakdowns using Starter.
5. Invite users to Discord for onboarding and feedback.
6. Capture Pro waitlist interest, but do not sell Pro until the product earns it.

### Avoid Early

- Paid ads
- Affiliates
- Hype creators
- Paid Discord signals
- Daily trade calls
- Complex onboarding funnels

---

## 11. Monetization Plan

Monetization should follow trust, not precede it.

### Phase 1

No paid product yet. Build:

- Free Starter
- Pro waitlist
- Discord feedback loop
- Manual user interviews

### Pro Beta

Open Pro only after Starter has signs of usage and demand.

Pro Beta should be narrow:

- Same clean dashboard foundation
- More customization
- Additional support/resistance zones
- Optional higher-timeframe context
- Optional neutral state-change alerts
- Better interpretation controls

Still defer:

- Full AVWAP automation
- Complex VCP engine
- Strategy/backtesting
- AI explanations
- Multi-tier pricing

### Pricing

Recommended launch path:

- Starter: free
- Pro Beta: $29/month early access
- Mature Pro: test $39/month after retention is proven
- Annual plan: defer until churn and retention are understood

Trial:

- For V1 Pro, prefer a **7-day money-back guarantee over a free trial.** Invite-only TradingView access is granted per username and is awkward to time-box and auto-revoke, so a free trial creates manual access churn at exactly the wrong time. A money-back window gives the same low-risk feel without the access-management overhead.
- Do not create a second free Pro tier.

Whop remains the likely payment/access platform once Pro exists.

---

## 12. Compliance Risks And Operating Rules

RangeClarity operates near financial-advice perception risk. The product must be conservative in UI, marketing, Discord, and support.

### Main Risks

- The dashboard is interpreted as a recommendation.
- The Context Score is interpreted as odds or expected return.
- Discord support becomes personalized advice.
- Marketing implies profitability.
- TradingView removes or limits the script for vendor or publishing-rule issues.
- Testimonials imply trading results.
- Pro access management mishandles user data or churn revocation.

### Required Operating Rules

- No buy/sell wording in UI, docs, marketing, Discord, or alerts.
- No profit, win-rate, or accuracy claims.
- No personalized trade advice.
- No P&L screenshots as marketing proof.
- No testimonials about money made.
- No "this will move" phrasing.
- No state labels that sound like instructions.
- All examples are educational and historical.

### Standard Disclosure

Use a version of this on the landing page, TradingView description, Discord onboarding, and Pro materials:

**RangeClarity is an educational chart-context tool. It does not provide financial advice, investment recommendations, buy/sell signals, or guarantees of performance. Trading involves risk. You are responsible for your own decisions.**

### Discord Rules

Discord should support:

- Setup help
- Product education
- Chart-context examples
- Feedback
- Changelog discussion

Discord should not support:

- Personalized trade calls
- "Should I buy this?"
- P&L contests
- Hype rooms
- Unmoderated claims

Before paid Pro launch, review official TradingView vendor rules and get qualified legal/compliance review.

---

## 13. Technical Architecture

The architecture should stay lightweight until demand proves otherwise.

### Needed For V1

- TradingView Pine Script Starter indicator
- Static RangeClarity.com landing page
- Hosted waitlist form
- Discord server
- Planning/docs repo

### Needed Later For Pro

- Invite-only TradingView script
- Whop checkout
- Manual or automated TradingView username access flow
- Discord role access
- Churn/revoke process

### Defer

- Custom backend
- User accounts
- Database
- Supabase
- Analytics stack beyond basic page metrics
- Sentry or error monitoring
- AI services
- Custom billing
- Mobile app

### Pine Feasibility Notes (build-readiness, not features)

Captured now so the future build avoids known traps:

- **Non-repainting only.** Confirmed pivots (bars closed on both sides) and last-closed-bar logic only. No `lookahead_on`.
- **Higher-timeframe context (Pro later)** must use confirmed HTF closes via `request.security(..., lookahead_off, barmerge.gaps_off)` to avoid repaint.
- **One table for the dashboard.** Render with a single `table` object, not many `label`/`line` objects, for performance and a clean look. Mind TradingView's per-script object limits.
- **Keep V1 light.** Avoid heavy loops over large lookbacks; cap the number of tracked pivots/zones. Favor simple, explainable math over clever indicators.
- **VWAP/AVWAP, RS, MTF, squeeze/VCP stay out of V1** partly for these feasibility/repaint reasons.

### Security / Operations

- Do not store more user data than needed.
- Treat TradingView usernames and emails as private.
- Use 2FA on TradingView, Whop, Discord, GitHub, and domain accounts.
- Keep access grants/revokes auditable once Pro exists.
- Do not expose private script logic in public docs beyond necessary explanation.

---

## 14. 30 / 60 / 90 Day Roadmap

Dates are anchored to June 14, 2026.

### Days 1-30: Scope, Spec, And Starter Build Readiness

Goal: approve the simple product and prepare to build without ambiguity.

Deliverables:

- Approved master plan
- Final Starter dashboard spec
- Final support/resistance spec
- Final scoring/state rules
- Dashboard wireframe
- Compliance language kit
- Landing page copy outline
- Manual test chart set
- Discord structure draft

No production code until this phase is approved.

### Days 31-60: Build And Private Test Starter

Goal: build the simplest useful Starter script and validate it manually.

Deliverables:

- Starter Pine Script prototype
- Visual testing across selected charts
- Landing page draft
- TradingView description draft
- Discord onboarding draft
- 10 to 20 private feedback users

### Days 61-90: Public Starter Launch And Pro Waitlist

Goal: publish Starter, build trust, and learn what users actually want next.

Deliverables:

- Public TradingView Starter script
- RangeClarity.com live
- Pro waitlist live
- Discord live
- Weekly chart-context content cadence
- Feedback log
- **Validation targets set and measured** so the Pro decision is evidence-based, not a feeling. Set explicit 90-day thresholds up front (illustrative, Dean to confirm): e.g. ~500+ Starter installs/boosts, ~150+ Discord members, ~100+ Pro waitlist signups, and qualitative "I use this daily" feedback. Hitting them = build Pro; missing them = iterate Starter first.
- Pro Beta decision: build, defer, or adjust (gated on the validation targets above)

---

## 15. Final Phase 1 Plan

Phase 1 is planning and product-definition only. It ends with an approved, build-ready Starter spec.

### P1-1: Approve Simplified Scope

**Goal:** Confirm that Starter is the only build target for first launch.  
**Output:** Master plan marked approved.  
**Done when:** Pro, Whop, advanced VWAP/AVWAP, alerts, MTF, squeeze, backend, and paid ads are explicitly deferred.

### P1-2: Finalize Starter Dashboard Spec

**Goal:** Define every row and label.  
**Output:** Dashboard spec with Bias, State, Context Score, S/R, distance metrics, ATR extension, RVOL, momentum, and interpretation rules.  
**Done when:** No new product decisions are needed to build the dashboard.

### P1-3: Finalize Support/Resistance Rules

**Goal:** Make the level engine stable and explainable.  
**Output:** Pivot rules, clustering rules, zone display rules, formulas, and edge-case behavior.  
**Done when:** Missing/invalid levels are handled without misleading numbers.

### P1-4: Finalize Score And State Logic

**Goal:** Prevent score from becoming a signal.  
**Output:** Context Score weights, hard caps, state definitions, and interpretation copy rules.  
**Done when:** Extended, unclear range, and insufficient data cannot accidentally produce Strong Trend.

### P1-5: Create Dashboard Wireframe

**Goal:** Lock the UX before coding.  
**Output:** One compact dashboard layout with row order, colors, labels, and unavailable-value states.  
**Done when:** The design is readable without chart clutter.

### P1-6: Create Compliance Kit

**Goal:** Keep all future copy aligned.  
**Output:** Banned words, approved words, standard disclosure, Discord rules, TradingView description rules.  
**Done when:** Every surface can be reviewed against the kit.

### P1-7: Draft Landing Page Copy

**Goal:** Prepare a simple, trustworthy launch page.  
**Output:** Hero, product sections, CTA copy, disclosure, footer copy.  
**Done when:** The page explains the tool without claims, hype, or pricing complexity.

### P1-8: Build Manual Test Chart Set

**Goal:** Prepare real charts for later validation.  
**Output:** 20 example symbols/charts covering clean trends, messy ranges, extensions, missing resistance, missing support, low volume, and gaps.  
**Done when:** Each chart has expected dashboard behavior written in plain English.

### P1-9: Decide Launch Operations

**Goal:** Make launch logistics boring.  
**Output:** TradingView account, waitlist tool, Discord structure, domain access, social handles.  
**Done when:** Nothing operational blocks the Starter build.

### P1-10: Approval Gate

**Goal:** Decide whether to begin coding.  
**Output:** Go/no-go decision for Starter build.  
**Done when:** Phase 1 is approved and the next task is Pine Script implementation.

---

## 16. First 10 Manual Actions

1. Approve this simplified master plan or mark final edits.
2. Confirm US equities daily swing trading as the first default market.
3. Choose final state labels: Wait / Watch / Constructive / Strong Trend / Extended, or another compliance-safe set.
4. Confirm that Context Score remains secondary to State.
5. Choose whether EMA 50 alone is enough for V1, or whether EMA 200 is required when enough data exists.
6. Pick 20 manual test charts.
7. Reserve RangeClarity social and Discord handles.
8. Confirm the TradingView account and publishing plan.
9. Choose a hosted waitlist tool.
10. Draft the first educational chart-context post without predictions.

---

## 17. Open Questions

Only these questions block Phase 1 approval:

1. Is the first default market US equities daily charts?
2. Are the safer state labels approved, replacing "Favorable"?
3. Should Context Score be visible in Starter, or should it be Pro-only later? *(Review recommendation: hide the number in Starter — compute internally, surface only State. Needs your confirmation.)*
4. Should EMA 200 be included in V1 trend logic when available?
5. What exact RVOL lookback should be used for the first spec?
6. What exact ATR extension thresholds should define Normal, Stretched, and Extended?
7. Which waitlist tool should be used?
8. Who will review compliance language before paid Pro launch?

---

## 18. Decision Log

Already decided:

- Domain: RangeClarity.com
- Core positioning: No signals. No hype. Just chart clarity.
- Product surface: TradingView first
- First product: Free public Starter indicator
- Business path: Starter first, Pro later
- Payment path later: Whop
- Community path: Discord for onboarding and retention
- UX principle: dashboard first, minimal overlays
- Current phase: planning only, no code

New decisions from this revision:

- Pro is deferred until Starter earns usage and trust.
- Whop automation is deferred until Pro exists.
- Advanced AVWAP, MTF, squeeze/VCP, and alerts are deferred.
- State is primary; Context Score is secondary.
- "Favorable" is replaced by safer state language unless deliberately approved later.
- Phase 1 ends with a build-ready Starter spec, not production code.

Proposed in the 2026-06-14 review pass (pending Dean's approval — not yet locked):

- Hide the numeric Context Score in Starter; compute it internally and surface only State.
- Trim the Starter dashboard to ~7 consolidated rows.
- Meme/internet-native tone is for social content only; product UI stays calm/premium.
- For V1 Pro, use a 7-day money-back guarantee instead of a free trial.
- Relative strength is an explicit V1 deferral / Pro candidate.
- Define concrete 90-day validation targets to gate the Pro go/no-go.

---

## 19. What To Avoid

Avoid:

- Building Pro before Starter is validated
- Adding too many dashboard rows
- Drawing too many levels
- Making the score feel like a trade rating
- Calling anything a signal
- Using buy/sell language
- Publishing profit or P&L marketing
- Adding AI features
- Building a backend
- Launching paid ads early
- Creating multiple pricing tiers
- Running Discord like a trade-call room
- Overfitting S/R levels
- Pretending support/resistance is precise
- Hiding risk disclaimers
- Copying other scripts or protected vendor logic
- Delaying Starter because of Pro ideas

The product wins by being useful, restrained, and trustworthy.

---

*End of master plan. Awaiting approval before any build work begins.*
