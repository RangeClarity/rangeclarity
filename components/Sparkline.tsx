import { getScenario, project, type Layout } from "@/lib/scenarios";

const L: Layout = { w: 248, h: 92, padX: 6, padTop: 10, padBottom: 12 };

export default function Sparkline({ id }: { id: string }) {
  const s = getScenario(id);
  const p = project(s, L);
  return (
    <svg
      className="spark"
      viewBox={`0 0 ${L.w} ${L.h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${s.label} sample chart`}
    >
      {p.resistance ? (
        <rect
          className="spark-zone spark-zone-r"
          x={0}
          y={p.resistance.y}
          width={L.w}
          height={p.resistance.h}
        />
      ) : null}
      {p.support ? (
        <rect
          className="spark-zone spark-zone-s"
          x={0}
          y={p.support.y}
          width={L.w}
          height={p.support.h}
        />
      ) : null}
      <path className="spark-line" d={p.emaPath} />
      <circle className="spark-dot" cx={p.last.x} cy={p.last.y} r={2.8} />
    </svg>
  );
}
