"""Validate the configured Linear target for RangeClarity.

This script proves that LINEAR_TEAM_ID and LINEAR_PROJECT_ID point to a Linear
project named RangeClarity, and that the project belongs to the configured team.
It is read-only and never prints LINEAR_API_KEY or raw .env values.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
LINEAR_GRAPHQL_URL = "https://api.linear.app/graphql"
EXPECTED_PROJECT_NAME = "RangeClarity"


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :].strip()
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def load_env() -> None:
    hermes_home = os.getenv("HERMES_HOME")
    if hermes_home:
        _load_env_file(Path(hermes_home) / ".env")
    _load_env_file(ROOT / ".env")


def _present(name: str) -> bool:
    return bool(os.getenv(name, "").strip())


def _bool_env(name: str) -> bool | None:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return None
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


def _sanitize_error(text: str) -> str:
    token = os.getenv("LINEAR_API_KEY", "").strip()
    if token:
        text = text.replace(token, "[REDACTED_LINEAR_API_KEY]")
    return text


def graphql(query: str, variables: dict[str, Any]) -> dict[str, Any]:
    token = os.getenv("LINEAR_API_KEY", "").strip()
    body = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    request = urllib.request.Request(
        LINEAR_GRAPHQL_URL,
        data=body,
        headers={
            "Authorization": token,
            "Content-Type": "application/json",
            "User-Agent": "RangeClarity-Linear-Target-Validation",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(_sanitize_error(f"Linear API error {exc.code}: {detail}")) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(_sanitize_error(f"Linear network error: {exc.reason}")) from exc

    if payload.get("errors"):
        raise RuntimeError(_sanitize_error(f"Linear API returned errors: {payload['errors']}"))
    return payload.get("data", {})


def main() -> int:
    load_env()
    expected_name = os.getenv("LINEAR_PROJECT_NAME", EXPECTED_PROJECT_NAME).strip() or EXPECTED_PROJECT_NAME

    required = ("LINEAR_API_KEY", "LINEAR_TEAM_ID", "LINEAR_PROJECT_ID", "LINEAR_PROJECT_NAME", "LINEAR_DRY_RUN")
    missing = [name for name in required if not _present(name)]
    print("Linear target validation (read-only)")
    print("Env presence, values hidden:")
    for name in required:
        print(f"- {name}: {'present' if _present(name) else 'missing'}")
    print()

    if missing:
        print("Missing required env var(s): " + ", ".join(missing))
        print("No Linear API call was made.")
        return 1

    if expected_name != EXPECTED_PROJECT_NAME:
        print("LINEAR_PROJECT_NAME is present but does not equal RangeClarity.")
        print("No Linear API call was made.")
        return 1

    if _bool_env("LINEAR_DRY_RUN") is not True:
        print("LINEAR_DRY_RUN must be true for validation/setup.")
        print("No Linear API call was made.")
        return 1

    query = """
    query RangeClarityLinearTarget($teamId: String!, $projectId: String!) {
      team(id: $teamId) {
        id
        key
        name
      }
      project(id: $projectId) {
        id
        name
        state
        team {
          id
          key
          name
        }
      }
    }
    """
    variables = {
        "teamId": os.getenv("LINEAR_TEAM_ID", "").strip(),
        "projectId": os.getenv("LINEAR_PROJECT_ID", "").strip(),
    }

    data = graphql(query, variables)
    team = data.get("team")
    project = data.get("project")

    if not team:
        print("Configured LINEAR_TEAM_ID did not resolve to a Linear team.")
        return 1
    if not project:
        print("Configured LINEAR_PROJECT_ID did not resolve to a Linear project.")
        return 1

    project_team = project.get("team") or {}
    name_ok = (project.get("name") or "").strip().lower() == EXPECTED_PROJECT_NAME.lower()
    team_ok = (project_team.get("id") or "") == (team.get("id") or "")

    print("Resolved target:")
    print(f"- team_key: {team.get('key')}")
    print(f"- team_name: {team.get('name')}")
    print(f"- project_name: {project.get('name')}")
    print(f"- project_state: {project.get('state')}")
    print(f"- project_belongs_to_configured_team: {'yes' if team_ok else 'no'}")
    print(f"- project_name_is_rangeclarity: {'yes' if name_ok else 'no'}")
    print()

    if not name_ok or not team_ok:
        print("Target validation failed. Do not create real Linear tickets yet.")
        return 1

    print("Target validation passed for Linear project RangeClarity.")
    print("No Linear tickets were created.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
