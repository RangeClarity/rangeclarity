# Product vision & strongest direction

> 2026-06-23 update: S/R Quality Upgrade is the current priority. Do not build
> the Volume / Liquidity Confirmation Engine now. Volume is parked for MVP and
> may return later only as a small context/tiebreaker around major zones.

## The recommendation (strongest direction)
Build **one indicator** — working name **"RangeClarity Engine — Market Map"** — whose surface is a single calm read and whose engine is a **weighted, explainable confidence score** built from a few robust modules. The differentiator is not any one module (all are copyable); it is the **scoring spine + the "No edge" honesty + the clean one-line read**. That combination is what an SMC/signal clone can't easily reproduce, and it's on-brand with RangeClarity.

### Why this direction wins
- The market is saturated with structure/liquidity/SMC scripts (cards 1,2,5) and signal spam (cards 9,10). Adding another is generic.
- The **gap** on TradingView is *restraint + explainability*: a tool that says "here is your range, here is the nearest zone, momentum confirms or not, and honestly — no edge right now." Card 4 (quality scoring) proves users value *scored* events; almost nobody pairs that with a deliberately minimal chart.
- It compounds into the RangeClarity moat: the same engine output feeds the **Daily Range Brief** (Telegram) and the **setup library**. The indicator is the hook; the brief/data is the moat (see `moat.md`).

## Best combined product concept (MVP composition)
A single dashboard read driven by structure-first engine inputs + a score:

1. **Regime** (from cards 3): trend / range / compression / expansion / shock — from ATR-percentile + range position.
2. **Structure & Bias** (card 1): confirmed swing pivots → BOS/CHoCH → up/down/neutral bias.
3. **Smart Zones** (cards 6, 2, 5-trimmed): fewer better zones, ATR-clustered, with touch count, recency, freshness, and reaction quality. No liquidity-pool claims in MVP.
4. **Momentum context** (card 7): RSI-percentile + EMA-slope + ADX gate. Context-only, never a signal.

→ **Confidence Score 0–100** (card 4 philosophy): weighted blend of regime suitability, bias clarity, zone quality, momentum agreement, and location clarity — with **explicit downgrades** (e.g., extended from support, price mid-range, unclear structure) and an **explainable breakdown**.

→ **Verdict (the only "main read"):** `No edge` / `Caution` / `Clean setup` + bias color (green/red/neutral). Never "buy/sell".

### The one-line dashboard (beginner surface)
`Regime · Bias · Nearest support · Nearest resistance · Location · Confidence · Verdict`

### Advanced mode (hidden)
Per-factor score breakdown, weights, raw values, debug zones — behind a settings toggle. Beginner sees 5–7 inputs; advanced unlocks the rest.

## What this is NOT (compliance + brand)
Not a signal bot, not "AI forecasting", no SL/TP promises, no buy/sell arrows, no chart wallpaper. "No edge" is a first-class output. Wording stays descriptive, never predictive.

## Why it's defensible (decoupled from the script)
The Pine script will be copied eventually. The moat is: (1) the **scoring weights + "no edge" calibration** refined on real feedback, (2) the **brief** that turns engine output into a weekly habit, (3) the **curated setup library** that grows, (4) **brand/trust**. The indicator earns the audience; the system retains it.
