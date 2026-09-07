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

if [[ "${1:-}" != "--export" ]]; then
  cat <<EOF
Usage:
  sudo bash scripts/lab-check.sh --export

This command exports Lab №1 evidence.
It does not grade interpretation questions in the report.
EOF
  exit 0
fi

OUT_ROOT="${LABBOX_ROOT}/evidence"
OUT="${OUT_ROOT}/lab01"
ZIP="${OUT_ROOT}/lab01-evidence.zip"
SURICATA_CONF="/etc/suricata/suricata.yaml"
SURICATA_LOG="/var/log/suricata-lab/eve.json"

rm -rf "$OUT"
mkdir -p "$OUT"

"${LABBOX_ROOT}/scripts/lab-topology.sh" > "$OUT/topology.txt"

{
  echo "=== host links ==="
  ip -br link
  echo
  echo "=== ${CLIENT_NS} ==="
  ip -n "$CLIENT_NS" -br addr
  echo
  echo "=== ${WEB_NS} ==="
  ip -n "$WEB_NS" -br addr
} > "$OUT/interfaces.txt" 2>&1

if have suricata; then
  suricata --build-info > "$OUT/suricata-build-info.txt" 2>&1 || true
else
  echo "Suricata command not found." > "$OUT/suricata-build-info.txt"
fi

if [[ -f "$SURICATA_CONF" ]] && have suricata; then
  suricata -T -c "$SURICATA_CONF" > "$OUT/config-test.txt" 2>&1 || true
else
  echo "Cannot run configuration test: Suricata/config not found." > "$OUT/config-test.txt"
fi

RULE_FOUND=""
for candidate in \
  /etc/suricata/rules/local.rules \
  /var/lib/suricata/rules/local.rules
do
  if [[ -f "$candidate" ]]; then
    cp "$candidate" "$OUT/local.rules"
    RULE_FOUND="$candidate"
    break
  fi
done

if [[ -z "$RULE_FOUND" ]]; then
  echo "local.rules was not found in common locations." > "$OUT/local.rules"
fi

if have curl; then
  {
    echo '$ curl http://10.13.37.20:8080/'
    ip netns exec "$CLIENT_NS" curl -sS -D - "http://${WEB_IP}:${WEB_PORT}/"
  } > "$OUT/normal-request.txt" 2>&1 || true

  {
    echo '$ curl http://10.13.37.20:8080/lab-test'
    ip netns exec "$CLIENT_NS" curl -sS -D - "http://${WEB_IP}:${WEB_PORT}/lab-test"
  } > "$OUT/detection-request.txt" 2>&1 || true
else
  echo "curl not installed." > "$OUT/normal-request.txt"
  echo "curl not installed." > "$OUT/detection-request.txt"
fi

if have tcpdump && have curl; then
  (
    timeout 5 tcpdump -nn -i "$CLIENT_HOST_IF" -c 10 "tcp port ${WEB_PORT}" \
      > "$OUT/packet-sample.txt" 2>&1
  ) &
  TCPDUMP_PID=$!
  sleep 0.4
  ip netns exec "$CLIENT_NS" curl -sS "http://${WEB_IP}:${WEB_PORT}/lab-test" >/dev/null 2>&1 || true
  wait "$TCPDUMP_PID" 2>/dev/null || true
else
  echo "tcpdump and/or curl not installed." > "$OUT/packet-sample.txt"
fi

if [[ -f "$SURICATA_LOG" ]] && have jq; then
  jq -c '
    select(
      .event_type == "alert"
      and (
        .alert.signature_id == 1000001
        or .alert.signature_id == 1000002
      )
    )
  ' "$SURICATA_LOG" > "$OUT/alerts.json" 2>/dev/null || true

  if [[ ! -s "$OUT/alerts.json" ]]; then
    echo "No LAB1 alerts (SID 1000001/1000002) found." > "$OUT/alerts.json"
  fi
else
  echo "EVE log or jq not available: ${SURICATA_LOG}" > "$OUT/alerts.json"
fi

{
  echo "Generated: $(date --iso-8601=seconds)"
  echo "Suricata process:"
  pgrep -af suricata || true
} > "$OUT/runtime.txt"

(
  cd "$OUT"
  sha256sum ./* > sha256sums.txt
)

rm -f "$ZIP"
python3 - "$OUT" "$ZIP" <<'PY'
from pathlib import Path
import sys, zipfile

src = Path(sys.argv[1])
dst = Path(sys.argv[2])

with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(src.iterdir()):
        if p.is_file():
            z.write(p, Path("lab01") / p.name)
PY

echo "Evidence exported:"
echo "  ${ZIP}"
echo
echo "This archive proves collected technical evidence only."
echo "Interpretation and conclusions still belong in lab01-report.md."
