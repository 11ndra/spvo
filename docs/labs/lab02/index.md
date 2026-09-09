# Лабораторная работа №2

## Network Detection Engineering: от широкого правила к regression-tested detection

<div class="lab-header">
  <div><strong>Фокус:</strong> Detection Engineering</div>
  <div><strong>Инструмент:</strong> Suricata или Browser Workbench</div>
  <div><strong>Режимы:</strong> Live / Offline / Accessibility</div>
</div>

<div class="chapter-lead">
<p>В этой работе оценивается не способность написать длинное правило. Нужно показать, как одна detection hypothesis проходит через <strong>baseline → тесты → обнаруженный FP → уточнение контекста → новый regression test → анализ FN</strong>.</p>
</div>

<div class="chapter-outcomes">
<strong>Единая цель для всех режимов:</strong>
<p>построить и проверить сетевое detection для traversal-like HTTP URI, сравнить три варианта логики на одинаковом наборе test cases и аргументированно объяснить изменение TP/FP/TN/FN.</p>
</div>

!!! warning "Статус QA и происхождение corpus"
    PCAP T1–T5 — **синтетические учебные данные, созданные специально для курса**; это не capture реального инцидента. Ethernet/IPv4/TCP-структура и checksums проверены программно. Однако до отдельного runtime-прогона на Suricata 8.0.6 ожидаемая матрица Rule A/B/C считается **гипотезой лаборатории, которую студент должен подтвердить engine output**, а не заранее доказанным фактом.

!!! info "Почему три режима считаются одной лабораторной"
    Live mode проверяет detection на генерируемом трафике. Offline mode использует те же логические сценарии в PCAP. Browser/Accessibility mode выполняет ту же regression matrix в интерактивном симуляторе, но студент обязан отдельно указать, что этот режим **не доказывает реальное поведение Suricata engine**. Выбор среды не должен подменять проверку понимания.

---

## 1. Выберите режим выполнения

<div class="lab-mode-grid">

  <div class="lab-mode-card recommended">
    <span>Mode A</span>
    <strong>Live LabBox</strong>
    <p>Реальный HTTP-трафик между network namespaces и Suricata на observation interface.</p>
    <small>Рекомендуется: 2 vCPU, 2–4 GB RAM.</small>
  </div>

  <div class="lab-mode-card">
    <span>Mode B</span>
    <strong>Offline PCAP</strong>
    <p>Suricata обрабатывает готовые PCAP. Не требуется live topology и дополнительные VM.</p>
    <small>Подходит для слабого ПК или нестабильной виртуализации.</small>
  </div>

  <div class="lab-mode-card">
    <span>Mode C</span>
    <strong>Browser / Accessibility</strong>
    <p>Интерактивная regression matrix без запуска engine.</p>
    <small>Zero-setup fallback; ограничения режима обязательно входят в отчёт.</small>
  </div>

</div>

Для Mode B скачайте:

[Скачать Lab Pack 02 v0.1](../../assets/downloads/idps-labpack-02-v0.1.zip){ .md-button }

Для Mode A используется уже знакомый:

[Скачать LabBox v0.1](../../assets/downloads/idps-labbox-v0.1.zip){ .md-button }

---

## 2. Единый test corpus

Независимо от режима мы используем пять случаев.

| ID | Запрос | Класс для этой лабораторной |
|---|---|---|
| T1 | `GET /` | normal |
| T2 | `GET /download?file=../../etc/passwd` | attack-like |
| T3 | `GET /docs/../index.html` | benign-like |
| T4 | `POST /submit`, где `../` находится только в body | normal для URI-use-case |
| T5 | `GET /download?file=../../var/log/auth.log` | attack-like variant |

Мы сознательно не называем T2/T5 «реальной эксплуатацией».

Стенд не содержит уязвимого приложения.

Нас интересует только:

```text
observable
→
rule match
→
classification of detection result
```

---

## 3. Detection hypothesis

Запишите до выполнения тестов:

> Мы хотим обнаруживать traversal-like структуру `../`, когда она присутствует в **HTTP URI запроса к Web-сервису**.

Это означает, что первоначальная область интереса:

