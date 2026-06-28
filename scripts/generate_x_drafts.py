#!/usr/bin/env python3
"""
RangeClarity — local X/Twitter draft generator.

DRAFTS ONLY. This script does NOT connect to the X API, does NOT post, and
does NOT automate any engagement. It reads the local content strategy + optional
project notes and writes a daily markdown file of drafts for MANUAL human review.

Usage:
    python scripts/generate_x_drafts.py                 # uses today's date
    python scripts/generate_x_drafts.py --date 2026-06-20
    python scripts/generate_x_drafts.py --out content/x/drafts

Output:
    content/x/drafts/YYYY-MM-DD_x_drafts.md

Safety: every output file carries a "MANUAL APPROVAL REQUIRED" banner. A small
linter flags any accidental advice/hype wording so the reviewer can catch it.
"""

import argparse
import datetime as dt
import os
import random
import re
import sys

# Anchor so 2026-06-20 maps to rotation index 0 (the starter themes below).
ANCHOR_DATE = dt.date(2026, 6, 20)
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Theme rotation — first five are the launch themes (Stage 6).
THEMES = [
    "Clarity over noise",
    "No signals, just structure",
    "Simple chart, complex engine",
    "No clean setup, say less",
    "Building in public",
    "Show fewer things, score what matters",
    "Strong = zone, weak = subtle line",
    "Website Brain / Market Room",
    "Watchlist Radar",
    "Clean chart, clear setup",
]

# Original-post pools, keyed by theme. Each line is a complete, on-brand draft.
POSTS = {
    "Clarity over noise": [
        "Most indicators scream. Ours whispers.\nStrong structure -> a zone. Weak structure -> a faint line. No clean setup -> it says less.\nClarity over noise.",
        "The hardest feature we built was the one that draws *less*.\nClean chart. Clear setup. That's the whole pitch.",
    ],
    "No signals, just structure": [
        "RangeClarity will never tell you to buy or sell.\nIt tells you where you are: bias, nearest level, the structure around price.\nThe map, not the move.",
        "No arrows. No alerts screaming 'NOW'. No 'sure thing' energy.\nJust structure: Local, Key, Strong, and a Soft Channel when it's real.",
    ],
    "Simple chart, complex engine": [
        "Simple chart. Complex engine.\nWhat you see: a few clean levels + a bias.\nWhat's underneath: scoring, merging, validation, and a lot of 'don't draw that.'",
        "The chart looks calm on purpose.\nThe engine behind it ranks every level so you only see the ones that matter.",
    ],
    "No clean setup, say less": [
        "No clean setup? The indicator says less.\nA mostly-empty chart with one honest bias chip beats five fake lines.",
        "Honesty feature: when there's no real structure near price, RangeClarity shows almost nothing.\nSilence is a signal too.",
    ],
    "Building in public": [
        "Building RangeClarity in public: a clean market-structure map on the chart, a clarity radar behind it.\nIf 'clean chart, clear setup' is your thing, follow along. ",
        "Building in public, week by week.\nThis one's about making the chart show real structure without ever cluttering it.",
    ],
    "Show fewer things, score what matters": [
        "Show fewer things. Score what matters.\nEvery level gets a 0-100 structure score; only the meaningful ones make it onto your chart.",
    ],
    "Strong = zone, weak = subtle line": [
        "Strong structure earns a zone. Medium/weak gets a subtle line. Noise gets nothing.\nThe visual *is* the verdict.",
    ],
    "Website Brain / Market Room": [
        "One chart is a lens. Many charts need a radar.\nThe Website Brain runs the same structure read across your whole watchlist and ranks what's worth a look.",
    ],
    "Watchlist Radar": [
        "Watchlist Radar idea: of your 100 names, which are at a Local/Key/Strong level or testing a channel today?\nA short, ranked, explained list. No signals.",
    ],
    "Clean chart, clear setup": [
        "Clean chart. Clear setup.\nBias + nearest level in about five seconds. That's the bar.",
    ],
}

# Build-in-public framing if we find a real recent note (see find_progress_note).
BIP_WRAPPERS = [
    "This week on RangeClarity: {note}\nSimple chart, complex engine. ",
    "Building in public -> {note}\nClean chart, clear setup.",
    "Progress log: {note}\nNo signals. Just clearer structure.",
]

