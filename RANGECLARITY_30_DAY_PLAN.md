# RangeClarity — 30-Day Execution Plan

**North star:** Ship the landing page on rangeclarity.com, then validate demand. Build the product only after people show they want it.
**Rule of the month:** Every day ends with something **shipped, tested, or decided**. Max 3 main tasks/day. Stop redesigning.

---

## A. Roadmap overview (next 30 days)

| Milestone | Days | Goal | Quality target | Done when |
|-----------|------|------|----------------|-----------|
| **M1 — Domain + Landing Page Launch** | 1–6 | rangeclarity.com is live, polished, trustworthy | **Level 3 — Early Access Ready** | Public URL on HTTPS, mobile-clean, pricing + disclaimer + waitlist CTA working |
| **M2 — Waitlist / Early Access Funnel** | 7–10 | Real emails captured & stored durably | Level 2–3 | Email lands in a real tool + confirmation, tested end-to-end |
| **M3 — TradingView Indicator MVP** | 11–22 | First working indicator (Range Map) on a chart | **Level 2 — Usable MVP** | Range Map Overlay runs on TradingView, shows S/R zones + range score |
| **M4 — Proof / Examples / Content** | 18–26 | Show it working on real tickers | Level 2–3 | 5–8 annotated chart examples + 1 explainer published |
| **M5 — Early Feedback + Paid Test** | 24–30 | 5–10 testers, then a paid early-access test | Level 2 → gate to **Level 4** | 5+ testers used it; 1 paid-access test run |

Milestones overlap on purpose (M4 starts while M3 finishes). **M1 is the only thing that matters this week.**

---

## B. Visual timeline — Days 1–14 (detailed)

| Day | Focus | Main tasks (max 3) | Output by EOD | Time | Blockers / decisions | Done when |
|-----|-------|--------------------|---------------|------|----------------------|-----------|
| **1** | Lock the design | 1) Decide previous-pro = homepage 2) Promote `/designs/previous-pro` → `/` 3) noindex the other `/designs/*` | `/` shows the chosen design locally | 2–3h | **DECISION: approve homepage version** | Homepage renders previous-pro locally, other designs hidden from search |
| **2** | Kill launch blockers | 1) Mobile QA (hero, chart, pricing) 2) Confirm pricing + TradingView positioning + disclaimer copy 3) Waitlist CTA wired to form | Launch-blocker checklist all green | 2–3h | **DECISION: final pricing + disclaimer text** | No mobile overflow; copy approved; CTA scrolls to working form |
| **3** | Build + preview | 1) `npm run build` locally, fix errors 2) Push to GitHub 3) Deploy Vercel **preview** | Live preview URL | 2h | Vercel account/login | Preview URL loads, no console errors |
| **4** | Domain | 1) Add rangeclarity.com + www in Vercel 2) Add Namecheap DNS records 3) Start SSL | DNS submitted, propagating | 1–2h | **DO NOT need: anything but registrar access** | Records saved; Vercel shows "valid configuration" pending |
| **5** | Go live | 1) Verify HTTPS on apex + www 2) Full launch QA (links, forms, meta/OG) 3) Soft-launch (share to a few) | **rangeclarity.com LIVE** | 2h | DNS propagation (up to 24h) | Padlock on both URLs; QA checklist passed |
| **6** | Buffer / polish | 1) Fix anything from QA 2) Add analytics snippet 3) **M1 DONE** | Stable public site | 1–2h | — | M1 definition of done met |
| **7** | Waitlist funnel | 1) Pick email tool 2) Replace file-based `/api/waitlist` with hosted capture 3) Test submit | Emails save to a real tool | 2–3h | **DECISION: email tool** | Test email appears in the tool |
| **8** | Funnel polish | 1) Confirmation/thank-you state 2) Double-opt-in or welcome email 3) Spam/honeypot check | Confirmed signup flow | 2h | — | New email triggers welcome; thank-you shows |
| **9** | Funnel QA + share | 1) Cross-device signup test 2) Write 1 short launch post 3) Share to 5–10 people | First real signups | 2h | — | ≥1 external signup received |
| **10** | M2 close + spec | 1) M2 DONE 2) Write Range Map indicator spec (1 page) 3) List mock inputs/outputs | Indicator spec v1 | 2–3h | **DECISION: first module name** | Spec approved by you |
| **11** | Indicator build | 1) Set up Pine Script skeleton 2) Plot support/resistance zones 3) Test on 1 ticker | Range zones draw on a chart | 3h | TradingView Pine basics | Zones render on ASTS chart |
| **12** | Indicator build | 1) Add range score 0–100 2) Price-position label 3) Test on 3 tickers | Range score live | 3h | — | Score + position show correctly |
| **13** | Indicator build | 1) Edge cases (gaps, low liquidity) 2) Clean visual styling 3) Self-review | Stable Range Map v0.1 | 2–3h | — | Works on 5 tickers without breaking |
| **14** | Review + checkpoint | 1) Record a 2-min demo 2) Decide MVP scope freeze 3) Plan days 15–30 | Demo clip + frozen scope | 2h | **DECISION: MVP scope freeze** | Demo recorded; scope locked |

