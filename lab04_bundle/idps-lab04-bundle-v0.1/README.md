# IDPS Lab 04 bundle v0.1

Пакет для ЛР №4 «Одни данные — разные логики обнаружения».

Состав:
- `server/setup-server.sh` — разворачивает учебный HTTP-сервис на `10.13.37.20:8080`;
- `server/lab04.rules` — готовые правила Suricata для сигнатурного и частотного тестов;
- `server/anomaly_detector.py` — упрощённый учебный аномалийный детектор;
- `server/preflight-server.sh` — проверка готовности сервера;
- `server/prepare-capture.sh` — best-effort отключение offloading на LAB_IFACE;
- `client/check-client.sh` — проверка клиента;
- `report/lab04-report.md` — шаблон отчёта.

Правила предоставляются готовыми: синтаксис Suricata системно разбирается только в Главе 6.

Статус полного live-сценария: `RUNTIME QA REQUIRED` до end-to-end прогона на эталонных Ubuntu Desktop/Server 24.04.x с актуальной Suricata 8.
