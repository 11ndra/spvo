# Лабораторная работа №1

## Развёртывание NIDS и проверка первого detection

<div class="lab-header">
  <div><strong>Уровень:</strong> базовый</div>
  <div><strong>Инструменты:</strong> Suricata, tcpdump, jq</div>
  <div><strong>Среда:</strong> IDPS LabBox v0.1</div>
</div>

<div class="chapter-lead">
<p>Цель этой работы — не просто установить Suricata. Нужно пройти всю цепочку проверки: <strong>трафик существует → проходит через выбранную точку → попадает в NIDS → правило анализирует нужный observable → alert появляется → результат можно доказать по журналам</strong>.</p>
</div>

<div class="chapter-outcomes">
<strong>После выполнения работы студент должен уметь:</strong>
<p>развернуть минимальный сетевой стенд; определить observation interface; доказать наличие трафика до запуска IDS; подготовить и проверить Suricata; создать простую HTTP-сигнатуру; получить контролируемый alert; найти его в EVE JSON; объяснить разницу между совпадением правила и подтверждённой компрометацией; показать первый пример False Positive.</p>
</div>

!!! warning "Статус QA лаборатории"
    Команды Suricata в этой работе сверены с официальной документацией OISF для Suricata 8 (`--build-info`, `-T`, `-S`, `-i`, `-l`, EVE JSON). Скрипты LabBox прошли статическую проверку shell-синтаксиса. **Полный runtime QA LabBox на чистой Ubuntu 24.04 VM ещё не закрыт**, поэтому курс не помечает эту лабораторию как полностью runtime-validated до отдельного прогона.

---

## 1. Что мы строим

Лаборатория выполняется в одной Ubuntu 24.04 VM.

LabBox создаёт две отдельные сетевые среды с помощью Linux network namespaces.

<div class="labbox-topology">

  <div class="labbox-endpoint">
    <span>namespace</span>
    <strong>idps-client</strong>
    <small>10.13.37.10/24</small>
  </div>

  <div class="labbox-link">
    <span>eth0</span>
    <b>↕</b>
    <span>lab-client0</span>
  </div>

  <div class="labbox-middle">
    <strong>br-idps</strong>
    <small>Linux bridge</small>
    <div class="labbox-observation">
      <span>Observation point</span>
      <strong>lab-client0</strong>
      <small>здесь passive NIDS получает трафик</small>
    </div>
  </div>

  <div class="labbox-link">
    <span>lab-web0</span>
    <b>↕</b>
    <span>eth0</span>
  </div>

  <div class="labbox-endpoint">
    <span>namespace</span>
    <strong>idps-web</strong>
    <small>10.13.37.20:8080</small>
  </div>

</div>

Рабочий поток:

```text
10.13.37.10:any → 10.13.37.20:8080/TCP
```

В этой лабораторной Suricata работает как **пассивный NIDS** и наблюдает интерфейс:

```text
lab-client0
```

!!! important
    LabBox создаёт только сеть и безопасный HTTP-сервис. Он не устанавливает Suricata, не пишет правила и не запускает IDS за студента.

[Скачать IDPS LabBox v0.1](../../assets/downloads/idps-labbox-v0.1.zip){ .md-button }

---

## 2. Подготовка LabBox

Распакуйте архив внутри Ubuntu VM и перейдите в каталог LabBox.

```bash
unzip idps-labbox-v0.1.zip
cd idps-labbox-v0.1
```

Создайте стенд:

```bash
sudo bash scripts/lab-init.sh
```

Проверьте его:

```bash
sudo bash scripts/lab-status.sh
bash scripts/lab-topology.sh
```

Но не ограничивайтесь зелёными `[ OK ]`.

Самостоятельно проверьте созданные объекты:

```bash
ip netns list
ip -br link
sudo ip -n idps-client -br addr
sudo ip -n idps-web -br addr
```

<div class="lab-evidence">
<strong>Контрольная точка 1</strong>
<p>Вы должны уметь показать, где находятся Client и Web, какой у них IP и почему <code>lab-client0</code> является подходящей observation point для потока Client ↔ Web.</p>
</div>