---

## B2. Timeline — Days 15–30 (high level)

| Days | Focus | Output |
|------|-------|--------|
| 15–18 | Momentum Engine basics + Risk Radar context (only if Range Map solid) | 2nd/3rd module v0.1 |
| 18–22 | Wire indicators to the "read" (buy/wait/avoid context), polish labels | Usable indicator suite MVP (Level 2) |
| 18–24 | **Proof content:** 5–8 annotated real-ticker screenshots + 1 explainer | Proof gallery + post |
| 24–27 | Recruit 5–10 testers (waitlist + network), give access, collect feedback | Tester feedback log |
| 27–29 | Fix top 3 feedback issues; tighten onboarding/setup guide | Improved MVP |
| 29–30 | **Paid early-access test** with a tiny cohort; confirm willingness to pay | 1 paid test run; go/no-go on pricing |

---

## C. Kanban board (current state)

```
INBOX            | SPEC NEEDED      | READY            | DOING            | HUMAN REVIEW     | DONE
-----------------|------------------|------------------|------------------|------------------|------------------
Affiliate link?  | Email tool       | Promote previous | Hero chart polish| Homepage version | previous-pro
(P3)             | choice (P1)      | -pro to / (P0)   | (P0, done-ish)   | approval (P0)    | built (P1)
                 |                  |                  |                  |                  |
Community        | Indicator spec   | Mobile QA (P0)   |                  | Pricing numbers  | Hero chart
Discord/TG (P2)  | v1 (P1)          |                  |                  | (P0)             | enlarged (P1)
                 |                  | Confirm pricing/ |                  |                  |
Blog/content     | Paid-test plan   | positioning/     |                  | Disclaimer text  | 4 design routes
engine (P3)      | (P2)             | disclaimer (P0)  |                  | (P0)             | + selector (done)
                 |                  |                  |                  |                  |
                 |                  | Vercel deploy    |                  |                  | Security audit
                 |                  | (P0)             |                  |                  | + docs (done)
                 |                  |                  |                  |                  |
                 |                  | Namecheap DNS +  |                  |                  |
                 |                  | SSL (P0)         |                  |                  |
                 |                  |                  |                  |                  |
                 |                  | Replace waitlist |                  |                  |
                 |                  | storage (P1)     |                  |                  |
```

Move tasks left→right. Nothing enters **Doing** until its decision in **Human Review** is cleared.

---

## D. Priority levels

**P0 — must do before launch:** approve homepage version; promote to `/`; mobile QA; pricing/positioning/disclaimer confirm; Vercel deploy; Namecheap DNS + SSL; launch QA.
**P1 — important soon:** durable waitlist email tool; indicator spec; Range Map MVP build; proof content.
**P2 — nice to have:** Momentum/Risk modules polish; community channel; paid-test plan.
**P3 — later / ignore now:** affiliate links, blog engine, extra design experiments, more `/designs/*` variants, logo/brand refinements, animations.

