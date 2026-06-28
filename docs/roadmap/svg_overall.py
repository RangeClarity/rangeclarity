#!/usr/bin/env python3
"""SVG + small HTML visual builders for the Overall Roadmap deck."""
from deck import PC, chip

# id, short, longname, start_day, end_day(incl), color_key, dates, mission, exit_gate
PHASES = [
    ('P0', 'Audit & Lock', 'Project Audit & Lock Direction', 0, 3, 'cyan', 'Jun 20-23',
     'Inspect repo, document current state, stop the redesign loop, lock the product promise.',
     'Signed-off current-state audit + one locked product promise; no open redesign debates.'),
    ('P1', 'Paid Beta Loop', 'Paid Beta Access Loop', 4, 17, 'accent', 'Jun 24 - Jul 7',
     'Build the full journey: landing to register to sandbox payment to verified access to product entry.',
     'A test user completes the loop end-to-end in sandbox and lands inside the beta area.'),
    ('P2', 'Core Value MVP', 'Core Product Value MVP', 18, 31, 'lime', 'Jul 8-21',
     'Make value legible in seconds: clarity dashboard, watchlist sample, score &amp; state, TV onboarding.',
     'A new paid user understands what they bought and why it matters without a call.'),
    ('P3', 'Indicator Polish', 'TradingView Indicator Polish', 32, 45, 'gold', 'Jul 22 - Aug 4',
     'Sharpen the visual layer: S/R tiers, strong zones, weak structure, range position, dashboard clarity.',
     'Indicator passes the test matrix on 1D + 4H/1H; founder verdict "worth charging for".'),
    ('P4', 'Website Brain', 'Website Brain Foundation', 46, 66, 'violet', 'Aug 5-25',
     'Canonical logic outside Pine: watchlist, stored assets, scoring model, explanations, history, snapshots.',
     'Scanner reproduces indicator scores via shared fixtures (parity) over a sample universe.'),
    ('P5', 'Private Beta', 'Private Beta Launch', 67, 84, 'magenta', 'Aug 26 - Sep 12',
     'Onboard the first paying users, collect structured feedback, validate willingness to pay.',
     'First 5 paying users onboarded; feedback logged; renew/refund signal captured.'),
    ('P6', 'Growth System', 'Growth System', 85, 112, 'orange', 'Sep 13 - Oct 10',
     'X content engine, demos, short videos, educational clarity posts, waitlist to beta conversion.',
     'Repeatable weekly content + a measured top-of-funnel into the paid beta.'),
]


def brand_chart(h=150):
    c = PC
    return (f'<svg viewBox="0 0 1000 {h}" width="100%" preserveAspectRatio="none" '
            'xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">'
            f'<rect x="0" y="46" width="1000" height="58" fill="{c["cyan"]}" opacity="0.06"/>'
            f'<line x1="0" y1="46" x2="1000" y2="46" stroke="{c["cyan"]}" stroke-width="1" stroke-dasharray="5 4" opacity="0.5"/>'
            f'<line x1="0" y1="104" x2="1000" y2="104" stroke="{c["magenta"]}" stroke-width="1" stroke-dasharray="5 4" opacity="0.5"/>'
            f'<polyline points="0,92 70,84 140,96 210,70 280,78 350,52 420,66 490,40 560,58 630,36 700,60 770,44 840,72 910,54 1000,66" '
            f'fill="none" stroke="{c["accent"]}" stroke-width="2.4" opacity="0.95"/>'
            f'<circle cx="490" cy="40" r="4.5" fill="{c["gold"]}"/><circle cx="630" cy="36" r="4.5" fill="{c["lime"]}"/>'
            f'<text x="8" y="38" fill="{c["cyan"]}" font-size="11" letter-spacing="2">STRONG ZONE</text>'
            f'<text x="8" y="124" fill="{c["magenta"]}" font-size="11" letter-spacing="2">WEAK STRUCTURE</text>'
            f'<text x="880" y="38" fill="{c["faint"]}" font-size="10" letter-spacing="2">KEY S/R</text></svg>')


