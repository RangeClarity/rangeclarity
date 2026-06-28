# Auth, Billing & Paid-Access Architecture — Plan (design only)

> **Status: PROPOSAL. Nothing here is implemented.** No packages installed, no provider accounts, no deploys, no live payments. Awaiting founder approval. Aligns with `docs/decisions.md`, `docs/launch-readiness.md`, `CLAUDE.md`.

## 1. Evidence inspected
- `package.json` + `package-lock.json` (npm only); `tsconfig.json`, `next.config.mjs`, `eslint.config.mjs`.
- Routing: `app/` App Router. API routes: only `app/api/waitlist/route.ts`. Server actions: none (`"use server"` not found).
- Auth/db/payment deps: **none** (no `@supabase/*`, `@clerk/*`, `next-auth`/`@auth/*`, `prisma`, `drizzle-orm`, `firebase`, `stripe`, `@paddle/*`, `@lemonsqueezy/*`).
- Middleware: **none** (`middleware.ts` absent). Protected routes: none (`cookies()/headers()/redirect()` not used).
- Env usage in code: only `process.env.WAITLIST_FILE`. `.env*` gitignored.
- Planning context: `docs/kanban.md`, `docs/project-state.md`, `docs/decisions.md`, `CLAUDE.md`, `AGENTS.md`. Git: HEAD `4297974` (origin/main), all history 2026-06-17.

## 2. Confirmed current state
Bare **Next.js 15.3 App Router + React 19 + TS 5** landing site. No database, no auth, no payments, no entitlements, no sessions. The paid product is the TradingView indicator (`RangeClarity_Core.pine`); the web app currently has no account or access layer. **This is a greenfield build.**

## 3. Existing authentication and payment code
**None.** The only "payment" artifacts are static pricing UI in design routes (`components/PricingSection.tsx`, design `data.ts`/CSS) — no checkout, no provider SDK. No login/session/JWT/cookie code anywhere.

## 4. Recommended architecture
**Supabase (Auth + Postgres) for identity & entitlement data; a provider-agnostic payment layer kept separate.**

- **Auth:** Supabase Auth — Google OAuth + email/password + email verification + password reset, all built in. SSR via `@supabase/ssr` (cookie sessions) fits App Router server checks.
- **Database:** Supabase Postgres holds `profiles` + `subscriptions` (the entitlement source of truth) with Row Level Security.
- **Payments:** a thin **provider adapter** (interface: `createCheckout`, `verifyWebhook`, `mapEvent`). The `subscriptions` row is tagged with `provider` + external IDs, so the payment provider can change **without touching auth or registration**.
- **Entitlement:** a single server-side function `hasActiveAccess(userId)` reads DB subscription state. The browser never decides access.

### Option comparison (against THIS repo)
| Criterion | **Supabase (recommended)** | Clerk (close runner-up) | Auth.js | Existing |
|---|---|---|---|---|
| Fit with repo | Greenfield; adds auth **and** the DB we need anyway | Greenfield; auth only — still need a separate DB | Greenfield; you own more plumbing | n/a |
| Implementation effort | Medium (auth + schema + RLS) | Lowest for auth; **+** DB **+** user-sync webhook | Highest (adapters, email, sessions) | — |
| Security ownership | We own RLS/policies; passwords hashed by Supabase (never plaintext) | Clerk owns auth fully (lowest ownership) | We own most of it | — |
| SSR support | `@supabase/ssr` cookie sessions | First-class App Router | Supported | — |
| Route protection | Middleware + server checks | Middleware helper | Middleware | — |
| Profile sync | DB trigger `auth.users → profiles` (in-DB, no extra service) | Needs Clerk→DB webhook | Manual | — |
| Payment integration | Provider-agnostic; webhook upserts DB | Same, but in the separate DB | Same | — |
| Vendor dependency | One vendor (auth+DB) | Two vendors (Clerk + a Postgres) | One, but more self-run | — |
| Ongoing cost | Free tier → ~$25/mo Pro | Clerk free → ~$25/mo **+** DB cost | Cheapest infra, most labor | — |
| Migration difficulty | Standard Postgres export | Auth locked to Clerk; DB portable | Portable | — |

