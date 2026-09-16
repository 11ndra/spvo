#!/usr/bin/env python3
import argparse
import json
import math
from collections import defaultdict, deque
from datetime import datetime
from pathlib import Path

DEFAULT_LOG = Path("/var/tmp/idps-lab/lab4-access.jsonl")


def parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def load_events(path: Path):
    events = []
    if not path.exists():
        raise SystemExit(f"Журнал не найден: {path}")
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"Некорректный JSON в строке {n}: {exc}") from exc
        events.append(event)
    return events


def signature(events, marker):
    hits = [e for e in events if marker in str(e.get("uri", ""))]
    print("РЕЖИМ: сигнатурное условие")
    print(f"УСЛОВИЕ: uri содержит {marker!r}")
    print(f"СОБЫТИЙ В ЖУРНАЛЕ: {len(events)}")
    for e in hits:
        print(
            "СРАБАТЫВАНИЕ: "
            f"timestamp={e.get('timestamp')} src={e.get('src_ip')} "
            f"uri={e.get('uri')}"
        )
    print(f"ИТОГ: срабатываний={len(hits)}")
    return 0


def behavior(events, path, count, window):
    selected = [
        e for e in events
        if e.get("path") == path and e.get("src_ip") and e.get("timestamp")
    ]
    selected.sort(key=lambda e: parse_time(e["timestamp"]))
    windows = defaultdict(deque)
    first_hit = None
    for e in selected:
        src = e["src_ip"]
        current = parse_time(e["timestamp"])
        q = windows[src]
        q.append(current)
        while q and (current - q[0]).total_seconds() > window:
            q.popleft()
        if len(q) >= count:
            first_hit = (src, e["timestamp"], len(q))
            break

    print("РЕЖИМ: детерминированное поведенческое условие")
    print(f"УСЛОВИЕ: path={path!r}; не менее {count} событий от одного источника за {window} с")
    print(f"ПОДХОДЯЩИХ СОБЫТИЙ: {len(selected)}")
    if first_hit:
        src, timestamp, observed = first_hit
        print(f"СРАБАТЫВАНИЕ: timestamp={timestamp} src={src} count={observed}")
        print("ИТОГ: ОБНАРУЖЕНО")
    else:
        print("ИТОГ: НЕ ОБНАРУЖЕНО")
    return 0


def anomaly(events, threshold):
    baseline = [
        int(e.get("value_length", 0))
        for e in events
        if e.get("path") == "/lab4-anomaly" and e.get("phase") == "baseline"
    ]
    tests = [
        e for e in events
        if e.get("path") == "/lab4-anomaly" and e.get("phase") == "test"
    ]
    if len(baseline) < 2:
        raise SystemExit("Для базовой линии нужно как минимум два наблюдения phase=baseline.")
    if not tests:
        raise SystemExit("Не найдено ни одного наблюдения phase=test.")

    mean = sum(baseline) / len(baseline)
    variance = sum((x - mean) ** 2 for x in baseline) / len(baseline)
    stdev = math.sqrt(variance)
    denominator = max(stdev, 1.0)

    print(f"БАЗОВАЯ ЛИНИЯ: n={len(baseline)} mean={mean:.2f} stdev={stdev:.2f}")
    print("МОДЕЛЬ: score=abs(value_length-mean)/max(stdev,1)")
    print(f"ПОРОГ: score > {threshold:.2f}")
    for n, event in enumerate(tests, 1):
        value = int(event.get("value_length", 0))
        score = abs(value - mean) / denominator
        result = "АНОМАЛИЯ" if score > threshold else "В ПРЕДЕЛАХ МОДЕЛИ"
        print(
            f"НАБЛЮДЕНИЕ {n}: value_length={value} "
            f"score={score:.2f} result={result}"
        )
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Учебные детекторы для ЛР №4. Не является промышленной IDS."
    )
    parser.add_argument("mode", choices=["signature", "behavior", "anomaly"])
    parser.add_argument("--log", type=Path, default=DEFAULT_LOG)
    parser.add_argument("--marker", default="LAB4-SIGNATURE")
    parser.add_argument("--path", default="/lab4-fail-login")
    parser.add_argument("--count", type=int, default=5)
    parser.add_argument("--window", type=float, default=10.0)
    parser.add_argument("--threshold", type=float, default=3.0)
    args = parser.parse_args()

    events = load_events(args.log)
    if args.mode == "signature":
        return signature(events, args.marker)
    if args.mode == "behavior":
        return behavior(events, args.path, args.count, args.window)
    return anomaly(events, args.threshold)


if __name__ == "__main__":
    raise SystemExit(main())
