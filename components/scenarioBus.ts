// Minimal client-side pub/sub so the Use Cases cards can drive the hero
// instrument without a heavy context provider.
type Fn = (id: string) => void;

const listeners = new Set<Fn>();

export function onScenario(fn: Fn): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function selectScenario(id: string): void {
  listeners.forEach((fn) => fn(id));
}
