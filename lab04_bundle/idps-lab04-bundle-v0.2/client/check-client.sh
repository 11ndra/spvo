#!/usr/bin/env bash
set -u
fail=0
ok(){ echo "[ OK ] $*"; }
bad(){ echo "[FAIL] $*"; fail=1; }
for cmd in ip curl; do command -v "$cmd" >/dev/null 2>&1 && ok "команда: $cmd" || bad "не найдена команда: $cmd"; done
CLIENT_IFACE="$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.10\// {print $2; exit}')"
[[ -n "$CLIENT_IFACE" ]] && ok "учебный интерфейс: $CLIENT_IFACE" || bad 'не найден адрес 10.13.37.10/24'
curl -fsS http://10.13.37.20:8080/health >/dev/null 2>&1 && ok 'сервер 10.13.37.20:8080 доступен' || bad 'сервер 10.13.37.20:8080 недоступен'
if [[ $fail -eq 0 ]]; then echo 'CLIENT CHECK PASSED.'; else echo 'CLIENT CHECK FAILED.'; fi
exit $fail
