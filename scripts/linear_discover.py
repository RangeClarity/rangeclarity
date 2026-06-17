"""Read-only Linear workspace discovery for RangeClarity.

This script lists available Linear teams and projects so the founder can copy
the correct IDs into local environment variables. It never creates, updates, or
deletes Linear data, and it never prints LINEAR_API_KEY.
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


def _present(name: str) -> str:
    return "present" if os.getenv(name, "").strip() else "missing"


def _sanitize_error(text: str) -> str:
    token = os.getenv("LINEAR_API_KEY", "").strip()
    if token:
        text = text.replace(token, "[REDACTED_LINEAR_API_KEY]")
    return text


def graphql(query: str, variables: dict[str, Any] | None = None) -> dict[str, Any]:
    token = os.getenv("LINEAR_API_KEY", "").strip()
    if not token:
        raise RuntimeError("LINEAR_API_KEY is missing.")

    body = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
    request = urllib.request.Request(
        LINEAR_GRAPHQL_URL,
        data=body,
        headers={
            "Authorization": token,
            "Content-Type": "application/json",
            "User-Agent": "RangeClarity-Linear-Discovery",
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


def _matches_rangeclarity(value: str | None) -> bool:
    return (value or "").strip().lower() == EXPECTED_PROJECT_NAME.lower()


def main() -> int:
    load_env()
    target_name = os.getenv("LINEAR_PROJECT_NAME", EXPECTED_PROJECT_NAME).strip() or EXPECTED_PROJECT_NAME

    print("Linear discovery (read-only)")
    print("Env presence, values hidden:")
    for name in (
        "LINEAR_API_KEY",
        "LINEAR_TEAM_ID",
        "LINEAR_PROJECT_ID",
        "LINEAR_PROJECT_NAME",
        "LINEAR_DRY_RUN",
    ):
        print(f"- {name}: {_present(name)}")
    print()

    if not os.getenv("LINEAR_API_KEY", "").strip():
        print("Missing LINEAR_API_KEY. Add it locally, then rerun discovery.")
        print("No Linear API call was made.")
        return 1

    query = """
    query RangeClarityLinearDiscovery {
      viewer {
        id
        name
      }
      teams(first: 100) {
        nodes {
          id
          key
          name
        }
      }
      projects(first: 100) {
        nodes {
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
    }
    """

    data = graphql(query)
    teams = data.get("teams", {}).get("nodes", [])
    projects = data.get("projects", {}).get("nodes", [])

    print("Teams:")
    if not teams:
        print("- none returned")
    for team in teams:
        print(f"- team_id: {team.get('id')}")
        print(f"  key: {team.get('key')}")
        print(f"  name: {team.get('name')}")

    print()
    print("Projects:")
    matches = 0
    if not projects:
        print("- none returned")
    for project in projects:
        recommended = _matches_rangeclarity(project.get("name")) or (
            project.get("name", "").strip().lower() == target_name.lower()
        )
        if recommended:
            matches += 1
        team = project.get("team") or {}
        print(f"- project_id: {project.get('id')}")
        print(f"  name: {project.get('name')}")
        print(f"  state: {project.get('state')}")
        print(f"  team_id: {team.get('id')}")
        print(f"  team_key: {team.get('key')}")
        print(f"  team_name: {team.get('name')}")
        print(f"  recommended_for_rangeclarity: {'yes' if recommended else 'no'}")

    print()
    if matches:
        print("Next: copy the recommended project_id and its team_id into local env.")
    else:
        print("No project named RangeClarity was returned. Create it in Linear or confirm the exact project name.")
    print("No Linear tickets were created.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
