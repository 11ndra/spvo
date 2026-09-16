# Лабораторная работа №3

## Точка наблюдения: один сервер, два сетевых пути

<div class="lab-header">
  <div><strong>Уровень:</strong> базовый</div>
  <div><strong>Инструменты:</strong> tcpdump, Suricata, curl, jq, ethtool</div>
  <div><strong>Теория:</strong> Глава 4 — размещение IDS/IPS</div>
</div>

<div class="chapter-lead">
<p>В этой работе вы не будете доказывать, что один интерфейс «хороший», а другой «плохой». Вы проверите более точное утверждение: <strong>каждая точка наблюдения подходит только для тех потоков, которые через неё действительно проходят</strong>.</p>
</div>
---

## Что должна доказать работа

Используются два контролируемых сетевых пути:

```text
ТЕСТ A — внутренний HTTP
idps-client 10.13.37.10
          ↓
LAB_IFACE idps-server 10.13.37.20:8080

ТЕСТ B — исходящий трафик сервера
idps-server
          ↓
NAT_IFACE
          ↓
шлюз по умолчанию
```

Если стенд настроен правильно, ожидается не «одна правильная карта», а **два зеркальных результата**:

```text
внутренний HTTP  → LAB_IFACE да, NAT_IFACE нет;
исходящий ICMP   → NAT_IFACE да, LAB_IFACE нет.
```

Это позволяет сделать более строгий вывод, чем простое «мы послушали не тот провод».

---

## Что необходимо до начала работы

Должна быть завершена [подготовка лабораторной среды](../environment/).

```text
idps-client   Ubuntu Desktop 24.04.x   10.13.37.10/24
idps-server   Ubuntu Server 24.04.x    10.13.37.20/24
```

На `idps-server` должны существовать два разных подключения:

```text
LAB_IFACE — интерфейс сети 10.13.37.0/24;
NAT_IFACE — интерфейс маршрута по умолчанию.
```

Перед работой прочитайте [Главу 4](../../course/04-detection-methods/).

[Скачать пакет ЛР №3 v0.2](../../assets/downloads/idps-lab03-bundle-v0.2.zip){ .md-button .md-button--primary }

---

## 1. Подготовьте сервер

На `idps-server`:

```bash
cd ~
unzip idps-lab03-bundle-v0.2.zip
cd idps-lab03-bundle-v0.2
sudo bash server/setup-server.sh
sudo bash server/prepare-capture.sh
sudo bash server/preflight-server.sh
```

Продолжайте только при:

```text
SERVER PRE-FLIGHT PASSED.
```

`prepare-capture.sh` пытается отключить offloading, который способен менять вид пакетов в виртуальном сетевом стеке. Если конкретный драйвер не позволяет отключить отдельный параметр, скрипт выводит предупреждение. Live-запуски Suricata в этой работе дополнительно используют `-k none`, поэтому checksum validation отключается только для учебного процесса Suricata.

!!! note
    Мы намеренно не меняем `suricata.yaml` глобально. Это локальная мера для воспроизводимого учебного эксперимента, а не production-рекомендация.

---

## 2. Проверьте клиент

На `idps-client`:

```bash
cd ~
unzip idps-lab03-bundle-v0.2.zip
cd idps-lab03-bundle-v0.2
bash client/check-client.sh
```

Продолжайте только при:

```text
CLIENT CHECK PASSED.
```

---

## 3. Определите точки и маршруты

На `idps-server`:

```bash
cd ~/idps-lab03-bundle-v0.2
bash server/show-observation-points.sh
```

Пример результата:

```text
LAB_IFACE=enp0s8
NAT_IFACE=enp0s3
NAT_GW=10.0.2.2
```

Названия интерфейсов и адрес шлюза — примеры. Используйте значения своей VM.

В **каждом новом терминале `idps-server`**, который будет использоваться в этой работе, загрузите значения одной командой:

```bash
cd ~/idps-lab03-bundle-v0.2
source server/load-vars.sh
```

После этого в текущей оболочке доступны:

```text
$LAB_IFACE
$NAT_IFACE
$NAT_GW
```

Это сделано специально, чтобы команды лабораторной не зависели от того, помнит ли новая оболочка переменные из другого терминала.

Скрипт `show-observation-points.sh` также показывает `ip route get` для внутреннего клиента и шлюза. До запуска IDS вы уже должны понимать, через какой интерфейс ядро собирается отправлять каждый поток.

---

# Часть A. Внутренний HTTP-путь

## 4. Независимо подтвердите прикладную доставку

На `idps-client`:

```bash
curl -sS 'http://10.13.37.20:8080/LAB3-PLACEMENT?stage=ground-truth'
```

На `idps-server`:

```bash
grep 'stage=ground-truth' /var/tmp/idps-lab/lab3-access.log | tail -n 1
```

Строка должна содержать примерно такие поля:

