#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

EVIDENCE_DIR = Path('/var/tmp/idps-lab')
EVIDENCE_FILE = EVIDENCE_DIR / 'lab2-evidence.txt'


class LabHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):  # noqa: N802 - required by BaseHTTPRequestHandler
        parsed = urlparse(self.path)
        if parsed.path == '/lab2-trigger/LAB2-NET':
            EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
            EVIDENCE_FILE.write_text(
                'LAB2-HOST\n'
                f'timestamp={datetime.now(timezone.utc).isoformat()}\n',
                encoding='utf-8',
            )
            body = (
                'LAB2 event created\n'
                f'file={EVIDENCE_FILE}\n'
            ).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--bind', required=True)
    parser.add_argument('--port', required=True, type=int)
    parser.add_argument('--directory', required=True)
    args = parser.parse_args()

    def handler(*handler_args, **handler_kwargs):
        return LabHandler(*handler_args, directory=args.directory, **handler_kwargs)

    server = ThreadingHTTPServer((args.bind, args.port), handler)
    server.serve_forever()


if __name__ == '__main__':
    main()
