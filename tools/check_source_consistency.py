#!/usr/bin/env python3
from pathlib import Path
import hashlib
import posixpath
import re
import subprocess
import sys
import tarfile
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
ERRORS: list[str] = []


def fail(msg: str) -> None:
    ERRORS.append(msg)


def nav_targets() -> list[str]:
    result = []
    for line in (ROOT / "mkdocs.yml").read_text(encoding="utf-8").splitlines():
        if line.strip().endswith(".md") and ":" in line:
            result.append(line.rsplit(":", 1)[1].strip().strip("\"'"))
    return result


def site_map() -> dict[str, Path]:
    result = {}
    for page in DOCS.rglob("*.md"):
        rel = page.relative_to(DOCS).as_posix()
        if page.name == "index.md":
            parent = page.parent.relative_to(DOCS).as_posix().strip("/")
            url = "/" if not parent else f"/{parent}/"
        else:
            url = f"/{rel[:-3]}/"
        result[url] = page
    return result


def check_nav_and_pages() -> None:
    nav = nav_targets()
    for rel in nav:
        if not (DOCS / rel).is_file():
            fail(f"nav target does not exist: {rel}")

    pages = {p.relative_to(DOCS).as_posix() for p in DOCS.rglob("*.md")}
    unlisted = sorted(pages - set(nav))
    if unlisted:
        fail(f"student-facing Markdown not listed in nav: {unlisted}")


def check_links() -> None:
    pages = site_map()
    md_link = re.compile(r'(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+["\'][^"\']*["\'])?\)')
    html_link = re.compile(r'(?:href|src)=["\']([^"\']+)["\']')

    for page in DOCS.rglob("*.md"):
        rel = page.relative_to(DOCS).as_posix()
        if page.name == "index.md":
            parent = page.parent.relative_to(DOCS).as_posix().strip("/")
            base = "/" if not parent else f"/{parent}/"
        else:
            base = f"/{rel[:-3]}/"

        text = page.read_text(encoding="utf-8", errors="replace")
        for raw in md_link.findall(text) + html_link.findall(text):
            target = raw.split("#", 1)[0].split("?", 1)[0]
            if not target or target.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "#")):
                continue
            if target.startswith("/"):
                fail(f"root-relative URL is unsafe for project GitHub Pages: {rel} -> {raw}")
                continue

            resolved = posixpath.normpath(posixpath.join(base, target))
            if target.endswith("/"):
                resolved = resolved.rstrip("/") + "/"
                if resolved not in pages:
                    fail(f"broken page link: {rel} -> {raw} ({resolved})")
            elif target.endswith(".md"):
                if not (page.parent / target).exists():
                    fail(f"broken Markdown link: {rel} -> {raw}")
            else:
                asset = DOCS / resolved.lstrip("/")
                if not asset.exists() and (resolved.rstrip("/") + "/") not in pages:
                    fail(f"broken local link: {rel} -> {raw} ({resolved})")


def check_student_boundary() -> None:
    forbidden_status = ("DESIGN VERIFIED", "STATIC QA PASSED", "RUNTIME QA REQUIRED", "RUNTIME VERIFIED")
    for page in DOCS.rglob("*.md"):
        text = page.read_text(encoding="utf-8", errors="replace")
        for term in forbidden_status:
            if term in text:
                fail(f"developer-only QA status leaked to student page: {page.relative_to(ROOT)} -> {term}")

    forbidden_paths = (
        "course/06-detection-quality.md",
        "course/07-placement.md",
        "course/08-detection-engineering.md",
        "prelab/index.md",
        "resources/evidence-register.md",
        "resources/audit-report.md",
        "resources/visual-guide.md",
        "assets/images/README.md",
    )
    for rel in forbidden_paths:
        if (DOCS / rel).exists():
            fail(f"legacy/internal material is published under docs/: {rel}")


def download_refs() -> set[str]:
    refs = set()
    pattern = re.compile(r'assets/downloads/([^\s)"\']+)')
    for page in DOCS.rglob("*.md"):
        refs.update(pattern.findall(page.read_text(encoding="utf-8", errors="replace")))
    return refs


