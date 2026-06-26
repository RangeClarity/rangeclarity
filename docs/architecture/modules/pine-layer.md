# Module: Pine Layer

> Living architecture doc — **documentation only**. **Do not touch Pine** (hard guardrail).
> Index: [system-map](../system-map.md) · [registry](../module-registry.md).

## Purpose
The visual companion on TradingView **only**. It **renders** a verdict; it must never **originate** one.
The product sold is the Pine indicator, delivered invite-only — but its *logic* must mirror the validated
Python core, not lead it.

## Public interface
Consumer only — Pine exposes **no function** the rest of the system calls. Files: `RangeClarity_Core.pine` ·
`pine/rangeclarity_ultimate_core.pine` · `pine/rangeclarity_sr_core_v1.pine`.

## Hidden complexity
Pine v5 dashboards; the MA structure stack; S/R overlays; RC Score display; the calm palette — all
re-encoded inside Pine.

## Owns
TradingView display · calm dashboard · structural overlays (only when validated).

## Must not own
Canonical scoring research · future unvalidated logic · buy/sell/prediction language.

## Subfunctions
(Pine-internal) dashboard tables · structure layers — **out of scope to change** this task.

## Dependencies
Conceptually depends on the **verdict definition** — it should mirror the Python core, never diverge from it.

## Dependent modules
None — Pine is a leaf (the end of the chain).

## Current leaks
**The big one:** Pine risks becoming a **second source of truth**, re-encoding scoring concepts independently
of the Python core. Divergence → two truths → false confidence.

## Risk level
**HIGH.** Frozen by guardrail. Do not edit until conviction is GREEN and the core is validated.

## Tests required
No automated test (TradingView). A **manual validation checklist** only; Pine must mirror the Python verdict,
never lead it.

## Agent / skill to use
None automated. `/grill-me` before any Pine idea — the question "touch Pine before conviction is GREEN?"
answers **No**.

## Next approved task
**NONE.** Pine stays frozen.

## Blocked work
**All** Pine changes — blocked until GREEN conviction + a validated core.