```text
HTTP
client → server
URI
../
```

Теперь проверим, насколько разные правила соответствуют этой формулировке.

---

## 4. Rule A — слишком широкая baseline logic

Начинаем намеренно с широкого правила:

```text
alert tcp 10.13.37.10 any -> 10.13.37.20 8080 (
    msg:"LAB2 broad traversal marker";
    flow:established,to_server;
    content:"../";
    sid:2000001;
    rev:1;
)
```

В реальном `rules`-файле держите правило в одной строке.

Перед тестом сформулируйте прогноз:

```text
T1 — ?
T2 — ?
T3 — ?
T4 — ?
T5 — ?
```

Не запускайте следующий вариант правила, пока не записали прогноз.

---

## 5. Mode A — Live LabBox

=== "Подготовка"

    Разверните LabBox:

    ```bash
    sudo bash scripts/lab-init.sh
    sudo bash scripts/lab-status.sh
    ```

    Убедитесь, что Suricata получает трафик с:

    ```text
    lab-client0
    ```

=== "Rule A"

    Сохраните Rule A в:

    ```text
    /etc/suricata/rules/lab02.rules
    ```

    Проверка:

    ```bash
    sudo suricata -T \
      -c /etc/suricata/suricata.yaml \
      -S /etc/suricata/rules/lab02.rules
    ```

    Запуск:

    ```bash
    sudo rm -rf /var/log/suricata-lab02
    sudo mkdir -p /var/log/suricata-lab02

    sudo suricata \
      -c /etc/suricata/suricata.yaml \
      -i lab-client0 \
      -S /etc/suricata/rules/lab02.rules \
      -l /var/log/suricata-lab02
    ```

=== "Пять запросов"

    Выполните в отдельном терминале:

    ```bash
    # T1
    sudo ip netns exec idps-client \
      curl http://10.13.37.20:8080/

    # T2
    sudo ip netns exec idps-client \
      curl --path-as-is \
      'http://10.13.37.20:8080/download?file=../../etc/passwd'

    # T3
    sudo ip netns exec idps-client \
      curl --path-as-is \
      'http://10.13.37.20:8080/docs/../index.html'

    # T4
    sudo ip netns exec idps-client \
      curl -X POST \
      --data 'comment=example../../text' \
      http://10.13.37.20:8080/submit

    # T5
    sudo ip netns exec idps-client \
      curl --path-as-is \
      'http://10.13.37.20:8080/download?file=../../var/log/auth.log'
    ```

    Ответ Web-сервера может быть `404` или `501`. Для detection test это допустимо: нас интересует то, какой HTTP request наблюдал сетевой сенсор.

=== "Проверка"

    ```bash
    sudo jq '
      select(.event_type=="alert" and .alert.signature_id==2000001)
      | {
          timestamp,
          src_ip,
          dest_ip,
          dest_port,
          sid: .alert.signature_id,
          signature: .alert.signature
        }
    ' /var/log/suricata-lab02/eve.json
    ```

    Заполните regression matrix в отчёте.

---

## 6. Mode B — Offline PCAP

Распакуйте Lab Pack:

```bash
unzip idps-labpack-02-v0.1.zip
cd idps-labpack-02-v0.1
```

Внутри уже есть:

```text
pcaps/
rules/starter.rules
tools/
SCENARIOS.md
```

Проверьте SHA-256:

```bash
sha256sum -c SHA256SUMS
```

### Первый запуск

```bash
mkdir -p output/rule-a

sudo suricata \
  -c /etc/suricata/suricata.yaml \
  -r pcaps/00-all-cases.pcap \
  -S rules/starter.rules \
  -l "$(pwd)/output/rule-a"
```

Затем:

```bash
python3 tools/summarize_eve.py \
  output/rule-a/eve.json
```

Если нужно понять, какой отдельный PCAP создаёт alert, запускайте каждый файл в отдельный output directory.

Например:

```bash
mkdir -p output/t4

sudo suricata \
  -c /etc/suricata/suricata.yaml \
  -r pcaps/04-body-marker.pcap \
  -S rules/starter.rules \
  -l "$(pwd)/output/t4"
```

