You are a strict senior reviewer, CTO, product strategist, UX lead, technical analyst, growth strategist, and compliance-minded startup operator.

I attached a Markdown planning document created by Claude for the RangeClarity project.

Your job:
Review the document deeply and look for better alternatives from every possible perspective.

Project context:
RangeClarity is a TradingView dashboard product.

Core positioning:
No signals. No hype. Just chart clarity.

Product idea:
A clean TradingView indicator/dashboard that helps traders understand:

* Trend
* Support
* Resistance
* Range
* Distance to support %
* Distance to resistance %
* ATR extension
* VWAP / AVWAP context
* Volume confirmation
* Market structure
* Setup quality

Trading style inspiration:

* Mark Minervini: Stage 2, relative strength, VCP, clean bases, risk control
* Brian Shannon: VWAP/AVWAP, multiple timeframes, location, market structure, support/resistance

Business model:

* Free Starter public TradingView script
* Pro invite-only TradingView script
* Whop for checkout/access
* Discord for onboarding and retention
* Landing page on RangeClarity.com
* No financial advice
* No profit promises
* No win-rate claims

Your review must be rigorous and practical.

Do NOT simply agree with the document.
Do NOT rewrite everything unless needed.
Your goal is to find what is weak, risky, missing, overbuilt, generic, or not optimal.

Review from these perspectives:

1. Product strategy

* Is the product concept strong?
* Is it differentiated enough?
* Is the MVP too big or too small?
* What should be removed?
* What should be added only if truly essential?
* What is the clearest wedge?

2. Trading methodology

* Is the Minervini + Brian Shannon inspiration translated correctly?
* Is the indicator likely to help real traders?
* What parts may be misleading?
* What should be shown on chart vs dashboard only?
* What should never be turned into a “score”?

3. Pine Script feasibility

* What parts may be hard or fragile in TradingView Pine?
* What could repaint?
* What could be slow/heavy?
* What should be simplified for v1?
* What is the safest implementation path?

4. UX and dashboard design

* Is the dashboard clean enough?
* Would beginners understand it?
* Would serious traders respect it?
* What creates noise?
* What should Clean Mode include exactly?
* What should Pro Mode hide by default?

5. Support/resistance engine

* Is pivot + ATR clustering the best approach?
* What alternatives should we consider?
* Should we use swing pivots, volume areas, VWAP anchors, prior highs/lows, or multi-timeframe levels?
* What is the simplest reliable v1 version?
* How should distance % and range position be displayed?

6. Scoring system

* Is a 0–100 score useful or dangerous?
* Could it create false confidence?
* What should the score include?
* What should be penalties?
* Should we replace score with simpler states like Clean / Watch / Extended / Mixed?
* Give the best scoring/state alternative.

7. Brand and positioning

* Is “RangeClarity” positioned well?
* Is “No signals. No hype. Just chart clarity.” strong enough?
* What better taglines or angles exist?
* How do we avoid looking scammy?
* What should the landing page promise?

8. Monetization

* Is Free Starter + Pro invite-only the best model?
* Is Whop the right first platform?
* What pricing is best: $29, $39, $49, or another?
* Should trial be with card or without card?
* What should be included in Pro vs saved for later?

9. Go-to-market

* Is TradingView organic the right first channel?
* What exact content should be created first?
* What should the first 30 days focus on?
* What should we avoid?
* What is the fastest realistic path to 100 users?

10. Compliance and trust

* Identify all risky wording or product behavior.
* Suggest safer alternatives.
* What disclaimers are needed?
* What should not appear in marketing?
* How do we avoid financial-advice perception?

11. Technical architecture

* Is the proposed stack too much?
* What can be deferred?
* What is needed for v1?
* What should the repo structure be?
* What should not be built yet?

12. Better alternatives
    For every major part of the plan, give alternatives:

* Current idea
* Better alternative
* Why it is better
* Risk/tradeoff
* Recommendation

Output format:

A. Executive verdict
Say whether the plan is:

* Ready for Phase 1
* Not ready
* Ready only after fixes

B. Top 10 improvements
Rank the most important improvements.

C. Critical risks
List the biggest risks that could kill the project.

D. Overbuilt / unnecessary items
List what should be removed or deferred.

E. Missing items
List what must be added before building.

F. Alternative product strategy
Suggest the best refined version of the product.

G. Alternative indicator spec
Suggest the cleanest and most professional v1 indicator concept.

H. Alternative dashboard UX
Suggest the cleanest dashboard layout and state model.

I. Alternative go-to-market plan
Suggest the best first 30-day acquisition plan.

J. Alternative pricing plan
Recommend exact pricing and trial structure.

K. Revised Phase 1 plan
Give 5–10 concrete next steps.

L. Final recommendation
Tell me exactly what to change in the Claude document before we proceed.

Rules:

* Be direct.
* Be critical.
* Be practical.
* Do not add hype.
* Do not suggest AI features unless there is a strong reason.
* Do not suggest paid ads yet.
* Protect the project from becoming too complex.
* Protect the product from becoming scammy.
* Focus on a clean, trustworthy MVP.
* Do not write code.
* Do not build files.
* Review and improve the plan only.