---

## 3. Сначала докажите, что трафик существует

До установки или запуска Suricata проверьте сам сетевой путь.

В первом терминале:

```bash
sudo tcpdump -nn -i lab-client0 'tcp port 8080'
```

Во втором:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/
```

HTTP-сервис должен ответить страницей LabBox, а `tcpdump` — показать двусторонний TCP-поток между:

```text
10.13.37.10
10.13.37.20:8080
```

Почему этот шаг выполняется **до** Suricata?

Потому что отсутствие alert может быть вызвано не правилом. IDS может просто не получать интересующий поток.

<div class="lab-evidence">
<strong>Контрольная точка 2</strong>
<p>Зафиксируйте, какими наблюдениями вы доказали, что нужный flow проходит через <code>lab-client0</code>.</p>
</div>

---

## 4. Подготовка Suricata

Если преподаватель выдал **LabBox Core с уже установленной Suricata**, не переустанавливайте пакет и не тратьте интернет-трафик: сразу зафиксируйте версию. Это основной offline-first вариант курса.

Если работа выполняется на чистой Ubuntu и Suricata отсутствует, официальный OISF Quickstart поддерживает установку через stable PPA:

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:oisf/suricata-stable
sudo apt update
sudo apt install -y suricata jq curl tcpdump
```

На дату аудита актуальная стабильная версия OISF — Suricata **8.0.6**; фактически установленную версию всё равно необходимо проверить, а не предполагать.

Проверьте, какая версия реально установлена:

```bash
sudo suricata --build-info
```

Версию не нужно угадывать по методичке. Она войдёт в evidence.

Пакет может автоматически запустить системный сервис. В этой лабораторной мы используем отдельный контролируемый запуск, поэтому остановите сервис:

```bash
sudo systemctl stop suricata
```

!!! note
    `systemctl status suricata` показывает состояние процесса, но сам по себе не доказывает ни visibility, ни корректность правил, ни наличие detection.

---

## 5. Проверка конфигурации до запуска

Посмотрите основные пути:

```bash
ls -la /etc/suricata/
ls -la /var/log/suricata/
```

Затем выполните configuration test:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml
```

Нас интересует принцип:

```text
процесс может запускаться
≠
конфигурация и правила гарантированно корректны
```

Перед каждым изменением собственного правила в этой работе полезно повторять `-T`.

---

## 6. Первое контролируемое правило

Создайте отдельный файл:

```bash
sudo mkdir -p /etc/suricata/rules
sudo nano /etc/suricata/rules/local.rules
```

Первое правило ищет специально созданный лабораторный URI:

```text
/lab-test
```

Добавьте:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (
    msg:"LAB1 controlled HTTP detection";
    flow:to_server,established;
    http.uri;
    content:"/lab-test";
    sid:1000001;
    rev:1;
)
```

В реальном `local.rules` правило должно находиться в одной строке. Здесь оно разбито только для чтения.

### Разберите правило до запуска

| Элемент | Что он определяет |
|---|---|
| `alert` | действие при совпадении |
| `http` | прикладной протокол |
| `10.13.37.10 → 10.13.37.20:8080` | направление интересующего потока |
| `flow:to_server,established` | контекст установленного соединения к серверу |
| `http.uri` | HTTP URI как анализируемый sticky buffer |
| `content:"/lab-test"` | наблюдаемый признак |
| `sid:1000001` | идентификатор локальной сигнатуры |

То есть правило не ищет абстрактную «атаку».

Оно утверждает:

> если в HTTP-запросе на этом направлении URI содержит `/lab-test`, создать alert.

---

## 7. Проверьте именно это правило

Для лабораторного запуска удобно загрузить только наш файл правил.

Создайте отдельный каталог логов:

```bash
sudo mkdir -p /var/log/suricata-lab
sudo rm -f /var/log/suricata-lab/*
```