Таким образом Mode B проверяет **тот же engine и те же правила**, но не требует live networking.

---

## 7. Проверяем гипотезу Rule A

Теперь сравните прогноз с фактическим EVE output. Не подгоняйте результат под таблицу из методички: если конкретная версия движка интерпретирует corpus иначе, это должно быть зафиксировано как результат runtime-проверки.

Особое внимание T4:

```text
POST /submit
body:
comment=example../../text
```

Наша detection hypothesis относится к URI.

Но Rule A ищет `../` в payload потока.

Если T4 создаёт alert, это важный FP относительно сформулированного use case.

Проблема не в Suricata.

Проблема:

```text
наше правило проверяет более широкое пространство данных,
чем требует гипотеза
```

---

## 8. Rule B — переносим observable в HTTP URI

Создайте новый вариант:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (
    msg:"LAB2 traversal-like sequence in HTTP URI";
    flow:established,to_server;
    http.uri.raw;
    content:"../";
    sid:2000002;
    rev:1;
)
```

Повторите **все пять тестов**.

Не только T4.

Почему?

Потому что после изменения правила нас интересует regression:

```text
что исправилось?
что осталось?
что случайно сломалось?
```

Ожидаемый инженерный вопрос:

> исчез ли T4, сохранились ли T2/T5 и что произошло с T3?

---

## 9. Rule C — ещё уже, но какой ценой?

Теперь попробуйте сузить логику к конкретному target:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (
    msg:"LAB2 passwd traversal candidate";
    flow:established,to_server;
    http.uri.raw;
    content:"../";
    content:"etc/passwd";
    sid:2000003;
    rev:1;
)
```

Повторите regression matrix.

Если Rule C ведёт себя согласно нашей гипотезе, вы увидите привлекательный на первый взгляд результат:

```text
T3 benign-like
→ больше не alert
```

Но затем проверьте T5:

```text
../../var/log/auth.log
```

Если use case звучит как:

> «обнаружить traversal-like доступ к произвольному чувствительному пути»,

то Rule C стал **слишком специфичным**.

Мы уменьшили FP на текущем corpus, но создали FN на variant case.

---

## 10. Mode C — Browser / Accessibility

Если Suricata или виртуализация недоступны, используйте тот же интерактив из Главы 8.

<div class="detection-workbench" data-rule="payload">

  <div class="workbench-rules">
    <button class="workbench-rule active" data-workbench-rule="payload">Rule A — payload anywhere</button>
    <button class="workbench-rule" data-workbench-rule="uri">Rule B — HTTP URI</button>
    <button class="workbench-rule" data-workbench-rule="passwd">Rule C — passwd-specific</button>
  </div>

  <div class="workbench-rule-view">
    <span>Текущая логика</span>
    <code class="workbench-rule-code"></code>
    <p class="workbench-rule-note"></p>
  </div>

  <div class="workbench-matrix">
    <div class="workbench-matrix-head">
      <span>Сценарий</span>
      <span>Ожидаемый класс</span>
      <span>Результат правила</span>
      <span>Оценка</span>
    </div>

    <div class="workbench-case" data-case="normal">
      <span><code>T1 GET /</code></span>
      <span>normal</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="passwd">
      <span><code>T2 ../../etc/passwd</code></span>
      <span>attack-like</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="benign">
      <span><code>T3 /docs/../index.html</code></span>
      <span>benign-like</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="body">
      <span><code>T4 marker only in POST body</code></span>
      <span>normal for URI-use-case</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="variant">
      <span><code>T5 ../../var/log/auth.log</code></span>
      <span>attack-like variant</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>
  </div>

  <div class="workbench-summary"></div>
  <button class="course-btn workbench-export" type="button">Скачать browser evidence</button>

</div>

Для сдачи этого режима приложите созданный:

```text
lab02-browser-evidence.txt
```

и отдельно ответьте:

> Почему этот файл является доказательством вашего анализа, но **не доказательством реального поведения Suricata engine**?

Это ограничение режима должно быть сформулировано явно.

---

## 11. Что именно сравниваем

В отчёте должна появиться таблица:

| Case | Rule A | Rule B | Rule C | TP/FP/TN/FN |
|---|---|---|---|---|
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |

