#!/usr/bin/env bash
set -euo pipefail
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ip -o -4 addr show | grep -q '10\.13\.37\.20/' || { echo '[FAIL] На сервере нет адреса 10.13.37.20/24.' >&2; ip -br addr; exit 1; }
for cmd in python3 curl; do command -v "$cmd" >/dev/null || { echo "[FAIL] Не найдена команда: $cmd" >&2; exit 1; }; done
install -d /opt/idps-lab /var/tmp/idps-lab
install -m 0755 "$SCRIPT_DIR/server.py" /opt/idps-lab/lab4-server.py
: > /var/tmp/idps-lab/lab4-access.jsonl
chmod 0644 /var/tmp/idps-lab/lab4-access.jsonl
cat >/etc/systemd/system/idps-lab-web.service <<'UNIT'
[Unit]
Description=IDPS course laboratory web service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/idps-lab/lab4-server.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable idps-lab-web.service >/dev/null 2>&1 || true
systemctl restart idps-lab-web.service
sleep 1
if ! curl -fsS http://10.13.37.20:8080/health >/dev/null; then
  echo '[FAIL] Web-сервис не отвечает на 10.13.37.20:8080.' >&2
  systemctl status idps-lab-web.service --no-pager || true
  exit 1
fi
printf '[ OK ] Учебный web-сервис: 10.13.37.20:8080\n'
printf '[ OK ] Журнал: /var/tmp/idps-lab/lab4-access.jsonl\n'