---

## E. Milestone 1 — exact steps

> Quality target: **Level 3 (Early Access Ready)**. Owner shorthand: **Dean** = you, **CC** = Claude Code (me), **Codex** = alt coder, **Hermes** = your agent.

| # | Task | Why it matters | Time | Owner | Acceptance criteria | Done when |
|---|------|----------------|------|-------|---------------------|-----------|
| 1 | Confirm design version | Stops the redesign loop | 10m | **Dean** | You say "previous-pro is the homepage" | Decision recorded |
| 2 | Make `/designs/previous-pro` the homepage `/` | One canonical site to launch | 45m | CC | `/` renders previous-pro; `/designs/*` kept but `noindex` | Local `/` = previous-pro |
| 3 | Polish hero dashboard graph + fonts | First impression = trust | done | CC | Chart large, labels readable, score header clear | Already shipped on previous-pro ✅ |
| 4 | Mobile responsiveness check | Half your traffic is mobile | 45m | Dean+CC | No overflow/scroll; chart stacks; CTAs aligned | Looks clean on phone width |
| 5 | Confirm pricing section | Sets expectations + trust | 20m | **Dean** | $0 / $29 annual / $49 monthly confirmed or edited | Numbers locked |
| 6 | Confirm TradingView positioning | Core message must be obvious | 15m | **Dean** | Hero clearly says "TradingView indicator suite" | Copy approved |
| 7 | Add/confirm disclaimer | Compliance + credibility | 15m | **Dean** | "Not financial advice / not a signal bot" present | Disclaimer final |
| 8 | Waitlist CTA placeholder | Capture intent from day one | 30m | CC | CTA scrolls to a working email field | Submitting shows success state |
| 9 | Build locally | Catch errors before deploy | 20m | Dean | `npm run build` passes | Clean build |
| 10 | Deploy Vercel preview | Safe staging URL | 30m | Dean | Preview URL loads | Preview live |
| 11 | Connect Namecheap domain | The whole point of M1 | 30m | **Dean** | A `@`→`76.76.21.21`, CNAME `www`→`cname.vercel-dns.com` | Vercel shows valid config |
| 12 | Test SSL / HTTPS | No padlock = no trust | 15m | Dean | https on apex + www, www→apex redirect | Padlock both URLs |
| 13 | Final launch QA | Don't ship broken | 45m | Dean+CC | Links, forms, OG image, 404, console all clean | QA checklist green → **M1 DONE** |

**M1 Definition of Done:** rangeclarity.com loads over HTTPS, mobile-clean, with correct positioning, confirmed pricing, disclaimer, and a working waitlist CTA. Other designs not indexed.

---

## F. Daily plan rules
- Max **3 main tasks/day**, each with a concrete output.
- No day without a ship/test/decision.
- No new design experiments unless a launch blocker forces it.
- Decisions get made **same day** — don't let them stall the board.
- If a task isn't P0 during M1 week, it waits.

---

## G. Visual execution order

```
1. Lock the design
        ↓
2. Make it the homepage (/)
        ↓
3. Polish launch blockers (mobile, copy, disclaimer)
        ↓
4. Deploy to Vercel
        ↓
5. Connect rangeclarity.com + SSL
        ↓
6. Add durable waitlist capture
        ↓
7. Build TradingView MVP (Range Map first)
        ↓
8. Get 5–10 testers
        ↓
9. Improve from feedback
        ↓
10. Test paid early access
```

---

## H. Founder decisions needed (clear the board)

**Before launch (this week):**
1. **Homepage version** — promote `/designs/previous-pro` to `/`? (Y/N)
2. **Final pricing** — keep $0 / $29 annual / $49 monthly? Is annual billing real at launch?
3. **Free preview vs waitlist-only** — at launch, collect emails only, or also offer a free preview?
4. **Disclaimer text** — approve current wording as final.
5. **TradingView positioning line** — keep "indicators that show the range before you make the move"?
6. **Apex vs www** — canonical = rangeclarity.com (recommended)?
7. **Hide other `/designs/*`** — noindex/keep for internal compare? (recommended: noindex)

