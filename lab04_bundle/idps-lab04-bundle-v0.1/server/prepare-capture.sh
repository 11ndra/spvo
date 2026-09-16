#!/usr/bin/env bash
set -u
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
command -v ethtool >/dev/null 2>&1 || { echo '[WARN] ethtool не установлен; offloading не менялся.'; exit 0; }
LAB_IFACE="$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')"
[[ -n "$LAB_IFACE" ]] || { echo '[FAIL] Не найден интерфейс 10.13.37.20/24.' >&2; exit 1; }
echo "LAB_IFACE=$LAB_IFACE"
for feature in rx tx gro gso tso lro; do
  ethtool -K "$LAB_IFACE" "$feature" off >/dev/null 2>&1 || echo "[WARN] $LAB_IFACE: не удалось отключить $feature"
done
ethtool -k "$LAB_IFACE" | grep -E '^(rx-checksumming|tx-checksumming|generic-receive-offload|generic-segmentation-offload|tcp-segmentation-offload|large-receive-offload):' || true
