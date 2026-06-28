# Visual → data map

For every visible element: data → engine module → output → update cadence → confirmed/preview → Pine approach → the user question it answers.

| Visual element | Underlying data | Engine module | Output / formula | Update | Confirmed vs preview | Pine approach | User question |
|---|---|---|---|---|---|---|---|
| Candlesticks | chart OHLC | — | raw | per bar | n/a | native plotcandle | "What's price doing?" |
| Volume | chart volume | Data Gate / Vol confirm | RVOL context | per bar | n/a | native volume | "Is the move backed by volume?" |
| MA50 / MA100 / MA200 | chart close | MA Structure | `ta.sma` | per bar | confirmed values | 3 plots, subordinate to price | "Is price above its averages?" |
| Current-price marker | close | — | last close | realtime | preview line, locks on close | `line`/label reused | "Where is price now?" |
| Support zone (band+tag) | confirmed swing lows, ATR cluster, reactions, recency, volume | Zone Engine | `{lo,hi,strength,confidence,reactions,distancePct}` | on confirmed pivot | confirmed only | `box.new` reused; nearest only | "Where did demand previously appear?" |
| Resistance zone (band+tag) | confirmed swing highs … | Zone Engine | same | on confirmed pivot | confirmed only | `box.new` reused | "Where is overhead supply?" |
| Invalidation tag | nearest support lo − buffer | Zone + Entry | price level | on zone change | confirmed | label reused | "Where am I wrong?" |
| Setup State | Structure, Entry, zones, extension, confidence | State Machine | enum of 5 | per bar (locks on close) | **preview vs confirmed styled** | table cell + color | "Is this actionable now?" |
| Entry Quality | location, extension, R:R, dist-to-support/resistance | Entry Score | 0–100 + components | per bar | preview/confirmed | table cell + ring | "Is *now* a good entry?" |
| Structure Quality | MA stack/slope, HH/HL, RS, volume | Structure Score | 0–100 + components | per bar | confirmed | table cell + ring | "Is the chart strong?" |
| Price Location | distances to zones, range pos | Location Engine | enum | per bar | preview/confirmed | table cell | "Where in the range am I?" |
| Nearest Support / Resistance | zone outputs | Zone Engine | level + distance% | on confirmed pivot | confirmed | table cells | "How far to support / resistance?" |
| Extension Risk | dist above support & MA50 (%, ATR) | Extension Engine | % + ATR + flag | per bar | preview/confirmed | table cell | "Is price stretched?" |
| MA structure row | priceVs + alignment + slope | MA Structure | alignment score | per bar | confirmed | table cell | "Are the averages stacked and rising?" |
| Relative Strength | SPY (+sector) closes | RS Context | rsScore | per bar | confirmed (`[1]` HTF) | `request.security` | "Leading or lagging the market?" |
| Explanation sentence | reason codes | Explanation | composed string | per bar | matches state | table cell (tiny) | "Why this verdict?" |
| Expandable "Why?" | all component values/weights/thresholds | all scores | breakdown list | on open | confirmed | second table / inputs panel | "Show me the math." |
| Confidence / data-quality badge | Data Gate | Data Gate | 0–100 + warnings | per bar | always shown | table cell | "Can I trust this read?" |
