export const designRoutes = [
  {
    href: "/designs/premium-fintech",
    title: "Premium Indicators",
    description: "Dark meme-fintech direction for a premium TradingView indicator suite."
  },
  {
    href: "/designs/data-terminal",
    title: "Indicator Terminal",
    description: "Dense TradingView-style preview with range scores, zones, and entry quality."
  },
  {
    href: "/designs/research-lab",
    title: "Investor Research Lab",
    description: "Calm AI analyst workspace focused on explanation, trust, and clarity."
  },
  {
    href: "/designs/bold-hero",
    title: "Bold Hero",
    description: "Cinematic first impression with a premium overlay and stronger editorial rhythm."
  }
] as const;

// ---------------------------------------------------------------------------
// Shared mock data used by the design sandbox routes (data-terminal, etc.)
// Kept intact so the alternate /designs routes continue to build.
// ---------------------------------------------------------------------------

export const productCards = [
  {
    label: "Range Position",
    value: "Upper",
    detail: "Price is trading in the upper band of its 90-day range."
  },
  {
    label: "Support Zone",
    value: "$28.50-31.00",
    detail: "Nearest demand area where prior buyers defended price."
  },
  {
    label: "Resistance Zone",
    value: "$39.00-42.00",
    detail: "Supply area where upside has repeatedly slowed."
  },
  {
    label: "Momentum State",
    value: "Extended",
    detail: "Strong trend, but extension risk is rising into supply."
  },
  {
    label: "Entry Quality",
    value: "Wait",
    detail: "Good setup quality, better after pullback confirmation."
  },
  {
    label: "Risk / Reward",
    value: "1.8x",
    detail: "Reward thins out the closer price gets to resistance."
  },
  {
    label: "Wait Zone",
    value: "$33.00-36.00",
    detail: "Neutral area where patience may beat chasing."
  },
  {
    label: "Breakout Watch",
    value: "$42+",
    detail: "A close above resistance would improve the decision map."
  }
];

export const decisionSteps = [
  {
    title: "Buy with context",
    body: "Identify whether price is near a favorable range area or already extended toward resistance."
  },
  {
    title: "Wait with discipline",
    body: "Separate a quality pullback from noise when the chart is stuck between support and resistance."
  },
  {
    title: "Avoid late entries",
    body: "See when risk is building near resistance, momentum is fading, or the setup no longer offers attractive context."
  }
];

export const audiences = [
  "Long-term investors who use technical timing before adding capital",
  "Swing traders who care about structure more than candle-chasing noise",
  "Retail investors who want cleaner TradingView chart context",
  "Watchlist builders tracking better buy-zone timing"
];

export const problems = [
  "A stock can look attractive fundamentally while trading in an unfavorable technical location.",
  "TradingView charts can become indicator spaghetti before they become decision support.",
  "Support, resistance, momentum, and risk/reward are usually scattered across tools instead of shown as one clean context layer."
];

// ---------------------------------------------------------------------------
// Premium meme-fintech landing page content (the primary route)
// ---------------------------------------------------------------------------

export const heroStats = [
  {
    label: "Indicator modules",
    value: "3",
    detail: "Range, momentum, risk"
  },
  {
    label: "Range score",
    value: "74 / 100",
    detail: "Upper range context"
  },
  {
    label: "Chart home",
    value: "TradingView",
    detail: "Overlay-first toolkit"
  },
  {
    label: "Setup path",
    value: "Guided",
    detail: "TradingView install notes"
  }
] as const;

export const trustSignals = [
  "TradingView-first",
  "Three named modules",
  "No black-box signals",
  "Mock preview only"
] as const;

export const heroProofPoints = [
  {
    label: "Suite packaging",
    value: "Range Map + Momentum Engine + Risk Radar"
  },
  {
    label: "Decision posture",
    value: "Buy / wait / avoid context, never guaranteed calls"
  },
  {
    label: "Launch posture",
    value: "Early access, setup notes, and honest mock previews"
  }
] as const;

