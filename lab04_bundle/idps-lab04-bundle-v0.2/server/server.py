#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

HOST = "10.13.37.20"
PORT = 8080
LOG = Path("/var/tmp/idps-lab/lab4-access.jsonl")


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class Handler(BaseHTTPRequestHandler):
    server_version = "IDPS-Lab4/2.0"

    def _write_event(self):
        parsed = urlsplit(self.path)
        query = parse_qs(parsed.query, keep_blank_values=True)
        dst_ip, dst_port = self.connection.getsockname()[:2]
        src_ip, src_port = self.client_address[:2]
        value = query.get("value", [""])[0]
        phase = query.get("phase", [""])[0]
        record = {
            "timestamp": now_iso(),
            "src_ip": src_ip,
            "src_port": src_port,
            "dst_ip": dst_ip,
            "dst_port": dst_port,
            "method": self.command,
            "path": parsed.path,
            "query": parsed.query,
            "uri": self.path,
            "phase": phase,
            "value_length": len(value),
        }
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")

    def do_GET(self):
        parsed = urlsplit(self.path)
        if parsed.path == "/health":
            body = b"OK\n"
        else:
            self._write_event()
            body = b"LAB4 OK\n"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        return


if __name__ == "__main__":
    LOG.parent.mkdir(parents=True, exist_ok=True)
    LOG.touch(exist_ok=True)
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
