#!/usr/bin/env bash
set -u
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fail=0; warn=0
ok(){ echo "[ OK ] $*"; }
bad(){ echo "[FAIL] $*"; fail=1; }
wrn(){ echo "[WARN] $*"; warn=$((warn+1)); }
for cmd in ip curl jq tcpdump timeout suricata ethtool python3 ss; do command -v "$cmd" >/dev/null 2>&1 && ok "команда: $cmd" || bad "не найдена команда: $cmd"; done
LAB_IFACE="$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')"
[[ -n "$LAB_IFACE" ]] && ok "LAB_IFACE=$LAB_IFACE" || bad 'не найден интерфейс 10.13.37.20/24'
systemctl is-active --quiet idps-lab-web.service && ok 'web-сервис запущен' || bad 'web-сервис не запущен'
curl -fsS http://10.13.37.20:8080/health >/dev/null 2>&1 && ok 'web-сервис отвечает' || bad 'web-сервис не отвечает'
[[ -f /var/tmp/idps-lab/lab4-access.jsonl ]] && ok 'журнал lab4-access.jsonl существует' || bad 'нет lab4-access.jsonl'
if ss -ltn 2>/dev/null | grep -Eq '10\.13\.37\.20:8080[[:space:]]'; then ok 'TCP/8080 привязан к 10.13.37.20'; else bad 'TCP/8080 не привязан строго к 10.13.37.20'; fi
[[ -f /etc/suricata/suricata.yaml ]] && ok 'suricata.yaml существует' || bad 'нет /etc/suricata/suricata.yaml'
if command -v suricata >/dev/null 2>&1 && [[ -f /etc/suricata/suricata.yaml ]]; then
  suricata -T -c /etc/suricata/suricata.yaml -S "$SCRIPT_DIR/lab04.rules" >/tmp/lab04-suricata-test.log 2>&1 && ok 'Suricata принимает lab04.rules' || bad 'suricata -T не пройден; см. /tmp/lab04-suricata-test.log'
fi
if [[ -n "$LAB_IFACE" ]] && command -v ethtool >/dev/null 2>&1; then
  if ethtool -k "$LAB_IFACE" >/tmp/lab04-ethtool.txt 2>/dev/null; then
    if grep -Eq '^(generic-receive-offload|large-receive-offload): on' /tmp/lab04-ethtool.txt; then wrn 'GRO/LRO включён; выполните sudo bash server/prepare-capture.sh'; else ok 'GRO/LRO не включены'; fi
  fi
fi
if [[ $fail -eq 0 ]]; then echo 'SERVER PRE-FLIGHT PASSED.'; ((warn>0)) && echo "Предупреждений: $warn"; else echo 'SERVER PRE-FLIGHT FAILED.'; fi
exit $fail