export const toolkitModules = [
  {
    id: "range",
    indicatorLabel: "TradingView indicator",
    category: "Range structure",
    title: "Range Map Overlay",
    description: "Shows where price sits inside the active range, directly on the chart.",
    metric: "74",
    metricLabel: "Range Score",
    status: "Wait / Watch / Act",
    accent: "mint",
    visual: "range",
    borderClass: "border-mint/25 hover:border-mint/50",
    glowClass: "hover:shadow-[0_0_52px_rgba(168,240,209,0.16)]",
    pillClass: "border-mint/30 bg-mint/10 text-mint",
    metricClass: "text-mint",
    barClass: "from-mint via-signal to-amber",
    packageLine: "Overlay layer for support, resistance, and range position.",
    setupOutput: "Adds range bands, current price marker, and a 0-100 range score.",
    stats: [
      ["Score", "0-100"],
      ["Zones", "Auto"],
      ["Context", "Wait"]
    ],
    bullets: [
      "Auto-detected support and resistance zones",
      "Price position inside the current range",
      "Wait, watch, or act context without chart clutter"
    ],
    avoid: "Chasing near resistance because the candle looks exciting.",
    bestFor: "Long-term investors checking whether the current price is early, fair, or late."
  },
  {
    id: "momentum",
    indicatorLabel: "TradingView indicator",
    category: "Momentum state",
    title: "Momentum Engine",
    description: "Shows whether the move is strengthening, fading, compressing, or breaking out.",
    metric: "7 / 10",
    metricLabel: "Trend Stage",
    status: "Strong, extended",
    accent: "signal",
    visual: "momentum",
    borderClass: "border-signal/25 hover:border-signal/50",
    glowClass: "hover:shadow-[0_0_52px_rgba(159,211,255,0.16)]",
    pillClass: "border-signal/30 bg-signal/10 text-signal",
    metricClass: "text-signal",
    barClass: "from-signal via-mint to-amber",
    packageLine: "Momentum layer for trend stage, compression, and extension context.",
    setupOutput: "Adds stage bars, breakout watch, and exhaustion notes.",
    stats: [
      ["Stages", "10"],
      ["Trend", "Strong"],
      ["Watch", "Breakout"]
    ],
    bullets: [
      "Momentum stage detection",
      "Trend strength and breakout watch",
      "Rejection and exhaustion context"
    ],
    avoid: "Buying a move right as momentum starts fading into exhaustion.",
    bestFor: "Swing traders and watchlist builders timing entries around structure, not vibes."
  },
  {
    id: "risk",
    indicatorLabel: "TradingView indicator",
    category: "Entry risk",
    title: "Risk Radar",
    description: "Shows whether the current entry has attractive upside versus nearby downside.",
    metric: "Med / High",
    metricLabel: "Risk Zone",
    status: "Late-entry warning",
    accent: "amber",
    visual: "risk",
    borderClass: "border-amber/30 hover:border-amber/55",
    glowClass: "hover:shadow-[0_0_52px_rgba(217,180,108,0.18)]",
    pillClass: "border-amber/35 bg-amber/10 text-amber",
    metricClass: "text-amber",
    barClass: "from-amber via-signal to-mint",
    packageLine: "Risk layer for upside, downside, and entry quality.",
    setupOutput: "Adds late-entry warnings, pullback zones, and risk/reward context.",
    stats: [
      ["R/R", "1.8x"],
      ["Entry", "Wait"],
      ["Pullback", "$31"]
    ],
    bullets: [
      "Risk/reward context",
      "Late-entry warnings and pullback zones",
      "Downside mapping with an entry quality label"
    ],
    avoid: "Mistaking upside potential for a good entry when downside is too close.",
    bestFor: "Retail investors who want clearer buy-zone timing before adding capital."
  }
] as const;

// Mock chart preview - mock data only, no live APIs.
export const sampleAnalysis = {
  ticker: "ASTS",
  name: "AST SpaceMobile",
  window: "Mock TradingView chart preview",
  currentPrice: "$37.20",
  position: "Upper Range",
  rangeScore: 74,
  support: "$28.50 - $31.00",
  resistance: "$39.00 - $42.00",
  waitZone: "$33.00 - $36.00",
  momentum: "Strong but Extended",
  entryQuality: "Wait for Pullback",
  riskLevel: "Medium / High",
  riskReward: "1.8x",
  decision: "Wait",
  // Range bar geometry (percent positions across the 0-100 range bar).
  supportStartPct: 8,
  supportEndPct: 24,
  resistanceStartPct: 80,
  resistanceEndPct: 96,
  currentPct: 74,
  // Momentum bars: lifecycle of the current move (early -> extended).
  momentumBars: [22, 31, 28, 44, 52, 63, 71, 82, 88, 79],
  stats: [
    ["Price position", "Upper Range", "Top half of the active range"],
    ["Entry quality", "Wait", "Constructive, but not discounted"],
    ["Risk / reward", "1.8x", "Thins out the closer price gets to supply"],
    ["Risk level", "Med / High", "Extension risk rising into resistance"]
  ],
  note:
    "ASTS is pressing into the upper range after a strong move. The Range Map Overlay marks support around $28.50-$31.00 and resistance around $39.00-$42.00, while Momentum Engine reads strong but extended. Risk Radar says the cleaner entry is a pullback, not a chase."
} as const;

