#!/usr/bin/env bash
LAB_IFACE="$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')"
if [[ -z "$LAB_IFACE" ]]; then
  echo '[FAIL] Не найден интерфейс с 10.13.37.20/24.' >&2
  return 1 2>/dev/null || exit 1
fi
export LAB_IFACE
echo "LAB_IFACE=$LAB_IFACE"
