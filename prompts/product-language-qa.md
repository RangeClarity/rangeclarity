# Prompt — Product Language QA (RangeClarity)

Scan user-facing copy for brand drift and signal-like language. Audit-only; propose calm rewrites, do not edit.

**Brand:** *Simple Chart. Complex Engine. No Signals. No Noise. Just Structure.*
**Forbidden (as product claims):** buy, sell, entry, exit, wait, avoid chase, pullback zone, breakout watch,
conviction, win-rate, profit, prediction, guaranteed, financial advice. *(Negating disclaimers like "no
buy/sell signals" are allowed and expected — flag them only to confirm they read as disclaimers.)*

**In scope:** `app/**` page copy, `app/beta/**`, indicator dashboard strings in `pine/rangeclarity_sr_core_v1.pine`
(read-only — flag wording, do not edit Pine), `docs/RANGECLARITY_V2_SURFACE_SPEC.md` as the wording source of truth.

```
Audit RangeClarity user-facing language. Return:
A. Violations — quote the exact text + file:line + why it drifts (claim vs disclaimer).
B. Generic / hypey / too-long copy that should be tighter or more specific.
C. Inconsistencies with the brand sentence and the V2 surface spec.
D. Suggested calm rewrites (one line each), preserving meaning.
E. The single highest-impact wording fix for Claude (smallest change) + acceptance criterion.
Make no edits. Pine wording is flagged for Dean's approval only.
```
