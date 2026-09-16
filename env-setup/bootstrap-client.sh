#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "[ ERROR ] Запустите скрипт через sudo: sudo bash bootstrap-client.sh" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "[1/3] Обновление списка пакетов..."
apt-get update

echo "[2/3] Установка инструментов клиентской VM..."
apt-get install -y \
  ca-certificates curl jq tcpdump unzip openssh-client \
  iproute2 iputils-ping net-tools

echo "[3/3] Проверка установленных команд..."
for cmd in curl jq tcpdump unzip ssh ip ping; do
  command -v "$cmd" >/dev/null || { echo "[ ERROR ] Не найдена команда: $cmd" >&2; exit 1; }
done

echo
cat <<'MSG'
[ OK ] Базовые пакеты клиентской VM установлены.

Следующие действия выполняются вручную:
1. Настройте hostname: idps-client (рекомендуется).
2. Настройте учебный интерфейс: 10.13.37.10/24, без шлюза.
3. Оставьте NAT-интерфейс для доступа в Интернет.
4. Запустите: bash check-client-environment.sh
MSG
