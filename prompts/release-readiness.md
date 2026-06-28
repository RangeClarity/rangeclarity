# Prompt — Release Readiness (RangeClarity Paid Beta)

A go / no-go check before inviting paying beta users. Audit-only; produce a checklist verdict, not edits.

```
Assess RangeClarity readiness to charge the first beta customers. Verify each, cite evidence, mark ✅/⚠️/❌:

1. Health: `npm run health` green on the host (typecheck, lint, qa:rc, build).
2. Indicator QA: docs/qa/live-qa-report.md — 0 product criticals; warnings triaged; only sentinels expected.
3. Indicator visual: Location/Structure pass on QQQ/SPY/AAPL/NVDA/TSLA/MSFT/META/BTCUSD/ETHUSD (Dean's eyes).
4. Brand: no forbidden/signal wording in app or dashboard (see product-language-qa).
5. Mobile: homepage + beta/free-access clean at 390px/430px; one <h1> per page; no overflow.
6. Funnel: /beta and /beta/free-access submit successfully; admin grant + Access-Granted email work.
7. Legal: disclaimers present (educational tool, not advice, manual TradingView access).
8. Env/secrets: required env vars set; no secrets in repo; analytics privacy-friendly.
9. Fulfillment: manual TradingView invite-only add process documented and tested.

Return:
A. Go / No-Go (one line).
B. Blockers (❌) that must clear first.
C. Warnings (⚠️) acceptable for beta with a note.
D. The shortest path to Go.
Make no edits; this is a verdict, not a fix.
```
