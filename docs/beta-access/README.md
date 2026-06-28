# Paid Beta Access Package

## What Was Created

This folder contains the planning package for RangeClarity's first paid beta access loop:

- `paid-beta-flow.md` - full customer journey and user states.
- `page-copy.md` - premium beta copy for pages and sections.
- `email-templates.md` - lifecycle email templates.
- `tradingview-onboarding.md` - TradingView setup guide.
- `beta-faq.md` - beta FAQ.
- `admin-checklist.md` - founder/admin manual workflow.
- `qa-test-plan.md` - QA checklist for the full beta loop.
- `sprint-board.md` - Sprint 1 task board for June 20, 2026 - July 7, 2026.
- `data-model-draft.md` - simple draft model for beta leads, payments, and feedback.
- `implementation-ticket-pack.md` - build tickets for Claude Code.

## Why It Exists

The goal is to prepare the full paid beta system without risky product-code changes. This package gives Claude Code a safe implementation blueprint for a manual-first beta flow.

## How Claude Code Should Use These Docs

1. Start with `paid-beta-flow.md`.
2. Use `page-copy.md` for user-facing copy.
3. Use `data-model-draft.md` before choosing storage.
4. Use `implementation-ticket-pack.md` to build only P0 items first.
5. Use `qa-test-plan.md` before any external beta user enters the flow.

## What Should Be Built First

Build the smallest manual beta loop:

1. Beta signup CTA.
2. Signup form.
3. TradingView username capture.
4. Payment/test-payment placeholder or sandbox plan.
5. Pending approval page.
6. Onboarding guide.
7. Feedback form.
8. Admin manual approval checklist.
9. Legal/disclaimer copy.
10. Full QA path.

## What Should Not Be Built Yet

- Live payments.
- Real Stripe/Paddle/Lemon Squeezy connection.
- Automated TradingView access.
- Full SaaS backend.
- User accounts/auth.
- Multi-tier billing.
- AI features.
- Trade-signal features.
- Homepage redesign.
- Deployment changes.

## Operating Principle

Keep the beta manual until the first users prove the flow. The product promise stays simple: clean structure, less noise, no signals, no advice.
