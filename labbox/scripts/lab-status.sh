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

ok=0
fail=0

check() {
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    printf "[ OK ] %s\n" "$label"
    ok=$((ok + 1))
  else
    printf "[FAIL] %s\n" "$label"
    fail=$((fail + 1))
  fi
}

check "namespace ${CLIENT_NS}" ip netns exec "$CLIENT_NS" true
check "namespace ${WEB_NS}" ip netns exec "$WEB_NS" true
check "bridge ${BRIDGE}" ip link show "$BRIDGE"
check "observation interface ${CLIENT_HOST_IF}" ip link show "$CLIENT_HOST_IF"
check "web-side interface ${WEB_HOST_IF}" ip link show "$WEB_HOST_IF"

check "client address ${CLIENT_IP}/${PREFIX}" \
  ip -n "$CLIENT_NS" addr show dev eth0

check "web address ${WEB_IP}/${PREFIX}" \
  ip -n "$WEB_NS" addr show dev eth0

if ip netns exec "$CLIENT_NS" python3 -c \
  "import urllib.request; r=urllib.request.urlopen('http://${WEB_IP}:${WEB_PORT}/', timeout=1); assert r.status == 200" \
  >/dev/null 2>&1; then
  printf "[ OK ] HTTP ${CLIENT_IP} -> ${WEB_IP}:${WEB_PORT}\n"
  ok=$((ok + 1))
else
  printf "[FAIL] HTTP ${CLIENT_IP} -> ${WEB_IP}:${WEB_PORT}\n"
  fail=$((fail + 1))
fi

if have suricata; then
  printf "[INFO] Suricata installed: %s\n" "$(suricata --build-info 2>/dev/null | sed -n '1p')"
else
  printf "[INFO] Suricata is not installed yet. This is expected before the installation stage.\n"
fi

printf "\nChecks passed: %d | failed: %d\n" "$ok" "$fail"

if [[ "$fail" -gt 0 ]]; then
  exit 1
fi