Проверьте configuration + rule:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S /etc/suricata/rules/local.rules
```

`-S` здесь намеренно загружает только указанный файл правил, чтобы первая лабораторная не зависела от большого внешнего ruleset.

Запустите Suricata в отдельном терминале:

```bash
sudo suricata \
  -c /etc/suricata/suricata.yaml \
  -i lab-client0 \
  -S /etc/suricata/rules/local.rules \
  -l /var/log/suricata-lab
```

Оставьте этот терминал открытым.

---

## 8. Negative test: нормальный запрос

Сначала выполните запрос, который **не должен** соответствовать правилу:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/
```

Проверьте alerts:

```bash
sudo jq \
  'select(.event_type=="alert" and .alert.signature_id==1000001)' \
  /var/log/suricata-lab/eve.json
```

Ожидаемый результат:

```text
нет событий SID 1000001
```

Это важная часть validation.

Мы проверяем не только:

> «правило умеет срабатывать»,

но и:

> **«правило не срабатывает на выбранный normal case».**

---

## 9. Positive test: `/lab-test`

Теперь:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/lab-test
```

Web-сервер может вернуть `404`. Это нормально.

Нас интересует не существование файла, а наблюдаемый URI.

Снова:

```bash
sudo jq \
  'select(.event_type=="alert" and .alert.signature_id==1000001)' \
  /var/log/suricata-lab/eve.json
```

Найдите как минимум:

```text
timestamp
src_ip
src_port
dest_ip
dest_port
proto
alert.signature
alert.signature_id
```

Удобная сокращённая выборка:

```bash
sudo jq '
  select(.event_type=="alert" and .alert.signature_id==1000001)
  | {
      timestamp,
      src_ip,
      src_port,
      dest_ip,
      dest_port,
      proto,
      signature: .alert.signature,
      sid: .alert.signature_id
    }
' /var/log/suricata-lab/eve.json
```

<div class="lab-evidence">
<strong>Контрольная точка 3</strong>
<p>Объясните, какие поля EVE позволяют связать alert именно с вашим тестовым HTTP-запросом.</p>
</div>

---

## 10. Alert не равен подтверждённой компрометации

Теперь добавим более похожий на security detection пример.

В `local.rules` добавьте вторую сигнатуру:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (
    msg:"LAB1 possible path traversal";
    flow:to_server,established;
    http.uri.raw;
    content:"../";
    sid:1000002;
    rev:1;
)
```

Снова выполните `suricata -T`.

После изменения rules перезапустите лабораторный процесс Suricata.

Затем отправьте безопасный attack-like запрос:

```bash
sudo ip netns exec idps-client \
  curl --path-as-is \
  http://10.13.37.20:8080/../../etc/passwd
```

LabBox **не содержит уязвимого path traversal приложения**. Python HTTP server ограничивает обслуживание своим webroot, поэтому этот сценарий используется только для наблюдаемого сетевого паттерна.

Если правило создало alert, что мы доказали?

```text
Доказано:
в HTTP URI присутствовал наблюдаемый признак "../",
и правило SID 1000002 совпало с потоком.

НЕ доказано:
что /etc/passwd был прочитан;
что код был выполнен;
что сервер скомпрометирован.
```

Это первая практическая демонстрация принципа:

> **alert ≠ incident confirmation**

---

## 11. Первый False Positive

Теперь используйте:

```bash
sudo ip netns exec idps-client \
  curl --path-as-is \
  http://10.13.37.20:8080/docs/../index.html
```

Такой URI всё ещё содержит:

```text
../
```

Примитивная сигнатура SID `1000002` может снова создать alert.

Однако запрос используется как benign-like navigation внутри учебного webroot.

Получаем:

```text
attack-like request  → ALERT
benign-like request  → ALERT
```

Это не означает, что Suricata «работает плохо».

Проблема находится в нашей detection logic:

```text
content:"../"
```

слишком широка для уверенного утверждения об атаке.

<div class="lab-evidence">
<strong>Контрольная точка 4</strong>
<p>Опишите, почему второе правило имеет риск False Positive и какой дополнительный контекст вы захотели бы учитывать. Исправлять правило до production-качества в ЛР №1 не требуется — это задача следующего блока курса.</p>
</div>

