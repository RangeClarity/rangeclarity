"use client";

import { useMemo, useState } from "react";
import type { NeuralMap, NeuralModule, NeuralStatus, NeuralRisk } from "@/lib/ops/opsData";
import { CopyButton } from "../CopyButton";
import styles from "./neural-map.module.css";

/* Interactive Neural Map / System Brain view (read-only). Local React state only — no execution,
   no network, no writes. All data is read server-side from the neural-map JSON and passed in. */

const STATUS_ORDER: NeuralStatus[] = ["GREEN", "YELLOW", "RED", "LOCKED"];
const RISK_ORDER: NeuralRisk[] = ["HIGH", "MEDIUM", "LOW"];
const COLOR: Record<NeuralStatus, string> = { GREEN: "#22c55e", YELLOW: "#eab308", RED: "#ef4444", LOCKED: "#a78bfa" };
const PIPELINE: string[] = ["data-adapters", "core-scoring", "research-experiments", "founder-review"];
const ANSWERS: { key: string; title: string }[] = [
  { key: "what_exists", title: "What exists" },
  { key: "done", title: "What's done" },
  { key: "in_progress", title: "In progress" },
  { key: "blocked", title: "Blocked" },
  { key: "touch_today", title: "Touch today" },
  { key: "do_not_touch", title: "Do not touch" },
];

function pillClass(s: NeuralStatus): string {
  return s === "GREEN" ? styles.green : s === "YELLOW" ? styles.yellow : s === "RED" ? styles.red : styles.locked;
}
function riskClass(r: NeuralRisk): string {
  return r === "HIGH" ? styles.riskHIGH : r === "MEDIUM" ? styles.riskMEDIUM : styles.riskLOW;
}

