#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "[ ERROR ] Запустите скрипт через sudo: sudo bash bootstrap-server.sh" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "[1/5] Обновление списка пакетов..."
apt-get update

echo "[2/5] Установка базовых инструментов серверной VM..."
apt-get install -y \
  ca-certificates software-properties-common python3 curl jq tcpdump \
  auditd audispd-plugins ethtool unzip openssh-server \
  iproute2 iputils-ping net-tools

echo "[3/5] Установка поддерживаемой ветки Suricata 8.x..."
get_suricata_major() {
  command -v suricata >/dev/null 2>&1 || return 1
  suricata -V 2>/dev/null | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1 | cut -d. -f1
}

SURICATA_MAJOR="$(get_suricata_major || true)"
if [[ "$SURICATA_MAJOR" != "8" ]]; then
  echo "[ INFO ] Требуется Suricata 8.x; текущая major-версия: ${SURICATA_MAJOR:-не установлена}."
  if add-apt-repository -y ppa:oisf/suricata-stable; then
    apt-get update
    apt-get install -y suricata
  else
    echo "[ ERROR ] Не удалось подключить официальный stable PPA OISF для установки Suricata 8.x." >&2
    echo "[ ERROR ] Не продолжайте лаборатории на неподдерживаемой ветке: подготовьте пакет/образ с Suricata 8.x." >&2
    exit 1
  fi
fi

SURICATA_MAJOR="$(get_suricata_major || true)"
if [[ "$SURICATA_MAJOR" != "8" ]]; then
  echo "[ ERROR ] После установки обнаружена неподдерживаемая major-версия Suricata: ${SURICATA_MAJOR:-не определена}." >&2
  exit 1
fi

echo "[4/5] Включение необходимых служб..."
systemctl enable --now auditd
systemctl enable --now ssh

# Системный сервис Suricata не нужен для лабораторий: студент запускает Suricata вручную
# на выбранном учебном интерфейсе. Останавливаем его, чтобы избежать двух экземпляров.
if systemctl is-active --quiet suricata 2>/dev/null; then
  systemctl stop suricata
fi

echo "[5/5] Проверка установленных команд..."
for cmd in python3 curl jq tcpdump suricata auditctl ausearch ethtool unzip ssh ip ping; do
  command -v "$cmd" >/dev/null || { echo "[ ERROR ] Не найдена команда: $cmd" >&2; exit 1; }
done

echo
suricata --build-info 2>/dev/null | sed -n '1,8p' || true

echo
cat <<'MSG'
[ OK ] Базовые пакеты серверной VM установлены.

Следующие действия выполняются вручную:
1. Настройте hostname: idps-server (рекомендуется).
2. Настройте учебный интерфейс: 10.13.37.20/24, без шлюза.
3. Оставьте NAT-интерфейс для доступа в Интернет.
4. Запустите: sudo bash check-server-environment.sh
MSG