**Soon (M2–M3):**
8. **Email capture tool** — ConvertKit / Beehiiv / Resend / Mailchimp? (current file-based store won't persist on Vercel.)
9. **First indicator module name** — "Range Map Overlay" final?
10. **Community** — Discord / Telegram / none at launch?
11. **TradingView affiliate link** — show or not?

---

## I. Proposed Linear tickets — Milestone 1 (NOT created yet — approve first)

| Title | Pri | Owner | Est | Status | Description / Acceptance / DoD |
|-------|-----|-------|-----|--------|--------------------------------|
| **RC-1 Promote previous-pro to homepage `/`** | P0 | CC | 45m | Ready | Make `/` render the previous-pro design; keep `/designs/*` but add `noindex`. **AC:** `/` = previous-pro, other designs hidden from search, no route deleted. **DoD:** builds clean, looks identical to current previous-pro. |
| **RC-2 Launch-blocker polish (mobile + copy)** | P0 | CC+Dean | 1.5h | Ready | Mobile QA, confirm pricing/positioning/disclaimer/CTA. **AC:** no mobile overflow, copy approved, CTA works. **DoD:** launch-blocker checklist green. |
| **RC-3 Deploy to Vercel (preview → prod)** | P0 | Dean | 1h | Ready | Build, push, deploy. **AC:** preview + prod URLs load, no console errors. **DoD:** production deployment succeeds. |
| **RC-4 Connect rangeclarity.com + SSL** | P0 | Dean | 45m | Ready | Add domain in Vercel; set Namecheap A `@`→76.76.21.21, CNAME `www`→cname.vercel-dns.com; remove parking records. **AC:** both URLs HTTPS, www→apex. **DoD:** Vercel "valid configuration" + padlock. |
| **RC-5 Durable waitlist email capture** | P1 | Dean+CC | 2h | Spec Needed | Replace file-based `/api/waitlist` with a hosted email tool. **AC:** test email lands in the tool + welcome email. **DoD:** end-to-end signup verified. |

---

## J. Quality bar per milestone

| Milestone | Target level | Meaning |
|-----------|-------------|---------|
| M1 Landing | **Level 3 — Early Access Ready** | Polished, trustworthy, mobile-clean, capturing intent |
| M2 Funnel | Level 2–3 | Real storage + confirmation, not file-based |
| M3 Indicator | **Level 2 — Usable MVP** | Works on real charts; rough edges OK |
| M4 Proof | Level 2–3 | Believable real examples |
| M5 Paid test | gate to **Level 4** | Only take money once it's reliable |

Don't over-build M3/M4 to Level 4. Landing = 3, MVP = 2.

---

## Closing — what to do now

**Today (Day 1):**
1. Decide: previous-pro becomes `/`. (Founder decision #1)
2. Approve final pricing + disclaimer text. (#2, #4)
3. Give me the go-ahead and I'll promote it to `/` + noindex the other designs.

**Tomorrow (Day 2):**
1. Mobile QA pass on `/`.
2. Confirm positioning line + CTA copy.
3. `npm run build` locally to confirm it's deploy-ready.

**Do NOT touch yet (P3):** new design variants, mascot/branding tweaks, affiliate links, blog engine, Momentum/Risk modules, community setup. None of these block launch.

**First 5 Linear tickets to create:** RC-1, RC-2, RC-3, RC-4, RC-5 (above). Approve and I'll draft them into Linear.

**Expected launch date (landing page live):**
- **2–3 h/day:** ~**Day 6** (about one week).
- **5–6 h/day:** ~**Day 3**.

**Full 30-day arc (through paid test):**
- 2–3 h/day: tight — expect M3 MVP ~Day 22, paid test slips to ~Day 32–35.
- 5–6 h/day: on track — paid test ~Day 28–30.