def _box(x, y, w, h, color, kicker, title, sub, chip_txt, chip_color):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="11" fill="#0c0f1c" stroke="{color}" stroke-width="1.4"/>'
            f'<rect x="{x}" y="{y}" width="4" height="{h}" rx="2" fill="{color}"/>'
            f'<text x="{x+15}" y="{y+19}" fill="{color}" font-size="9.5" letter-spacing="1.6">{kicker}</text>'
            f'<text x="{x+15}" y="{y+38}" fill="{PC["fg"]}" font-size="14" font-weight="bold">{title}</text>'
            f'<text x="{x+15}" y="{y+55}" fill="{PC["dim"]}" font-size="9.6">{sub}</text>'
            + (f'<rect x="{x+w-118}" y="{y+11}" width="106" height="17" rx="8.5" fill="{chip_color}" opacity="0.16"/>'
               f'<text x="{x+w-65}" y="{y+23}" fill="{chip_color}" font-size="8.2" text-anchor="middle" letter-spacing="1">{chip_txt}</text>'
               if chip_txt else ''))


def architecture_svg():
    p = ['<svg viewBox="0 0 1000 520" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    p.append(f'<defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="{PC["faint"]}"/></marker></defs>')

    def ln(x1, y1, x2, y2):
        return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{PC["faint"]}" stroke-width="1.3" marker-end="url(#ah)" opacity="0.8"/>'

    p.append(_box(250, 6, 500, 66, PC['accent'], 'CANONICAL SCORING CORE - THE BRAIN', 'One spec, two bodies',
                  'pivots-zones-score-bias-channel-events - golden fixtures enforce parity', 'EN-1 - NEXT', PC['accent']))
    p.append(ln(450, 72, 320, 96)); p.append(ln(550, 72, 680, 96))
    p.append(_box(120, 98, 360, 70, PC['cyan'], 'TRADINGVIEW VISUAL LAYER', 'Pine indicator (on-chart)',
                  'S/R tiers - soft channel - bias - dashboard - alerts', 'BUILT - VALIDATING', PC['cyan']))
    p.append(_box(520, 98, 360, 70, PC['lime'], 'BRAIN - SCANNER', 'Scanner (server-side)',
                  'universe x timeframe to schema rows (batch + on-demand)', 'PHASE 4', PC['lime']))
    p.append(ln(300, 168, 300, 196)); p.append(ln(700, 168, 700, 196))
    p.append(_box(120, 198, 360, 64, PC['violet'], 'SYNC LAYER', 'Event / webhook bridge',
                  'TV alerts to schema events - auth - dedup', 'POST-BETA', PC['violet']))
    p.append(_box(520, 198, 360, 64, PC['gold'], 'STORAGE', 'Snapshots - events - watchlists',
                  'state-now + what-changed + user presets', 'PHASE 4', PC['gold']))
    p.append(ln(300, 262, 470, 292)); p.append(ln(700, 262, 560, 292))
    p.append(_box(300, 294, 400, 64, PC['accent'], 'WEBSITE BRAIN - API + RANKING', 'rangeClarityScore - filters',
                  'ranks &amp; explains which charts deserve attention today', 'PHASE 4', PC['accent']))
    p.append(ln(430, 358, 300, 388)); p.append(ln(570, 358, 700, 388))
    p.append(_box(120, 390, 360, 64, PC['magenta'], 'MARKET ROOM', 'Watchlist radar',
                  'ranked, explained cards - daily clarity brief', 'POST-BETA', PC['magenta']))
    p.append(_box(520, 390, 360, 64, PC['violet'], 'HERMES / AI EXPLANATION', 'Plain-language "why"',
                  'describes structure from schema - no-advice guard', 'POST-BETA', PC['violet']))
    p.append(f'<line x1="520" y1="422" x2="482" y2="422" stroke="{PC["faint"]}" stroke-width="1.3" marker-end="url(#ah)" opacity="0.7"/>')
    p.append(_box(120, 470, 760, 44, PC['orange'], 'GROWTH / COMMUNITY LAYER',
                  'X content - demos - educational clarity - beta funnel', '', 'PHASE 6', PC['orange']))
    p.append('</svg>')
    return ''.join(p)


def gantt_svg():
    W, H, x0, x1, top, rh = 1000, 300, 250, 980, 50, 32
    tw = x1 - x0
    bottom = top + len(PHASES) * rh

    def dx(d):
        return x0 + (d / 112.0) * tw

    months = [('JUN', 0, 11), ('JUL', 11, 42), ('AUG', 42, 73), ('SEP', 73, 103), ('OCT', 103, 112)]
    p = [f'<svg viewBox="0 0 {W} {H}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    for name, a, b in months:
        gx = dx(a)
        p.append(f'<line x1="{gx:.1f}" y1="{top-10:.0f}" x2="{gx:.1f}" y2="{bottom:.0f}" stroke="{PC["line"]}" stroke-width="1"/>')
        p.append(f'<text x="{dx((a+b)/2):.1f}" y="{top-16:.0f}" fill="{PC["faint"]}" font-size="11" letter-spacing="2.5" text-anchor="middle">{name}</text>')
    p.append(f'<line x1="{x1:.1f}" y1="{top-10:.0f}" x2="{x1:.1f}" y2="{bottom:.0f}" stroke="{PC["line"]}" stroke-width="1"/>')
    for i, ph in enumerate(PHASES):
        pid, short, _l, s, e, ck, dates = ph[0], ph[1], ph[2], ph[3], ph[4], ph[5], ph[6]
        y = top + i * rh
        col = PC[ck]
        bx, bw = dx(s), dx(e + 1) - dx(s)
        p.append(f'<text x="14" y="{y+20:.0f}" fill="{col}" font-size="11" font-weight="bold">{pid}</text>')
        p.append(f'<text x="42" y="{y+20:.0f}" fill="{PC["dim"]}" font-size="10.5">{short}</text>')
        p.append(f'<rect x="{bx:.1f}" y="{y+7:.0f}" width="{bw:.1f}" height="16" rx="8" fill="{col}" opacity="0.9"/>')
        if bw > 150:
            p.append(f'<text x="{bx+bw-8:.1f}" y="{y+18:.0f}" fill="#06121a" font-size="8" font-weight="bold" text-anchor="end">{dates}</text>')
        else:
            p.append(f'<text x="{bx+bw+7:.1f}" y="{y+18:.0f}" fill="{PC["faint"]}" font-size="8">{dates}</text>')
    mx = dx(84)
    p.append(f'<line x1="{mx:.1f}" y1="{top-24:.0f}" x2="{mx:.1f}" y2="{bottom+8:.0f}" stroke="{PC["accent"]}" stroke-width="1.3" stroke-dasharray="4 3"/>')
    p.append(f'<text x="{mx:.1f}" y="{bottom+22:.0f}" fill="{PC["accent"]}" font-size="8.5" text-anchor="middle" letter-spacing="1.5">WEEK 12 - PRIVATE BETA LIVE</text>')
    p.append(f'<text x="{x0:.0f}" y="{bottom+22:.0f}" fill="{PC["faint"]}" font-size="8.5" text-anchor="start" letter-spacing="1">NOW - JUN 20</text>')
    p.append('</svg>')
    return ''.join(p)


def dependency_svg():
    p = ['<svg viewBox="0 0 1000 380" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans Mono, monospace">']
    p.append(f'<defs><marker id="da" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="{PC["faint"]}"/></marker></defs>')
    nodes = {
        'RC6': (60, 60, PC['cyan'], 'RC-6', 'Validate indicator', 'GATE'),
        'O2': (60, 158, PC['gold'], 'O-002', 'Offer + price', 'DECISION'),
        'EN1': (60, 256, PC['accent'], 'EN-1', 'Canonical core', 'NEXT'),
        'RC7': (290, 60, PC['accent'], 'RC-7', 'Whop + access', ''),
        'RC8': (290, 158, PC['lime'], 'RC-8', 'CTA to offer', ''),
        'CV': (520, 108, PC['lime'], 'P2', 'Core value screen', ''),
        'PINE': (520, 250, PC['gold'], 'PINE-1', 'Indicator polish', ''),
        'BRAIN': (740, 250, PC['violet'], 'P4', 'Website brain', ''),
        'BETA': (770, 95, PC['magenta'], 'P5', 'Private beta', 'MILESTONE'),
        'GROW': (770, 300, PC['orange'], 'P6', 'Growth system', ''),
    }
    edges = [('RC6', 'RC7'), ('O2', 'RC7'), ('O2', 'RC8'), ('RC7', 'RC8'), ('RC6', 'CV'),
             ('RC7', 'BETA'), ('CV', 'BETA'), ('EN1', 'PINE'), ('EN1', 'BRAIN'),
             ('PINE', 'BETA'), ('BRAIN', 'BETA'), ('BETA', 'GROW')]
    bw, bh = 150, 52
    for a, b in edges:
        ax, ay = nodes[a][0], nodes[a][1]
        bx, by = nodes[b][0], nodes[b][1]
        p.append(f'<line x1="{ax+bw:.0f}" y1="{ay+bh//2:.0f}" x2="{bx-3:.0f}" y2="{by+bh//2:.0f}" stroke="{PC["faint"]}" stroke-width="1.2" marker-end="url(#da)" opacity="0.6"/>')
    for x, y, col, tag, title, badge in nodes.values():
        if badge:
            p.append(_box(x, y, bw, bh, col, tag, title, '', badge, col))
        else:
            p.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="10" fill="#0c0f1c" stroke="{col}" stroke-width="1.4"/>'
                     f'<rect x="{x}" y="{y}" width="4" height="{bh}" rx="2" fill="{col}"/>'
                     f'<text x="{x+15}" y="{y+22}" fill="{col}" font-size="10" font-weight="bold" letter-spacing="1">{tag}</text>'
                     f'<text x="{x+15}" y="{y+40}" fill="{PC["fg"]}" font-size="11.5">{title}</text>')
    p.append('</svg>')
    return ''.join(p)


def timeline_html():
    cells = []
    for i, ph in enumerate(PHASES):
        ck = ph[5]
        cells.append(f'<div class="tl-node p{i}"><div class="mono" style="font-size:8px;color:var(--{ck});letter-spacing:1.5px">'
                     f'{ph[0]} - {ph[6]}</div><div style="font-size:10.5px;color:var(--fg);font-weight:700;margin-top:2px">{ph[1]}</div></div>')
    return f'<div class="tl"><div class="tl-axis"></div><div class="tl-row" style="margin-top:2px">{"".join(cells)}</div></div>'


def phase_mini(i):
    ph = PHASES[i]
    return (f'<div class="card p{i}" style="padding:9px 10px"><div class="badge-phase p{i}" style="font-size:8px">'
            f'<span class="sq" style="width:8px;height:8px"></span>{ph[0]}</div>'
            f'<div style="font-size:9.5px;color:var(--fg);font-weight:700;margin-top:5px">{ph[1]}</div>'
            f'<div class="faint mono" style="font-size:7.5px;margin-top:3px">{ph[6]}</div></div>')


def risk_heatmap():
    def c(level, rid, txt):
        return f'<td class="lvl-{level}"><div class="rid">{rid}</div><div class="rk">{txt}</div></td>'
    return ('<table class="heat">'
            '<tr><td class="axis"></td><td class="axis" colspan="3">LIKELIHOOD &#8594;</td></tr>'
            '<tr><td class="axis">HIGH<br>IMPACT</td>'
            + c('med', 'R3', 'Redesign loop reopens') + c('high', 'R2', 'Chart/web divergence') + c('crit', 'R1', 'Indicator not worth paying') + '</tr>'
            '<tr><td class="axis">MED</td>'
            + c('low', 'R6', 'Mobile/UX trust gaps') + c('med', 'R4', 'Price set wrong') + c('high', 'R5', 'No verified-access proof') + '</tr>'
            '<tr><td class="axis">LOW</td>'
            + c('low', 'R8', 'Deploy hiccup') + c('low', 'R7', 'Whop sandbox friction') + c('med', 'R9', 'Scope creep into brain') + '</tr>'
            '<tr><td class="axis"></td><td class="axis">LOW</td><td class="axis">MED</td><td class="axis">HIGH</td></tr>'
            '</table>')