export default function NeuralMapView({ data }: { data: NeuralMap | null }) {
  const [status, setStatus] = useState<NeuralStatus | "ALL">("ALL");
  const [risk, setRisk] = useState<NeuralRisk | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const modules: NeuralModule[] = useMemo(() => data?.modules ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter((m) => {
      if (status !== "ALL" && m.status !== status) return false;
      if (risk !== "ALL" && m.risk !== risk) return false;
      if (q) {
        const hay = [m.name, m.lane, m.purpose, m.interface, ...m.files, ...m.functions].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [modules, status, risk, query]);

  const selected = modules.find((m) => m.id === selectedId) ?? null;
  const findModule = (id: string) => modules.find((m) => m.id === id) ?? null;

  if (!data) {
    return (
      <main className={styles.wrap}>
        <div className={styles.inner}>
          <h1 className={styles.title}>RC <span className={styles.g}>Neural Map</span></h1>
          <p className={styles.footer}>
            System map data not found — expected <span className={styles.code}>docs/architecture/rangeclarity-neural-map.json</span>.
            Build it, then reload. <a className={styles.link} href="/ops">← Ops Console</a>
          </p>
        </div>
      </main>
    );
  }

  const m = data.meta;

  return (
    <main className={styles.wrap}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <h1 className={styles.title}>RC <span className={styles.g}>Neural Map</span> <span className={styles.muted}>· System Brain</span></h1>
            <p className={styles.subtitle}>
              internal · read-only — maps modules, files, consumers, tests, status &amp; the next safe action ·{" "}
              <a className={styles.link} href="/ops">/ops →</a> · <a className={styles.link} href="/command-center">Command Center →</a>
            </p>
          </div>
          <div className={styles.subtitle}>as of {m.as_of}</div>
        </header>

        <div className={styles.convWrap}>
          <span className={`${styles.convPill} ${pillClass(m.conviction as NeuralStatus)}`}>Conviction: {m.conviction}</span>
          <span className={styles.convReason}>{m.conviction_reason}</span>
        </div>

        <div className={styles.legend}>
          {STATUS_ORDER.map((s) => {
            const n = modules.filter((x) => x.status === s).length;
            return (
              <span key={s} className={styles.legendItem}>
                <span className={styles.dot} style={{ background: COLOR[s] }} />
                {s} — {m.legend[s] ?? ""}<span className={styles.count}>({n})</span>
              </span>
            );
          })}
        </div>

        {/* What the map answers */}
        <div className={styles.answers}>
          {ANSWERS.map((a) => {
            const items = data.answers[a.key] ?? [];
            return (
              <div key={a.key} className={styles.ansCard}>
                <p className={styles.ansTitle}>{a.title}</p>
                <ul className={styles.ansList}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
            );
          })}
        </div>

        {/* System flow */}
        <section className={styles.flowSec} aria-label="System flow">
          <p className={styles.secLabel}>System flow · one-way pipeline (click a node)</p>
          <div className={styles.flowStrip}>
            {PIPELINE.map((id) => {
              const mod = findModule(id);
              if (!mod) return null;
              return (
                <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <button type="button" className={styles.flowNode} style={{ borderLeftColor: COLOR[mod.status] }} onClick={() => setSelectedId(id)}>
                    <div className={styles.flowName}>{mod.name}</div>
                    <div className={styles.flowMeta}>{mod.status}</div>
                  </button>
                  <span className={styles.flowArrow} aria-hidden="true">→</span>
                </span>
              );
            })}
            <span className={styles.flowNode} style={{ borderLeftColor: "#22c55e", cursor: "default" }}>
              <div className={styles.flowName}>Reports / Decisions</div>
              <div className={styles.flowMeta}>output</div>
            </span>
          </div>
          <div className={styles.flowSide}>
            {(["pine-layer", "web-ui", "payments-access"] as const).map((id) => {
              const mod = findModule(id);
              if (!mod) return null;
              const tag = id === "pine-layer" ? "consumer only" : id === "web-ui" ? "future consumer" : "isolated";
              return (
                <button key={id} type="button" className={styles.sideNode} style={{ borderLeftColor: COLOR[mod.status] }} onClick={() => setSelectedId(id)}>
                  {mod.name} <span className={styles.sideTag}>· {tag}</span>
                </button>
              );
            })}
          </div>
          <p className={styles.opsNote}>↻ Ops / Feedback Loops protects all modules (health · verify · golden test). Payments / Access is isolated from scoring &amp; research.</p>
        </section>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status</span>
            <div className={styles.seg}>
              <button type="button" className={`${styles.segBtn} ${status === "ALL" ? styles.segOn : ""}`} onClick={() => setStatus("ALL")}>All</button>
              {STATUS_ORDER.map((s) => (
                <button key={s} type="button" className={`${styles.segBtn} ${status === s ? styles.segOn : ""}`} onClick={() => setStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Risk</span>
            <div className={styles.seg}>
              <button type="button" className={`${styles.segBtn} ${risk === "ALL" ? styles.segOn : ""}`} onClick={() => setRisk("ALL")}>All</button>
              {RISK_ORDER.map((r) => (
                <button key={r} type="button" className={`${styles.segBtn} ${risk === r ? styles.segOn : ""}`} onClick={() => setRisk(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Search module / file / function</span>
            <input className={styles.search} value={query} placeholder="e.g. score_window, beta, zone…" onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button type="button" className={styles.reset} onClick={() => { setStatus("ALL"); setRisk("ALL"); setQuery(""); }}>Reset</button>
        </div>

        {/* Cards + detail */}
        <div className={styles.layout}>
          <div className={styles.grid}>
            {filtered.map((mod) => (
              <button
                key={mod.id}
                type="button"
                className={`${styles.card} ${selectedId === mod.id ? styles.cardSel : ""}`}
                style={{ borderLeftColor: COLOR[mod.status], textAlign: "left" }}
                onClick={() => setSelectedId(mod.id)}
              >
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardName}>{mod.name}</div>
                    <div className={styles.cardLane}>{mod.lane}</div>
                  </div>
                  <span className={`${styles.pill} ${pillClass(mod.status)}`}>{mod.status}</span>
                </div>
                <div className={styles.pillRow}>
                  <span className={`${styles.pill} ${riskClass(mod.risk)}`}>risk: {mod.risk}</span>
                  {mod.blocked && <span className={`${styles.pill} ${styles.red}`}>blocked</span>}
                  {mod.do_not_touch && <span className={`${styles.pill} ${styles.locked}`}>do not touch</span>}
                </div>
                <p className={styles.purpose}>{mod.purpose}</p>
              </button>
            ))}
            {filtered.length === 0 && <p className={styles.footer}>No modules match these filters.</p>}
          </div>

          <div className={styles.detailWrap}>
            {!selected ? (
              <div className={styles.detailEmpty}>Select a module (a node, a card) to see its files, functions, consumers, tests, blocked state, and next safe action.</div>
            ) : (
              <div className={styles.detail}>
                <div className={styles.dHead}>
                  <div>
                    <h2 className={styles.dName}>{selected.name}</h2>
                    <div className={styles.dLane}>{selected.lane} · owner: {selected.owner}</div>
                  </div>
                  <div className={styles.dPills}>
                    <span className={`${styles.pill} ${pillClass(selected.status)}`}>{selected.status}</span>
                    <span className={`${styles.pill} ${riskClass(selected.risk)}`}>risk: {selected.risk}</span>
                  </div>
                </div>
                <div className={styles.dInterface}>{selected.interface}</div>
                <p className={styles.dVal}>{selected.purpose}</p>

                <div className={styles.block}>
                  <div className={styles.dLabel}>Files</div>
                  <div className={styles.chips}>{selected.files.map((f) => <span key={f} className={styles.chip}>{f}</span>)}</div>
                </div>
                <div className={styles.block}>
                  <div className={styles.dLabel}>Functions</div>
                  <div className={styles.chips}>{selected.functions.map((f) => <span key={f} className={styles.chip}>{f}</span>)}</div>
                </div>
                {selected.consumers.length > 0 && (
                  <div className={styles.block}>
                    <div className={styles.dLabel}>Consumers</div>
                    <div className={styles.chips}>
                      {selected.consumers.map((c) => (
                        <span key={c.name} className={`${styles.chip} ${c.state === "migrated" ? styles.conMigrated : c.state === "old-interface" ? styles.conOld : ""}`}>
                          {c.name}{c.state === "migrated" ? " ✓" : c.state === "old-interface" ? " ⏳" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.block}>
                  <div className={styles.dLabel}>Tests / gates</div>
                  <div className={styles.chips}>
                    {selected.tests.map((t) => <span key={t} className={styles.chip}>{t}</span>)}
                    {selected.gates.map((g) => <span key={g} className={styles.chip}>{g}</span>)}
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.dLabel}>Last known progress</div>
                  <div className={styles.dVal}>{selected.progress}</div>
                </div>
                {selected.blocked && (
                  <div className={styles.block}><div className={styles.blocked}><b>Blocked:</b> {selected.blocked_reason}</div></div>
                )}
                {selected.do_not_touch && selected.do_not_touch_items.length > 0 && (
                  <div className={styles.block}><div className={styles.dnt}><b>Do not touch:</b> {selected.do_not_touch_items.join(" · ")}</div></div>
                )}
                <div className={styles.block}>
                  <div className={styles.dLabel}>Next safe action</div>
                  <div className={styles.next}>{selected.next_action}</div>
                </div>
                <div className={styles.docPath}>
                  <span>doc: {selected.doc}</span>
                  <CopyButton text={selected.doc} label="Copy doc path" small />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className={styles.footer}>
          Read-only system map. Selectors use local React state (not persisted); the only action is copy-to-clipboard.
          Nothing here executes shell, calls services, or mutates git. Source of truth:{" "}
          <span className={styles.code}>docs/architecture/rangeclarity-neural-map.json</span> (mirrors{" "}
          {m.sources.join(", ")}).
        </p>
      </div>
    </main>
  );
}
