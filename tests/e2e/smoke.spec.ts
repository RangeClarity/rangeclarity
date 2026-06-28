import { test, expect } from "@playwright/test";

const PUBLIC = [
  { path: "/", text: "No signals. No noise. Just structure." },
  { path: "/beta", text: "Get Beta Access" },
  { path: "/privacy", text: "Privacy" },
  { path: "/terms", text: "Terms" },
];
for (const p of PUBLIC) {
  test(`smoke ${p.path}: loads, shows key copy, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    const res = await page.goto(p.path, { waitUntil: "domcontentloaded" });
    expect(res?.status() ?? 0, `${p.path} status`).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(p.text);
    expect(errors, `console errors on ${p.path}`).toEqual([]);
  });
}
// production gate: experimental routes must 404 when RC_INTERNAL_PAGES_ENABLED is off
for (const gated of ["/designs", "/range-command-premium", "/variant-codex-section"]) {
  test(`gate ${gated}: not public (404)`, async ({ page }) => {
    const res = await page.goto(gated, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `${gated} should 404 in production`).toBe(404);
  });
}