## 5. Why Supabase won
We **must** own a subscription/entitlement database server-side (the security model demands it). Supabase delivers auth **+** that database **+** RLS **+** SSR in **one** vendor, with a single source of truth for "who the user is and what they've paid for" and **no cross-system user-sync layer**. The founder's decision rule favors Clerk "if no mature backend exists" for speed — but here we need a DB regardless, and choosing Clerk means running Clerk **plus** a Postgres **plus** a sync webhook (two overlapping systems, which the rules say to avoid). Supabase consolidates that. **Pick Clerk instead only if** the founder wants the absolute fastest drop-in auth UI and zero auth-security ownership, and accepts a second vendor + a sync webhook.

## 6. Registration user-flow (diagram)
```
Homepage → /pricing → [Choose plan]
   → /sign-up  ──(Google OAuth)──────────────► /auth/callback ─┐
        │  (Email + password)                                  │
        ▼                                                       ▼
   Email verification link ───────────────► /auth/callback → profile row ensured (DB trigger)
                                                              │
                                                              ▼
                                            Signed in, NO subscription → /pricing (upsell)
                                                              │ [Start checkout]
                                                              ▼
                                              Provider-hosted checkout (TEST)
                                                              │
                         success URL → /checkout/success (shows "finalizing…", grants NOTHING)
                                                              │
                              Payment webhook (verified, idempotent) → subscriptions=active
                                                              ▼
                                   hasActiveAccess()=true → /app (onboarding → dashboard)
```

## 7. Payment & entitlement flow (diagram)
```
Browser              Next.js (server)            Payment provider        Supabase DB
  │  click "Subscribe"   │                              │                    │
  ├─────────────────────►│ createCheckout(user, plan)   │                    │
  │                      ├─────────────────────────────►│ (TEST session)     │
  │  redirect to checkout│◄─────────────────────────────┤ checkout URL       │
  │◄─────────────────────┤                              │                    │
  │  pays (test card)    │                              │                    │
  │                      │           webhook (signed) ──►│  POST /api/webhooks/payments
  │                      │  verify sig → dedupe event ───┼───────────────────► upsert subscription
  │  return to /checkout/success (NO access granted)     │                    │ (active/period_end)
  │  load /app           │ hasActiveAccess(userId) ──────┼───────────────────► read subscription
  │◄── access or upsell ─┤  (server-side only)           │                    │
```
**Access is granted only by the webhook-updated DB row, never by the return URL.**

## 8. Database changes (Supabase Postgres)
Improved from the proposed model (kept minimal; one table added for webhook idempotency, which is required for safe webhooks).

