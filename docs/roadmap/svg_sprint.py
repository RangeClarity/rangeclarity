#!/usr/bin/env python3
"""SVG + HTML visual builders for the Next Sprint Taskbook (PDF B)."""
from deck import PC

FLOW = [
    ('cyan', 'TRAFFIC', 'X / search / referral'),
    ('accent', 'LANDING', 'clarity offer + CTA'),
    ('lime', 'BETA SIGNUP', 'name - email - TV user'),
    ('gold', 'SANDBOX PAY', 'Whop test mode'),
    ('violet', 'VERIFIED ACCESS', 'TV invite + Discord'),
    ('magenta', 'ONBOARDING', 'core value screen'),
    ('bull', 'FEEDBACK', 'private beta loop'),
]


def sprint_flow_svg():
    p = ['<svg viewBox="0 0 1000 170" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    p.append(f'<defs><marker id="fa" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="{PC["faint"]}"/></marker></defs>')
    n = len(FLOW)
    w, y, h = 120, 44, 70
    pitch = (1000 - w) / (n - 1)
    for i, (ck, title, sub) in enumerate(FLOW):
        x = i * pitch
        col = PC[ck]
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{w}" height="{h}" rx="10" fill="#0c0f1c" stroke="{col}" stroke-width="1.4"/>')
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{w}" height="4" rx="2" fill="{col}"/>')
        p.append(f'<text x="{x+w/2:.1f}" y="{y+16}" fill="{col}" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="0.5">{i+1}</text>')
        p.append(f'<text x="{x+w/2:.1f}" y="{y+38}" fill="{PC["fg"]}" font-size="9.6" font-weight="bold" text-anchor="middle">{title}</text>')
        # wrap sub into up to 2 lines by splitting on " - "
        parts = sub.split(' - ')
        line1 = parts[0]
        line2 = ' '.join(parts[1:])
        p.append(f'<text x="{x+w/2:.1f}" y="{y+52}" fill="{PC["dim"]}" font-size="7.3" text-anchor="middle">{line1}</text>')
        if line2:
            p.append(f'<text x="{x+w/2:.1f}" y="{y+62}" fill="{PC["dim"]}" font-size="7.3" text-anchor="middle">{line2}</text>')
        if i < n - 1:
            ax = x + w + 2
            bx = (i + 1) * pitch - 3
            p.append(f'<line x1="{ax:.1f}" y1="{y+h/2}" x2="{bx:.1f}" y2="{y+h/2}" stroke="{PC["faint"]}" stroke-width="1.3" marker-end="url(#fa)"/>')
    # iterate loop back
    x_last = (n - 1) * pitch + w / 2
    x_land = 1 * pitch + w / 2
    p.append(f'<path d="M {x_last:.1f} {y+h} C {x_last:.1f} 150, {x_land:.1f} 150, {x_land:.1f} {y+h}" fill="none" stroke="{PC["bull"]}" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#fa)" opacity="0.7"/>')
    p.append(f'<text x="{(x_last+x_land)/2:.1f}" y="163" fill="{PC["bull"]}" font-size="7.5" text-anchor="middle" letter-spacing="1">ITERATE - FEEDBACK IMPROVES THE OFFER</text>')
    p.append('</svg>')
    return ''.join(p)


def funnel_svg():
    stages = [
        (920, 'cyan', 'VISITOR', 'lands on the page', 'STATE 0'),
        (770, 'accent', 'REGISTERED', 'name - email - TV username - type - notes', 'STATE 1'),
        (620, 'lime', 'TEST-PAID', 'completes sandbox checkout', 'STATE 2'),
        (470, 'gold', 'APPROVED BETA', 'verified access: TV invite + Discord', 'STATE 3'),
        (330, 'bull', 'ACTIVATED', 'sees core value - applies indicator', 'STATE 4'),
    ]
    p = ['<svg viewBox="0 0 1000 380" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    h, gap = 60, 10
    for i, (w, ck, title, sub, state) in enumerate(stages):
        x = (1000 - w) / 2
        y = 8 + i * (h + gap)
        col = PC[ck]
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{w}" height="{h}" rx="9" fill="{col}" fill-opacity="0.14" stroke="{col}" stroke-width="1.4"/>')
        p.append(f'<text x="500" y="{y+26}" fill="{PC["fg"]}" font-size="13" font-weight="bold" text-anchor="middle">{title}</text>')
        p.append(f'<text x="500" y="{y+44}" fill="{PC["dim"]}" font-size="9" text-anchor="middle">{sub}</text>')
        p.append(f'<text x="{x-10:.1f}" y="{y+36}" fill="{col}" font-size="8" text-anchor="end" letter-spacing="1">{state}</text>')
        if i < len(stages) - 1:
            p.append(f'<text x="990" y="{y+h+8}" fill="{PC["faint"]}" font-size="7.5" text-anchor="end">&#8595;</text>')
    p.append('</svg>')
    return ''.join(p)


def risk_effort_svg():
    items = [
        (0.30, 0.34, 'accent', 'Registration + access model'),
        (0.62, 0.60, 'gold', 'Sandbox payment wiring'),
        (0.40, 0.55, 'lime', 'Verified-access logic'),
        (0.55, 0.28, 'cyan', 'Core value screen'),
        (0.22, 0.20, 'violet', 'Docs + disclaimers'),
        (0.50, 0.24, 'magenta', 'QA full flow'),
    ]
    W, Hh, x0, y0, x1, y1 = 560, 360, 64, 24, 540, 300
    p = [f'<svg viewBox="0 0 {W} {Hh}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    p.append(f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" fill="none" stroke="{PC["line"]}" stroke-width="1"/>')
    midx, midy = (x0 + x1) / 2, (y0 + y1) / 2
    p.append(f'<line x1="{midx}" y1="{y0}" x2="{midx}" y2="{y1}" stroke="{PC["line"]}" stroke-width="1" stroke-dasharray="3 3"/>')
    p.append(f'<line x1="{x0}" y1="{midy}" x2="{x1}" y2="{midy}" stroke="{PC["line"]}" stroke-width="1" stroke-dasharray="3 3"/>')
    # quadrant labels
    p.append(f'<text x="{x0+10}" y="{y0+16}" fill="{PC["faint"]}" font-size="8" letter-spacing="1">PLAN CAREFULLY</text>')
    p.append(f'<text x="{x1-10}" y="{y0+16}" fill="{PC["bear"]}" font-size="8" letter-spacing="1" text-anchor="end">HARD + RISKY</text>')
    p.append(f'<text x="{x0+10}" y="{y1-8}" fill="{PC["bull"]}" font-size="8" letter-spacing="1">QUICK WINS</text>')
    p.append(f'<text x="{x1-10}" y="{y1-8}" fill="{PC["faint"]}" font-size="8" letter-spacing="1" text-anchor="end">BIG BUILDS</text>')
    # axes labels
    p.append(f'<text x="{midx}" y="{y1+22}" fill="{PC["dim"]}" font-size="8.5" text-anchor="middle" letter-spacing="1">EFFORT &#8594;</text>')
    p.append(f'<text x="{x0-12}" y="{midy}" fill="{PC["dim"]}" font-size="8.5" text-anchor="middle" letter-spacing="1" transform="rotate(-90 {x0-12} {midy})">RISK &#8594;</text>')
    for ex, rk, ck, label in items:
        cx = x0 + ex * (x1 - x0)
        cy = y1 - rk * (y1 - y0)
        col = PC[ck]
        p.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="6" fill="{col}" fill-opacity="0.85"/><circle cx="{cx:.1f}" cy="{cy:.1f}" r="11" fill="none" stroke="{col}" stroke-width="1" opacity="0.4"/>')
        anchor = 'end' if ex > 0.55 else 'start'
        dxs = -14 if ex > 0.55 else 14
        p.append(f'<text x="{cx+dxs:.1f}" y="{cy+3:.1f}" fill="{PC["dim"]}" font-size="8" text-anchor="{anchor}">{label}</text>')
    p.append('</svg>')
    return ''.join(p)


# ---- calendar (Jun 20 - Jul 7, 2026) ----
DAYS = [
    ('Jun 20', 'Sat', 'p0', 'Audit', 'Inspect structure; map landing/auth/pricing/payment/docs/indicators; write current-state audit. No major design edits.'),
    ('Jun 21', 'Sun', 'p0', 'Journey', 'Map the user journey; define paid-beta flow + access states (visitor/registered/test-paid/approved); write acceptance criteria.'),
    ('Jun 22', 'Mon', 'p1', 'Register', 'Implement / clean registration flow; basic account + access model.'),
    ('Jun 23', 'Tue', 'p1', 'Access model', 'Protected beta-page placeholder; persist access state.'),
    ('Jun 24', 'Wed', 'p1', 'Sandbox pay', 'Add sandbox payment flow only (Whop test). No live payments.'),
    ('Jun 25', 'Thu', 'p1', 'Pay states', 'Test-payment success / failure states + return handling.'),
    ('Jun 26', 'Fri', 'p2', 'Verify access', 'Verified-access logic: test payment unlocks the beta area.'),
    ('Jun 27', 'Sat', 'p2', 'Manual override', 'Simple admin / manual access override for fulfilment.'),
    ('Jun 28', 'Sun', 'p2', 'Core value', 'Build core value screen: overview, sample ticker/watchlist, bias/score/state.'),
    ('Jun 29', 'Mon', 'p2', 'Onboarding', 'TradingView indicator onboarding; "what this means / does not mean".'),
    ('Jun 30', 'Tue', 'p3', 'Docs', 'Product docs: what RangeClarity does; how to use the indicator.'),
    ('Jul 1', 'Wed', 'p3', 'Disclaimers', 'No-advice disclaimer; beta limitations; what users should test.'),
    ('Jul 2', 'Thu', 'p4', 'QA flow', 'QA full flow: signup, sandbox payment, access, protected pages.'),
    ('Jul 3', 'Fri', 'p4', 'QA devices', 'Mobile + desktop basics; fix dead-ends and broken states.'),
    ('Jul 4', 'Sat', 'p4', 'Polish', 'Polish only what affects trust + comprehension; clarify copy.'),
    ('Jul 5', 'Sun', 'p4', 'Trim', 'Remove confusing sections; keep premium fintech feel.'),
    ('Jul 6', 'Mon', 'p5', 'Checklists', 'Beta launch checklist; founder review checklist.'),
    ('Jul 7', 'Tue', 'p5', 'Finalize', 'Next-sprint recommendation; finalize PDFs + handoff.'),
]


def daily_calendar_html():
    cells = []
    for date, wd, pc, focus, task in DAYS:
        cells.append(
            f'<div class="card {pc}" style="padding:8px 9px"><div style="display:flex;justify-content:space-between;align-items:baseline">'
            f'<span class="mono" style="font-size:10px;color:var(--fg);font-weight:700">{date}</span>'
            f'<span class="mono faint" style="font-size:7.5px">{wd}</span></div>'
            f'<div class="badge-phase {pc}" style="font-size:7.5px;margin-top:4px"><span class="sq" style="width:7px;height:7px"></span>{focus}</div>'
            f'<div style="font-size:8px;color:var(--fg-dim);margin-top:4px;line-height:1.35">{task}</div></div>')
    return '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:7px">' + ''.join(cells) + '</div>'


def kanban_html():
    cols = [
        ('Backlog', 'muted', [
            ('Product docs + disclaimers', 'P1 - writer'),
            ('Legal reword (paid beta)', 'P1 - founder'),
            ('QA full flow', 'P2 - all'),
            ('Trust + comprehension polish', 'P2 - design'),
        ]),
        ('Now', 'cyan', [
            ('Repo current-state audit', 'P0 - claude'),
            ('Map journey + access states', 'P0 - founder'),
            ('Decide offer + price (O-002)', 'P0 - founder'),
        ]),
        ('In Progress', 'gold', [
            ('Registration + access model', 'P1 - full-stack'),
            ('Sandbox payment (Whop test)', 'P1 - full-stack'),
            ('Verified-access logic', 'P1 - full-stack'),
            ('Core value screen', 'P2 - full-stack'),
        ]),
        ('Done', 'ok', [
            ('Landing page + design system', 'pre-sprint'),
            ('Core indicator built (Pine)', 'pre-sprint'),
        ]),
    ]
    out = ['<div class="cols-4" style="flex:1;align-items:start">']
    for name, chipcls, cards in cols:
        body = ''.join(
            f'<div class="card soft" style="padding:8px 9px;margin-top:7px"><div style="font-size:9.5px;color:var(--fg);font-weight:600">{t}</div>'
            f'<div class="mono faint" style="font-size:7.5px;margin-top:3px">{m}</div></div>'
            for t, m in cards)
        out.append(
            f'<div><div class="chip {chipcls}" style="width:100%;justify-content:center"><span class="dot"></span>{name.upper()} &middot; {len(cards)}</div>{body}</div>')
    out.append('</div>')
    return ''.join(out)