REPLIES = [
    ("A chart account asks 'what do you see on $X?'",
     "Structurally: bias looks [Bullish/Sideways], price near a [Key/Strong] zone, [Soft Channel holding]. Not a call -- just the map. (RangeClarity = structure, not signals.)"),
    ("A market-news headline post",
     "Worth watching the *structure* here, not just the headline -- note where the nearest level sits. No call, just context."),
    ("Someone posts a cluttered 12-indicator chart",
     "Genuine question: which two of those do you act on? We went the other way -- score everything, draw almost nothing."),
    ("A trader says 'I keep getting chopped up'",
     "Chop usually = no clean structure near price. Sometimes the best read is 'say less and wait for a level.' Not advice, just how we think about it."),
    ("A 'rate my setup' post",
     "Structurally it reads [Sideways] with price mid-range between a Local S and a Key R. The map, not the move."),
    ("An account debating signals vs discretion",
     "We skipped signals entirely. The product just shows structure + bias and lets you decide. Less to argue with."),
    ("A 'what timeframe do you use' thread",
     "Daily for structure clarity right now. Same engine will scan many names later -- that's the part we're building in public."),
    ("Someone shares a clean breakout chart",
     "Nice clean structure. The 'is this real?' test we use: did it close beyond the level + buffer, or just wick? Confirmed closes only over here."),
    ("A beginner asks how to read support/resistance",
     "One way to simplify: rank levels (Local/Key/Strong), show strong ones as zones, weak ones as faint lines, and ignore the rest. Clarity over noise."),
    ("A 'this indicator is just lines' skeptic",
     "Fair -- the lines are the easy 10%. The 90% is deciding which lines NOT to draw. That's the whole engine."),
]

MEME_PROMPTS = [
    "Split image. Left: a chart with 14 indicators, arrows, rainbow clouds -- caption 'Your setup.' Right: one clean RangeClarity level + bias chip -- caption 'The setup.' Minimal, premium, slightly funny.",
    "Before/after. Before: chart so noisy you can't see price. After: same chart, one Local S line + a calm bias chip. Caption: 'We removed features until it made sense.'",
    "Calm, mostly-empty premium chart with a single bias chip. Caption: 'POV: there's no setup and the indicator is honest about it.'",
    "A 'distracted boyfriend' style frame but tasteful: trader looking away from 'RSI+MACD+VWAP+OB+FVG' toward 'one clean level.' Keep it premium, not cheesy.",
    "Two doors meme, minimal: Door 1 'More indicators.' Door 2 'Draw less.' RangeClarity walking through Door 2.",
    "A single faint line vs a bold zone, labeled 'weak structure' and 'strong structure.' Caption: 'The visual is the verdict.'",
]

CHART_PROMPTS = [
    "Pick an anonymized daily chart with obvious structure. Screenshot RangeClarity showing bias + nearest Local/Key/Strong level + Soft Channel. Caption: 'Structure read, not a call. What would you add or remove?'",
    "Find a chart near all-time highs. Show how RangeClarity says 'no resistance above / price discovery' instead of inventing a level. Caption: 'Honest beats hopeful.'",
    "Show a ranging chart where the Soft Channel is Inside and holding. Caption: 'Bias + range boundaries in 5 seconds.' Keep it anonymized, no ticker call.",
    "Show a wedge/messy chart where the channel correctly DOESN'T draw (Developing/None). Caption: 'No fake structure. If it's not real, we don't draw it.'",
    "Before/after of a strong trend that used to look empty, now showing one quiet Local S below price. Caption: 'A real level, shown quietly.'",
]

QUESTIONS = [
    "Show me a chart where the *structure* is obvious but everyone's overcomplicating it. Bias + nearest level only -- no signals.",
    "Honest poll: strong structure should be a zone, weak structure a faint line, noise nothing. Agree / disagree / depends?",
    "What clutters your charts the most -- and would you actually miss it if it were gone?",
    "How big is your watchlist? Trying to size the 'which of these is at a level today' problem.",
    "When is a nearly-blank chart the *right* answer? (We think: when there's no real setup.)",
]

# Occasional, tasteful pointer to the invite-only private beta. Used sparingly.
BETA_CTAS = [
    "RangeClarity is in a small private beta - invite-only, structure-only, no signals. If 'clean chart, clear setup' is your thing, the link's in bio.",
    "Quietly opening a private beta for the RangeClarity indicator: invite-only on TradingView. No signals, no hype - just the structure read.",
    "Private beta is open to a handful of people who think in structure, not signals. Invite-only TradingView access - a cleaner chart, not a promise.",
]

BANNED = [
    "buy", "sell", "long ", "short ", "entry", "exit", "take profit", "stop loss",
    "target", "guaranteed", "guarantee", "pump", "moon", "100x", "financial advice",
    "will go up", "will go down", "price target", "calls the top", "called the top",
    "win rate", "profit",
]


def rotation_index(d: dt.date) -> int:
    return (d - ANCHOR_DATE).days


def themes_for(d: dt.date, n: int = 5):
    idx = rotation_index(d)
    return [THEMES[(idx + i) % len(THEMES)] for i in range(n)]