---

## 12. Минимальный troubleshooting

Теперь воспроизведите типичную ситуацию.

Остановите текущий лабораторный Suricata и запустите тот же rule-file на неправильном интерфейсе:

```bash
sudo suricata \
  -c /etc/suricata/suricata.yaml \
  -i lo \
  -S /etc/suricata/rules/local.rules \
  -l /var/log/suricata-lab
```

В другом терминале:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/lab-test
```

HTTP работает.

Rule syntactically valid.

Но новый flow не проходит через `lo`.

Пройдите диагностическую цепочку:

```text
Запрос работает?
        ↓
Видит ли его tcpdump на lab-client0?
        ↓
Какой interface использует Suricata?
        ↓
Загрузилось ли правило?
        ↓
Появился ли alert в EVE?
```

После диагностики верните Suricata на:

```text
lab-client0
```

Это важнее, чем просто запомнить правильную команду запуска.

---

## 13. Evidence вместо коллекции скриншотов

После завершения основных тестов запустите Suricata на правильном интерфейсе и выполните:

```bash
sudo bash scripts/lab-check.sh --export
```

LabBox создаст:

```text
evidence/
└── lab01-evidence.zip
```

Внутри:

```text
lab01/
├── topology.txt
├── interfaces.txt
├── suricata-build-info.txt
├── config-test.txt
├── local.rules
├── normal-request.txt
├── detection-request.txt
├── packet-sample.txt
├── alerts.json
├── runtime.txt
└── sha256sums.txt
```

Evidence не заменяет объяснение.

Он нужен для доказательства технических фактов.

---

## 14. Что сдаёт студент

Два файла:

```text
lab01-report.md
lab01-evidence.zip
```

В `lab01-report.md` ответьте на вопросы:

1. Почему `active (running)` не доказывает работоспособность IDS?
2. Как вы доказали, что `lab-client0` получает нужный flow?
3. Какой observable использует SID `1000001`?
4. Какие поля `eve.json` связывают alert с вашим запросом?
5. Что именно доказал alert SID `1000002` и чего он не доказал?
6. Почему `/docs/../index.html` демонстрирует риск False Positive?
7. Почему запуск Suricata на `lo` не исправляется изменением самой сигнатуры?
8. Какой следующий шаг вы сделали бы, чтобы улучшить правило path traversal?

Не отвечайте одним предложением «потому что так настроено». Каждый вывод должен ссылаться на конкретное наблюдение из лаборатории.

---

## 15. Критерии оценки

| Критерий | Баллы |
|---|---:|
| LabBox развёрнут, топология понята | 10 |
| Suricata доступна в среде, configuration test пройден | 15 |
| Visibility на `lab-client0` доказана | 15 |
| Controlled detection SID `1000001` воспроизведён | 20 |
| EVE JSON разобран и интерпретирован | 15 |
| Attack-like и False Positive сценарии объяснены корректно | 15 |
| Troubleshooting и evidence оформлены | 10 |
| **Итого** | **100** |

!!! warning "Критическое условие"
    Если студент не может доказать, что нужный поток действительно проходит через observation interface, один показанный alert не считается достаточным доказательством корректной работы NIDS.

---

## 16. Что мы пока намеренно не делаем

В этой работе мы **не** пытаемся:

```text
создать production-ready signature
настроить большой ET Open ruleset
включить inline blocking
проводить реальную эксплуатацию уязвимости
строить SIEM correlation
оценивать throughput под нагрузкой
```

Это не упрощение ради упрощения.

ЛР №1 должна сначала закрепить фундаментальную цепочку:

```text
traffic
  ↓
visibility
  ↓
parsing
  ↓
rule
  ↓
alert
  ↓
evidence
  ↓
interpretation
```

<div class="next-step">
<strong>Следующий практический уровень:</strong> мы уже умеем заставить detection сработать. Дальше нужно научиться делать его качественным: уточнять контекст, уменьшать False Positive и проверять варианты обхода правила. Это станет основой ЛР №2 по Detection Engineering.
</div>
