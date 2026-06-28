import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const body = readFileSync(filePath, "utf8");
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || "dean7lich@gmail.com";
const emailFrom = process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM?.trim() || "";
const apiKey = process.env.RESEND_API_KEY?.trim() || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rangeclarity.com";

console.log("RangeClarity email smoke test");
console.log(`RESEND_API_KEY exists: ${apiKey ? "yes" : "no"}`);
console.log(`EMAIL_FROM: ${emailFrom || "(missing)"}`);
console.log(`ADMIN_NOTIFICATION_EMAIL: ${adminEmail || "(missing)"}`);
console.log(`NEXT_PUBLIC_SITE_URL: ${siteUrl}`);

if (!apiKey) {
  console.error("FAIL: RESEND_API_KEY is missing.");
  process.exit(1);
}

if (!emailFrom) {
  console.error("FAIL: EMAIL_FROM is missing. Use a sender/domain verified in Resend.");
  process.exit(1);
}

if (!adminEmail) {
  console.error("FAIL: ADMIN_NOTIFICATION_EMAIL is missing.");
  process.exit(1);
}

const subject = "RangeClarity Email Test";
const text = [
  "RangeClarity email test.",
  "",
  "If you received this, Resend accepted EMAIL_FROM and delivered the admin smoke-test message.",
  "",
  "This test does not grant TradingView access and does not create a signup.",
].join("\n");

const response = await fetch(RESEND_ENDPOINT, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: emailFrom,
    to: adminEmail,
    subject,
    text,
  }),
});

if (!response.ok) {
  const detail = (await response.text().catch(() => "")).trim();
  console.error(`FAIL: Resend rejected the test email with HTTP ${response.status}.`);
  if (detail) console.error(detail);
  console.error("Check that EMAIL_FROM is a verified sender/domain in Resend.");
  process.exit(1);
}

const result = await response.json().catch(() => ({}));
console.log("PASS: Resend accepted the test email.");
if (result.id) console.log(`Resend message id: ${result.id}`);