def check_downloads_and_archives() -> None:
    download_dir = DOCS / "assets" / "downloads"
    actual = {p.name for p in download_dir.iterdir() if p.is_file()}
    referenced = download_refs()

    missing = sorted(referenced - actual)
    extra = sorted(actual - referenced)
    if missing:
        fail(f"referenced downloads missing: {missing}")
    if extra:
        fail(f"published downloads not referenced by student materials: {extra}")

    for archive in ROOT.rglob("*"):
        if not archive.is_file():
            continue
        try:
            if archive.suffix == ".zip":
                with zipfile.ZipFile(archive) as zf:
                    bad = zf.testzip()
                    if bad:
                        fail(f"corrupt ZIP member: {archive.relative_to(ROOT)} -> {bad}")
            elif archive.name.endswith(".tar.gz"):
                with tarfile.open(archive, "r:gz") as tf:
                    for member in tf.getmembers():
                        if member.isfile():
                            fh = tf.extractfile(member)
                            if fh:
                                fh.read()
        except Exception as exc:
            fail(f"archive integrity failure: {archive.relative_to(ROOT)} -> {exc}")


def run_syntax_checks() -> None:
    download_dir = DOCS / "assets" / "downloads"
    with tempfile.TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        for archive in download_dir.iterdir():
            if archive.suffix == ".zip":
                dest = temp / archive.stem
                dest.mkdir()
                with zipfile.ZipFile(archive) as zf:
                    zf.extractall(dest)

        shell_files = list(temp.rglob("*.sh")) + list((ROOT / "env-setup").rglob("*.sh"))
        seen = set()
        for script in shell_files:
            digest = hashlib.sha256(script.read_bytes()).hexdigest()
            if digest in seen:
                continue
            seen.add(digest)
            proc = subprocess.run(["bash", "-n", str(script)], capture_output=True, text=True)
            if proc.returncode:
                fail(f"shell syntax: {script} -> {proc.stderr.strip()}")

        for script in temp.rglob("*.py"):
            proc = subprocess.run([sys.executable, "-m", "py_compile", str(script)], capture_output=True, text=True)
            if proc.returncode:
                fail(f"Python syntax: {script} -> {proc.stderr.strip()}")

    for script in (ROOT / "tools").glob("*.py"):
        if script.name == Path(__file__).name:
            continue
        proc = subprocess.run([sys.executable, "-m", "py_compile", str(script)], capture_output=True, text=True)
        if proc.returncode:
            fail(f"tool Python syntax: {script} -> {proc.stderr.strip()}")

    node = subprocess.run(["bash", "-lc", "command -v node"], capture_output=True, text=True)
    if node.returncode == 0:
        proc = subprocess.run(["node", "--check", str(DOCS / "assets/javascripts/course.js")], capture_output=True, text=True)
        if proc.returncode:
            fail(f"JavaScript syntax: {proc.stderr.strip()}")



def check_repository_hygiene() -> None:
    attributes = ROOT / ".gitattributes"
    if not attributes.is_file():
        fail("missing .gitattributes; LF policy is not enforced by the repository")
    else:
        text = attributes.read_text(encoding="utf-8", errors="replace")
        if "* text=auto eol=lf" not in text:
            fail(".gitattributes does not define canonical LF line endings")

    text_suffixes = {
        ".md", ".yml", ".yaml", ".py", ".sh", ".js", ".css", ".html",
        ".json", ".jsonl", ".txt", ".svg", ".toml", ".ini", ".cfg",
    }
    text_names = {".gitattributes", ".gitignore"}

    for path in ROOT.rglob("*"):
        if not path.is_file() or ".git" in path.parts:
            continue
        if path.name not in text_names and path.suffix.lower() not in text_suffixes:
            continue
        data = path.read_bytes()
        if b"\r\n" in data:
            fail(f"CRLF found in LF-controlled text file: {path.relative_to(ROOT)}")
        # A lone carriage return is also unsafe in repository-controlled text.
        if b"\r" in data.replace(b"\r\n", b""):
            fail(f"lone CR found in LF-controlled text file: {path.relative_to(ROOT)}")

def main() -> int:
    check_repository_hygiene()
    check_nav_and_pages()
    check_links()
    check_student_boundary()
    check_downloads_and_archives()
    run_syntax_checks()

    if ERRORS:
        for error in ERRORS:
            print(f"[FAIL] {error}")
        print(f"[FAIL] source/static consistency errors: {len(ERRORS)}")
        stale_markers = (
            "student-facing Markdown not listed in nav",
            "legacy/internal material is published under docs/",
            "published downloads not referenced by student materials",
        )
        if any(any(marker in error for marker in stale_markers) for error in ERRORS):
            print("[HINT] This often means the release ZIP was extracted over an older working tree.")
            print("[HINT] ZIP extraction does not delete files removed by the new release.")
            print("[HINT] Review with: python tools/migrate_v228.py")
            print("[HINT] Apply with:  python tools/migrate_v228.py --apply")
        return 1

    print("[ OK ] source/static consistency gate passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
