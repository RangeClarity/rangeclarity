# RangeClarity Design System

## Brand Feeling

RangeClarity should feel like a premium meme-fintech market toolkit for long-term investors.

The brand is:

- Sharp
- Dark
- Confident
- Analytical
- Slightly funny
- Investor-first
- Premium without becoming sterile

It should feel closer to a TradingView indicator pack, market command center, and collectible dashboard module set than a generic SaaS site.

## Product Positioning

RangeClarity is a premium TradingView indicator suite that helps investors understand where price is trading inside the active technical range before making a buy, wait, or avoid decision.

The product gives chart context. It does not promise market predictions.

Use language like:

- Range position
- Support zone
- Resistance zone
- Wait zone
- Entry quality
- Risk / reward
- Decision posture
- Momentum state
- Patience

Avoid language like:

- Guaranteed signal
- Beat the market
- Secret alpha machine
- Risk-free
- Automatic profits

## TradingView Indicator Product Positioning

Product category:

- Premium TradingView indicator suite
- Overlay-first chart toolkit
- Technical range reading product

Target user:

- Long-term investors who use technical timing
- Swing traders who care about structure
- Retail investors who want cleaner chart context
- Watchlist builders tracking buy-zone timing
- TradingView users who hate messy indicator overload

Core promise:

- Show support, resistance, momentum, entry quality, and risk zones directly on the TradingView chart.
- Help users read structure before making the move.
- Make buy / wait / avoid conversations clearer without pretending to predict the market.

Module naming rules:

- Use clear product names that sound like premium indicators.
- Current modules are `Range Map Overlay`, `Momentum Engine`, and `Risk Radar`.
- Future modules should be short, memorable, and descriptive.
- Avoid names that sound like guaranteed signal systems, gambling tools, or copied competitor branding.
- Avoid generic SaaS names such as "dashboard," "workspace," or "AI platform" unless they are clearly secondary to the indicator suite.

Copy tone:

- Direct, investor-literate, and lightly funny.
- Use TradingView vocabulary naturally: overlay, indicator, chart, support, resistance, momentum, risk zone, entry quality.
- Keep jokes pointed at bad timing, candle chasing, and indicator clutter, not at the user.

Compliance language:

- Say "not financial advice."
- Say "not a signal bot."
- Say "does not guarantee profits."
- Say "mock data only" when showing sample charts.
- Say "future companion" or "coming soon" for AI concepts.

What not to claim:

- Do not claim no-loss entries.
- Do not claim market prediction.
- Do not claim guaranteed alerts, profits, or performance.
- Do not imply RangeClarity replaces research or risk management.
- Do not imply a real TradingView integration is functional inside the landing page prototype.

How to visually represent indicator modules:

- Use dark cards with neon-tinted borders.
- Include a TradingView indicator label on each card.
- Show a strong module name, a metric, compact stats, bullets, and a small mock visual.
- Represent overlays with range bands, chart lines, support/resistance zones, current price markers, and risk labels.
- Keep visual density high but readable.

Module card anatomy:

- Top metadata row: category pill plus `TradingView indicator` label.
- Header: module name, one-line purpose, and one memorable metric.
- Visual: CSS/SVG-only mock overlay or meter. Never use a real chart API in the prototype.
- Packaging: include `Included layer` and `Chart output` so users understand what appears on TradingView.
- Stats: compact rows such as score, zone, stage, risk/reward, or entry quality.
- Decision copy: include `What it helps you avoid` and `Best for`.

## Color Direction

Primary background:

- Near-black navy: `#05070d`
- Deep graphite panels: `#070b12`, `#09111e`, `#0a111d`

Primary text:

- White for headlines
- Slate 200-400 for body and secondary labels
- Slate 500 for metadata

Accent colors:

- Mint: premium action and positive clarity
- Signal blue: chart intelligence and TradingView-style data accents
- Amber: caution, wait zones, and market heat
- Rose: controlled meme-risk accents only

Use accents as edges, pills, stats, highlights, and glows. Do not flood the page with one color.

Avoid:

- Purple-heavy gradients
- Beige/tan research-lab colors
- Bright casino reds and greens as the dominant palette
- Large decorative gradient blobs

## Typography Direction

Use a strong, clear sans-serif hierarchy.

