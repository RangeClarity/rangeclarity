/**
 * Supabase REST helpers for the manual beta-access fulfilment console.
 * Server-only: uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Never import in client code.
 * Mirrors the URL/table resolution used by lib/betaSignupCapture.ts.
 */
const DEFAULT_TABLE = "beta_signups";
const SELECT =
  "id,email,tradingview_username,full_name,selected_plan,signup_type,status,invited_at,created_at,email_error";

export type BetaSignupRow = {
  id: string;
  email: string;
  tradingview_username: string;
  full_name: string | null;
  selected_plan: string;
  signup_type: string;
  status: string | null;
  invited_at: string | null;
  created_at: string;
  email_error: string | null;
};

function envValue(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v || undefined;
}

function cfg() {
  const url = envValue("SUPABASE_URL");
  const key = envValue("SUPABASE_SERVICE_ROLE_KEY");
  const tableSetting = envValue("SUPABASE_BETA_SIGNUPS_TABLE") ?? DEFAULT_TABLE;
  const dot = tableSetting.indexOf(".");
  const schema = dot >= 0 ? tableSetting.slice(0, dot) : "public";
  const table = dot >= 0 ? tableSetting.slice(dot + 1) : tableSetting;
  const base = url ? url.replace(/\/+$/, "").replace(/\/rest\/v1$/, "") : undefined;
  return { base, key, schema, table };
}

export function hasSupabaseAdminConfig(): boolean {
  const { base, key } = cfg();
  return Boolean(base && key);
}

function readHeaders(key: string, schema: string): HeadersInit {
  return { apikey: key, Authorization: `Bearer ${key}`, "Accept-Profile": schema };
}

function writeHeaders(key: string, schema: string): HeadersInit {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "Accept-Profile": schema,
    "Content-Profile": schema,
    Prefer: "return=representation",
  };
}

export async function listRecentSignups(limit = 100): Promise<BetaSignupRow[]> {
  const { base, key, schema, table } = cfg();
  if (!base || !key) throw new Error("Supabase admin not configured");
  const url = `${base}/rest/v1/${encodeURIComponent(table)}?select=${SELECT}&order=created_at.desc&limit=${limit}`;
  const res = await fetch(url, { headers: readHeaders(key, schema) });
  if (!res.ok) throw new Error(`Supabase list HTTP ${res.status}`);
  return (await res.json()) as BetaSignupRow[];
}

export async function getSignup(id: string): Promise<BetaSignupRow | null> {
  const { base, key, schema, table } = cfg();
  if (!base || !key) throw new Error("Supabase admin not configured");
  const url = `${base}/rest/v1/${encodeURIComponent(table)}?id=eq.${encodeURIComponent(id)}&select=${SELECT}&limit=1`;
  const res = await fetch(url, { headers: readHeaders(key, schema) });
  if (!res.ok) throw new Error(`Supabase get HTTP ${res.status}`);
  const rows = (await res.json()) as BetaSignupRow[];
  return rows[0] ?? null;
}

export async function markGranted(id: string): Promise<BetaSignupRow | null> {
  const { base, key, schema, table } = cfg();
  if (!base || !key) throw new Error("Supabase admin not configured");
  const url = `${base}/rest/v1/${encodeURIComponent(table)}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: writeHeaders(key, schema),
    body: JSON.stringify({ status: "granted", invited_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).trim().slice(0, 300);
    throw new Error(detail ? `Supabase grant HTTP ${res.status}: ${detail}` : `Supabase grant HTTP ${res.status}`);
  }
  const rows = (await res.json()) as BetaSignupRow[];
  return rows[0] ?? null;
}

/** Best-effort: record (or clear) the access-granted email error. Never throws. */
export async function recordGrantEmailError(id: string, error: string | null): Promise<void> {
  const { base, key, schema, table } = cfg();
  if (!base || !key) return;
  try {
    await fetch(`${base}/rest/v1/${encodeURIComponent(table)}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...writeHeaders(key, schema), Prefer: "return=minimal" },
      body: JSON.stringify({ email_error: error }),
    });
  } catch {
    /* best-effort */
  }
}
