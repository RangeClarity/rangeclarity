# RC-1 Real Data Baseline v1 — Comparison Report

> **Status: BLOCKED on data in this environment** (0 CSVs, no `TIINGO_API_KEY` in sandbox
> `.env`, no outbound network). **No real baseline was run; nothing fabricated.** Below are
> the two **frozen SYNTHETIC** baselines (reference only, NOT validation) and the exact
> one‑command path to produce the real comparison locally. **Conviction: RED.**
> RC Score is permission, not prediction; the weakest lens sets the ceiling.

## Produce the real baseline (locally, where .env + network exist)
```
cd research/rc1_autonomous_model && python3 fetch_tiingo.py   # 20 syms -> data/ohlcv/<SYM>.csv
cd ../.. && cd research && python3 compare_baselines.py        # runs BOTH baselines + writes the auto comparison
# (rc1_ultimate reads the sibling data/ohlcv automatically; no copy needed)
```
`compare_baselines.py` is guarded: with no CSVs it prints the fetch command and exits (no
fake data). It writes `docs/research/rc1-real-data-baseline-v1-comparison.md` with both real
runs side‑by‑side.

## Frozen SYNTHETIC baselines (reference — not evidence)
| Package | windows | Insufficient | Unclear | Mixed | Clear | HighClarity |
|---|---|---|---|---|---|---|
| rc1_autonomous_model | 260 | 0 | 127 | 132 | **1** | **0** |
| rc1_ultimate_offline_indicator (frozen) | 520 | 0 | 220 | 300 | **0** | **0** |

**Caps fired most (ultimate, synthetic):** `agree3` 503 · `severe` 404 · `broken` 364 ·
`chop` 171 · `weakzone` 89 · `extended` 79 · `contradictory` 60.
**Ablation — earns its place (removal worsens):** ultimate → zone, extension, hysteresis;
autonomous → extension (fatal on removal), chop, zone. **No effect on synthetic:** chop*,
location, agreement, trend (*chop earns place in autonomous). false‑high self‑flag 0,
fatal 0, cap_accuracy 1.0, stability ~1.0 in both.

## What the synthetic numbers do / don't tell us
- **Over‑rejection signal:** 0–1 Clear and 0 HighClarity across 260–520 windows. Per the
  interpretation rule, on *real* data that pattern would indicate **over‑rejection**. On
  *synthetic* data it is **suggestive but not conclusive** — the generator rarely produces
  ≥2‑touch fresh in‑play zones inside clean trends, so the zone/agree3 gate may be starved
  by the fixtures rather than by reality. **Real data must confirm.**
- **agree3 over‑binding?** Synthetic: **likely yes** — `agree3` is the single most‑fired
  cap (503/520). It is the prime suspect for "clean charts can't reach Clear." Confirm on real.
- **Zone quality over‑binding?** Synthetic: **possibly** — `broken` (364) + `weakzone` (89)
  are heavy, and zone earns its ablation place. But broken/weak may be correct rejections;
  needs the real founder queue to judge.
- **ATR extension too strict?** Synthetic: **watch** — `severe` (404) is the #2 cap and the
  synthetic series drifts far from the MA‑200; on real equities/ETFs `severe` (>4 ATR)
  should be much rarer. Re‑check the real distribution before judging.
- **Founder review queue:** `reports/founder_review_queue.csv` (per package) — on synthetic
  it is sparse because there are ~0 Clear/High to scrutinise. On real data it surfaces the
  suspicious‑high / borderline / caps‑saved / uncertain windows.
- **Charts that should be Clear but were capped / caps that correctly prevented false
  confidence:** cannot be listed without real data — the real run + `founder_review_queue`
  produce both lists for your review.

## Conviction: **RED**
No real data, no human labels. The "false‑high" figures are self‑consistency only. High
Clarity is rare *by construction*, which is not the same as *validated*.

## Single smallest refinement to test next (RECOMMEND ONLY — do not implement)
**Prerequisite:** run the real baseline first. **If real data also shows ~0 Clear on
genuinely clean charts**, the smallest, most‑targeted test is: allow a `Clean` trend (or a
clean `Range`) in a `Trend`/`Range` regime with `Normal` extension to satisfy the **agree3
location/zone leg via proximity to a real level OR clean range‑position, without requiring
a ≥2‑touch in‑play zone** — because `agree3` is by far the dominant binding cap. One toggle,
A/B against the frozen baseline, accepted only if Clear becomes reachable on clean charts
**without** raising the false‑high self‑flag or fatal count, and with High Clarity still
rare. **Per your instruction this is not implemented and no caps are loosened yet** — it is
the next test to run *after* the real baseline confirms over‑rejection.
