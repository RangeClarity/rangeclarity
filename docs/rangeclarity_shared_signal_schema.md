# RangeClarity — Shared Signal Schema

Status: planning / contract draft (v0.1). The single structural language spoken by the Pine indicator, the scanner, the event/webhook sync, the Market Room, and Hermes. Aligns 1:1 with the indicator's current outputs (`rangeclarity_sr_core_v1.pine`) and the canonical core. **This is a contract — change it deliberately and version it.**

## Principles
- **Describe structure, never advise.** No fields for entries, targets, stops, or direction predictions.
- **Stable enums.** Bias, level types, channel states, and event types are fixed vocabularies (below). UI and AI key off these, not free text.
- **Two row kinds, one schema:** a **snapshot** (state of a symbol/timeframe now) and an **event** (something that changed on a confirmed bar). They share most fields; `eventType`/`eventSeverity` are null on pure snapshots.
- **Versioned.** Every row carries `schemaVersion`.

## Field dictionary

| Field | Type | Notes / allowed values |
|---|---|---|
| `schemaVersion` | string | e.g. "0.1" |
| `symbol` | string | exchange-qualified, e.g. "NASDAQ:NVDA", "BITSTAMP:BTCUSD" |
| `timeframe` | string | "1D", "1W", "4H", … (indicator MVP = 1D) |
| `timestamp` | int (epoch ms) | confirmed bar close time the row describes |
| `marketBias` | enum | `Bullish` \| `Bearish` \| `Sideways` \| `Unclear` |
| `channelState` | enum | `Inside` \| `Test Upper` \| `Test Lower` \| `Break Above` \| `Break Below` \| `Developing` \| `None` |
| `channelBias` | enum | `Bullish` \| `Bearish` \| `Sideways` \| `Unclear` (defers to `marketBias` on conflict) |
| `channelQuality` | number 0–100 | 0 when no valid channel |
| `nearestSupportPrice` | number \| null | null if none nearby |
| `nearestSupportPct` | number \| null | signed % from price (negative = below) |
| `nearestSupportType` | enum | `Local` \| `Key` \| `Strong` \| `None` |
| `nearestResistancePrice` | number \| null | null if none above |
| `nearestResistancePct` | number \| null | signed % from price (positive = above) |
| `nearestResistanceType` | enum | `Local` \| `Key` \| `Strong` \| `None` \| `None Above` (price discovery) |
| `strongestSupportScore` | number 0–100 \| null | best valid support zone score; null = none local |
| `strongestResistanceScore` | number 0–100 \| null | best valid resistance zone score; null = none local |
| `visibleLevels` | int | levels actually rendered (primary + fallback) |
| `trackedZones` | int | total zones in the engine's array |
| `rangeClarityScore` | number 0–100 | composite "how clean/worth-watching" (see below) |
| `eventType` | enum \| null | see event vocabulary; null on snapshots |
| `eventSeverity` | enum \| null | `info` \| `notable` \| `major` |
| `explanationSummary` | string | one-line, plain-language, **non-advice** reason |
| `priceAtEvent` | number \| null | close at event/snapshot |
| `atrPct` | number \| null | ATR as % of price (volatility context) |
| `source` | enum | `pine-webhook` \| `scanner` (provenance) |

### Event vocabulary (`eventType`)
`bias_changed`, `entered_strong_support`, `entered_strong_resistance`, `approaching_strong_support`, `approaching_strong_resistance`, `breakout_above_resistance`, `breakdown_below_support`, `retest_after_break`, `channel_break_above`, `channel_break_below`, `channel_test_upper`, `channel_test_lower`, `new_strong_zone`, `clarity_improved`, `clarity_degraded`.
(Maps directly onto the indicator's existing `alertcondition`s plus a few scanner-only diffs. No "buy/sell" types ever.)

### rangeClarityScore (composite, 0–100) — definition to finalize at M3/M5
A weighted blend describing *how clean and decision-relevant* a chart is right now, e.g.:
- bias decisiveness (Bullish/Bearish/Sideways clear vs Unclear),
- presence and strength of nearby Key/Strong levels,
- proximity of price to a level or channel boundary (closer = more "at a decision"),
- channel quality/containment,
- low clutter (few but meaningful tracked zones).
Exact weights live with the canonical core and its test vectors so chart and web agree. **It is a clarity/attention score, never a direction or probability score.**

## JSON example — snapshot (scanner)
```json
{
  "schemaVersion": "0.1",
  "symbol": "NASDAQ:NVDA",
  "timeframe": "1D",
  "timestamp": 1718841600000,
  "marketBias": "Bullish",
  "channelState": "Inside",
  "channelBias": "Bullish",
  "channelQuality": 78,
  "nearestSupportPrice": 118.40,
  "nearestSupportPct": -3.2,
  "nearestSupportType": "Key",
  "nearestResistancePrice": null,
  "nearestResistancePct": null,
  "nearestResistanceType": "None Above",
  "strongestSupportScore": 84,
  "strongestResistanceScore": null,
  "visibleLevels": 2,
  "trackedZones": 41,
  "rangeClarityScore": 72,
  "eventType": null,
  "eventSeverity": null,
  "explanationSummary": "Bullish, inside a clean channel, near a Key support ~3% below; no resistance above (highs).",
  "priceAtEvent": 122.30,
  "atrPct": 3.1,
  "source": "scanner"
}
```

## JSON example — event (TradingView webhook)
```json
{
  "schemaVersion": "0.1",
  "symbol": "BITSTAMP:BTCUSD",
  "timeframe": "1D",
  "timestamp": 1718841600000,
  "marketBias": "Bearish",
  "channelState": "Break Below",
  "channelBias": "Unclear",
  "channelQuality": 61,
  "nearestSupportType": "Local",
  "nearestSupportPct": -1.8,
  "nearestResistanceType": "Key",
  "nearestResistancePct": 4.4,
  "eventType": "channel_break_below",
  "eventSeverity": "major",
  "explanationSummary": "Closed below the soft structure channel; structure turning Bearish.",
  "source": "pine-webhook"
}
```

## Pine → schema mapping (current indicator)
| Schema field | Pine source (today) |
|---|---|
| `marketBias` | `bias` (f_bias) |
| `channelState` | `chanState` |
| `channelBias` | `chBias` |
| `channelQuality` | `chQuality` |
| `nearestSupport*` | `nSupIdx`/`fbSupPx` + tier (`Strong/Key/Local`) + `f_distPct` |
| `nearestResistance*` | `nResIdx` + tier; `None Above`/price discovery when none |
| `strongest*Score` | `f_strongestIdx` scores |
| `visibleLevels` / `trackedZones` | `visCount` / `array.size(zones)` |
| events | the 11 `alertcondition`s (S/R + channel) |
The TradingView alert message body is the JSON event above (alerts support `{{ }}` placeholders for symbol/time/price; structural fields are filled by the indicator's computed strings).

## Web/scanner parity
The scanner produces the **same fields** from historical OHLCV via the canonical core. A shared fixture set (`core/fixtures/*`: input bars → expected schema row) must pass in both the Pine reference and the TS scanner before either is trusted. Mismatches block release (see `rangeclarity_execution_strategy.md`, divergence risk).

## Versioning rules
- Additive fields → minor bump (0.1 → 0.2), consumers ignore unknown fields.
- Enum/semantic changes → major bump + migration note in `decisions.md`.
- Never silently repurpose a field.
