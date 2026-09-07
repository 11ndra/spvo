#!/usr/bin/env bash
set -euo pipefail

LABBOX_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="/run/idps-labbox"

CLIENT_NS="idps-client"
WEB_NS="idps-web"
BRIDGE="br-idps"
CLIENT_HOST_IF="lab-client0"
WEB_HOST_IF="lab-web0"

CLIENT_IP="10.13.37.10"
WEB_IP="10.13.37.20"
PREFIX="24"
WEB_PORT="8080"

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "Run this script with sudo/root." >&2
    exit 1
  fi
}

have() {
  command -v "$1" >/dev/null 2>&1
}


require_root

if [[ -f "$STATE_DIR/web.pid" ]]; then
  WEB_PID="$(cat "$STATE_DIR/web.pid" 2>/dev/null || true)"
  if [[ -n "${WEB_PID}" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
fi

ip netns del "$CLIENT_NS" 2>/dev/null || true
ip netns del "$WEB_NS" 2>/dev/null || true
ip link del "$CLIENT_HOST_IF" 2>/dev/null || true
ip link del "$WEB_HOST_IF" 2>/dev/null || true
ip link del "$BRIDGE" 2>/dev/null || true

rm -rf "$STATE_DIR"

echo "LabBox network objects removed."
echo "Suricata installation/configuration was not changed."
