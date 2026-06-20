import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    // scripts/** are dependency-free Node tooling scripts (Hermes adapter, etc.),
    // intentionally outside the Next app's React/TS lint scope.
    ignores: [".next/**", "node_modules/**", ".qatmp/**", "next-env.d.ts", "scripts/**", "docs/video-production/runway-inputs/_gen*.cjs"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