- **profiles** — `id uuid pk default gen_random_uuid()`, `auth_user_id uuid unique not null references auth.users(id)`, `email text not null`, `display_name text`, `role text not null default 'user' check (role in ('user','admin'))`, `terms_version text`, `terms_accepted_at timestamptz`, `disabled_at timestamptz` (disable/soft-delete), `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- **billing_customers** — `id uuid pk`, `user_id uuid references profiles(id)`, `provider text not null`, `external_customer_id text not null`, `created_at`. Unique `(provider, external_customer_id)`.
- **subscriptions** — `id uuid pk`, `user_id uuid references profiles(id)`, `provider text not null`, `external_subscription_id text not null`, `plan_key text not null`, `status text not null` (`incomplete|trialing|active|past_due|canceled|expired`), `current_period_end timestamptz`, `cancel_at_period_end boolean default false`, `created_at`, `updated_at`. Unique `(provider, external_subscription_id)`.
- **webhook_events** (NEW, required for idempotency) — `id text pk` (provider event id), `provider text`, `type text`, `payload_hash text`, `received_at timestamptz default now()`, `processed_at timestamptz`. The PK guarantees exactly-once processing.

**RLS:** users can `select` only their own `profiles`/`subscriptions`; **all writes to billing tables happen server-side with the service-role key** (never from the browser). A trigger on `auth.users` insert creates the `profiles` row. Entitlement = `status in ('active','trialing')` OR (`status='canceled'` AND `current_period_end > now()`).

## 9. Route changes (App Router)
| Route | Type | Purpose / guard |
|---|---|---|
| `/pricing` | public | Plans + "Subscribe" CTA |
| `/sign-up` | public | Email+password / Google |
| `/sign-in` | public | Login |
| `/auth/callback` | route handler | OAuth + email-verify code exchange → set session |
| `/auth/reset` `/auth/update-password` | public | Password reset flow |
| `/app` (a.k.a. dashboard) | **protected** | `hasActiveAccess` required; else → `/pricing` |
| `/app/onboarding` | protected | TradingView invite + Discord steps |
| `/account` | protected (auth only) | Email, display name, terms, logout |
| `/account/billing` | protected (auth only) | Subscription status; manage/cancel link (provider portal) |
| `/checkout/success` `/checkout/cancel` | protected (auth only) | Status pages; **grant nothing** |
| `/api/webhooks/payments` | route handler (no auth) | Verified + idempotent provider webhook |
| `middleware.ts` | edge | Refresh session; gate `/app/**` |

Profile sync uses a **DB trigger** (no separate user-sync webhook needed with Supabase). If Clerk is chosen instead, add `/api/webhooks/clerk` for user sync.

## 10. Environment variables (placeholder names only — never real values, never committed)
Browser-safe (`NEXT_PUBLIC_*`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PAYMENT_PUBLISHABLE_KEY` (only if the chosen provider needs a client key).
Server-only (never exposed): `SUPABASE_SERVICE_ROLE_KEY`, `PAYMENT_PROVIDER` (`stripe|paddle|lemonsqueezy|whop`), `PAYMENT_API_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `ADMIN_EMAILS` (bootstrap admin). Google OAuth client id/secret are configured **in the Supabase dashboard**, not in the repo. Add all as placeholders in `.env.example`; real values go in `.env.local` / Vercel env.

## 11. Security requirements
- Access decided **server-side only** (middleware + server components/route handlers reading the DB). The browser never decides paid access.
- **Return URLs grant nothing**; only verified webhooks mutate entitlement.
- Webhooks: **verify signature** with `PAYMENT_WEBHOOK_SECRET`; **idempotent** via `webhook_events` PK.
- **Never** store plaintext passwords (Supabase hashes; or Clerk owns it). **Never** expose service-role / webhook / payment secrets to the browser (`NEXT_PUBLIC_*` only for anon/publishable).
- RLS on all user tables; billing writes only via service role.
- No secrets in repo; `.env*` gitignored.

## 12. Webhook & idempotency design
1. Receive `POST /api/webhooks/payments` (Node runtime; raw body).
2. **Verify** provider signature → 400 on failure.
3. **Dedupe:** `insert into webhook_events(id=...)`; on unique-violation → already processed → return `200` no-op.
4. **Map** provider event → canonical `{userId, plan_key, status, current_period_end, cancel_at_period_end}` via the adapter.
5. **Upsert** `subscriptions` by `(provider, external_subscription_id)`; link `billing_customers`.
6. Mark `webhook_events.processed_at`; return `200` fast. Provider retries are safe (idempotent).

## 13. Error & empty states
- Signed-out → `/app` redirects to `/sign-in`.
- Email unverified → blocked from `/app`; resend-verification prompt.
- Signed-in, no subscription → `/app` redirects to `/pricing` (upsell, not an error).
- Checkout incomplete / `status='incomplete'` → "Payment not completed" with retry.
- `past_due` → restricted access + "update payment" banner (grace policy = founder decision).
- `canceled` + `current_period_end>now` → full access until period end, with end-date banner.
- `expired` → upsell.
- Webhook signature fail → 400 logged; provider missing event → reconcile job (manual for Beta).
- Disabled user (`disabled_at`) → forced logout + blocked.

## 14. Test matrix
| State | `/app` | `/account` | Expected |
|---|---|---|---|
| Signed out | redirect `/sign-in` | redirect | no access |
| Signed in, unverified email | blocked | limited | verify prompt |
| Signed in, no sub | redirect `/pricing` | yes | upsell |
| Checkout incomplete | redirect `/pricing` | yes | retry |
| Trialing (if approved) | access | yes | access |
| Active | access | yes | access |
| Past due | restricted | yes | banner |
| Canceled, period not ended | access | yes | end-date banner |
| Expired | redirect `/pricing` | yes | upsell |
| Admin | access + admin view | yes | elevated |
| Disabled/deleted | forced logout | no | blocked |

Plus: **webhook replay** (same event id twice → one effect), **bad signature → 400**, **return URL does NOT grant access**, RLS (user cannot read another user's subscription).

## 15. Deployment sequence
1. DB migrations to a Supabase **dev** project; verify RLS + trigger.
2. Deploy auth (sign-up/in/Google/verify/reset) to a Vercel **preview**; test in TEST mode.
3. Add payment provider in **TEST/sandbox**; wire checkout + webhook; fire test events; verify entitlement gating end-to-end (test matrix green).
4. Founder review on preview.
5. Promote to production with provider still in **TEST**; final smoke test.
6. **Separate explicit approval** → switch payment provider to **LIVE**; monitor first real webhook.

## 16. Rollback strategy
- Gate everything behind a `PAID_BETA_ENABLED` flag; flip off to hide paid surfaces, leaving the public landing intact.
- Keep auth + payments in **TEST** until verified; live mode is a separate toggle.
- DB migrations are reversible (down migrations); entitlement reads are non-destructive.
- Disable the webhook + revert the Vercel deployment to the prior good build to fully back out. No customer data is deleted on rollback.

## 17. Work suitable for Claude Code (implementation)
Schema + RLS + trigger (AB-1); auth pages + callback + middleware (AB-2); entitlement module + protected routes + account/billing pages (AB-3); provider adapter + checkout (TEST) (AB-4); webhook handler (AB-5); minimal admin (AB-6); terms capture + onboarding (AB-7). Plus `.env.example` placeholders and the test matrix as automated checks where possible.

## 18. Work suitable for Codex review
Security-critical review of: the **webhook handler** (signature verification + idempotency, AB-5); the **entitlement function** and route guards (no client-side access decisions, AB-3); RLS policies (AB-1); secret handling (no `NEXT_PUBLIC_` leakage). Codex signs off before live mode.

## 19. Work that requires founder input
- **Payment provider + company country** (the blocker — see below).
- Approve **Supabase** as the auth+DB stack.
- **Plan(s) + price** (`plan_key`, amount) and **whether a trial** exists.
- **Grace policy** for `past_due`; **refund** policy (ties to RC-9 legal).
- **Terms version** string to record at sign-up.
- Approval to deploy and (separately) to enable live payments.

## 20. Implementation tickets (≤7 active; design-only until approved)

### AB-1 — Supabase project + schema + RLS + profile trigger
- Priority P0 · Owner Claude (Codex review RLS) · Deps: founder approves Supabase · Effort ~0.5–1d
- Files: `supabase/migrations/*.sql`, `lib/supabase/{server,client,middleware}.ts`, `.env.example`
- Acceptance: tables `profiles/billing_customers/subscriptions/webhook_events` exist; RLS restricts users to their rows; `auth.users`→`profiles` trigger works; service-role used only server-side.
- Verify: `supabase db reset` on dev applies cleanly; a signup creates exactly one profile row; RLS denies cross-user reads (SQL test).
- Security: service-role key server-only; RLS on by default.

### AB-2 — Auth (sign-up/in, Google, email verify, reset) + session middleware + protected `/app`
- Priority P0 · Owner Claude · Deps AB-1 · Effort ~1d
- Files: `app/(auth)/sign-up`, `/sign-in`, `app/auth/callback/route.ts`, `app/auth/reset/*`, `middleware.ts`
- Acceptance: email+password and Google work; unverified email blocked from `/app`; reset works; `/app` redirects when signed out.
- Verify: `npm run build` + manual matrix rows (signed out / unverified / signed-in-no-sub).
- Security: no passwords stored by us; sessions are httpOnly cookies; access checked server-side.

### AB-3 — Entitlement module + route guards + `/pricing` `/account` `/account/billing`
- Priority P1 · Owner Claude (Codex review) · Deps AB-1, AB-2 · Effort ~0.5–1d
- Files: `lib/entitlement.ts`, `app/pricing/*`, `app/account/*`, `app/app/*`
- Acceptance: `hasActiveAccess()` matches the state table; `/app` gated by it; billing page shows status read-only.
- Verify: unit tests on `hasActiveAccess` for all states; manual route checks.
- Security: access decisions server-side only.

### AB-4 — Payment-provider adapter + checkout (TEST) + return pages
- Priority P1 · Owner Claude · Deps AB-3 + **founder provider decision** · Effort ~0.5–1d
- Files: `lib/payments/{index,<provider>}.ts`, `app/api/checkout/route.ts`, `app/checkout/{success,cancel}/page.tsx`
- Acceptance: adapter interface (`createCheckout/verifyWebhook/mapEvent`) with one provider in TEST; checkout opens; success/cancel pages grant nothing.
- Verify: TEST checkout completes; `/checkout/success` shows "finalizing" with no access until webhook.
- Security: secret keys server-only; no live mode.

### AB-5 — Webhook handler (verify + idempotent + subscription upsert)
- Priority P0 (correctness) · Owner Claude + **Codex sign-off** · Deps AB-1, AB-4 · Effort ~0.5d
- Files: `app/api/webhooks/payments/route.ts`
- Acceptance: rejects bad signatures (400); replaying an event id is a no-op; valid events upsert subscription + period end.
- Verify: replay test (same event twice → one row change); signature-fail test; state transitions verified in DB.
- Security: signature verification mandatory; idempotency via `webhook_events` PK; raw-body handling.

### AB-6 — Minimal admin (user/admin role + read-only subscriptions view)
- Priority P2 · Owner Claude · Deps AB-1 · Effort ~0.25d
- Files: `app/admin/*`, `lib/entitlement.ts`
- Acceptance: `role='admin'` (bootstrapped via `ADMIN_EMAILS`) can view subscriptions; non-admins blocked.
- Verify: admin sees list; user gets 403/redirect.
- Security: admin gate server-side; no destructive admin actions in Beta.

### AB-7 — Terms capture + short onboarding (TradingView invite + Discord)
- Priority P2 · Owner Claude + Founder (copy) · Deps AB-2 · Effort ~0.25d
- Files: `app/(auth)/sign-up`, `app/app/onboarding/*`
- Acceptance: `terms_version`/`terms_accepted_at` recorded at sign-up; dashboard onboarding shows TradingView invite + Discord steps.
- Verify: new signup row has terms fields; onboarding renders post-payment.
- Security: store only the version + timestamp, no sensitive data.

---

## Summary (required ending)
- **Recommended authentication provider:** **Supabase Auth** (+ Supabase Postgres for entitlements). Clerk is the close runner-up; pick it only for fastest drop-in auth at the cost of a second vendor + user-sync.
- **Payment-provider decision still required:** **YES — blocked on the company's country of incorporation** (determines Stripe availability). Candidates: Stripe (best DX, country-limited, not MoR), Paddle / LemonSqueezy (Merchant of Record, global tax handled), or **Whop** (already in the plan; MoR-style). Architecture keeps this swappable via the adapter + `subscriptions.provider`.
- **Single highest-priority implementation ticket:** **AB-1** (Supabase project + schema + RLS + profile trigger) — provider-agnostic and unblocks everything else.
- **Exact founder decision required:** Confirm the **company's payment country → payment provider**, and approve **Supabase** as the auth+DB stack (plus plan/price and trial yes/no).
- **Do this next:** Confirm the company's country of incorporation and approve Supabase, so AB-1 can be scheduled (no implementation until you approve this plan).
