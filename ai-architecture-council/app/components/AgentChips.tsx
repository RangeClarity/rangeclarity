"use client";
import { useState } from "react";

/** "Consult with [Claude Code] [Codex] [AntiGravity]" — removable chips + add menu + weight sliders.
 *  Selected agent ids + weights live in client state and feed the consult request. */
export function AgentChips({ providers }: { providers: { id: string; label: string }[] }) {
  const [selected, setSelected] = useState<string[]>(providers.map((p) => p.id));
  const remove = (id: string) => setSelected((s) => s.filter((x) => x !== id));
  const add = (id: string) => setSelected((s) => (s.includes(id) ? s : [...s, id]));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ color: "#94a3b8", fontSize: 13 }}>Consult with</span>
      {selected.map((id) => {
        const label = providers.find((p) => p.id === id)?.label ?? id;
        return (
          <span key={id} style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "#14233a", border: "1px solid #2dd4bd66", borderRadius: 999, padding: "4px 10px", fontSize: 12 }}>
            {label}
            <button onClick={() => remove(id)} aria-label={`remove ${label}`} style={{ background: "none", border: 0, color: "#94a3b8", cursor: "pointer" }}>×</button>
          </span>
        );
      })}
      {providers.filter((p) => !selected.includes(p.id)).map((p) => (
        <button key={p.id} onClick={() => add(p.id)} style={{ background: "#0f1626", border: "1px dashed #334155", borderRadius: 999, padding: "4px 10px", fontSize: 12, color: "#94a3b8", cursor: "pointer" }}>+ {p.label}</button>
      ))}
      {/* TODO(impl): weighted-voting sliders (config/weights), mode selector, rounds (1–3). */}
    </div>
  );
}
