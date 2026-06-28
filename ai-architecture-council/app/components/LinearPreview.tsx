"use client";
/** Linear Preview tab: the exact issues that WILL be created (title, labels, priority, deps, AC).
 *  Approval actions are the only path to a Linear write — nothing is sent automatically. */
export function LinearPreviewTab() {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button style={btn("#2dd4bd", "#04221e")}>Create all</button>
        <button style={btn("#14233a", "#e6edf3")}>Create selected</button>
        <button style={btn("#14233a", "#e6edf3")}>Edit before creating</button>
        <button style={btn("transparent", "#94a3b8")}>Cancel</button>
        <button style={{ ...btn("transparent", "#94a3b8"), marginLeft: "auto" }}>Export Markdown</button>
      </div>
      <p style={{ color: "#64748b", fontSize: 13 }}>
        Each row shows: title · priority · labels · dependencies · acceptance criteria · the council session it traces to.
        Calling <code>approveAndCreateLinear()</code> requires explicit selection AND <code>COUNCIL_ALLOW_LINEAR_WRITES=true</code>.
        If Linear is unavailable, "Export Markdown" produces the same plan offline.
      </p>
    </div>
  );
}
const btn = (bg: string, fg: string) => ({ background: bg, color: fg, border: "1px solid #1f2937", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" });