export const processSteps = [
  {
    eyebrow: "01",
    title: "Install on TradingView",
    body: "Join early access and install the RangeClarity indicator suite into your TradingView workspace."
  },
  {
    eyebrow: "02",
    title: "Add the indicators",
    body: "Load Range Map Overlay, Momentum Engine, and Risk Radar on the chart you are already studying."
  },
  {
    eyebrow: "03",
    title: "Read the range",
    body: "See support, resistance, current price position, and the 0-100 range score before you make the move."
  },
  {
    eyebrow: "04",
    title: "Confirm momentum",
    body: "Check whether the move is strengthening, fading, compressing, or breaking out."
  },
  {
    eyebrow: "05",
    title: "Decide buy / wait / avoid",
    body: "Use the chart context to decide whether the setup deserves action, patience, or a hard pass."
  }
] as const;

export const setupHighlights = [
  {
    label: "TradingView home base",
    value: "Add the indicators to the chart layout you already use."
  },
  {
    label: "Access model",
    value: "Invite-only or script access is still TBD, so the page stays honest."
  },
  {
    label: "Setup material",
    value: "Early users should get a short install guide and example chart layouts."
  }
] as const;

export const audienceCards = [
  {
    title: "Long-term investors",
    body: "Investors who like the company but want better technical timing before adding capital."
  },
  {
    title: "Swing traders",
    body: "Traders who care about structure, momentum, and risk instead of noisy candle chasing."
  },
  {
    title: "Retail chart readers",
    body: "People who use TradingView and want cleaner context without messy indicator overload."
  },
  {
    title: "Watchlist builders",
    body: "Investors tracking buy zones who need better timing around support, resistance, and pullbacks."
  },
  {
    title: "Indicator minimalists",
    body: "Chart users who want fewer tools on screen, but each tool needs to earn its space."
  }
] as const;

export const notForItems = [
  {
    title: "Not a signal bot",
    body: "RangeClarity does not tell you to blindly buy or sell."
  },
  {
    title: "Not financial advice",
    body: "It provides chart context and education, not personalized recommendations."
  },
  {
    title: "Not a guaranteed profit machine",
    body: "No indicator can promise outcomes, and this one will not pretend otherwise."
  },
  {
    title: "Not indicator spaghetti",
    body: "The suite is built around three clear modules, not a screen full of random lines."
  },
  {
    title: "Not a gambling tool",
    body: "The product is for reading structure and risk, not turning charts into a casino."
  }
] as const;

export const pricingPlans = [
  {
    title: "Free preview",
    status: "Planned",
    body: "A lightweight preview of the range-reading workflow and sample indicator outputs.",
    features: [
      "Mock chart examples",
      "Module walkthrough",
      "Waitlist updates"
    ]
  },
  {
    title: "Pro indicator suite",
    status: "Core",
    body: "Range Map Overlay, Momentum Engine, and Risk Radar inside TradingView.",
    features: [
      "Three indicator modules",
      "Setup guide and example layouts",
      "Support/resistance, momentum, and risk context"
    ]
  },
  {
    title: "AI companion add-on",
    status: "Coming soon",
    body: "A future plain-English companion for explaining selected chart context. No real AI is built yet.",
    features: [
      "Plain-English indicator explanations",
      "Context recap from selected readings",
      "No trade automation or advice"
    ]
  }
] as const;

export const earlyAccessBenefits = [
  "Pricing will be announced before checkout exists.",
  "TradingView setup flow will be documented before launch.",
  "No payment, account, or live-market plumbing is built into this prototype."
] as const;

export const faqItems = [
  {
    question: "Is RangeClarity a TradingView indicator suite?",
    answer:
      "Yes. The product is being positioned as a premium TradingView indicator suite built around Range Map Overlay, Momentum Engine, and Risk Radar."
  },
  {
    question: "Does RangeClarity provide buy and sell signals?",
    answer:
      "No. It frames range, momentum, entry quality, and risk so users can decide whether to buy, wait, or avoid. It is decision context, not a signal bot."
  },
  {
    question: "Does it repaint or promise accurate entries?",
    answer:
      "The landing page should not make repaint or accuracy claims until the real indicator implementation proves them. No indicator can guarantee entries or profits."
  },
  {
    question: "How will TradingView access work?",
    answer:
      "The access model is still to be confirmed. The page can explain the intended setup flow, but it should not claim automated access management yet."
  },
  {
    question: "Is the ASTS chart live market data?",
    answer:
      "No. The ASTS panel is mock data and CSS/SVG UI only. There are no real stock APIs, brokerage flows, or live TradingView embeds."
  },
  {
    question: "Who is it for?",
    answer:
      "Long-term investors and swing traders who use TradingView, care about structure, and want cleaner support, resistance, momentum, and risk context."
  }
] as const;

export const footerLinks = [
  { label: "Modules", href: "#indicator-modules" },
  { label: "Chart", href: "#tradingview-preview" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Early access", href: "#early-access" }
] as const;
