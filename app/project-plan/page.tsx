import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "RangeClarity — Internal Project Plan",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PLAN_PATH = path.join(
  process.cwd(),
  "docs",
  "project-plan",
  "rangeclarity-live-plan.md",
);

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let idx = 0;
  let m: RegExpExecArray | null = re.exec(text);
  while (m !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2]) {
      out.push(<strong key={`${keyPrefix}s${idx}`}>{m[2]}</strong>);
    } else if (m[3]) {
      out.push(
        <code key={`${keyPrefix}c${idx}`} className="pp-ic">
          {m[3]}
        </code>,
      );
    }
    idx += 1;
    last = m.index + m[0].length;
    m = re.exec(text);
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderMarkdown(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const nextKey = (): string => `b${(key += 1)}`;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === "") {
      i += 1;
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push(<hr key={nextKey()} className="pp-hr" />);
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const k = nextKey();
      if (level === 1) {
        blocks.push(
          <h1 key={k} className="pp-h1">
            {renderInline(text, k)}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={k} id={slug(text)} className="pp-h2">
            {renderInline(text, k)}
          </h2>,
        );
      } else {
        blocks.push(
          <h3 key={k} className="pp-h3">
            {renderInline(text, k)}
          </h3>,
        );
      }
      i += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      const k = nextKey();
      blocks.push(
        <blockquote key={k} className="pp-quote">
          {buf.map((b, j) => (
            <p key={`${k}q${j}`}>{renderInline(b, `${k}q${j}`)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^-\s+/, ""));
        i += 1;
      }
      const k = nextKey();
      blocks.push(
        <ul key={k} className="pp-ul">
          {items.map((it, j) => (
            <li key={`${k}i${j}`}>{renderInline(it, `${k}i${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|>|-\s|---+$)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    const k = nextKey();
    blocks.push(
      <p key={k} className="pp-p">
        {renderInline(para.join(" "), k)}
      </p>,
    );
  }

  return blocks;
}

const CSS = `
.pp-wrap{max-width:900px;margin:0 auto;padding:2rem 1.25rem 4rem;color:#cdd5e6;font:15px/1.65 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}
.pp-banner{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;border:1px solid #2a3550;background:#0c1322;color:#9fb0d0;border-radius:8px;padding:.55rem .8rem;font-size:.74rem;letter-spacing:.03em;margin-bottom:1.5rem;}
.pp-banner b{color:#ffce4d;text-transform:uppercase;letter-spacing:.1em;}
.pp-toc{border:1px solid #1d2740;background:#0a1020;border-radius:10px;padding:1rem 1.1rem;margin-bottom:2rem;}
.pp-toc h4{margin:0 0 .5rem;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:#6b7aa0;}
.pp-toc ol{margin:0;padding-left:1.1rem;}
.pp-toc li{margin:.2rem 0;}
.pp-toc a{color:#8fd6ff;text-decoration:none;}
.pp-toc a:hover{text-decoration:underline;}
.pp-h1{font-size:1.7rem;line-height:1.2;margin:.2rem 0 .4rem;color:#f3f6ff;letter-spacing:-.01em;}
.pp-h2{font-size:1.18rem;margin:2rem 0 .7rem;padding-top:1.1rem;border-top:1px solid #1b2438;color:#fff;scroll-margin-top:1rem;}
.pp-h3{font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;color:#8a98bd;margin:1.3rem 0 .5rem;}
.pp-p{margin:.6rem 0;}
.pp-ul{margin:.5rem 0 .8rem;padding-left:1.2rem;}
.pp-ul li{margin:.32rem 0;}
.pp-ic{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.85em;background:#141c30;border:1px solid #232f4a;border-radius:5px;padding:.04rem .34rem;color:#9fe7c8;}
.pp-quote{margin:1rem 0;padding:.8rem 1rem;border-left:3px solid #38e8ff;background:#0b1426;border-radius:0 8px 8px 0;color:#dbe6ff;}
.pp-quote p{margin:.25rem 0;}
.pp-hr{border:none;border-top:1px solid #1b2438;margin:1.6rem 0;}
strong{color:#eef2ff;}
.pp-err{border:1px solid #5a2330;background:#1b0f14;color:#ffb4b4;border-radius:8px;padding:1rem;}
`;

export default function ProjectPlanPage() {
  let md = "";
  let error = "";
  try {
    md = fs.readFileSync(PLAN_PATH, "utf8");
  } catch {
    error = PLAN_PATH;
  }

  const sections =
    md === ""
      ? []
      : Array.from(md.matchAll(/^##\s+(.*)$/gm)).map((mm) => mm[1].trim());

  return (
    <main className="pp-wrap">
      <style>{CSS}</style>
      <div className="pp-banner">
        <b>Internal</b>
        <span>not public · do not link from the site · source:</span>
        <code className="pp-ic">docs/project-plan/rangeclarity-live-plan.md</code>
      </div>

      {error !== "" ? (
        <div className="pp-err">
          Plan file not found at <code className="pp-ic">{error}</code>. Create{" "}
          <code className="pp-ic">docs/project-plan/rangeclarity-live-plan.md</code> to
          populate this page.
        </div>
      ) : (
        <>
          {sections.length > 0 ? (
            <nav className="pp-toc" aria-label="Sections">
              <h4>Sections</h4>
              <ol>
                {sections.map((s, j) => (
                  <li key={`toc${j}`}>
                    <a href={`#${slug(s)}`}>{s.replace(/^\d+\.\s*/, "")}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <article className="pp-doc">{renderMarkdown(md)}</article>
        </>
      )}
    </main>
  );
}
