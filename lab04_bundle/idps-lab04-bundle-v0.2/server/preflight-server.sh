#!/usr/bin/env bash
set -u
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
fail=0
ok(){ echo "[ OK ] $*"; }
bad(){ echo "[FAIL] $*"; fail=1; }
for cmd in ip curl jq python3 ss; do
  command -v "$cmd" >/dev/null 2>&1 && ok "команда: $cmd" || bad "не найдена команда: $cmd"
done
LAB_IFACE="$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')"
[[ -n "$LAB_IFACE" ]] && ok "учебный интерфейс: $LAB_IFACE" || bad 'не найден адрес 10.13.37.20/24'
ip route get 10.13.37.10 >/dev/null 2>&1 && ok 'маршрут к клиенту существует' || bad 'нет маршрута к 10.13.37.10'
systemctl is-active --quiet idps-lab-web.service && ok 'web-сервис запущен' || bad 'web-сервис не запущен'
curl -fsS http://10.13.37.20:8080/health >/dev/null 2>&1 && ok 'web-сервис отвечает' || bad 'web-сервис не отвечает'
if ss -ltn 2>/dev/null | grep -Eq '10\.13\.37\.20:8080[[:space:]]'; then
  ok 'TCP/8080 привязан к 10.13.37.20'
else
  bad 'TCP/8080 не привязан строго к 10.13.37.20'
fi
[[ -f /var/tmp/idps-lab/lab4-access.jsonl ]] && ok 'журнал событий существует' || bad 'нет lab4-access.jsonl'
[[ -x /opt/idps-lab4/detectors.py ]] && ok 'учебный анализатор установлен' || bad 'нет /opt/idps-lab4/detectors.py'
if [[ $fail -eq 0 ]]; then echo 'SERVER PRE-FLIGHT PASSED.'; else echo 'SERVER PRE-FLIGHT FAILED.'; fi
exit $fail
