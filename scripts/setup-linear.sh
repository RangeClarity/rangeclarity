#!/usr/bin/env bash
set -euo pipefail

MODE="${1:---dry-run}"
if [ "$MODE" != "--dry-run" ] && [ "$MODE" != "--apply" ]; then
  echo "Usage: bash scripts/setup-linear.sh [--dry-run|--apply]" >&2
  exit 2
fi

ENV_FILE=".env"
EXAMPLE_FILE=".env.example"

echo "RangeClarity Linear setup (${MODE})"
echo "This script never prints LINEAR_API_KEY."

if [ "$MODE" = "--dry-run" ]; then
  echo "Dry-run: would prompt for Linear values and update .env safely."
  echo "Dry-run: would preserve unrelated .env entries."
  echo "Dry-run: would ensure .env is gitignored."
  exit 0
fi

read -r -p "Linear team key (e.g. RC): " LINEAR_TEAM_KEY_VALUE
read -r -p "Linear team id: " LINEAR_TEAM_ID_VALUE
read -r -p "Linear project id (optional): " LINEAR_PROJECT_ID_VALUE
read -r -p "Linear milestone/cycle id (optional): " LINEAR_MILESTONE_ID_VALUE
read -r -s -p "Linear API key (hidden): " LINEAR_API_KEY_VALUE
echo

touch "$ENV_FILE"

upsert_env() {
  local key="$1"
  local value="$2"
  local tmp
  tmp="$(mktemp)"
  grep -Ev "^${key}=" "$ENV_FILE" > "$tmp" || true
  printf "%s=%s\n" "$key" "$value" >> "$tmp"
  mv "$tmp" "$ENV_FILE"
}

upsert_env "LINEAR_API_KEY" "$LINEAR_API_KEY_VALUE"
upsert_env "LINEAR_TEAM_KEY" "$LINEAR_TEAM_KEY_VALUE"
upsert_env "LINEAR_TEAM_ID" "$LINEAR_TEAM_ID_VALUE"
upsert_env "LINEAR_PROJECT_ID" "$LINEAR_PROJECT_ID_VALUE"
upsert_env "LINEAR_MILESTONE_ID" "$LINEAR_MILESTONE_ID_VALUE"
upsert_env "LINEAR_WRITE_ENABLED" "false"

if command -v chmod >/dev/null 2>&1; then
  chmod 600 "$ENV_FILE" || true
fi

if [ -f ".gitignore" ] && ! grep -Eq '^\.env$' .gitignore; then
  printf "\n.env\n" >> .gitignore
fi

if [ -f "$EXAMPLE_FILE" ]; then
  for key in LINEAR_API_KEY LINEAR_TEAM_KEY LINEAR_TEAM_ID LINEAR_PROJECT_ID LINEAR_MILESTONE_ID LINEAR_WRITE_ENABLED; do
    if ! grep -Eq "^#?${key}=" "$EXAMPLE_FILE"; then
      printf "%s=\n" "$key" >> "$EXAMPLE_FILE"
    fi
  done
fi

echo "Linear env placeholders updated. Key value was not printed."
echo "Writes to Linear remain disabled unless LINEAR_WRITE_ENABLED=true and a sync command uses --apply."
