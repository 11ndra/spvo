#!/usr/bin/env python3
"""Clean stale public files when upgrading an existing repository to v2.28.

Why this exists:
Extracting a release ZIP over an existing Git working tree replaces files that
exist in both trees, but it does not delete files that were removed from the
new release. Those stale files remain under docs/ and are therefore still
eligible for MkDocs/GitHub Pages publication.

Run without --apply for a dry run. Use --apply only after reviewing the list.
Git history remains the recovery mechanism for removed tracked files.
"""
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

STALE_PUBLIC_PATHS = [
    "assets/images/README.md",
    "course/04-firewall-vs-idps.md",
    "course/05-detection-methods.md",
    "course/05-detection-quality.md",
    "course/06-detection-quality.md",
    "course/06-placement.md",
    "course/06-rules.md",
    "course/07-placement.md",
    "course/08-detection-engineering.md",
    "labs/lab05/index.md",
    "practice/practice01/index.md",
    "prelab/index.md",
    "resources/audit-report.md",
    "resources/evidence-register.md",
    "resources/visual-guide.md",
]

CURRENT_DOWNLOADS = {
    "idps-environment-setup-v1.1.tar.gz",
    "idps-environment-setup-v1.1.zip",
    "idps-lab01-bundle-v0.5.zip",
    "idps-lab02-bundle-v0.5.zip",
    "idps-lab03-bundle-v0.2.zip",
    "idps-lab04-bundle-v0.1.zip",
}


def prune_empty_dirs(start: Path, stop: Path) -> None:
    for directory in sorted(
        (p for p in start.rglob("*") if p.is_dir()),
        key=lambda p: len(p.parts),
        reverse=True,
    ):
        if directory == stop:
            continue
        try:
            directory.rmdir()
        except OSError:
            pass


def collect() -> tuple[list[Path], list[Path]]:
    stale_pages = [DOCS / rel for rel in STALE_PUBLIC_PATHS if (DOCS / rel).exists()]
    download_dir = DOCS / "assets" / "downloads"
    stale_downloads: list[Path] = []
    if download_dir.is_dir():
        stale_downloads = sorted(
            p for p in download_dir.iterdir()
            if p.is_file() and p.name not in CURRENT_DOWNLOADS
        )
    return stale_pages, stale_downloads


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="remove stale public files; without this flag the script is a dry run",
    )
    args = parser.parse_args()

    stale_pages, stale_downloads = collect()
    targets = stale_pages + stale_downloads

    if not targets:
        print("[ OK ] no stale v2.27/v2.28-rc1 public files detected")
        return 0

    print("Stale files detected. These are not part of the v2.28 student-facing tree:")
    for path in targets:
        print(f"  - {path.relative_to(ROOT)}")

    if not args.apply:
        print("\nDry run only. Review the list, then run:")
        print("  python tools/migrate_v228.py --apply")
        return 0

    for path in targets:
        path.unlink()
        print(f"[DEL] {path.relative_to(ROOT)}")

    prune_empty_dirs(DOCS, DOCS)
    print("\n[ OK ] stale public files removed")
    print("Next steps:")
    print("  git add --renormalize .")
    print("  git status")
    print("  python tools/check_source_consistency.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
