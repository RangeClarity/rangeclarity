"use client";

import Sparkline from "@/components/Sparkline";
import { SCENARIOS, type StateT } from "@/lib/scenarios";
import { selectScenario } from "@/components/scenarioBus";

function tone(s: StateT): string {
  if (s === "Extended") return "warn";
  if (s === "Strong Trend" || s === "Constructive") return "bull";
  return "neutral";
}

function load(id: string) {
  selectScenario(id);
  const el = document.getElementById("instrument");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function UseCases() {
  return (
    <div className="usecase-grid">
      {SCENARIOS.map((s) => (
        <button
          type="button"
          className="usecase"
          key={s.id}
          onClick={() => load(s.id)}
          aria-label={`Load ${s.label} in the instrument`}
        >
          <div className="usecase-spark">
            <Sparkline id={s.id} />
          </div>
          <div className="usecase-meta">
            <span className={`tag tag-${tone(s.reading.state)}`}>
              {s.reading.state}
            </span>
            <h3>{s.label}</h3>
            <p>{s.blurb}</p>
            <span className="usecase-cta" aria-hidden="true">
              Load in instrument &rarr;
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
