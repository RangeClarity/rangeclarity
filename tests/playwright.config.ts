import { defineConfig } from "@playwright/test";
// Minimal smoke config. One-time setup (see docs/ops/feedback-loops.md):
//   npm i -D @playwright/test && npx playwright install chromium
// Builds + starts prod so the gate (RC_INTERNAL_PAGES_ENABLED off) is exercised.
export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  use: { baseURL: "http://localhost:3000" },
  webServer: { command: "npm run build && npm run start", url: "http://localhost:3000", timeout: 180_000, reuseExistingServer: true },
});
