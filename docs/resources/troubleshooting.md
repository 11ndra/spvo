# Troubleshooting

## Локальный запуск

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
mkdocs serve
```

## GitHub Desktop

```text
Changes → Commit to main → Push origin
```

После push дождитесь успешного workflow `Deploy GitHub Pages`.


## tcpdump видит пакет, а Suricata ведёт себя иначе

В виртуальной машине сначала проверьте не правило, а сетевой тракт:

```bash
ethtool -k <интерфейс>
```

GRO/LRO/GSO/TSO и checksum offloading могут менять представление пакетов внутри гостевой ОС. В лабораторных, где это существенно, используйте предоставленный `prepare-capture.sh`. Live-запуски Suricata выполняются с `-k none`, поэтому checksum validation отключается для конкретного учебного процесса, а не глобально.

Если `tcpdump` показывает `bad cksum`, это само по себе ещё не доказывает повреждение пакета на сети: при checksum offloading контрольная сумма может быть вычислена позже по пути передачи.

## В eve.json появился «невозможный» старый alert

Не используйте общий журнал между независимыми опытами. В актуальной ЛР №3 каждый запуск Suricata пишет в отдельный предварительно очищенный каталог (`lab03-nat-run` и `lab03-lab-run`). Если вы изменили методику, сначала проверьте, что читаете `eve.json` именно текущего запуска.
