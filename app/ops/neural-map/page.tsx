import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readNeuralMap } from "@/lib/ops/opsData";
import NeuralMapView from "./NeuralMapView";

/* RC Neural Map (System Brain) — internal, read-only system map view INSIDE the Ops area.
   Server component: reads docs/architecture/rangeclarity-neural-map.json at request time and
   hands it to the interactive client view. No execution, no network, no writes. Internal-only:
   404 in production unless RC_INTERNAL_PAGES_ENABLED === "true" (same gate as /ops, /command-center). */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "RC Neural Map",
  description: "Internal RangeClarity system map / brain.",
  robots: { index: false, follow: false },
};

export default function NeuralMapPage() {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();
  const data = readNeuralMap();
  return <NeuralMapView data={data} />;
}
