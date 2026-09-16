#!/usr/bin/env python3
import json
import statistics
import sys
from pathlib import Path

LOG = Path('/var/tmp/idps-lab/lab4-access.jsonl')
THRESHOLD = 3.0

if not LOG.exists():
    print('[FAIL] Нет lab4-access.jsonl', file=sys.stderr)
    sys.exit(1)

rows = []
for line in LOG.read_text(encoding='utf-8').splitlines():
    if not line.strip():
        continue
    try:
        row = json.loads(line)
    except json.JSONDecodeError:
        continue
    if row.get('path') == '/lab4-anomaly' and row.get('phase') in {'baseline', 'test'}:
        rows.append(row)

baseline = [int(r.get('value_length', 0)) for r in rows if r.get('phase') == 'baseline']
tests = [int(r.get('value_length', 0)) for r in rows if r.get('phase') == 'test']

if len(baseline) < 5:
    print(f'[FAIL] Нужны минимум 5 baseline-наблюдений; найдено {len(baseline)}.', file=sys.stderr)
    sys.exit(2)
if not tests:
    print('[FAIL] Нет test-наблюдения.', file=sys.stderr)
    sys.exit(3)

mu = statistics.mean(baseline)
sigma = statistics.pstdev(baseline)
den = max(sigma, 1.0)
print(f'BASELINE n={len(baseline)} mean={mu:.2f} stdev={sigma:.2f}')
print(f'MODEL score=abs(value_length-mean)/max(stdev,1); threshold={THRESHOLD:.1f}')
for idx, value in enumerate(tests, 1):
    score = abs(value - mu) / den
    result = 'ANOMALY' if score > THRESHOLD else 'WITHIN_BASELINE'
    print(f'TEST {idx}: value_length={value} score={score:.2f} result={result}')