Но сама таблица — не итог.

Нужно объяснить причинность:

```text
Rule A → T4 FP
потому что проверял payload шире URI

Rule B → T4 перестал совпадать
потому что observable перенесён в http.uri.raw

Rule B → T3 всё ещё совпадает
потому что ../ само по себе неоднозначно

Rule C → T3 исчез
но T5 стал FN
потому что tuning привязался к одному target
```

---

## 12. Дополнительный профессиональный шаг: regression test как артефакт

Создайте каталог:

```text
my-detection/
├── rules/
│   └── traversal.rules
├── tests/
│   ├── positive/
│   ├── negative/
│   └── variant/
└── README.md
```

В `README.md` зафиксируйте:

```text
Use case
Observable
Expected matches
Expected non-matches
Known limitations
Current SID/rev
```

Это минимальная форма Detection-as-Code без отдельной платформы.

---

## 13. ET Open — чтение production-like rule

Если в вашей среде доступен ET Open ruleset:

```bash
suricata-update -V
```

или локальный snapshot правил, выберите **одно HTTP-rule** и разберите его.

Не копируйте всё правило в отчёт.

Ответьте:

```text
Какой protocol buffer используется?
Есть ли flow context?
Сколько независимых content conditions?
Есть ли metadata/reference/classtype?
Какой observable выглядит самым селективным?
Какие positive/negative tests вы бы написали?
```

Если ET Open локально отсутствует, этот пункт можно выполнить по предоставленному преподавателем rule snapshot и он не требует доступа к Интернету.

---

## 14. Evidence для разных режимов

### Mode A

```text
lab02-report.md
lab02.rules
eve.json или отфильтрованные LAB2 alerts
краткий packet/request evidence
```

### Mode B

```text
lab02-report.md
lab02.rules
output/ с EVE
SHA256SUMS validation
```

### Mode C

```text
lab02-report.md
lab02-browser-evidence.txt
явное описание ограничения simulator mode
```

Мы оцениваем одну и ту же detection reasoning.

Mode C не выдаётся за запуск Suricata.

---

## 15. Вопросы отчёта

1. Сформулируйте detection hypothesis одним абзацем.
2. Почему Rule A создаёт FP на T4?
3. Что именно изменил переход к `http.uri.raw`?
4. Почему Rule B всё ещё может считать T3 подозрительным?
5. Какой FP уменьшает Rule C?
6. Какой FN появляется у Rule C?
7. Какой additional context вы бы исследовали перед дальнейшим tuning?
8. Почему thresholding не исправляет логическую причину FP?
9. Какие тесты должны войти в regression corpus следующей версии правила?
10. Какие ограничения имеет выбранный вами режим выполнения?

---

## 16. Критерии оценки

| Критерий | Баллы |
|---|---:|
| Detection hypothesis и observable сформулированы корректно | 15 |
| Rule A протестирован по regression matrix | 15 |
| Переход к protocol-aware Rule B обоснован | 20 |
| FP после Rule B проанализирован | 10 |
| Rule C и появившийся FN объяснены | 15 |
| Positive / negative / variant tests оформлены как regression corpus | 15 |
| Evidence и ограничения режима описаны честно | 10 |
| **Итого** | **100** |

!!! important
    Баллы не начисляются за количество keywords в сигнатуре. Более сложное правило не считается лучше, пока тесты не показывают, что оно лучше соответствует зафиксированному use case.

---

## 17. Итог лабораторной

После ЛР №1 студент мог доказать:

```text
мой NIDS видит поток
и создаёт alert
```

После ЛР №2 утверждение становится сильнее:

```text
я могу сформулировать detection hypothesis
        ↓
выбрать network representation
        ↓
создать rule
        ↓
построить regression corpus
        ↓
увидеть FP/FN
        ↓
обосновать tuning
        ↓
зафиксировать ограничения detection
```

<div class="next-step">
<strong>Дальше:</strong> следующая тема усложнит саму visibility. Мы посмотрим, что происходит с detection, когда полезный прикладной контекст оказывается внутри TLS и точка наблюдения видит уже не тот набор данных, на который рассчитывало правило.
</div>
