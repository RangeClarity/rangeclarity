#!/usr/bin/env python3
"""Sprint Taskbook slides 8-14 (deps, calendar, DoD, owners, risk, accept, ship)."""
from deck import slide, PC
from svg_sprint import risk_effort_svg, daily_calendar_html


def _task_dep_svg():
    nodes = [('T1', 'Audit', 'cyan'), ('T2', 'Journey', 'cyan'), ('T3', 'Register', 'accent'),
             ('T4', 'Sandbox pay', 'gold'), ('T5', 'Verified access', 'violet'),
             ('T6', 'Core value', 'lime'), ('T7', 'Docs', 'magenta'), ('T8', 'QA', 'cyan'),
             ('T9', 'Polish', 'accent'), ('T10', 'Ship', 'bull')]
    p = ['<svg viewBox="0 0 1000 150" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    p.append(f'<defs><marker id="ta" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="{PC["faint"]}"/></marker></defs>')
    p.append(f'<rect x="250" y="6" width="210" height="30" rx="8" fill="#0c0f1c" stroke="{PC["cyan"]}" stroke-width="1.3"/>')
    p.append(f'<text x="355" y="25" fill="{PC["cyan"]}" font-size="9" text-anchor="middle">RC-6 VALIDATE (gate)</text>')
    p.append(f'<rect x="480" y="6" width="230" height="30" rx="8" fill="#0c0f1c" stroke="{PC["gold"]}" stroke-width="1.3"/>')
    p.append(f'<text x="595" y="25" fill="{PC["gold"]}" font-size="9" text-anchor="middle">O-002 OFFER + PRICE (gate)</text>')
    n = len(nodes)
    w, y, h = 88, 78, 50
    pitch = (1000 - w) / (n - 1)
    for i, (tid, title, ck) in enumerate(nodes):
        x = i * pitch
        col = PC[ck]
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{w}" height="{h}" rx="9" fill="#0c0f1c" stroke="{col}" stroke-width="1.3"/>')
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{w}" height="3" rx="2" fill="{col}"/>')
        p.append(f'<text x="{x+w/2:.1f}" y="{y+22}" fill="{col}" font-size="9" font-weight="bold" text-anchor="middle">{tid}</text>')
        p.append(f'<text x="{x+w/2:.1f}" y="{y+38}" fill="{PC["fg"]}" font-size="7.6" text-anchor="middle">{title}</text>')
        if i < n - 1:
            p.append(f'<line x1="{x+w+1:.1f}" y1="{y+h/2}" x2="{(i+1)*pitch-2:.1f}" y2="{y+h/2}" stroke="{PC["faint"]}" stroke-width="1.2" marker-end="url(#ta)"/>')
    p.append(f'<line x1="355" y1="36" x2="{3*pitch+w/2:.1f}" y2="{y-2}" stroke="{PC["cyan"]}" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#ta)" opacity="0.6"/>')
    p.append(f'<line x1="595" y1="36" x2="{4*pitch+w/2:.1f}" y2="{y-2}" stroke="{PC["gold"]}" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#ta)" opacity="0.6"/>')
    p.append('</svg>')
    return ''.join(p)


def slides_2():
    S = []

    S.append(slide(
        "07 &middot; Task Dependencies", "What must finish <span class='accent'>before</span> what",
        f'''<div class="card soft" style="padding:16px 18px;display:flex;align-items:center">{_task_dep_svg()}</div>
        <div class="cols-3 mt10">
          <div class="card" style="border-color:rgba(56,232,255,0.3)"><div class="kicker" style="color:var(--cyan)">CRITICAL CHAIN</div>
            <p style="font-size:9.6px;margin-top:4px">T3 Register &rarr; T4 Sandbox pay &rarr; T5 Verified access &rarr;
            T6 Core value. This is the spine; protect it.</p></div>
          <div class="card"><div class="kicker">GATES FEED IN</div>
            <p style="font-size:9.6px;margin-top:4px"><b style="color:var(--fg)">RC-6</b> (validate) and
            <b style="color:var(--fg)">O-002</b> (price) must resolve before pay + access are meaningful.</p></div>
          <div class="card"><div class="kicker">PARALLEL OK</div>
            <p style="font-size:9.6px;margin-top:4px">T7 Docs can be drafted alongside T5-T6; QA (T8) needs the chain
            complete before it can run end-to-end.</p></div>
        </div>''', "Task dependency diagram"))

    S.append(slide(
        "08 &middot; Daily Calendar", "Eighteen days, <span class='accent'>exact</span>",
        f'''{daily_calendar_html()}
        <div class="tagrow mt10" style="justify-content:center">
          <span class="chip cyan"><span class="dot"></span>Jun 20-21 Audit + journey</span>
          <span class="chip"><span class="dot"></span>Jun 22-25 Register + sandbox pay</span>
          <span class="chip lime"><span class="dot"></span>Jun 26-29 Access + core value</span>
          <span class="chip gold"><span class="dot"></span>Jun 30-Jul 1 Docs</span>
          <span class="chip violet"><span class="dot"></span>Jul 2-5 QA + polish</span>
          <span class="chip magenta"><span class="dot"></span>Jul 6-7 Checklists + finalize</span>
        </div>''', "Daily execution calendar"))

    S.append(slide(
        "09 &middot; Definition of Done", "Per-task <span class='accent'>acceptance</span>",
        '''<table class="t zebra" style="flex:1"><thead><tr><th style="width:24%">Task</th>
          <th>Definition of done</th></tr></thead><tbody>
          <tr><td><b>T1 &middot; Repo audit</b></td><td>Current-state audit doc committed; landing/auth/pricing/payment/docs/indicators catalogued with evidence.</td></tr>
          <tr><td><b>T2 &middot; Journey + states</b></td><td>Documented flow + four access states (visitor/registered/test-paid/approved) with written acceptance criteria.</td></tr>
          <tr><td><b>T3 &middot; Registration</b></td><td>Form persists name, email, TV username, type, notes; basic account/access record created; protected beta-page placeholder exists.</td></tr>
          <tr><td><b>T4 &middot; Sandbox payment</b></td><td>Test checkout completes; success + failure states handled; no live keys; clear "sandbox" labelling.</td></tr>
          <tr><td><b>T5 &middot; Verified access</b></td><td>A test payment unlocks the beta area; manual/admin override works; access cannot be reached without payment + approval.</td></tr>
          <tr><td><b>T6 &middot; Core value screen</b></td><td>Overview + sample ticker/watchlist + bias/score/state explanation + TV onboarding + "what this means / does not mean".</td></tr>
          <tr><td><b>T7 &middot; Docs + disclaimers</b></td><td>What RangeClarity does, how to use the indicator, no-advice disclaimer, beta limitations, what to test.</td></tr>
          <tr><td><b>T8 &middot; QA full flow</b></td><td>Signup, sandbox payment, access, protected pages, mobile + desktop all pass with no dead ends.</td></tr>
          <tr><td><b>T9 &middot; Polish + T10 &middot; Ship</b></td><td>Trust/comprehension copy clean; confusing sections removed; beta + founder review checklists complete; PDFs finalized.</td></tr>
        </tbody></table>''', "Definition of done"))

    S.append(slide(
        "10 &middot; Owners &amp; Roles", "Who runs <span class='accent'>what</span>",
        '''<div class="row" style="flex:1;gap:14px">
          <table class="t zebra" style="flex:1.5"><thead><tr><th style="width:26%">Task group</th><th style="width:24%">Owner</th>
            <th>Support</th></tr></thead><tbody>
            <tr><td><b>Validate + price (gates)</b></td><td>Founder</td><td>Pine dev (validation), Claude (runbook)</td></tr>
            <tr><td><b>Registration + access model</b></td><td>Full-stack</td><td>Founder (requirements)</td></tr>
            <tr><td><b>Sandbox payment + access</b></td><td>Full-stack</td><td>Founder (Whop account)</td></tr>
            <tr><td><b>Core value screen</b></td><td>Full-stack</td><td>Designer (1 day), Founder (copy)</td></tr>
            <tr><td><b>Docs + disclaimers</b></td><td>Writer / Claude</td><td>Founder (no-advice sign-off)</td></tr>
            <tr><td><b>QA + polish + ship</b></td><td>Founder + Claude</td><td>Designer (trust polish)</td></tr>
          </tbody></table>
          <div class="col" style="flex:1;gap:9px">
            <div class="card soft" style="padding:10px 12px"><div class="kicker">FREELANCER RECS</div>
              <ul class="ul tight mt6">
                <li><b style="color:var(--fg)">Full-stack (Next.js/TS)</b> &mdash; 0.5-0.8 FTE, the build engine</li>
                <li><b style="color:var(--fg)">Pine/quant dev</b> &mdash; ~1 day for validation pass</li>
                <li><b style="color:var(--fg)">Designer</b> &mdash; ~1 day, trust polish only</li>
                <li><b style="color:var(--fg)">Writer</b> &mdash; 2-3 days for docs + disclaimers</li>
              </ul></div>
            <div class="card" style="padding:10px 12px;border-color:rgba(255,206,77,0.3)"><div class="kicker" style="color:var(--gold)">HIRE DISCIPLINE</div>
              <p style="font-size:9.4px;margin-top:3px">One full-stack contractor carries this sprint. Everything else
              is by-the-day. No full-time hires before the beta validates demand.</p></div>
          </div></div>''', "Owners & freelancers"))

    S.append(slide(
        "11 &middot; Risk &amp; Effort", "Where the <span class='accent'>danger</span> sits",
        f'''<div class="row" style="flex:1;gap:14px">
          <div class="card soft" style="flex:1.2;padding:14px 16px;display:flex;align-items:center">{risk_effort_svg()}</div>
          <div class="col" style="flex:1;gap:7px">
            <div class="card soft" style="padding:9px 11px"><div class="kicker" style="color:var(--bear)">RISK LIST</div>
              <ul class="ul tight mt6">
                <li><b style="color:var(--fg)">Sandbox pay friction</b> &mdash; provider quirks; mitigate with a thin abstraction</li>
                <li><b style="color:var(--fg)">Access can be bypassed</b> &mdash; test the gate explicitly in QA</li>
                <li><b style="color:var(--fg)">Scope creep</b> into auth/brain &mdash; hold the line</li>
                <li><b style="color:var(--fg)">Indicator not validated</b> in time &mdash; gates the sprint meaning</li>
                <li><b style="color:var(--fg)">Mobile dead ends</b> &mdash; device pass in QA</li>
              </ul></div>
            <div class="card" style="padding:9px 11px;border-color:rgba(52,245,176,0.3)"><div class="kicker" style="color:var(--bull)">POSTURE</div>
              <p style="font-size:9.2px;margin-top:3px">Most items are low-risk quick wins. Concentrate care on
              sandbox payment + the verified-access gate.</p></div>
          </div></div>''', "Risk / effort matrix"))

    S.append(slide(
        "12 &middot; Acceptance Checklist", "Done means <span class='accent'>all of this</span>",
        '''<div class="cols-2" style="flex:1">
          <div class="card"><div class="kicker" style="color:var(--accent)">THE LOOP</div>
            <ul class="ul mt6" style="font-size:10px">
              <li>&#9744; Visitor can read the offer and reach a working CTA</li>
              <li>&#9744; Registration captures name, email, TV username, type, notes</li>
              <li>&#9744; Sandbox checkout completes with success + failure handled</li>
              <li>&#9744; Test payment unlocks the protected beta area</li>
              <li>&#9744; Manual/admin access override works</li>
              <li>&#9744; Core value screen renders sample structure + score + state</li>
              <li>&#9744; TradingView onboarding path is clear</li>
            </ul></div>
          <div class="card"><div class="kicker" style="color:var(--gold)">TRUST &amp; CLARITY</div>
            <ul class="ul mt6" style="font-size:10px">
              <li>&#9744; "What this means / does not mean" present on value screen</li>
              <li>&#9744; No-advice + beta-limitation disclaimers visible</li>
              <li>&#9744; No buy/sell, profit, or prediction language anywhere</li>
              <li>&#9744; No dead <span class="mono">action="#"</span> forms remain</li>
              <li>&#9744; Mobile + desktop pass with no overflow or dead ends</li>
              <li>&#9744; <span class="mono">npm run build</span> + <span class="mono">typecheck</span> green</li>
              <li>&#9744; Copy reads premium &mdash; clarity, not returns</li>
            </ul></div></div>''', "Acceptance checklist"))

    S.append(slide(
        "13 &middot; Ship / No-Ship", "The final <span class='accent'>gate</span>",
        '''<div class="row" style="flex:1">
          <div class="card" style="flex:1;border-color:rgba(52,245,176,0.32)"><div class="chip ok"><span class="dot"></span>SHIP IF</div>
            <ul class="ul check mt10" style="font-size:10.5px">
              <li>The full sandbox loop works end-to-end, no dead ends</li>
              <li>Verified access cannot be reached without pay + approval</li>
              <li>A new user grasps the value in under five minutes</li>
              <li>Disclaimers + no-advice language are intact</li>
              <li>Build + typecheck pass; mobile is clean</li>
            </ul></div>
          <div class="card" style="flex:1;border-color:rgba(255,93,122,0.3)"><div class="chip miss"><span class="dot"></span>DO NOT SHIP IF</div>
            <ul class="ul cross mt10" style="font-size:10.5px">
              <li>Any step in the loop dead-ends or errors</li>
              <li>Access leaks without payment/approval</li>
              <li>Live payment keys are present anywhere</li>
              <li>Indicator value is still unproven (RC-6 open)</li>
              <li>Copy drifts into signals / profit / prediction</li>
            </ul></div></div>
        <div class="card glow mt10" style="border-color:rgba(47,255,214,0.45)">
          <div class="statement" style="font-size:16px">Most important sprint now: <span class="accent">prove the loop.</span>
          Land &rarr; register &rarr; sandbox pay &rarr; verified access &rarr; understood value. Everything else in the
          roadmap waits behind this evidence.</div></div>''', "Ship / no-ship"))

    return S
