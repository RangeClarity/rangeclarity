#!/usr/bin/env python3
"""Overall Project Roadmap — slide content (PDF A)."""
from deck import slide, kpi, chip
from svg_overall import (PHASES, brand_chart, architecture_svg, gantt_svg,
                         dependency_svg, timeline_html, phase_mini, risk_heatmap)


def overall_slides():
    S = []

    S.append(slide(
        "Strategic Roadmap &middot; v1.0 &middot; Confidential", "",
        f'''<div style="flex:1;display:flex;flex-direction:column;justify-content:center">
          <div class="cover-badge">RangeClarity &middot; Market-Structure Clarity System</div>
          <h1 style="margin-top:20px">Overall Project<br><span class="accent">Roadmap</span></h1>
          <div class="tagline">Audit &rarr; Paid Beta &rarr; MVP &middot; a 12-week arc (+ growth)</div>
          <div class="sub">An execution-ready roadmap taking RangeClarity from a built-but-unsold indicator to
          a paying private beta &mdash; no redesign loops, no premature infrastructure. One question governs every
          phase: <b style="color:var(--fg)">can RangeClarity deliver enough real value to charge the first five
          customers?</b></div></div>
        <div style="margin:14px 0 4px">{brand_chart(120)}</div>
        <div class="cols-4">
          {kpi('Jun 20', 'PREPARED', '2026 &middot; planning baseline', 'p0')}
          {kpi('16 wks', 'HORIZON', 'Jun 20 &rarr; Oct 10 &middot; 7 phases', 'p1')}
          {kpi('5', 'FIRST CUSTOMERS', 'the paid-beta validation target', 'p2')}
          {kpi('Pine-first', 'STRATEGY', 'indicator sells &middot; web markets', 'p4')}
        </div>''', "Founder + build team", cls="cover"))

    S.append(slide(
        "01 &middot; Executive Summary", "The bet, in one <span class='accent'>page</span>",
        f'''<div class="row" style="flex:1">
          <div class="col" style="flex:1.35">
            <div class="card rail glow"><div class="kicker">THE SITUATION</div>
              <p style="color:var(--fg);font-size:11.5px;margin-top:6px">RangeClarity already owns its hardest asset:
              a real, 465-line TradingView Pine indicator. What is missing is not more product &mdash; it is
              <b>proof of value</b> and a <b>way to take money</b>. The landing page builds but converts nothing (its
              CTA posts to a dead <span class="mono">action="#"</span>). There is no payment, no access path, and the
              indicator is not yet validated on real charts.</p></div>
            <div class="card rail"><div class="kicker">THE BET</div>
              <p style="color:var(--fg);font-size:11.5px;margin-top:6px">Sell the indicator <b>Pine-first</b> to five
              paying beta users. The web app stays marketing + access only. Defer auth, billing engines and the website
              brain until paying users prove the loop. Prioritise the one journey that turns a visitor into a verified
              paid user who immediately understands what they bought.</p></div>
          </div>
          <div class="col" style="flex:1">
            <div class="card soft"><div class="kicker">THE 12-WEEK ARC</div>
              <ul class="ul tight mt6">
                <li><b style="color:var(--fg)">Wk 1</b> &mdash; Audit &amp; lock direction</li>
                <li><b style="color:var(--fg)">Wk 1-2</b> &mdash; Paid beta access loop</li>
                <li><b style="color:var(--fg)">Wk 3-4</b> &mdash; Core product value MVP</li>
                <li><b style="color:var(--fg)">Wk 5-6</b> &mdash; Indicator polish</li>
                <li><b style="color:var(--fg)">Wk 7-9</b> &mdash; Website brain foundation</li>
                <li><b style="color:var(--fg)">Wk 10-12</b> &mdash; Private beta launch</li>
                <li><span class="faint">Wk 13-16 &mdash; Growth system</span></li>
              </ul></div>
            <div class="card glow" style="border-color:rgba(47,255,214,0.4)">
              <div class="kicker" style="color:var(--accent)">SINGLE GOVERNING TEST</div>
              <p style="color:var(--fg);font-size:12.5px;font-weight:700;margin-top:6px">"Can RangeClarity deliver
              enough real value to charge the first five customers?"</p>
              <p class="note">Every phase is scored against this &mdash; not feature count.</p></div>
          </div></div>
        <div class="cols-4 mt10">
          {kpi('1', 'HARD ASSET', 'validated indicator = the product', 'p0')}
          {kpi('0', 'PAYMENT PATHS', 'today &mdash; the gap to close first', 'p5')}
          {kpi('Whop', 'CHECKOUT', 'external &middot; sandbox first', 'p1')}
          {kpi('Invite', 'ACCESS', 'TradingView invite-only + Discord', 'p3')}
        </div>''', "Executive summary"))

    S.append(slide(
        "02 &middot; Product Vision", "The north <span class='accent'>star</span>",
        f'''<div class="card glow" style="border-color:rgba(47,255,214,0.34)">
          <div class="statement">RangeClarity turns a wall of charts into a short, ranked, explained list of the
          <span class="accent">structures worth watching</span> &mdash; a clean map on the chart, a clarity radar
          behind it.</div></div>
        <div class="row mt10" style="flex:1">
          <div class="card" style="flex:1.1"><div class="kicker">THE FOUR PLAIN QUESTIONS IT ANSWERS</div>
            <ul class="ul mt6">
              <li><b style="color:var(--fg)">What is the structure?</b> &mdash; bias: bullish / bearish / sideways / unclear</li>
              <li><b style="color:var(--fg)">Where are the levels that matter?</b> &mdash; Local / Key / Strong S/R + channel</li>
              <li><b style="color:var(--fg)">How far is price from them?</b> &mdash; distance to the levels that count</li>
              <li><b style="color:var(--fg)">Which charts are interesting now, and why?</b> &mdash; ranked across a watchlist</li>
            </ul></div>
          <div class="card" style="flex:1"><div class="kicker">WHO IT IS FOR</div>
            <ul class="ul tight mt6">
              <li>Self-directed swing traders &amp; investors who think in <b style="color:var(--fg)">structure</b>, not signals</li>
              <li>Watchlist-driven users tracking 20-200 symbols who need a daily "what changed" radar</li>
              <li>Discretionary traders wanting a clean second opinion &mdash; not a black box</li>
            </ul>
            <div class="divider"></div><div class="kicker">THE PHILOSOPHY</div>
            <p style="color:var(--fg);font-size:12px;font-weight:700;margin-top:5px">Simple visual &middot; complex engine &middot; clear context.</p>
            <p class="note">The indicator is the lens. The brain is the radar. Restraint is the brand.</p></div>
        </div>''', "Vision &middot; master_vision.md"))

    S.append(slide(
        "03 &middot; Positioning", "What RangeClarity <span class='accent'>is</span> &mdash; and is not",
        '''<div class="row" style="flex:1">
          <div class="card" style="flex:1;border-color:rgba(52,245,176,0.32)">
            <div class="chip ok"><span class="dot"></span>RANGECLARITY IS</div>
            <ul class="ul check mt10">
              <li>A market-<b style="color:var(--fg)">structure clarity system</b>: a clean chart overlay + a clarity radar</li>
              <li>A reader of <b style="color:var(--fg)">range, bias, support/resistance, channel state</b>, strength &amp; score</li>
              <li>A way to see <b style="color:var(--fg)">which of your charts are at a decision point</b> today</li>
              <li>Educational decision-<b style="color:var(--fg)">support</b> &mdash; it describes structure; the user decides</li>
              <li>Deliberately narrow &amp; premium &mdash; "<b style="color:var(--fg)">clarity over noise</b>"</li>
              <li>Sold as a <b style="color:var(--fg)">TradingView Pine indicator</b>, invite-only, for a paid beta</li>
            </ul></div>
          <div class="card" style="flex:1;border-color:rgba(255,93,122,0.3)">
            <div class="chip miss"><span class="dot"></span>RANGECLARITY IS NOT</div>
            <ul class="ul cross mt10">
              <li>A <b style="color:var(--fg)">buy / sell signal</b> service or an entries-and-exits bot</li>
              <li>A <b style="color:var(--fg)">prediction</b> or probability-of-direction engine</li>
              <li>A win-rate, target/stop, or guaranteed-profit product</li>
              <li>Financial advice &mdash; no advice framing anywhere</li>
              <li>A noisy RSI + MACD + VWAP + FVG + liquidity pile-up</li>
              <li>Crypto hype, generic SaaS, or trading-guru marketing</li>
            </ul></div></div>
        <div class="card soft mt10" style="border-color:rgba(255,206,77,0.28)">
          <div class="kicker" style="color:var(--gold)">LANGUAGE GUARDRAIL &mdash; NON-NEGOTIABLE</div>
          <p style="margin-top:4px">No profit / win-rate / buy-sell / guarantee language on the chart, in the scanner,
          in the brief, or in marketing. This restraint is the moat, not a limitation.</p></div>''',
        "Positioning &middot; decision D-001"))

    S.append(slide(
        "04 &middot; Product Architecture", "One brain, <span class='accent'>two bodies</span>",
        f'''<div class="row" style="flex:1;gap:14px">
          <div style="flex:2.6">{architecture_svg()}</div>
          <div class="col" style="flex:1;gap:9px">
            <div class="card soft" style="padding:10px 12px"><div class="kicker">READING THE MAP</div>
              <p style="font-size:9.6px;margin-top:4px">A single tested <b style="color:var(--accent)">canonical scoring
              core</b> defines the structure math. The Pine indicator and the web scanner are two implementations of it,
              kept honest by shared golden fixtures.</p></div>
            <div class="card soft" style="padding:10px 12px"><div class="kicker">STATUS LEGEND</div>
              <div class="tagrow mt6">{chip('Built', 'cyan')}{chip('Next', 'ok')}{chip('Phase 4', 'violet')}{chip('Post-beta', 'muted')}</div>
              <p class="note" style="margin-top:7px">Only the cyan layer exists today. Everything below the fold is
              sequenced &mdash; and deliberately deferred until paid validation.</p></div>
            <div class="card" style="padding:10px 12px;border-color:rgba(47,255,214,0.34)">
              <div class="kicker" style="color:var(--accent)">THE ANCHOR</div>
              <p style="font-size:9.6px;margin-top:4px">Parity by <b style="color:var(--fg)">test vectors</b>, not a shared
              runtime. Divergence between chart and web is the #1 architectural risk &mdash; fixtures gate both.</p></div>
          </div></div>''', "Architecture &middot; system_architecture.md"))

    S.append(slide(
        "04 &middot; Product Architecture", "The <span class='accent'>six layers</span>, by responsibility &amp; status",
        f'''<div class="cols-3" style="flex:1">
          <div class="card p0"><div class="badge-phase p0"><span class="sq"></span>TRADINGVIEW VISUAL LAYER</div>
            <p style="margin-top:7px"><b style="color:var(--fg)">The lens.</b> Clean Pine overlay: S/R tiers, soft
            structure channel, bias, distances, dashboard, descriptive alerts. Visible truth for one chart.</p>
            <div class="tagrow mt10">{chip('Built &middot; validating', 'cyan')}</div></div>
          <div class="card p1"><div class="badge-phase p1"><span class="sq"></span>WEBSITE BRAIN / CANONICAL CORE</div>
            <p style="margin-top:7px"><b style="color:var(--fg)">The radar.</b> The tested scoring spec + a server scanner
            that runs it across many symbols, ranks by clarity, and stores history the chart cannot.</p>
            <div class="tagrow mt10">{chip('Core: next', 'ok')}{chip('Scanner: Phase 4', 'violet')}</div></div>
          <div class="card p4"><div class="badge-phase p4"><span class="sq"></span>SYNC LAYER</div>
            <p style="margin-top:7px">TradingView alert webhooks &rarr; schema-shaped events into the brain, validated and
            de-duplicated. Bridges live chart events to history. Additive, never required.</p>
            <div class="tagrow mt10">{chip('Post-beta', 'muted')}</div></div>
          <div class="card p5"><div class="badge-phase p5"><span class="sq"></span>MARKET ROOM</div>
            <p style="margin-top:7px">The primary web UI: ranked, explained cards of the charts worth watching today,
            with filters and a daily clarity brief over the user's watchlists.</p>
            <div class="tagrow mt10">{chip('Post-beta', 'muted')}</div></div>
          <div class="card p4"><div class="badge-phase p4"><span class="sq"></span>HERMES / AI EXPLANATION</div>
            <p style="margin-top:7px">Turns schema rows into short, plain-language reasons a chart is interesting.
            Deterministic templates first, LLM phrasing later &mdash; always behind a no-advice guard.</p>
            <div class="tagrow mt10">{chip('Post-beta', 'muted')}</div></div>
          <div class="card p6"><div class="badge-phase p6"><span class="sq"></span>GROWTH / COMMUNITY LAYER</div>
            <p style="margin-top:7px">X content engine, demos, short videos, educational clarity posts, and the
            beta-access funnel. The repeatable top of funnel into paid beta.</p>
            <div class="tagrow mt10">{chip('Phase 6', 'orange')}</div></div>
        </div>''', "Architecture layers"))

    S.append(slide(
        "05 &middot; 12-Week Roadmap", "The <span class='accent'>arc</span>, phase by phase",
        f'''<div class="card soft" style="padding:14px 16px 18px">{timeline_html()}</div>
        <div class="mt10" style="display:grid;grid-template-columns:repeat(7,1fr);gap:7px">
          {''.join(phase_mini(i) for i in range(len(PHASES)))}
        </div>
        <p class="note mt10">Exact dates run Jun 20 &rarr; Oct 10, 2026. The <b style="color:var(--accent)">12-week core
        arc</b> (Phases 0-5) delivers a live private beta by Sep 12; Phase 6 (Growth) extends four weeks beyond.</p>''',
        "Roadmap timeline"))

    S.append(slide(
        "05 &middot; 12-Week Roadmap", "Gantt-style <span class='accent'>schedule</span>",
        f'''<div class="card soft" style="padding:16px 22px;flex:1;display:flex;align-items:center">{gantt_svg()}</div>
        <div class="cols-3 mt10">
          <div class="card soft" style="padding:10px 13px"><div class="kicker" style="color:var(--cyan)">CRITICAL PATH</div>
            <p style="font-size:9.8px;margin-top:4px">Validate indicator &rarr; stand up offer/access &rarr; point CTA
            &rarr; core value screen. Everything else waits behind it.</p></div>
          <div class="card soft" style="padding:10px 13px"><div class="kicker" style="color:var(--accent)">PARALLELISABLE</div>
            <p style="font-size:9.8px;margin-top:4px">Indicator polish (P3) and the canonical core spec (EN-1) can run
            alongside the access loop with a second contributor.</p></div>
          <div class="card soft" style="padding:10px 13px"><div class="kicker" style="color:var(--orange)">FLOAT / SLACK</div>
            <p style="font-size:9.8px;margin-top:4px">Website brain (P4) holds the most slack &mdash; it can compress or
            slip without moving the private-beta date.</p></div>
        </div>''', "Gantt schedule"))

    S.append(slide(
        "06 &middot; Milestones by Phase", "Mission &amp; <span class='accent'>exit gate</span> per phase",
        '<table class="t zebra" style="flex:1"><thead><tr><th style="width:8%">Phase</th>'
        '<th style="width:16%">Window</th><th style="width:34%">Mission</th>'
        '<th style="width:42%">Exit gate &mdash; what proves it is done</th></tr></thead><tbody>'
        + ''.join(
            f'<tr><td><span class="badge-phase p{i}"><span class="sq"></span>{ph[0]}</span></td>'
            f'<td class="num">{ph[6]}</td><td><b>{ph[2]}</b><br>'
            f'<span class="faint" style="font-size:9px">{ph[7]}</span></td><td>{ph[8]}</td></tr>'
            for i, ph in enumerate(PHASES))
        + '</tbody></table>'
        '<p class="note mt6">A phase does not start until the prior gate is signed off. Gates are evidence, not calendar '
        'dates &mdash; the schedule serves the gate, never the other way around.</p>', "Milestones &middot; exit gates"))

    S.append(slide(
        "07 &middot; Dependency Map", "What <span class='accent'>blocks</span> what",
        f'''<div class="card soft" style="padding:14px 20px;flex:1;display:flex;align-items:center">{dependency_svg()}</div>
        <div class="cols-3 mt10">
          <div class="card" style="border-color:rgba(56,232,255,0.3)"><div class="kicker" style="color:var(--cyan)">TWO HARD GATES</div>
            <p style="font-size:9.8px;margin-top:4px"><b style="color:var(--fg)">RC-6</b> (indicator validated) and
            <b style="color:var(--fg)">O-002</b> (offer + price) gate the entire money path. Resolve both in week 1.</p></div>
          <div class="card"><div class="kicker">CONVERGENCE</div>
            <p style="font-size:9.8px;margin-top:4px">Access loop, core value, and indicator polish all converge on
            <b style="color:var(--magenta)">Private Beta (P5)</b> &mdash; the first revenue milestone.</p></div>
          <div class="card"><div class="kicker">DECOUPLED</div>
            <p style="font-size:9.8px;margin-top:4px"><b style="color:var(--accent)">EN-1</b> (canonical core) seeds the
            website brain but is off the revenue critical path &mdash; start early, finish calmly.</p></div>
        </div>''', "Dependency map"))

    S.append(slide(
        "08 &middot; Risk Map", "Likelihood &times; impact <span class='accent'>heatmap</span>",
        f'''<div class="row" style="flex:1;gap:14px">
          <div style="flex:1.5">{risk_heatmap()}</div>
          <div class="col" style="flex:1;gap:8px">
            <div class="card soft" style="padding:10px 12px"><div class="kicker" style="color:var(--bear)">TOP RISK</div>
              <p style="font-size:9.6px;margin-top:4px"><b style="color:var(--fg)">R1 &mdash; Indicator is not worth
              paying for.</b> Mitigation: validate (RC-6) before any spend; founder go/no-go gate.</p></div>
            <div class="card soft" style="padding:10px 12px"><div class="kicker" style="color:var(--orange)">WATCH</div>
              <p style="font-size:9.6px;margin-top:4px"><b style="color:var(--fg)">R2 &mdash; Chart/web divergence.</b>
              Shared golden fixtures enforce parity. <b style="color:var(--fg)">R3 &mdash; Redesign loop.</b> Direction
              is locked in P0.</p></div>
            <div class="card soft" style="padding:10px 12px"><div class="kicker">POSTURE</div>
              <p style="font-size:9.6px;margin-top:4px">Most risk is <b style="color:var(--fg)">de-risked by
              sequencing</b> &mdash; validate value and avoid building infra before demand is proven.</p></div>
          </div></div>''', "Risk heatmap"))

    S.append(slide(
        "09 &middot; Success Metrics", "The clarity <span class='accent'>dashboard</span>",
        f'''<div class="cols-4" style="margin-bottom:11px">
          {kpi('5', 'PAYING BETA USERS', 'primary validation target', 'p2')}
          {kpi('&ge;6/9', 'TEST MATRIX', 'indicator categories passed (RC-6)', 'p0')}
          {kpi('100%', 'LOOP COMPLETION', 'sandbox journey, no dead ends', 'p1')}
          {kpi('&lt; 5 min', 'TIME-TO-VALUE', 'signup &rarr; understands product', 'p3')}
        </div>
        <table class="t zebra" style="flex:1"><thead><tr><th style="width:26%">Metric</th><th style="width:13%">Baseline</th>
          <th style="width:17%">Target (Beta)</th><th style="width:14%">Phase</th><th>How measured</th></tr></thead><tbody>
          <tr><td><b>Indicator validation coverage</b></td><td class="num">0 / 9</td><td class="num">&ge; 6 / 9</td><td>P0-P3</td><td>Pine test matrix on 1D + 4H/1H, repaint check</td></tr>
          <tr><td><b>Paid-loop completion</b></td><td class="num">no path</td><td class="num">100% sandbox</td><td>P1</td><td>QA run: land &rarr; register &rarr; pay &rarr; access</td></tr>
          <tr><td><b>First paying customers</b></td><td class="num">0</td><td class="num">5</td><td>P5</td><td>Whop active subscriptions</td></tr>
          <tr><td><b>Activation (saw core value)</b></td><td class="num">&mdash;</td><td class="num">&ge; 80%</td><td>P2/P5</td><td>reached core value screen + applied indicator</td></tr>
          <tr><td><b>Willingness to pay / retain</b></td><td class="num">unknown</td><td class="num">&ge; 3/5 renew intent</td><td>P5</td><td>structured beta feedback + renewal signal</td></tr>
          <tr><td><b>Top-of-funnel (growth)</b></td><td class="num">0</td><td class="num">weekly cadence</td><td>P6</td><td>CTA&rarr;Whop clicks, content reach</td></tr>
        </tbody></table>''', "Success metrics"))

    S.append(slide(
        "10 &middot; Now / Next / Later", "Where focus <span class='accent'>lives</span>",
        '''<div class="cols-3" style="flex:1">
          <div class="card" style="border-color:rgba(47,255,214,0.4)"><div class="chip ok"><span class="dot"></span>NOW &middot; WK 1-2</div>
            <ul class="ul mt10">
              <li><b style="color:var(--fg)">Validate</b> the indicator (RC-6)</li>
              <li><b style="color:var(--fg)">Decide</b> offer + price (O-002)</li>
              <li>Build the <b style="color:var(--fg)">paid beta access loop</b> (sandbox)</li>
              <li>Point the live <b style="color:var(--fg)">CTA at the real offer</b></li>
            </ul></div>
          <div class="card" style="border-color:rgba(155,107,255,0.4)"><div class="chip violet"><span class="dot"></span>NEXT &middot; WK 3-9</div>
            <ul class="ul mt10">
              <li><b style="color:var(--fg)">Core value screen</b> + onboarding</li>
              <li>Indicator <b style="color:var(--fg)">polish</b> to "worth charging"</li>
              <li><b style="color:var(--fg)">Canonical core</b> spec + fixtures (EN-1)</li>
              <li>Website <b style="color:var(--fg)">brain foundation</b> (scanner)</li>
            </ul></div>
          <div class="card" style="border-color:rgba(255,138,60,0.36)"><div class="chip orange"><span class="dot"></span>LATER &middot; WK 10+</div>
            <ul class="ul mt10">
              <li><b style="color:var(--fg)">Private beta</b> &mdash; onboard the first 5</li>
              <li><b style="color:var(--fg)">Growth system</b> &mdash; content + demos</li>
              <li>Market Room, Hermes, sync layer</li>
              <li>Self-serve auth / billing (only if demand proves it)</li>
            </ul></div></div>
        <div class="card soft mt10" style="border-color:rgba(47,255,214,0.26)">
          <p style="font-size:11px"><b style="color:var(--accent)">The discipline:</b> nothing moves from
          <span class="mono">LATER</span> to <span class="mono">NOW</span> until a paying user demands it. The roadmap
          protects focus as fiercely as it sequences work.</p></div>''', "Now / Next / Later"))

    S.append(slide(
        "11 &middot; Guardrails", "What <span class='accent'>not</span> to build yet",
        '''<div class="cols-2" style="flex:1">
          <div class="card" style="border-color:rgba(255,93,122,0.3)"><div class="chip miss"><span class="dot"></span>DO NOT BUILD (PRE-VALIDATION)</div>
            <ul class="ul cross mt10">
              <li>In-app <b style="color:var(--fg)">Stripe / auth / entitlements</b> stack for 5 users &mdash; Whop + invite covers it</li>
              <li>A <b style="color:var(--fg)">live-money</b> payment path &mdash; sandbox only until founder approval</li>
              <li>The full <b style="color:var(--fg)">Market Room</b> / multi-ticker scanner before the core loop is proven</li>
              <li><b style="color:var(--fg)">LLM</b> Hermes explanations &mdash; templates first, behind a no-advice guard</li>
              <li><b style="color:var(--fg)">Another landing redesign</b> &mdash; the page exists; point it at the offer</li>
              <li>A licensed market-data feed / charting engine &mdash; TradingView supplies it free</li>
            </ul></div>
          <div class="card" style="border-color:rgba(52,245,176,0.3)"><div class="chip ok"><span class="dot"></span>BUILD INSTEAD</div>
            <ul class="ul check mt10">
              <li>Proof the indicator is <b style="color:var(--fg)">worth paying for</b></li>
              <li>The <b style="color:var(--fg)">one complete journey</b>: land &rarr; register &rarr; sandbox pay &rarr; access &rarr; value</li>
              <li>A <b style="color:var(--fg)">core value screen</b> a buyer grasps in &lt; 5 minutes</li>
              <li>Honest <b style="color:var(--fg)">docs + disclaimers</b> (no-advice, beta limits, what to test)</li>
              <li>The <b style="color:var(--fg)">canonical core spec</b> + fixtures, quietly, in parallel</li>
            </ul></div></div>
        <div class="card soft mt10" style="border-color:rgba(255,206,77,0.26)">
          <p style="font-size:10.5px"><b style="color:var(--gold)">Why this matters:</b> building auth, billing and a
          scanner for five customers is over-engineering that delays the only thing that de-risks the company &mdash;
          revenue. Restraint here is a strategy, not a shortcut.</p></div>''', "Guardrails"))

    S.append(slide(
        "12 &middot; Team", "Recommended <span class='accent'>roles</span> &amp; freelancers",
        '''<table class="t zebra" style="flex:1"><thead><tr><th style="width:20%">Role</th><th style="width:14%">When</th>
          <th style="width:13%">Load</th><th style="width:53%">Why / scope</th></tr></thead><tbody>
          <tr><td><b>Founder</b> (product + GTM)</td><td>All phases</td><td>Lead</td><td>Owns the offer, price, validation verdict, beta relationships, and every go/no-go gate.</td></tr>
          <tr><td><b>Pine / quant developer</b></td><td>P0, P3, P4</td><td>0.4-0.6 FTE</td><td>Validate &amp; polish the indicator; co-author the canonical scoring spec + golden fixtures.</td></tr>
          <tr><td><b>Full-stack (Next.js/TS)</b></td><td>P1, P2, P4</td><td>0.5-0.8 FTE</td><td>Access loop, core value screen, Whop wiring, and later the scanner/brain endpoints.</td></tr>
          <tr><td><b>Product designer</b> (contract)</td><td>P1-P2</td><td>~1 wk</td><td>Trust-and-comprehension polish only &mdash; no redesign. Premium fintech feel, mobile pass.</td></tr>
          <tr><td><b>Technical writer</b> (contract)</td><td>P2</td><td>2-3 days</td><td>Indicator user guide, beta limitations, disclaimers, "what this means / does not mean".</td></tr>
          <tr><td><b>Content / motion</b> (contract)</td><td>P6</td><td>part-time</td><td>X content engine, short demos, educational clarity posts. Starts only at growth.</td></tr>
        </tbody></table>
        <div class="cols-3 mt10">
          <div class="card soft" style="padding:9px 12px"><div class="kicker">LEANEST VIABLE TEAM</div><p style="font-size:9.6px;margin-top:3px">Founder + one part-time full-stack who can also touch Pine. Everything else contracted by the day.</p></div>
          <div class="card soft" style="padding:9px 12px"><div class="kicker">HIRE TRIGGER</div><p style="font-size:9.6px;margin-top:3px">Add the quant dev only after RC-6 confirms the indicator is worth investing in.</p></div>
          <div class="card soft" style="padding:9px 12px"><div class="kicker">DO NOT HIRE YET</div><p style="font-size:9.6px;margin-top:3px">No DevOps, data-eng, or community manager until the beta validates demand.</p></div>
        </div>''', "Team &amp; freelancers"))

    S.append(slide(
        "13 &middot; Budget Sensitivity", "Lean &middot; standard &middot; <span class='accent'>premium</span>",
        '''<div class="cols-3" style="flex:1">
          <div class="card p2" style="border-color:rgba(182,255,60,0.34)"><div class="badge-phase p2"><span class="sq"></span>LEAN</div>
            <div class="lead-num mt6" style="color:var(--lime)">$0-0.6k</div>
            <p class="faint mono" style="font-size:8.5px">PER MONTH &middot; TO PRIVATE BETA</p>
            <ul class="ul tight mt10"><li>Founder builds; AI-assisted dev</li><li>Whop fees + domain + Vercel free tier</li>
              <li>Discord free; no paid tools</li><li><b style="color:var(--fg)">Tradeoff:</b> slower, founder-bound</li></ul></div>
          <div class="card p1" style="border-color:rgba(47,255,214,0.45);box-shadow:0 0 26px rgba(47,255,214,0.13)">
            <div class="badge-phase p1"><span class="sq"></span>STANDARD &middot; RECOMMENDED</div>
            <div class="lead-num mt6" style="color:var(--accent)">$1.5-3k</div>
            <p class="faint mono" style="font-size:8.5px">PER MONTH &middot; TO PRIVATE BETA</p>
            <ul class="ul tight mt10"><li>Part-time full-stack contractor</li><li>Day-rate design + writing polish</li>
              <li>Analytics + email + hosting paid tiers</li><li><b style="color:var(--fg)">Tradeoff:</b> balanced speed &amp; spend</li></ul></div>
          <div class="card p4" style="border-color:rgba(155,107,255,0.4)"><div class="badge-phase p4"><span class="sq"></span>PREMIUM</div>
            <div class="lead-num mt6" style="color:var(--violet)">$5-9k</div>
            <p class="faint mono" style="font-size:8.5px">PER MONTH &middot; TO PRIVATE BETA</p>
            <ul class="ul tight mt10"><li>Dedicated full-stack + quant dev</li><li>Brand designer + content/motion</li>
              <li>Brain foundation built in parallel</li><li><b style="color:var(--fg)">Tradeoff:</b> fastest, highest burn pre-revenue</li></ul></div></div>
        <div class="card soft mt10" style="border-color:rgba(47,255,214,0.26)">
          <p style="font-size:10.5px"><b style="color:var(--accent)">Recommendation &mdash; Standard.</b> Enough leverage
          to ship the access loop and value screen on schedule, without burning premium money before five customers
          prove the bet. Step up to Premium <i>after</i> the beta validates willingness to pay.</p></div>''',
        "Budget sensitivity"))

    S.append(slide(
        "14 &middot; Recommendation", "The sprint that <span class='accent'>matters most now</span>",
        '''<div class="card glow" style="border-color:rgba(47,255,214,0.45);margin-bottom:11px">
          <div class="kicker" style="color:var(--accent)">DO THIS FIRST</div>
          <div class="statement mt6">Run <span class="accent">Sprint 1 &mdash; Paid Beta Access Loop + Core Product
          Value</span> (Jun 20 - Jul 7). Prove RangeClarity can be a real product, not a visual idea.</div></div>
        <div class="row" style="flex:1">
          <div class="card" style="flex:1.3"><div class="kicker">WHY THIS, WHY NOW</div>
            <ul class="ul mt6">
              <li>The hard asset (a real indicator) already exists &mdash; the gap is <b style="color:var(--fg)">proof + a way to pay</b></li>
              <li>One complete journey unlocks the only metric that matters: <b style="color:var(--fg)">paying users</b></li>
              <li>It needs <b style="color:var(--fg)">no heavy infrastructure</b> &mdash; Whop sandbox + invite-only access</li>
              <li>It forces the two hard decisions (validation + price) to the front, where they belong</li>
            </ul></div>
          <div class="col" style="flex:1">
            <div class="card soft"><div class="kicker" style="color:var(--accent)">THE ONE OUTCOME</div>
              <p style="font-size:10.5px;margin-top:4px;color:var(--fg)">A user can land, understand the offer, register,
              complete a sandbox payment, receive verified access, and see one clear product-value screen.</p></div>
            <div class="card soft"><div class="kicker">THEN, AND ONLY THEN</div>
              <p style="font-size:10.5px;margin-top:4px">Polish the indicator, build the website brain, and open the
              private beta &mdash; each behind its own evidence gate.</p></div></div></div>
        <p class="note center mt10">Detail, daily schedule, and ship/no-ship checklist &rarr;
        <b class="mono" style="color:var(--accent)">RangeClarity_Next_Sprint_Taskbook.pdf</b></p>''', "Final recommendation"))

    return S
