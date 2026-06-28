# Fox concept → Beta/onboarding section mapping

> Portable handoff (authored in the Claude Design workspace). Copy into `docs/design/`.
> Plan only — implement the new pages in the repo only if small and safe; otherwise keep as plan.

The Claude Design concept board (`RangeClarity Landing Concepts.dc.html`) has more than a hero.
Keep the **homepage** lean (fox hero + your existing lower sections). Route the education/product-deep
content to Beta/onboarding instead of bloating the public homepage.

## Stays on the PUBLIC homepage
- **Fox hero** — "No signals. No noise. Just structure." (Concept A treatment).
- Existing lower sections (unchanged): Three modules · One ticker, fully read · Five steps · What RangeClarity is not · Simple access · Straight answers · Stop chasing candles.

## Already owned elsewhere — do NOT duplicate on homepage
- **Premium Indicators** → keep the existing public section/page.
- **Investor Research Lab** → keep the existing public section/page.
- **Pricing / Beta card** (concept) → `/beta` already owns checkout. Link, don't re-render.

## Move to Beta / onboarding (proposed)
| Concept section | Destination | Why |
|---|---|---|
| "Strong zone vs weak structure" product chart (shared section) | `/beta/how-to-use` | Teaches how to read the structure layer — onboarding, not a homepage pitch |
| Concept B "Verdict" split panel (weak vs strong + bias) | `/beta/how-to-use` or homepage product strip | Best as a "how it reads" demo; keep ONE instance |
| Research Lab watchlist table (concept version) | `/beta/onboarding` | Shows the research surface to new beta users |
| TradingView access steps | `/beta/tradingview-access` | Pure setup/onboarding |
| Straight-answers / objection content | `/beta/faq` | FAQ belongs in beta funnel |

## Implementation guidance
- Only build a new `/beta/...` page now if it is **very small and safe** (static content, links to existing `/beta?plan=...`). No new APIs, no checkout/admin changes.
- Otherwise leave this as the plan and let the user prioritize which beta page to build first.
- Reuse existing components/tokens; match the fox hero's dark/teal system so beta pages feel like one brand world (not a separate Claude Design direction).

## Constraints carried through
- Nav: no Indicator Terminal, no Bold Hero.
- Safety language rules apply (no signals/profit/prediction/advice wording).
- Don't touch payment/pricing/beta-checkout/admin/DB/webhooks.
