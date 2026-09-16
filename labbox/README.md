# IDPS LabBox v0.2

Минимальная учебная среда для вводных лабораторных работ курса IDPS.

## Что создаёт LabBox

LabBox использует одну Ubuntu VM и два Linux network namespace:

```text
idps-client                          idps-web
10.13.37.10                         10.13.37.20
     │                                  │
     │ eth0                             │ eth0
     │                                  │
lab-client0 ─────── br-idps ─────── lab-web0
     ▲
     │
интерфейс наблюдения
для пассивного NIDS
```

Web-сервис слушает `10.13.37.20:8080`.

Важно: `idps-client` и `idps-web` — это **сетевые пространства имён, а не отдельные виртуальные машины**. Они разделяют файловую систему базовой Ubuntu VM. Это сделано специально, чтобы стенд помещался в одну VM и был воспроизводим на учебных компьютерах.

## Что изменено в v0.2

- вместо стандартного `python3 -m http.server` используется небольшой учебный HTTP-сервер;
- добавлен безопасный endpoint `/lab2-trigger/LAB2-NET`, который создаёт `/var/tmp/idps-lab/lab2-evidence.txt` для ЛР №2;
- при наличии `ethtool` LabBox пытается отключить GRO/GSO/TSO/LRO на виртуальных интерфейсах, чтобы снизить влияние offloading на пакетный анализ;
- обычные URL по-прежнему обслуживаются как статические файлы, поэтому ЛР №1 совместима со стендом.

Suricata **не устанавливается и не настраивается скриптами LabBox**.

## Базовые требования

- Ubuntu 24.04 LTS;
- root/sudo;
- `iproute2`;
- `python3`;
- `ethtool` (используется для отключения GRO/GSO/TSO/LRO на виртуальных интерфейсах).

Для лабораторных работ дополнительно используются Suricata, `jq`, `curl`, `tcpdump`; для ЛР №2 — пакет `auditd` (`auditctl`, `ausearch`).

## Запуск

```bash
sudo bash scripts/lab-init.sh
sudo bash scripts/lab-status.sh
bash scripts/lab-topology.sh
```

Сброс:

```bash
sudo bash scripts/lab-reset.sh
```

## Что LabBox намеренно НЕ делает

- не устанавливает Suricata;
- не изменяет `/etc/suricata/suricata.yaml`;
- не создаёт правила Suricata за студента;
- не запускает IDS автоматически;
- не делает вид, будто network namespace является отдельным хостом.

Цель LabBox — обеспечить контролируемый учебный стенд, а не скрыть от студента устройство эксперимента.
