#!/usr/bin/env python3
"""
RangeClarity roadmap deck — shared framework + components.
Imported by content_overall.py and content_sprint.py; rendered by build_pdfs.py.
Premium fintech dark theme, tuned for WeasyPrint. CSS in assets/roadmap.css.
"""
from pathlib import Path
from weasyprint import HTML

HERE = Path(__file__).resolve().parent
CSS_HREF = "assets/roadmap.css"

# svg palette (mirrors assets/roadmap.css tokens)
PC = {
    'cyan': '#38e8ff', 'accent': '#2fffd6', 'lime': '#b6ff3c', 'gold': '#ffce4d',
    'violet': '#9b6bff', 'magenta': '#ff4fd8', 'orange': '#ff8a3c',
    'fg': '#f2f6ff', 'dim': '#9aa6c4', 'faint': '#5c668a', 'line': '#1d2740',
    'panel': '#0e1120', 'bull': '#34f5b0', 'bear': '#ff5d7a',
}


# ----------------------------------------------------------- components ------
def kpi(v, k, d, pcls="p1"):
    return (f'<div class="kpi {pcls}"><div class="v">{v}</div>'
            f'<div class="k">{k}</div><div class="d">{d}</div></div>')


def chip(text, cls=""):
    return f'<span class="chip {cls}"><span class="dot"></span>{text}</span>'


def phase_badge(label, pcls):
    return (f'<span class="badge-phase {pcls}"><span class="sq"></span>{label}</span>')


def slide(eyebrow, title, body, tag, sub="", cls=""):
    """Store a slide as a dict; header/footer/page-number added at render."""
    return dict(eyebrow=eyebrow, title=title, body=body, tag=tag, sub=sub, cls=cls)


def render_slide(s, idx, total, doclabel):
    sub = f'<div class="slide-sub">{s["sub"]}</div>' if s["sub"] else ""
    title = (f'<div class="slide-title">{s["title"]}</div>{sub}'
             if s["title"] else "")
    head = ('<div class="slide-head">'
            f'<div class="eyebrow">{s["eyebrow"]}</div>'
            f'<div class="pagemeta">{doclabel}<br><b>{idx:02d}</b> / {total:02d}</div>'
            '</div>')
    foot = ('<div class="foot">'
            '<div class="brand"><b>RangeClarity</b> · Simple chart. Complex engine.</div>'
            f'<div class="tag">{s["tag"]}</div></div>')
    return (f'<section class="slide {s["cls"]}">{head}'
            f'<div class="body">{title}{s["body"]}</div>{foot}</section>')


def build_doc(slides, doclabel, title, out_stem):
    total = len(slides)
    sections = "\n".join(
        render_slide(s, i + 1, total, doclabel) for i, s in enumerate(slides))
    html = ('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
            f'<title>{title}</title>'
            f'<link rel="stylesheet" href="{CSS_HREF}"></head><body>'
            f'{sections}</body></html>')
    (HERE / f"{out_stem}.html").write_text(html, encoding="utf-8")
    HTML(string=html, base_url=str(HERE)).write_pdf(str(HERE / f"{out_stem}.pdf"))
    print(f"  wrote {out_stem}.html -> {out_stem}.pdf  ({total} pages)")
