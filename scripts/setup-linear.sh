#!/usr/bin/env bash
#
# setup-linear.sh — store Linear credentials for Hermes LOCALLY and safely.
#
# What it does:
#   • ensures .env is in .gitignore
#   • creates .env if missing and chmod 600 it
#   • reads LINEAR_API_KEY with hidden input (never echoed/printed/logged)
#   • prompts for team key / team id / project id (visible, non-secret)
#   • writes .env without ever printing the secret
#
# The API key is NEVER printed to the terminal, written to history, or shown in
# any summary. Run it locally:  bash scripts/setup-linear.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env"
GITIGNORE="$ROOT/.gitignore"

echo "Hermes -> Linear setup"
echo "Repo: $ROOT"
echo

# --- ensure .env is gitignored ------------------------------------------------
touch "$GITIGNORE"
if grep -qxF ".env" "$GITIGNORE"; then
  echo "[ok] .env already in .gitignore"
else
  printf '\n# Local secrets (added by setup-linear.sh)\n.env\n' >> "$GITIGNORE"
  echo "[ok] added .env to .gitignore"
fi

# --- create .env if missing + lock permissions -------------------------------
if [ ! -f "$ENV_FILE" ]; then
  : > "$ENV_FILE"
  echo "[ok] created .env"
else
  echo "[ok] .env exists"
fi
chmod 600 "$ENV_FILE"
echo "[ok] .env permissions set to 600"
echo

# --- helper: set KEY=VALUE in .env WITHOUT printing VALUE ---------------------
set_env() {
  local key="$1"; local val="$2"
  local tmp; tmp="$(mktemp)"
  if [ -f "$ENV_FILE" ]; then
    grep -v -E "^[[:space:]]*${key}=" "$ENV_FILE" > "$tmp" 2>/dev/null || true
  fi
  printf '%s=%s\n' "$key" "$val" >> "$tmp"
  cat "$tmp" > "$ENV_FILE"
  rm -f "$tmp"
  chmod 600 "$ENV_FILE"
}

# --- LINEAR_API_KEY (hidden input) -------------------------------------------
printf 'Linear API key (input hidden): '
read -r -s LINEAR_API_KEY_INPUT || true
echo
if [ -z "${LINEAR_API_KEY_INPUT:-}" ]; then
  echo "[!] No key entered — leaving any existing key unchanged." >&2
else
  set_env "LINEAR_API_KEY" "$LINEAR_API_KEY_INPUT"
  echo "[ok] stored LINEAR_API_KEY (hidden)"
fi
unset LINEAR_API_KEY_INPUT

# --- team / project (visible, non-secret) ------------------------------------
read -r -p "Linear team KEY (e.g. DEA) [enter to skip]: " TEAM_KEY || true
[ -n "${TEAM_KEY:-}" ] && set_env "LINEAR_TEAM_KEY" "$TEAM_KEY" && echo "[ok] set LINEAR_TEAM_KEY"
read -r -p "Linear team ID (UUID, optional) [enter to skip]: " TEAM_ID || true
[ -n "${TEAM_ID:-}" ] && set_env "LINEAR_TEAM_ID" "$TEAM_ID" && echo "[ok] set LINEAR_TEAM_ID"
read -r -p "Linear project ID (optional) [enter to skip]: " PROJECT_ID || true
[ -n "${PROJECT_ID:-}" ] && set_env "LINEAR_PROJECT_ID" "$PROJECT_ID" && echo "[ok] set LINEAR_PROJECT_ID"

# --- safe defaults: writes stay OFF until explicitly enabled ------------------
grep -qE "^LINEAR_WRITE_ENABLED=" "$ENV_FILE" || set_env "LINEAR_WRITE_ENABLED" "false"
grep -qE "^HERMES_SOURCE_OF_TRUTH=" "$ENV_FILE" || set_env "HERMES_SOURCE_OF_TRUTH" "docs"

echo
echo "Done. Summary (secrets hidden):"
if grep -qE '^LINEAR_API_KEY=.+' "$ENV_FILE"; then echo "  LINEAR_API_KEY       : set (hidden)"; else echo "  LINEAR_API_KEY       : MISSING"; fi
echo "  LINEAR_TEAM_KEY      : $(grep -E '^LINEAR_TEAM_KEY=' "$ENV_FILE" | cut -d= -f2- || true)"
echo "  LINEAR_TEAM_ID       : $(grep -E '^LINEAR_TEAM_ID=' "$ENV_FILE" | cut -d= -f2- || true)"
echo "  LINEAR_PROJECT_ID    : $(grep -E '^LINEAR_PROJECT_ID=' "$ENV_FILE" | cut -d= -f2- || true)"
echo "  LINEAR_WRITE_ENABLED : $(grep -E '^LINEAR_WRITE_ENABLED=' "$ENV_FILE" | cut -d= -f2- || true)"
echo
echo "Next: npm run linear:health   # verifies the key (prints only pass/fail + your name)"
echo "      npm run linear:teams    # confirm your team KEY/ID"
