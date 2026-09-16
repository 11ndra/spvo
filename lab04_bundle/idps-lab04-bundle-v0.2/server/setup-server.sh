#!/usr/bin/env bash
set -euo pipefail
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
install -d -m 0755 /opt/idps-lab4 /var/tmp/idps-lab
install -m 0755 "$SCRIPT_DIR/server.py" /opt/idps-lab4/server.py
install -m 0755 "$SCRIPT_DIR/detectors.py" /opt/idps-lab4/detectors.py
: > /var/tmp/idps-lab/lab4-access.jsonl
cat > /etc/systemd/system/idps-lab-web.service <<'UNIT'
[Unit]
Description=IDPS Lab 4 controlled HTTP service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/idps-lab4/server.py
Restart=on-failure
RestartSec=1

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable idps-lab-web.service >/dev/null
systemctl restart idps-lab-web.service
sleep 1
if curl -fsS http://10.13.37.20:8080/health >/dev/null; then
  echo '[ OK ] Учебный HTTP-сервис запущен на 10.13.37.20:8080.'
else
  echo '[FAIL] Учебный HTTP-сервис не отвечает.' >&2
  systemctl --no-pager --full status idps-lab-web.service || true
  exit 1
fi