Headlines:

- Heavy weight
- Large but controlled
- Tight line-height
- No negative letter spacing
- Direct copy

Body:

- Comfortable line height
- Short paragraphs
- Clear investor language
- No dense marketing walls

Labels and pills:

- Small uppercase
- Bold or black weight
- Use sparingly as metadata and category tags

## Card Style

Cards should feel like premium market modules.

Rules:

- Dark panel backgrounds
- Thin neon-tinted borders
- Subtle glow only where useful
- 8px border radius through `rounded-lg`
- Strong internal spacing
- Small category/status pills
- Stats grouped into rows or compact grids
- Bullet lists for decision details

Cards should not feel like soft SaaS feature cards.

Avoid:

- Overly rounded cards
- Cards inside cards unless the inner element is a functional dashboard surface
- Large generic icons
- Empty decorative panels
- Vague "feature benefit" cards

## Button Style

Primary CTA:

- Mint background
- Dark text
- Strong border
- Subtle neon glow
- Text should be decisive: "Join Early Access" or "Request Early Access"

Secondary CTA:

- Dark translucent background
- White or signal-blue text
- Thin border
- Clear action, not vague browsing

Button rules:

- Minimum 48px height
- 8px radius
- Strong hover state
- Full-width on small mobile when stacked if needed
- Do not use too many CTAs per section

## Copy Tone

Tone should be:

- Clear
- Premium
- Investor-literate
- Lightly funny
- Calm under pressure

Good examples:

- "See the range before you make the move."
- "Pullback beats chasing."
- "Decision support, not advice."
- "Premium market command center energy."

Avoid:

- Hype
- Fake urgency
- Infantilizing meme jokes
- Long abstract AI claims
- Overpromising returns

## Section Structure

Current preferred order:

1. Hero with full-bleed market visual, headline, CTAs, and stat row
2. Indicator modules with collectible market cards
3. TradingView workflow / how it works
4. Mock TradingView chart preview
5. Who it is for
6. What RangeClarity is not
7. Pricing / early access placeholder
8. FAQ and trust notes
9. Final CTA
10. Footer

Each section should have:

- One clear job
- Strong heading
- Short supporting copy
- A visual or structured content block

Transitions should use borders, background shifts, grids, and spacing rather than decorative filler.

## Component Rules

Keep repeated content in arrays/constants:

- Toolkit modules
- Hero stats
- Chart preview stats
- Process steps
- Audience cards
- Footer links

Use components for repeated UI:

- `LandingButton`
- `ToolkitCard`
- `ToolkitSection`
- `SampleAnalysisCard`
- `ProcessSection`
- `CTASection`
- `Footer`

When adding a new section, prefer:

1. Add data to `lib/range-data.ts`.
2. Create a focused component in `components/landing`.
3. Add the component to `PremiumMemeFintechLanding`.

Do not bury large arrays inside JSX.

## Mobile Rules

Mobile must remain polished.

Check:

- Hero headline does not collide with the stat cards.
- Buttons stack cleanly.
- Cards keep readable spacing.
- Chart preview stats wrap without overflow.
- Long labels do not push cards wider than the viewport.
- The hero image crop still supports the text.

Keep visual density, but never at the cost of legibility.

## What To Avoid

Do not add:

- Login
- Auth
- Payment
- Backend
- Real stock data
- Live API calls
- Complex dashboards that require state management
- Extra npm packages unless the benefit is clear

Do not change the concept into:

- Generic SaaS
- Light research lab
- Corporate fintech
- Crypto gambling
- Meme-only joke site
- AI agent productivity page

## Future Design Ideas

High-fit future improvements:

- A three-card "Buy / Wait / Sell" decision section.
- A compact watchlist strip with mock tickers and range positions.
- A "range report" preview that looks exportable.
- A small compliance note near the mock chart preview.
- Animated range marker hover states, kept subtle.
- More refined mobile hero cropping.
- More chart microcopy that explains terms without sounding like a tutorial.
- A sharper final CTA with product preview bullets.
- A proof strip near the hero that feels like a market terminal rather than generic client logos.
- FAQ cards that make disclaimers feel like trust-building rather than legal fog.

Every future idea should reinforce the core promise:

RangeClarity helps investors see technical range context before making the move.
