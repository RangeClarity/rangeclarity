#!/usr/bin/env python3
"""Sprint Taskbook slides 1-7 (cover, overview, audit, gaps, board, ICE, funnel)."""
from deck import slide, kpi, chip
from svg_sprint import sprint_flow_svg, funnel_svg, kanban_html


def _ice_rows():
    items = [
        ('Decide offer + price (O-002)', 9, 8, 9), ('Point live CTA at the offer', 6, 9, 9),
        ('QA the full flow', 8, 8, 7), ('Product docs + disclaimers', 6, 9, 8),
        ('Validate indicator (RC-6, gate)', 10, 8, 5), ('Core value screen', 9, 7, 6),
        ('Registration + access model', 7, 8, 6), ('Verified-access logic', 8, 7, 6),
        ('Sandbox payment (Whop test)', 9, 7, 5),
    ]
    scored = sorted(((i, c, e, i * c * e, t) for t, i, c, e in items), key=lambda r: -r[3])
    out = ''
    for rank, (i, c, e, s, t) in enumerate(scored, 1):
        hot = 'style="color:var(--accent);font-weight:700"' if rank <= 3 else 'class="num"'
        out += (f'<tr><td class="num">{rank}</td><td><b>{t}</b></td><td class="num">{i}</td>'
                f'<td class="num">{c}</td><td class="num">{e}</td><td {hot}>{s}</td></tr>')
    return out


