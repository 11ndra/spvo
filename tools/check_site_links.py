#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import posixpath
import sys

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links=[]
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {"href", "src"} and value:
                self.links.append((tag,key,value))

def target_exists(site: Path, current_html: Path, target: str) -> bool:
    parsed=urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith(("mailto:","tel:","javascript:","data:")):
        return True
    path=unquote(parsed.path)
    if not path:
        return True
    if path.startswith('/'):
        # Project GitHub Pages is mounted below /spvo/. Root-relative URLs are unsafe.
        return False
    current_rel=current_html.relative_to(site).as_posix()
    current_url_dir=posixpath.dirname(current_rel)
    if current_html.name == 'index.html':
        current_url_dir=posixpath.dirname(current_rel)
    resolved=posixpath.normpath(posixpath.join(current_url_dir,path))
    candidate=site/resolved
    if candidate.is_file():
        return True
    if path.endswith('/') and (candidate/'index.html').is_file():
        return True
    if candidate.is_dir() and (candidate/'index.html').is_file():
        return True
    return False

def main() -> int:
    site=Path(sys.argv[1] if len(sys.argv)>1 else 'site').resolve()
    if not site.is_dir():
        print(f'[FAIL] site directory not found: {site}', file=sys.stderr)
        return 2
    broken=[]
    checked=0
    for html in site.rglob('*.html'):
        parser=LinkParser()
        parser.feed(html.read_text(encoding='utf-8', errors='replace'))
        for tag,key,target in parser.links:
            checked += 1
            if not target_exists(site,html,target):
                broken.append((html.relative_to(site).as_posix(),target))
    print(f'[INFO] checked href/src references: {checked}')
    if broken:
        for source,target in broken:
            print(f'[FAIL] {source} -> {target}')
        print(f'[FAIL] broken/unsafe references: {len(broken)}')
        return 1
    print('[ OK ] generated site links are internally consistent')
    return 0

if __name__=='__main__':
    raise SystemExit(main())