```text
src=10.13.37.10:<port>
dst=10.13.37.20:8080
method=GET
uri=/LAB3-PLACEMENT?stage=ground-truth
```

Обратите внимание: учебный web-сервис слушает **только** `10.13.37.20:8080`, а не `0.0.0.0:8080`. Поэтому подтверждение не смешивает запросы к учебному и NAT-адресу сервера.

<div class="callout-banner">
<strong>Граница вывода:</strong> эта запись подтверждает сборку и обработку конкретного HTTP-запроса приложением. Она не является универсальным доказательством отсутствия или наличия пакетов L3/L4.
</div>

---

## 5. Сравните LAB_IFACE и NAT_IFACE с помощью tcpdump

### 5.1 NAT_IFACE

На сервере, терминал 1:

```bash
sudo timeout 8 tcpdump -nn -i "$NAT_IFACE" \
  'host 10.13.37.10 and tcp port 8080'
```

Пока захват работает, на клиенте:

```bash
curl -sS 'http://10.13.37.20:8080/LAB3-PLACEMENT?stage=http-nat'
```

Для корректной схемы соответствующих пакетов на `NAT_IFACE` быть не должно. После этого подтвердите, что сам запрос существовал:

```bash
grep 'stage=http-nat' /var/tmp/idps-lab/lab3-access.log
```

### 5.2 LAB_IFACE

На сервере, терминал 1:

```bash
sudo timeout 8 tcpdump -nn -i "$LAB_IFACE" \
  'host 10.13.37.10 and tcp port 8080'
```

На клиенте:

```bash
curl -sS 'http://10.13.37.20:8080/LAB3-PLACEMENT?stage=http-lab'
```

Теперь пакеты взаимодействия `10.13.37.10 ↔ 10.13.37.20:8080` должны наблюдаться.

Корректный вывод:

> Для внутреннего HTTP-пути LAB_IFACE является подходящей точкой наблюдения, а NAT_IFACE — нет.

Не говорите «NAT_IFACE слепой»: это утверждение пока относится только к **данному потоку**.

---

# Часть B. Исходящий путь через NAT

## 6. Создайте второй контролируемый поток

На `idps-server` проверьте решение маршрутизации:

```bash
ip route get "$NAT_GW"
```

Теперь сравните интерфейсы для ICMP echo request к шлюзу по умолчанию.

### 6.1 LAB_IFACE

Терминал 1:

```bash
sudo timeout 8 tcpdump -nn -i "$LAB_IFACE" \
  "icmp and host $NAT_GW"
```

Терминал 2:

```bash
cd ~/idps-lab03-bundle-v0.2
source server/load-vars.sh
ping -c 1 -W 1 "$NAT_GW" || true
```

Соответствующий исходящий ICMP-пакет на `LAB_IFACE` наблюдаться не должен.

### 6.2 NAT_IFACE

Терминал 1:

```bash
sudo timeout 8 tcpdump -nn -i "$NAT_IFACE" \
  "icmp and host $NAT_GW"
```

Терминал 2:

```bash
cd ~/idps-lab03-bundle-v0.2
source server/load-vars.sh
ping -c 1 -W 1 "$NAT_GW" || true
```

Теперь должен наблюдаться как минимум исходящий ICMP echo request. Ответ шлюза полезен, но для задачи размещения не обязателен: мы проверяем, через какую точку уходит созданный пакет.

Корректный вывод:

> Для исходящего потока к шлюзу NAT_IFACE является подходящей точкой наблюдения, а LAB_IFACE — нет.

---

# Часть C. Повторите оба теста с Suricata

## 7. Проверьте правила

В пакете два правила:

```text
SID 1000003 — HTTP-маркер LAB3-PLACEMENT;
SID 1000004 — ICMP echo request.
```

Проверка:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S "$HOME/idps-lab03-bundle-v0.2/server/lab03.rules"
```

---

## 8. Suricata на NAT_IFACE

Перед запуском создайте **чистый каталог**. Мы не используем общий `/var/log/suricata/eve.json`, чтобы старое оповещение не попало в новый эксперимент.

```bash
sudo systemctl is-active --quiet suricata && sudo systemctl stop suricata || true
sudo rm -rf "$HOME/lab03-nat-run"
mkdir -p "$HOME/lab03-nat-run"

sudo suricata \
  -k none \
  -c /etc/suricata/suricata.yaml \
  -S "$HOME/idps-lab03-bundle-v0.2/server/lab03.rules" \
  -i "$NAT_IFACE" \
  -l "$HOME/lab03-nat-run"
```

Оставьте Suricata работающей.

Теперь создайте **оба** события:

на `idps-client`:

```bash
curl -sS 'http://10.13.37.20:8080/LAB3-PLACEMENT?stage=suricata-nat'
```

на `idps-server`, терминал 2:

```bash
ping -c 1 -W 1 "$NAT_GW" || true
```

Проверьте только текущий каталог:

```bash
sudo jq '
  select(.event_type=="alert" and (.alert.signature_id==1000003 or .alert.signature_id==1000004))
  | {timestamp, src_ip, dest_ip, sid: .alert.signature_id, signature: .alert.signature}
