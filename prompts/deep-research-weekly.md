# Prompt — Deep Research (Weekly / On-Demand)

Strategic research for RangeClarity. **Weekly or on-demand, not daily.** Paste into a research-capable
assistant (web access). No API is wired — this is a manual hand-off. Save the output as a dated brief in
`data/ops/research/`. Playbook: `docs/ops/deep-research-playbook.md`.

---

```
You are doing strategic market research for RangeClarity — a premium, invite-only TradingView indicator.
Positioning: "Simple chart. Complex engine. No signals. No noise. Just structure." It reads trend,
location, zones, and structure quality — it does NOT give buy/sell signals or predictions.

FOCUS THIS WEEK: <one line — e.g. "pricing + free-trial norms for premium TV indicators">

Research and return a concise, sourced brief with these sections:

A. COMPETITOR LANDSCAPE
   5–8 comparable TradingView indicators / market-structure tools. For each: what it claims, price,
   delivery (invite-only vs public), apparent traction, and its weakness we can beat.

B. TRADINGVIEW MARKETPLACE
   How premium scripts get discovered and reviewed; invite-only vs public trade-offs; what earns trust.

C. PRICING
   Typical tiers and free-trial patterns for premium indicators; where $29 / $49 sits; what converts;
   anything that signals "serious tool" vs "signal-seller".

D. PINE SPECIALISTS / PARTNERSHIPS
   Credible Pine authors/educators; realistic collaboration, affiliate, or co-marketing angles.

E. POSITIONING
   How to own the "structure, not signals" position against signal-seller noise. Messaging that lands;
   traps to avoid (hype, win-rate claims, prediction language).

F. ACQUISITION CHANNELS
   Rank channels (YouTube, X, TradingView ideas, Discord, newsletters, etc.) by fit + repeatability for
   this audience; note the format that works on each.

G. RECOMMENDED MOVES
   3–5 concrete moves, each with: effort (S/M/L), risk, and why it's high-leverage now.

Rules: cite sources/links; flag guesses vs evidence; no scraping behind logins; no PII. Keep it skimmable.
This is an input to founder decisions, not a mandate to build.
```

---

### After running
- Save as `data/ops/research/<YYYY-MM-DD>-<topic>.md`.
- Move decisions → `docs/decisions.md`; move concrete tasks → `docs/kanban.md`.
- Don't let a brief silently expand scope — every build still goes through the one-issue loop.