def find_progress_note():
    """Optionally ground a build-in-public post in a real recent note. Safe if absent."""
    candidates = [
        "docs/current-sprint.md",
        "docs/project-state.md",
        "docs/rangeclarity_sr_core_v1_6_patch_notes.md",
    ]
    # Reject lines that read as internal jargon (paths, commit hashes, file types)
    internal = ("/", "commit", "http", ".md", ".pine", ".py", ".ts", ".tsx", ".json", "todo")
    for rel in candidates:
        path = os.path.join(REPO_ROOT, rel)
        if not os.path.isfile(path):
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                for raw in fh:
                    line = raw.strip()
                    if line.startswith(("- ", "* ")) and 20 <= len(line) <= 140:
                        text = re.sub(r"[#*_`>\[\]()]", "", line[2:]).strip()
                        text = re.sub(r"\s+", " ", text)
                        low = text.lower()
                        if not text or any(b in low for b in BANNED):
                            continue
                        if any(tok in low for tok in internal):
                            continue
                        if re.search(r"\b[0-9a-f]{7,}\b", low):  # commit-hash-like
                            continue
                        return text[0].lower() + text[1:]
        except OSError:
            continue
    return None  # clean fallback: a generic build-in-public post is used instead


def lint(text: str):
    low = text.lower()
    return [w.strip() for w in BANNED if w in low]


def build_doc(d: dt.date) -> str:
    rng = random.Random(d.toordinal())  # deterministic per date
    themes = themes_for(d, 5)

    # 3 original posts across 3 distinct themes
    posts = []
    for theme in themes[:3]:
        pool = POSTS.get(theme) or POSTS["Clarity over noise"]
        posts.append((theme, rng.choice(pool)))

    # one of the three becomes a grounded build-in-public if we have a real note
    note = find_progress_note()
    if note:
        wrapper = rng.choice(BIP_WRAPPERS).format(note=note)
        posts[-1] = ("Building in public", wrapper)

    replies = rng.sample(REPLIES, 5)
    memes = rng.sample(MEME_PROMPTS, 2)
    chart = rng.choice(CHART_PROMPTS)
    question = rng.choice(QUESTIONS)

    out = []
    out.append(f"# RangeClarity - X/Twitter Drafts - {d.isoformat()}\n")
    out.append("> [!] MANUAL APPROVAL REQUIRED - nothing here is posted automatically.")
    out.append("> Review every item against content/x/approval_checklist.md before posting by hand.")
    out.append("> Not financial advice. No buy/sell signals. Structure & context only.\n")

    out.append("## Themes today")
    for t in themes:
        out.append(f"- {t}")
    out.append("")

    out.append("## 3 original posts")
    for i, (theme, text) in enumerate(posts, 1):
        out.append(f"### Post {i} - theme: {theme}")
        out.append("```")
        out.append(text)
        out.append("```")
        flags = lint(text)
        if flags:
            out.append(f"> linter: review wording -> {', '.join(flags)}")
        out.append("")

    out.append("## 5 suggested replies")
    out.append("> Reply only to add value. Never lead with a link. Never give a call. One reply, not a swarm.\n")
    for i, (ctx, text) in enumerate(replies, 1):
        out.append(f"{i}. When: {ctx}")
        out.append(f"   Reply: {text}")
        flags = lint(text)
        if flags:
            out.append(f"   > linter: review wording -> {', '.join(flags)}")
    out.append("")

    out.append("## 2 meme / image prompts")
    for i, m in enumerate(memes, 1):
        out.append(f"{i}. {m}")
    out.append("")

    out.append("## 1 chart breakdown prompt")
    out.append(f"- {chart}")
    out.append("- Reminder: anonymize the chart, label it 'not a call,' structure-only.\n")

    out.append("## 1 question for followers")
    out.append(f"- {question}\n")

    out.append("## Optional: private-beta CTA (use sparingly, ~1-2x/week)")
    out.append(f"- {rng.choice(BETA_CTAS)}")
    out.append("- Invite-only, no fake scarcity. Skip it most days; clarity first, CTA second.\n")

    out.append("## Before you post")
    out.append("- Run content/x/approval_checklist.md on each item.")
    out.append("- Edit freely; keep the 1-3 that feel best; drop the rest.")
    out.append("- Post manually from the X app. This tool never posts for you.")
    out.append("")
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description="Generate RangeClarity X drafts (local, no API, no posting).")
    ap.add_argument("--date", help="YYYY-MM-DD (default: today)", default=None)
    ap.add_argument("--out", help="output dir", default=os.path.join(REPO_ROOT, "content", "x", "drafts"))
    args = ap.parse_args()

    if args.date:
        try:
            d = dt.date.fromisoformat(args.date)
        except ValueError:
            print(f"Invalid --date '{args.date}'. Use YYYY-MM-DD.", file=sys.stderr)
            return 2
    else:
        d = dt.date.today()

    os.makedirs(args.out, exist_ok=True)
    path = os.path.join(args.out, f"{d.isoformat()}_x_drafts.md")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(build_doc(d))

    print(f"Wrote {path}")
    print("DRAFTS ONLY - review against content/x/approval_checklist.md, then post manually.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
