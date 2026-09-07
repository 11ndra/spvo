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

for cmd in ip python3; do
  if ! have "$cmd"; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
done

mkdir -p "$STATE_DIR"

# Remove only objects owned by this LabBox.
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

ip netns add "$CLIENT_NS"
ip netns add "$WEB_NS"

ip link add "$CLIENT_HOST_IF" type veth peer name client-ns0
ip link add "$WEB_HOST_IF" type veth peer name web-ns0

ip link set client-ns0 netns "$CLIENT_NS"
ip link set web-ns0 netns "$WEB_NS"

ip -n "$CLIENT_NS" link set client-ns0 name eth0
ip -n "$WEB_NS" link set web-ns0 name eth0

ip link add "$BRIDGE" type bridge
ip link set "$BRIDGE" up

ip link set "$CLIENT_HOST_IF" master "$BRIDGE"
ip link set "$WEB_HOST_IF" master "$BRIDGE"
ip link set "$CLIENT_HOST_IF" up
ip link set "$WEB_HOST_IF" up

ip -n "$CLIENT_NS" link set lo up
ip -n "$WEB_NS" link set lo up
ip -n "$CLIENT_NS" addr add "${CLIENT_IP}/${PREFIX}" dev eth0
ip -n "$WEB_NS" addr add "${WEB_IP}/${PREFIX}" dev eth0
ip -n "$CLIENT_NS" link set eth0 up
ip -n "$WEB_NS" link set eth0 up

WEBROOT="${LABBOX_ROOT}/webroot"
WEB_LOG="${STATE_DIR}/web.log"

ip netns exec "$WEB_NS" bash -c \
  "nohup python3 -m http.server ${WEB_PORT} --bind ${WEB_IP} --directory '${WEBROOT}' > '${WEB_LOG}' 2>&1 & echo \$! > '${STATE_DIR}/web.pid'"

# Wait for the service from the client namespace without requiring curl.
READY=0
for _ in $(seq 1 20); do
  if ip netns exec "$CLIENT_NS" python3 -c \
    "import urllib.request; urllib.request.urlopen('http://${WEB_IP}:${WEB_PORT}/', timeout=0.5).read()" \
    >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.15
done

if [[ "$READY" -ne 1 ]]; then
  echo "LabBox network was created, but the HTTP service did not become ready." >&2
  echo "Check: ${WEB_LOG}" >&2
  exit 1
fi

cat <<EOF
LabBox v0.1 is ready.

Client namespace : ${CLIENT_NS} (${CLIENT_IP}/${PREFIX})
Web namespace    : ${WEB_NS} (${WEB_IP}/${PREFIX})
Web service      : http://${WEB_IP}:${WEB_PORT}/
Observation iface: ${CLIENT_HOST_IF}

Next:
  sudo bash scripts/lab-status.sh
  bash scripts/lab-topology.sh
EOF
