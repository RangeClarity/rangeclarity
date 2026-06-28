"use client";
import { useState } from "react";
import { LinearPreviewTab } from "./LinearPreview";

const TABS = ["Consensus", "Debate", "Risks", "Implementation", "Hermes Plan", "Linear Preview", "Raw Responses", "Timeline"] as const;
type Tab = (typeof TABS)[number];

/** Bottom result surface. Each tab renders a slice of the CouncilSession (+ Hermes plan / Linear preview). */
export function ResultTabs() {
  const [tab, setTab] = useState<Tab>("Consensus");
  return (
    <section style={{ marginTop: 20 }}>
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #1f2937", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: 0, borderBottom: tab === t ? "2px solid #2dd4bd" : "2px solid transparent", color: tab === t ? "#e6edf3" : "#94a3b8", padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: 16, color: "#cbd5e1", fontSize: 14 }}>
        {tab === "Linear Preview" ? <LinearPreviewTab /> :
          <p style={{ color: "#64748b" }}>{tab} renders from the council session (see docs/UI-WIREFRAMES.md). Consensus = agreements · Debate = disagreements+why · Risks = hidden risks+missing pieces · Implementation = final action plan · Hermes Plan = milestones/epics/issues · Raw = verbatim outputs · Timeline = round-by-round.</p>}
      </div>
    </section>
  );
}