def slides_1():
    S = []

    S.append(slide(
        "Sprint 1 &middot; Execution Taskbook &middot; Confidential", "",
        f'''<div style="flex:1;display:flex;flex-direction:column;justify-content:center">
          <div class="cover-badge">RangeClarity &middot; Next Sprint &middot; Paid Beta Access Loop</div>
          <h1 style="margin-top:18px">Sprint 1 &mdash;<br><span class="accent">Access Loop + Core Value</span></h1>
          <div class="tagline">Jun 20 &rarr; Jul 7, 2026 &middot; 18 days &middot; one complete journey</div>
          <div class="sub">The practical, day-by-day execution book for the sprint that matters most now. Mission:
          <b style="color:var(--fg)">prove RangeClarity can become a real product, not just a visual idea</b> &mdash;
          a user can land, understand the offer, register, complete a sandbox payment, receive verified access, and
          see one clear product-value screen.</div></div>
        <div class="cols-4">
          {kpi('18', 'DAYS', 'Jun 20 - Jul 7, 2026', 'p0')}
          {kpi('10', 'CORE TASKS', 'audit to ship, sequenced', 'p1')}
          {kpi('1', 'JOURNEY', 'land to verified value', 'p2')}
          {kpi('Sandbox', 'PAYMENTS', 'test mode only - no live money', 'p3')}
        </div>''', "Founder + build team", cls="cover"))

    S.append(slide(
        "01 &middot; Sprint Overview", "The one <span class='accent'>loop</span> to prove",
        f'''<div class="card soft" style="padding:14px 18px">{sprint_flow_svg()}</div>
        <div class="row mt10" style="flex:1">
          <div class="card rail glow" style="flex:1.4"><div class="kicker" style="color:var(--accent)">SPRINT GOAL</div>
            <p style="color:var(--fg);font-size:12px;font-weight:700;margin-top:5px">A user can land on the site,
            understand the offer, register, complete a sandbox payment, receive verified access, and see one clear
            product-value screen or TradingView onboarding flow.</p>
            <p class="note">Success is the <b style="color:var(--fg)">whole loop with no dead ends</b> &mdash; in
            sandbox, on mobile and desktop.</p></div>
          <div class="col" style="flex:1">
            <div class="card soft"><div class="kicker">MISSION</div><p style="font-size:10px;margin-top:3px">Prove
            RangeClarity can become a real product, not just a visual idea.</p></div>
            <div class="card soft"><div class="kicker" style="color:var(--gold)">HARD CONSTRAINT</div><p style="font-size:10px;margin-top:3px">
            <b style="color:var(--fg)">Sandbox / test payment only.</b> No live payments enabled without explicit
            founder approval.</p></div>
          </div></div>''', "Sprint overview"))

    S.append(slide(
        "02 &middot; Repo Audit", "What <span class='accent'>exists</span> now",
        f'''<table class="t zebra" style="flex:1"><thead><tr><th style="width:22%">Area</th><th style="width:12%">State</th>
          <th>Evidence in the repository</th></tr></thead><tbody>
          <tr><td><b>Core indicator</b></td><td>{chip('Built', 'cyan')}</td><td><span class="mono">RangeClarity_Core.pine</span> &mdash; 465 lines, @version=6, 19 inputs/visuals. The deliverable customers pay for.</td></tr>
          <tr><td><b>Landing site</b></td><td>{chip('Builds', 'ok')}</td><td>Next.js 15 + React 19 + TS 5; <span class="mono">typecheck</span> passes. Live homepage = "Codex Premium Hero".</td></tr>
          <tr><td><b>Design system</b></td><td>{chip('Present', 'ok')}</td><td><span class="mono">app/globals.css</span> tokens (void bg + neon accents); reusable components in <span class="mono">components/</span>.</td></tr>
          <tr><td><b>Legal pages</b></td><td>{chip('Partial', 'warn')}</td><td><span class="mono">terms</span> + <span class="mono">privacy</span> exist (educational + financial disclaimers) &mdash; worded around "waitlist".</td></tr>
          <tr><td><b>Waitlist capture</b></td><td>{chip('Partial', 'warn')}</td><td><span class="mono">lib/waitlist.ts</span> + <span class="mono">.data/waitlist.jsonl</span>; functional form only on an archived design.</td></tr>
          <tr><td><b>Deploy prep</b></td><td>{chip('Ready', 'ok')}</td><td>icon, OpenGraph, robots, sitemap, <span class="mono">deploy-rangeclarity.md</span>. Zero-config Vercel. Not deployed.</td></tr>
          <tr><td><b>Payments / auth</b></td><td>{chip('Missing', 'miss')}</td><td>No Stripe/Whop, no accounts, no entitlements anywhere in the codebase.</td></tr>
        </tbody></table>
        <p class="note mt6">Source: <span class="mono">docs/project-state.md</span> (HEAD 4297974). The hard asset exists;
        the gap is proof-of-value + a way to take money and grant access.</p>''', "Repo audit"))

    S.append(slide(
        "03 &middot; Gaps &amp; Guardrails", "Broken / missing &mdash; and <span class='accent'>do not touch</span>",
        '''<div class="row" style="flex:1">
          <div class="card" style="flex:1;border-color:rgba(255,93,122,0.3)"><div class="chip miss"><span class="dot"></span>BROKEN / MISSING</div>
            <ul class="ul cross mt10">
              <li>Live CTA posts to a dead <b style="color:var(--fg)">action="#"</b> &mdash; no conversion path</li>
              <li>No <b style="color:var(--fg)">payment</b> path (no Whop/Stripe)</li>
              <li>No <b style="color:var(--fg)">verified-access</b> model after purchase</li>
              <li>No <b style="color:var(--fg)">core value screen</b> / onboarding for a new buyer</li>
              <li>Indicator <b style="color:var(--fg)">not yet validated</b> (test matrix empty)</li>
              <li>Legal copy still says "<b style="color:var(--fg)">waitlist</b>", not paid beta</li>
            </ul></div>
          <div class="card" style="flex:1;border-color:rgba(255,206,77,0.3)"><div class="chip warn"><span class="dot"></span>DO NOT TOUCH THIS SPRINT</div>
            <ul class="ul mt10">
              <li>The <b style="color:var(--fg)">homepage design</b> &mdash; no redesign (decision O-003 open)</li>
              <li>The <b style="color:var(--fg)">indicator internals</b> beyond validation notes (polish is Phase 3)</li>
              <li><b style="color:var(--fg)">Live payments</b> &mdash; sandbox only, no real money</li>
              <li>In-app <b style="color:var(--fg)">Stripe / auth stack</b> &mdash; deferred (O-001)</li>
              <li>The <b style="color:var(--fg)">website brain</b> / scanner &mdash; Phase 4</li>
              <li><b style="color:var(--fg)">Linear writes</b> &mdash; board stays the source of truth</li>
            </ul></div></div>
        <div class="card soft mt10" style="border-color:rgba(47,255,214,0.26)"><p style="font-size:10.5px">
          <b style="color:var(--accent)">Rule of the sprint:</b> touch only what stands between a visitor and verified,
          understood, paid access. Everything else is explicitly out of scope.</p></div>''', "Gaps & guardrails"))

    S.append(slide(
        "04 &middot; Task Board", "Backlog &middot; Now &middot; In Progress &middot; <span class='accent'>Done</span>",
        f'''{kanban_html()}
        <p class="note mt10">Snapshot at sprint start. The <b style="color:var(--cyan)">Now</b> column holds the two
        week-one gates (validate + price). Build tasks move through <b style="color:var(--gold)">In Progress</b> in
        dependency order; <b style="color:var(--bull)">Done</b> seeds with assets that already exist.</p>''',
        "Prioritized task board"))

    S.append(slide(
        "05 &middot; Prioritization", "ICE <span class='accent'>scoring</span> &mdash; impact &times; confidence &times; ease",
        f'''<div class="row" style="flex:1;gap:14px">
          <table class="t zebra" style="flex:1.7"><thead><tr><th style="width:8%">#</th><th>Task</th>
            <th style="width:10%">Impact</th><th style="width:13%">Confidence</th><th style="width:9%">Ease</th>
            <th style="width:12%">ICE</th></tr></thead><tbody>{_ice_rows()}</tbody></table>
          <div class="col" style="flex:1;gap:9px">
            <div class="card soft" style="padding:10px 12px"><div class="kicker">SCORING</div><p style="font-size:9.4px;margin-top:3px">
            Each factor is rated 1-10. <span class="mono">ICE = I &times; C &times; E</span>. Higher = do sooner among
            peers. Top three highlighted.</p></div>
            <div class="card" style="padding:10px 12px;border-color:rgba(56,232,255,0.32)"><div class="kicker" style="color:var(--cyan)">GATES OVERRIDE ICE</div>
            <p style="font-size:9.4px;margin-top:3px"><b style="color:var(--fg)">Validate indicator (RC-6)</b> scores
            lower on ease but is a <b style="color:var(--fg)">hard gate</b> &mdash; sequence it first regardless of ICE.
            ICE ranks the rest.</p></div>
          </div></div>''', "ICE priority table"))

    S.append(slide(
        "06 &middot; User Journey", "Funnel &amp; <span class='accent'>access states</span>",
        f'''<div class="row" style="flex:1;gap:14px">
          <div style="flex:1.5">{funnel_svg()}</div>
          <div class="col" style="flex:1;gap:8px">
            <div class="card soft" style="padding:9px 12px"><div class="kicker" style="color:var(--cyan)">STATE 0-1 &middot; VISITOR &rarr; REGISTERED</div>
              <p style="font-size:9.2px;margin-top:3px">Form collects name, email, TradingView username, user type, and
              notes. State stored; no payment yet.</p></div>
            <div class="card soft" style="padding:9px 12px"><div class="kicker" style="color:var(--gold)">STATE 2 &middot; TEST-PAID</div>
              <p style="font-size:9.2px;margin-top:3px">Completes the <b style="color:var(--fg)">sandbox</b> checkout.
              Success + failure states both handled; no real money.</p></div>
            <div class="card soft" style="padding:9px 12px"><div class="kicker" style="color:var(--violet)">STATE 3 &middot; APPROVED BETA</div>
              <p style="font-size:9.2px;margin-top:3px">Verified access: TradingView invite-only grant + Discord role.
              Manual override available for fulfilment.</p></div>
            <div class="card" style="padding:9px 12px;border-color:rgba(52,245,176,0.34)"><div class="kicker" style="color:var(--bull)">STATE 4 &middot; ACTIVATED</div>
              <p style="font-size:9.2px;margin-top:3px">Reaches the core value screen and applies the indicator. This is
              the activation metric the sprint exists to unlock.</p></div>
          </div></div>''', "User journey funnel"))

    return S
