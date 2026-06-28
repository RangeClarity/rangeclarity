import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    // scripts/** are dependency-free Node tooling scripts (Hermes adapter, etc.).
    // repo-dropin*/** are portable design handoff packages (concept board + vendored
    // support.js + brand assets) staged for copy-in — not Next app source.
    // All intentionally outside the Next app's React/TS lint scope.
    // ai-architecture-council/** is a standalone subproject (own deps + tsconfig), not Next app source.
    ignores: [".next/**", "node_modules/**", ".qatmp/**", "next-env.d.ts", "scripts/**", "docs/video-production/runway-inputs/_gen*.cjs", "repo-dropin/**", "repo-dropin_mobile/**", "tests/**", "ai-architecture-council/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
