"use client";
import { useState } from "react";

/** Large prompt textbox + mode selector + Consult button. On submit, POSTs to /api/consult and
 *  streams agent events (wired in IMPLEMENTATION-PLAN step 6). */
export function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const modes = ["review", "planning", "implementation", "audit", "architecture"];
  return (
    <div style={{ marginTop: 12 }}>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe one engineering or product task…" rows={6}
        style={{ width: "100%", background: "#0b1120", color: "#e6edf3", border: "1px solid #1f2937", borderRadius: 12, padding: 12, fontSize: 14 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
        <select defaultValue="planning" style={{ background: "#0f1626", color: "#e6edf3", border: "1px solid #1f2937", borderRadius: 8, padding: "6px 10px" }}>
          {modes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button style={{ background: "#2dd4bd", color: "#04221e", fontWeight: 700, border: 0, borderRadius: 10, padding: "8px 16px", cursor: "pointer" }}>Consult the council →</button>
      </div>
    </div>
  );
}
