"""Preview a Linear issue payload for RangeClarity without calling Linear.

By default this reads RC-T01 from docs/kanban.md and renders the issueCreate
payload shape Hermes should eventually send. It never calls the Linear API and
never prints raw LINEAR_TEAM_ID, LINEAR_PROJECT_ID, or LINEAR_API_KEY values.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
KANBAN_PATH = ROOT / "docs" / "kanban.md"
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


def _bool_env(name: str) -> bool | None:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return None
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


def _split_row(line: str) -> list[str]:
    stripped = line.strip()
    if stripped.startswith("|"):
        stripped = stripped[1:]
    if stripped.endswith("|"):
        stripped = stripped[:-1]
    return [part.strip() for part in stripped.split("|")]


def read_kanban_card(card_id: str) -> dict[str, str]:
    if not KANBAN_PATH.exists():
        raise RuntimeError(f"Kanban file not found: {KANBAN_PATH}")

    current_section = ""
    for raw in KANBAN_PATH.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("## "):
            current_section = line[3:].strip()
            continue
        if not line.startswith("|"):
            continue
        cells = _split_row(line)
        if not cells or cells[0] != card_id:
            continue

        if current_section == "Milestone Board":
            return {
                "id": cells[0],
                "title": cells[1],
                "milestone": cells[1],
                "priority": cells[3] if len(cells) > 3 else "Medium",
                "owner": cells[4] if len(cells) > 4 else "Founder",
                "done_condition": cells[5] if len(cells) > 5 else "",
                "section": current_section,
            }

        return {
            "id": cells[0],
            "title": cells[1] if len(cells) > 1 else card_id,
            "milestone": cells[2] if len(cells) > 2 else "",
            "priority": cells[3] if len(cells) > 3 else "Medium",
            "owner": cells[4] if len(cells) > 4 else "Founder",
            "done_condition": cells[5] if len(cells) > 5 else "",
            "section": current_section,
        }

    raise RuntimeError(f"Card {card_id} not found in {KANBAN_PATH}")


def linear_priority(priority: str) -> int:
    mapping = {
        "urgent": 1,
        "high": 2,
        "medium": 3,
        "low": 4,
    }
    return mapping.get(priority.strip().lower(), 3)


def configured_marker(name: str) -> str | None:
    return f"<{name}: configured>" if os.getenv(name, "").strip() else None


def build_preview(card: dict[str, str]) -> dict[str, object]:
    project_name = os.getenv("LINEAR_PROJECT_NAME", EXPECTED_PROJECT_NAME).strip() or EXPECTED_PROJECT_NAME
    title = f"{card['id']}: {card['title']}"
    description = "\n".join(
        [
            f"Source: docs/kanban.md ({card.get('section')})",
            f"Milestone: {card.get('milestone') or 'Unassigned'}",
            f"Owner: {card.get('owner') or 'Unassigned'}",
            "",
            "Acceptance criteria:",
            f"- {card.get('done_condition') or 'Define acceptance criteria before creation.'}",
            "",
            "Safety:",
            "- Created only after Linear target validation passes.",
            "- Must stay inside the Linear project named RangeClarity.",
        ]
    )
    return {
        "mode": "dry_run_only",
        "linear_api_call_made": False,
        "target": {
            "teamId": configured_marker("LINEAR_TEAM_ID"),
            "projectId": configured_marker("LINEAR_PROJECT_ID"),
            "projectNameExpected": EXPECTED_PROJECT_NAME,
            "projectNameConfiguredMatches": project_name == EXPECTED_PROJECT_NAME,
        },
        "issueCreateInputPreview": {
            "teamId": "$LINEAR_TEAM_ID",
            "projectId": "$LINEAR_PROJECT_ID",
            "title": title,
            "description": description,
            "priority": linear_priority(card.get("priority", "")),
            "labels": ["rangeclarity", "kanban", card.get("section", "backlog").lower().replace(" ", "-")],
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Preview a RangeClarity Linear ticket without creating it.")
    parser.add_argument("--from-kanban", default="RC-T01", help="Kanban card ID to preview, default RC-T01.")
    args = parser.parse_args()

    load_env()

    if _bool_env("LINEAR_DRY_RUN") is not True:
        print("LINEAR_DRY_RUN must be true before using dry-run ticket preview.")
        print("No Linear API call was made.")
        return 1

    card = read_kanban_card(args.from_kanban)
    preview = build_preview(card)
    print("Linear dry-run ticket preview")
    print("No Linear API call was made. No tickets were created.")
    print(json.dumps(preview, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
