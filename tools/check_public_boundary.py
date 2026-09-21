#!/usr/bin/env python3
"""Fail CI if maintainer-only material leaks into the public course repository."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

ALLOWED_TOP_LEVEL = {
    ".gitattributes",
    ".github",
    ".gitignore",
    "README.md",
    "docs",
    "mkdocs.yml",
    "requirements.txt",
    "tools",
}
IGNORED_GENERATED = {".git", ".venv", ".pytest_cache", "site", "__pycache__"}
FORBIDDEN_ROOT = {
    "PROJECT_HANDOFF.md",
    "QA_RELEASE_GATE.md",
    "TEACHER_CLASSROOM_CHECKLIST.md",
    "TEACHER_LAB_CHEATSHEET.md",
    "internal",
    "legacy",
    "archive",
    "design",
    "env-setup",
    "labbox",
}
FORBIDDEN_TEXT_MARKERS = (
    "TEACHER_LAB_CHEATSHEET",
    "TEACHER_CLASSROOM_CHECKLIST",
    "PROJECT_HANDOFF.md",
    "QA_RELEASE_GATE.md",
    "internal/resources/",
    "legacy/course/",
    "archive/downloads/",
    "design/lab",
)
TEXT_SUFFIXES = {".md", ".yml", ".yaml", ".py", ".js", ".css", ".html", ".txt"}

errors: list[str] = []

for name in sorted(FORBIDDEN_ROOT):
    if (ROOT / name).exists():
        errors.append(f"maintainer-only path exists in public tree: {name}")

for child in ROOT.iterdir():
    if child.name in IGNORED_GENERATED:
        continue
    if child.name not in ALLOWED_TOP_LEVEL:
        errors.append(f"unexpected top-level public path: {child.name}")

for path in ROOT.rglob("*"):
    if not path.is_file():
        continue
    if path.resolve() == Path(__file__).resolve():
        continue
    if any(part in IGNORED_GENERATED for part in path.parts):
        continue
    if path.name.startswith("TEACHER_"):
        errors.append(f"teacher-only filename leaked: {path.relative_to(ROOT)}")
        continue
    if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in {".gitignore", ".gitattributes"}:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    for marker in FORBIDDEN_TEXT_MARKERS:
        if marker in text:
            errors.append(f"maintainer-only reference leaked: {path.relative_to(ROOT)} -> {marker}")

if errors:
    for error in errors:
        print(f"[FAIL] {error}")
    print(f"[FAIL] public repository boundary errors: {len(errors)}")
    raise SystemExit(1)

print("[ OK ] public repository boundary passed")
