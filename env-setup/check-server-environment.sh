#!/usr/bin/env bash
set -u

if [[ $EUID -ne 0 ]]; then
  echo "[ ERROR ] Запустите через sudo: sudo bash check-server-environment.sh" >&2
  exit 2
fi

fail=0
warn=0
ok(){ printf '[ OK ] %s\n' "$*"; }
err(){ printf '[FAIL] %s\n' "$*"; fail=$((fail+1)); }
wrn(){ printf '[WARN] %s\n' "$*"; warn=$((warn+1)); }

EXPECTED_IP="10.13.37.20"
PEER_IP="10.13.37.10"

printf 'Проверка серверной VM (%s)\n\n' "$(hostname)"

if ip -o -4 addr show | grep -q " ${EXPECTED_IP}/24"; then
  ok "Учебный адрес ${EXPECTED_IP}/24 найден"
else
  err "Не найден учебный адрес ${EXPECTED_IP}/24"
fi

LAB_IFACE=$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')
if [[ -n "${LAB_IFACE:-}" ]]; then ok "Учебный интерфейс: $LAB_IFACE"; else err "Не удалось определить учебный интерфейс"; fi

if ip route show default | grep -q '^default '; then
  ok "Маршрут по умолчанию присутствует (обычно NAT)"
else
  wrn "Нет маршрута по умолчанию; Интернет для установки пакетов может быть недоступен"
fi

for cmd in python3 curl jq tcpdump suricata auditctl ausearch ethtool unzip ip ping; do
  if command -v "$cmd" >/dev/null 2>&1; then ok "Команда $cmd доступна"; else err "Команда $cmd не найдена"; fi
done

if command -v suricata >/dev/null 2>&1; then
  SURICATA_VERSION=$(suricata -V 2>/dev/null | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1 || true)
  SURICATA_MAJOR=${SURICATA_VERSION%%.*}
  if [[ "$SURICATA_MAJOR" == "8" ]]; then
    ok "Suricata ${SURICATA_VERSION} соответствует поддерживаемой ветке 8.x"
  else
    err "Требуется Suricata 8.x; обнаружена версия ${SURICATA_VERSION:-не определена}"
  fi
fi

if ping -c 2 -W 2 "$PEER_IP" >/dev/null 2>&1; then
  ok "Клиент ${PEER_IP} доступен по учебной сети"
else
  err "Нет ответа от ${PEER_IP}. Проверьте второй адаптер, имя Internal Network и адрес клиента"
fi

if systemctl is-active --quiet auditd; then ok "auditd запущен"; else err "auditd не запущен"; fi

if auditctl -s 2>/dev/null | grep -Eq '^enabled[[:space:]]+1'; then
  ok "Linux Audit включён (enabled 1)"
else
  err "Linux Audit не находится в состоянии enabled 1"
fi

if auditctl -l 2>/dev/null | grep -q -- '-a never,task'; then
  wrn "Найдено правило never,task — оно может мешать некоторым audit-событиям"
fi

if [[ -f /etc/suricata/suricata.yaml ]]; then
  ok "Найдена конфигурация /etc/suricata/suricata.yaml"
  EMPTY_RULES=$(mktemp)
  if suricata -T -c /etc/suricata/suricata.yaml -S "$EMPTY_RULES" >/tmp/idps-suricata-test.log 2>&1; then
    ok "Suricata проходит проверку базовой конфигурации"
  else
    err "Suricata не проходит -T; см. /tmp/idps-suricata-test.log"
  fi
  rm -f "$EMPTY_RULES"
else
  err "Не найден /etc/suricata/suricata.yaml"
fi

if [[ "$(hostname)" == "idps-server" ]]; then
  ok "Hostname: idps-server"
else
  wrn "Hostname отличается от рекомендуемого idps-server: $(hostname)"
fi

printf '\n'
if (( fail == 0 )); then
  echo "SERVER ENVIRONMENT READY"
  (( warn > 0 )) && echo "Предупреждений: $warn"
  exit 0
else
  echo "SERVER ENVIRONMENT NOT READY — ошибок: $fail, предупреждений: $warn"
  exit 1
fi
