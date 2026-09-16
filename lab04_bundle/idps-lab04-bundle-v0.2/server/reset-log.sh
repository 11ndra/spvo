#!/usr/bin/env bash
set -euo pipefail
if [[ $EUID -ne 0 ]]; then echo '[FAIL] Запустите через sudo.' >&2; exit 1; fi
install -d -m 0755 /var/tmp/idps-lab
: > /var/tmp/idps-lab/lab4-access.jsonl
echo '[ OK ] Журнал ЛР №4 очищен.'
