#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import posixpath
import sys
import re

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {"href", "src"} and value:
                self.links.append((tag, key, value))

def load_site_base_path(config_path: Path) -> str:
    # Read only the top-level site_url scalar. Parsing the whole MkDocs YAML with
    # SafeLoader is inappropriate because mkdocs.yml legitimately contains
    # Python-specific YAML tags used by pymdownx.superfences.
    text = config_path.read_text(encoding="utf-8")
    match = re.search(r"(?m)^site_url\s*:\s*[\"']?([^\"'\s#]+)", text)
    site_url = match.group(1).strip() if match else ""
    if not site_url:
        return "/"
    path = urlsplit(site_url).path or "/"
    if not path.startswith("/"):
        path = "/" + path
    if not path.endswith("/"):
        path += "/"
    return path

def site_candidate_exists(site: Path, resolved: str, original_path: str) -> bool:
    candidate = site / resolved
    if candidate.is_file():
        return True
    if original_path.endswith("/") and (candidate / "index.html").is_file():
        return True
    if candidate.is_dir() and (candidate / "index.html").is_file():
        return True
    return False

def target_exists(site: Path, current_html: Path, target: str, base_path: str) -> bool:
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return True

    path = unquote(parsed.path)
    if not path:
        return True

    # MkDocs Material may generate root-relative links that include the GitHub
    # Pages project base path (for example /spvo/assets/...). Those links are
    # valid and must be mapped back to the root of the generated site/.
    if path.startswith("/"):
        base_prefix = base_path.rstrip("/")
        if base_prefix:
            if path == base_prefix:
                relative = "."
            elif path.startswith(base_prefix + "/"):
                relative = path[len(base_prefix) + 1:] or "."
            else:
                return False
        else:
            relative = path.lstrip("/") or "."
        resolved = posixpath.normpath(relative)
        return site_candidate_exists(site, resolved, path)

    current_rel = current_html.relative_to(site).as_posix()
    current_url_dir = posixpath.dirname(current_rel)
    resolved = posixpath.normpath(posixpath.join(current_url_dir, path))
    return site_candidate_exists(site, resolved, path)

def main() -> int:
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "site").resolve()
    if not site.is_dir():
        print(f"[FAIL] site directory not found: {site}", file=sys.stderr)
        return 2

    repo_root = Path(__file__).resolve().parents[1]
    config_path = repo_root / "mkdocs.yml"
    if not config_path.is_file():
        print(f"[FAIL] mkdocs.yml not found: {config_path}", file=sys.stderr)
        return 2

    base_path = load_site_base_path(config_path)
    print(f"[INFO] GitHub Pages base path from site_url: {base_path}")

    broken = []
    checked = 0
    for html in site.rglob("*.html"):
        parser = LinkParser()
        parser.feed(html.read_text(encoding="utf-8", errors="replace"))
        for tag, key, target in parser.links:
            checked += 1
            if not target_exists(site, html, target, base_path):
                broken.append((html.relative_to(site).as_posix(), target))

    print(f"[INFO] checked href/src references: {checked}")
    if broken:
        for source, target in broken:
            print(f"[FAIL] {source} -> {target}")
        print(f"[FAIL] broken/unsafe references: {len(broken)}")
        return 1

    print("[ OK ] generated site links are internally consistent")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