' "$HOME/lab03-nat-run/eve.json"
```

Ожидание:

```text
SID 1000003 — нет
SID 1000004 — да
```

После фиксации результата остановите Suricata сочетанием `Ctrl+C`.

---

## 9. Suricata на LAB_IFACE

Создайте другой чистый каталог:

```bash
sudo rm -rf "$HOME/lab03-lab-run"
mkdir -p "$HOME/lab03-lab-run"

sudo suricata \
  -k none \
  -c /etc/suricata/suricata.yaml \
  -S "$HOME/idps-lab03-bundle-v0.2/server/lab03.rules" \
  -i "$LAB_IFACE" \
  -l "$HOME/lab03-lab-run"
```

Снова создайте **оба** события:

на клиенте:

```bash
curl -sS 'http://10.13.37.20:8080/LAB3-PLACEMENT?stage=suricata-lab'
```

на сервере, терминал 2:

```bash
ping -c 1 -W 1 "$NAT_GW" || true
```

Проверьте:

```bash
sudo jq '
  select(.event_type=="alert" and (.alert.signature_id==1000003 or .alert.signature_id==1000004))
  | {timestamp, src_ip, dest_ip, sid: .alert.signature_id, signature: .alert.signature}
' "$HOME/lab03-lab-run/eve.json"
```

Ожидание:

```text
SID 1000003 — да
SID 1000004 — нет
```

---

## 10. Сводная матрица проверки

| Источник / точка | Тест A: внутренний HTTP | Тест B: исходящий ICMP | Что подтверждает |
|---|---|---|---|
| `lab3-access.log` | запись есть | не применяется | HTTP-запрос собран и обработан приложением |
| `tcpdump -i LAB_IFACE` | поток наблюдается | ICMP к NAT_GW не наблюдается | наличие соответствующих пакетов на данном интерфейсе захвата |
| `tcpdump -i NAT_IFACE` | HTTP-поток не наблюдается | ICMP наблюдается | наличие соответствующих пакетов на данном интерфейсе захвата |
| Suricata на `LAB_IFACE` | SID 1000003 | нет SID 1000004 | правила получают только данные, доступные этой точке |
| Suricata на `NAT_IFACE` | нет SID 1000003 | SID 1000004 | та же логика обнаружения даёт другой результат из-за другого потока данных |

!!! important
    `tcpdump` в виртуальной машине подтверждает наличие пакетов в конкретной точке захвата сетевого стека. Не называйте это автоматически «физическим прохождением по проводу» и не объясняйте результат терминами collision domain: в VirtualBox это виртуализированный сетевой тракт.

---

## 11. Что нужно сдать

Используйте:

```text
report/lab03-report.md
```

Нужны не десятки скриншотов, а минимальные подтверждения для двух гипотез:

```text
HTTP → LAB_IFACE, не NAT_IFACE;
ICMP к NAT_GW → NAT_IFACE, не LAB_IFACE.
```

Отдельно объясните:

1. почему application log является независимым подтверждением только для HTTP-теста;
2. почему разные каталоги `lab03-nat-run` и `lab03-lab-run` исключают смешение старых и новых событий `eve.json`;
3. зачем в учебном запуске используется `-k none` и почему это не production-рекомендация.

---

## 12. Защита работы

Преподаватель может попросить студента:

- показать `ip route get` для `10.13.37.10` и `NAT_GW`;
- воспроизвести любой из двух потоков;
- показать его на правильном интерфейсе;
- объяснить отсутствие на другой точке без фразы «этот интерфейс ничего не видит»;
- показать кортеж `src → dst` в `lab3-access.log`;
- объяснить различие между точкой наблюдения и логикой правила.

---

## Если результат отличается от ожидаемого

Проверяйте по порядку:

```text
1. Совпадают ли LAB_IFACE и NAT_IFACE? Они не должны совпадать.
2. Что показывает ip route get для нужного назначения?
3. Слушает ли web-сервис именно 10.13.37.20:8080?
4. Запущен ли prepare-capture.sh и что показывает ethtool -k?
5. Видит ли tcpdump нужный поток на предполагаемой точке?
6. Проходит ли suricata -T?
7. Запущена ли Suricata на том же интерфейсе, который проверен tcpdump?
8. Читаете ли вы eve.json именно из текущего чистого каталога запуска?
9. Только после этого проверяйте правило.
```

---

## Связь с теорией

Лабораторная проверяет ровно два тезиса Главы 4:

```text
точка наблюдения оценивается относительно конкретного потока;

одинаковая логика обнаружения + разные доступные данные
= разные результаты.
```

И одновременно закрепляет ограничение:

```text
нет оповещения
≠
события не было.
```
