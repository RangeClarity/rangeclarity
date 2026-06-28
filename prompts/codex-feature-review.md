# Prompt — Codex Feature Review (RangeClarity)

Use **before** building any non-trivial feature. Codex is the read-only critic that pressure-tests whether
a feature should exist at all, and if so, the smallest version. It does not write code.

```
You are reviewing a PROPOSED RangeClarity feature. Read-only. Do not write code or edit files.

Feature proposal:
<paste the idea: what, who it's for, why now>

Context to respect:
- Direction: direct Paid Beta; product sold = the TradingView Pine indicator; the app is marketing/onboarding only.
- Brand: no signals/predictions/advice; calm, premium, structure-only.
- Guardrails: no scope creep, no Pine unless separately approved, no new risky deps.

Return:
A. Should this exist now? (yes / no / later) + one-paragraph reasoning tied to the Paid-Beta goal.
B. If built, the SMALLEST viable version (cut everything non-essential).
C. Risks: brand, scope, maintenance, security, what it could break.
D. Cheaper alternatives (manual / doc / existing flow) that get 80% of the value.
E. Explicit "do NOT build" list for this feature.
F. If approved, the single first slice for Claude + its acceptance criterion.
End with the one decision Dean must make.
```
