# IDPS LabBox v0.1

Минимальная учебная среда для ЛР №1 курса IDPS.

## Что создаёт LabBox

LabBox использует одну Ubuntu VM и Linux network namespaces:

```text
idps-client                          idps-web
10.13.37.10                         10.13.37.20
     │                                  │
     │ eth0                             │ eth0
     │                                  │
lab-client0 ─────── br-idps ─────── lab-web0
     ▲
     │
observation interface
для passive NIDS
```

Web-сервис слушает `10.13.37.20:8080`.

Suricata **не устанавливается и не настраивается скриптами LabBox**.
Это часть работы студента.

## Требования

- Ubuntu 24.04 LTS;
- root/sudo;
- `iproute2`;
- `python3`.

Для выполнения самой лабораторной дополнительно понадобятся:

- Suricata;
- `jq`;
- `curl`;
- `tcpdump`.

## Запуск

Из корня LabBox:

```bash
sudo bash scripts/lab-init.sh
sudo bash scripts/lab-status.sh
bash scripts/lab-topology.sh
```

Сброс:

```bash
sudo bash scripts/lab-reset.sh
```

Экспорт evidence после выполнения лабораторной:

```bash
sudo bash scripts/lab-check.sh --export
```

Файл `lab01-evidence.zip` будет создан в каталоге `evidence/`.

## Что LabBox намеренно НЕ делает

- не устанавливает Suricata;
- не изменяет `/etc/suricata/suricata.yaml`;
- не создаёт правила за студента;
- не запускает IDS автоматически;
- не скрывает используемый observation interface.

Цель LabBox — обеспечить воспроизводимый сетевой стенд, а не автоматизировать саму лабораторную работу.
