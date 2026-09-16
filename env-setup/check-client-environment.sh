#!/usr/bin/env bash
set -u

fail=0
warn=0
ok(){ printf '[ OK ] %s\n' "$*"; }
err(){ printf '[FAIL] %s\n' "$*"; fail=$((fail+1)); }
wrn(){ printf '[WARN] %s\n' "$*"; warn=$((warn+1)); }

EXPECTED_IP="10.13.37.10"
PEER_IP="10.13.37.20"

printf 'Проверка клиентской VM (%s)\n\n' "$(hostname)"

if ip -o -4 addr show | grep -q " ${EXPECTED_IP}/24"; then
  ok "Учебный адрес ${EXPECTED_IP}/24 найден"
else
  err "Не найден учебный адрес ${EXPECTED_IP}/24"
fi

if ip route show default | grep -q '^default '; then
  ok "Маршрут по умолчанию присутствует (обычно NAT)"
else
  wrn "Нет маршрута по умолчанию; Интернет для установки пакетов может быть недоступен"
fi

for cmd in curl jq tcpdump unzip ip ping; do
  if command -v "$cmd" >/dev/null 2>&1; then ok "Команда $cmd доступна"; else err "Команда $cmd не найдена"; fi
done

if ping -c 2 -W 2 "$PEER_IP" >/dev/null 2>&1; then
  ok "Сервер ${PEER_IP} доступен по учебной сети"
else
  err "Нет ответа от ${PEER_IP}. Проверьте второй адаптер, имя Internal Network и адрес сервера"
fi

if [[ "$(hostname)" == "idps-client" ]]; then
  ok "Hostname: idps-client"
else
  wrn "Hostname отличается от рекомендуемого idps-client: $(hostname)"
fi

printf '\n'
if (( fail == 0 )); then
  echo "CLIENT ENVIRONMENT READY"
  (( warn > 0 )) && echo "Предупреждений: $warn"
  exit 0
else
  echo "CLIENT ENVIRONMENT NOT READY — ошибок: $fail, предупреждений: $warn"
  exit 1
fi
