# Глава 8. Как проектировать сетевое обнаружение, а не просто писать сигнатуры

<div class="chapter-lead">
<p>В первой лабораторной мы заставили правило сработать. Этого достаточно, чтобы доказать работу механизма, но недостаточно, чтобы назвать detection качественным.</p>

<p>Теперь задача меняется: <strong>не написать строку Suricata, а сформулировать проверяемую гипотезу обнаружения</strong>. Нужно понять, какой сетевой след оставляет интересующая активность, в каком представлении его увидит движок, какой контекст уменьшает неоднозначность и какими тестами доказать ожидаемое поведение правила.</p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь:</strong>
<p>переводить threat scenario в observable; выбирать подходящий protocol-aware buffer; объяснять роль header, direction и flow; отличать широкое совпадение от содержательного detection; строить positive, negative и variant tests; анализировать компромисс FP/FN; использовать SID/rev как часть жизненного цикла правила; понимать, зачем production detection проверяется как код.</p>
</div>

---

## 1. Совпадение строки ещё не является Detection Engineering

Возьмём правило:

```text
alert tcp any any -> any any (
    content:"../";
    sid:2000001;
)
```

Оно может обнаружить интересующий нам фрагмент.

Но прежде чем считать его полезным, нужно задать несколько вопросов:

```text
Где именно должен находиться "../"?
В запросе или ответе?
В URI, body, заголовке или вообще любом TCP payload?
Для какого сервиса это имеет смысл?
Какой нормальный трафик содержит тот же фрагмент?
Какие варианты интересующей активности правило пропустит?
```

Если на эти вопросы нет ответа, перед нами не инженерно спроектированный detection, а условие совпадения.

Detection Engineering начинается раньше синтаксиса:

```text
Threat / behavior
       ↓
Observable
       ↓
Network representation
       ↓
Detection condition
       ↓
Context
       ↓
Tests
       ↓
Tuning
       ↓
Operational rule
```

---

## 2. Сначала поведение, затем observable

Допустим, сценарий звучит так:

> Клиент пытается обратиться к файлу за пределами ожидаемого каталога Web-приложения через path traversal-подобный URI.

Это ещё не правило.

Сначала нужно определить, что сетевой сенсор вообще способен увидеть.

Например:

```text
HTTP request
GET /download?file=../../etc/passwd HTTP/1.1
```

Наблюдаемый сетевой признак:

```text
../
```

Но даже это пока слишком широко.

Полезнее записать гипотезу:

> В **HTTP URI запроса к серверу** присутствует последовательность `../`, указывающая на traversal-подобную структуру пути.

Здесь уже появились четыре инженерных решения:

```text
protocol = HTTP
direction = client → server
representation = URI
observable = ../
```

И только теперь имеет смысл переводить гипотезу в rule syntax.

---

## 3. Header задаёт область, а не описывает атаку

Типичная Suricata signature состоит из:

```text
ACTION PROTOCOL SOURCE PORT -> DESTINATION PORT (OPTIONS)
```

Например:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (...)
```

Header отвечает на вопрос:

> **к какому сетевому взаимодействию правило вообще применимо?**

Он способен отсечь огромное количество нерелевантного трафика ещё до анализа конкретного content.

Но ошибка в обратную сторону тоже опасна.

Если написать слишком узко:

```text
10.13.37.10 → 10.13.37.20:8080
```

а production-сервис завтра переедет на другой адрес, detection исчезнет вместе со старой топологией.

Поэтому header должен отражать **устойчивую область применения**, а не случайные параметры тестового стенда.

В лаборатории мы используем конкретные IP намеренно — для воспроизводимости. В production чаще применяются переменные вроде `$HOME_NET`, `$EXTERNAL_NET` и группы сервисов.

---

## 4. Контекст потока отвечает на вопрос «в какую сторону и в каком состоянии»

Для TCP/HTTP полезный контекст часто выглядит так:

```text
flow:established,to_server;
```

Это означает:

```text
соединение уже установлено
+
анализируем направление client → server
```

Такой контекст не делает правило автоматически хорошим.

Но он помогает исключить ситуации, которые не соответствуют нашей гипотезе.

Например строка `../` может встретиться в HTTP response:

```text
Server → Client
```

Если нас интересует URI запроса, response не должен создавать совпадение.

Следовательно:

> **direction и state — часть смысла detection, а не декоративные keywords.**

---

## 5. Почему protocol-aware buffer лучше «искать где угодно»

Предположим клиент отправляет:

```text
POST /submit HTTP/1.1
Content-Type: application/x-www-form-urlencoded

comment=example../../text
```

Последовательность `../` есть в TCP payload.

Но её нет в URI.

Если правило просто ищет:

```text
content:"../";
```

оно может совпасть с body.

Если же гипотеза относится именно к URI, нам нужен соответствующий sticky buffer:

```text
http.uri.raw;
content:"../";
```

Теперь движок ищет observable не «где-нибудь в пакете», а в конкретном представлении HTTP.

Это важный переход:

```text
raw bytes
   ↓
protocol parser
   ↓
specific field / buffer
   ↓
detection
```

Suricata предоставляет как нормализованные, так и raw-представления некоторых HTTP-полей. Для URI:

```text
http.uri
http.uri.raw
```

`http.uri` работает с нормализованным представлением, а `http.uri.raw` — с исходным URI до такой нормализации.

Вопрос выбора между ними должен следовать из того, **какой observable вы хотите детектировать и в каком виде он существует**.

---

## 6. Первое улучшение правила

Исходное условие:

```text
alert tcp any any -> any any (
    content:"../";
    sid:2000001;
)
```

Инженерно более осмысленный вариант:

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

Что изменилось?

```text
было:
искать "../" где угодно

стало:
искать "../"
в HTTP
в запросе к серверу
в URI
на нужном сервисном пути
```

Это уже лучше соответствует гипотезе.

Но пока не решает проблему полностью.

---

## 7. Контекст уменьшает FP, но не отменяет их

Рассмотрим два URI:

```text
/download?file=../../etc/passwd
/docs/../index.html
```

Оба содержат:

```text
../
```

Первый мы используем как attack-like case.

Второй — как benign-like navigation.

Правило SID `2000002` совпадёт с обоими.

Следовательно:

```text
больше protocol context
≠
нулевой False Positive
```

Можно попытаться уточнить detection:

```text
http.uri.raw;
content:"../";
content:"etc/passwd";
```

Теперь benign-like URI перестанет совпадать.

Но появляется другой вопрос.

Что произойдёт с:

```text
/download?file=../../var/log/auth.log
```

Если такое обращение тоже относится к интересующему поведению, правило, привязанное к `etc/passwd`, создаёт **False Negative**.

Поэтому tuning — не соревнование:

> «сделать как можно меньше alert».

Настоящий вопрос:

> **какое поведение мы хотим покрывать и какой уровень FP/FN допустим для этого use case?**

---

## 8. Stable observable: что именно трудно изменить атакующему

Не все признаки одинаково полезны.

Сравним:

```text
User-Agent: BadScanner/1.0
```

и:

```text
необходимость отправить запрос к определённому endpoint
с определённой структурой параметров
```

User-Agent обычно легко изменить.

Необходимый шаг протокола или структуры взаимодействия может быть устойчивее.

Это не означает, что нужно всегда выбирать «самый сложный» observable.

Но хороший detection engineer спрашивает:

```text
Насколько легко изменить этот признак?
Изменится ли он после обновления приложения?
Есть ли он в нормальном трафике?
Виден ли он в нашем placement?
Можно ли его проверить тестом?
```

Чем сильнее правило зависит от случайной строки, тем выше риск, что оно окажется либо шумным, либо хрупким.

---

## 9. Правило — это гипотеза, тесты — доказательство

Для каждого detection полезно иметь минимум три класса тестов.

### Positive test

Событие, которое **должно** совпасть.

```text
/download?file=../../etc/passwd
→ ожидаем ALERT
```

### Negative test

Событие, которое **не должно** совпасть.

```text
/
→ ожидаем NO ALERT
```

### Variant test

Изменённая версия интересующего поведения.

```text
/download?file=../../var/log/auth.log
```

Она отвечает на вопрос:

> правило обнаруживает поведение или только один конкретный образец?

Именно variant test часто выявляет скрытый FN после агрессивного tuning.

---

## 10. Regression matrix вместо проверки «одного счастливого запроса»

Соберём пять тестовых случаев.

| Test case | Смысл | Ожидание от качественного traversal detection |
|---|---|---|
| `/` | нормальный запрос | no alert |
| `/download?file=../../etc/passwd` | attack-like | alert |
| `/docs/../index.html` | benign-like navigation | зависит от контекста и политики |
| `POST /submit` + `../` только в body | marker вне URI | no alert для URI-rule |
| `/download?file=../../var/log/auth.log` | variant attack-like | alert, если use case покрывает traversal в целом |

Теперь правило можно оценивать не по одному событию, а по **матрице ожидаемого поведения**.

Это и есть первая форма regression testing для detection.

---

## 11. Интерактив: как tuning меняет TP/FP/FN

Ниже — упрощённый симулятор именно для пяти случаев этой главы. Это **не эмулятор Suricata parser**. Он нужен, чтобы до лаборатории спрогнозировать последствия трёх логических вариантов правила.

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
      <span><code>GET /</code></span>
      <span>normal</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="passwd">
      <span><code>GET /download?file=../../etc/passwd</code></span>
      <span>attack-like</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="benign">
      <span><code>GET /docs/../index.html</code></span>
      <span>benign-like</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="body">
      <span><code>POST /submit</code>, marker только в body</span>
      <span>normal for URI-use-case</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>

    <div class="workbench-case" data-case="variant">
      <span><code>GET /download?file=../../var/log/auth.log</code></span>
      <span>attack-like variant</span>
      <strong class="workbench-match"></strong>
      <strong class="workbench-quality"></strong>
    </div>
  </div>

  <div class="workbench-summary"></div>
  <button class="course-btn workbench-export" type="button">Скачать browser evidence</button>

</div>

Обратите внимание на закономерность:

```text
Rule A
широкий охват → лишние FP

Rule B
лучше соответствует URI-гипотезе → меньше FP

Rule C
ещё уже → текущие FP исчезают,
но появляется FN на другом target
```

Не существует магической кнопки «сделать правило идеальным».

Нужно зафиксировать **use case** и тестировать его границы.

---

## 12. Performance тоже является частью инженерии

Сигнатура выполняется не один раз.

На production-сенсоре она может проверяться против огромного числа потоков.

Поэтому полезно различать:

```text
дешёвый селективный content
и
дорогую сложную проверку
```

Suricata умеет выбирать `fast_pattern` автоматически, а разработчик может указать его явно, когда понимает, какой content должен использоваться для предварительного отбора.

Регулярные выражения (`pcre`) дают большую выразительность, но их сложность имеет вычислительную цену. Поэтому разумный подход:

```text
сначала protocol / flow / content narrowing
        ↓
затем сложная проверка, если она действительно нужна
```

То есть производительность — не отдельная «оптимизация после написания правила».

Она влияет на то, как detection проектируется.

---

## 13. Thresholding не исправляет плохую detection logic

Допустим шумное правило создаёт:

```text
500 alert / minute
```

Можно ограничить частоту сообщений с помощью thresholding.

Это иногда правильно с эксплуатационной точки зрения.

Но нужно различать:

```text
rule match
и
alert emission rate
```

Если правило логически совпадает с нормальным трафиком, threshold:

> не превращает FP в TP.

Он только меняет количество создаваемых alert.

Поэтому порядок должен быть таким:

```text
сначала понять причину совпадения
        ↓
исправить или документировать detection logic
        ↓
только затем решать, нужна ли rate control
```

---

## 14. SID, rev и жизненный цикл правила

Локальная сигнатура должна иметь устойчивый идентификатор:

```text
sid:2000002;
```

Если логика правила изменилась:

```text
rev:1
→
rev:2
```

Это позволяет отличать версии одного detection.

Для production-процесса вокруг правила также важны:

```text
author / owner
описание use case
источник observable
дата изменения
тестовые PCAP
ожидаемые результаты
история tuning
```

Именно поэтому detection удобно рассматривать как **code-like artifact**, а не как строку, случайно вставленную в конфигурацию сенсора.

---

## 15. Как это делают сами разработчики Suricata

Проект OISF поддерживает `suricata-verify` — набор verification tests для самого движка Suricata.

Инженерная идея очень близка к тому, что нам нужно:

```text
PCAP
+
rules
+
test descriptor
        ↓
Suricata
        ↓
EVE output
        ↓
machine-checkable assertions
```

Упрощённая структура такого теста может выглядеть так:

```yaml
pcap: input.pcap
rules: test.rules

checks:
  - filter:
      count: 1
      match:
        event_type: alert
        alert.signature_id: 2000002
```

Нам не нужно копировать весь framework в учебную работу.

Но принцип очень важен:

> **Detection считается надёжнее, когда его ожидаемое поведение можно воспроизвести автоматически.**

Эту философию мы используем в ЛР №2.

---

## 16. ET Open как профессиональный reference corpus

В реальной работе большинство инженеров не начинают с пустого файла `local.rules`.

Suricata использует rulesets, а `suricata-update` по умолчанию умеет получать Emerging Threats Open.

ET Open полезен для курса не как:

> «включите тысячи правил и считайте работу законченной».

А как коллекция примеров того, как реальные rules используют:

```text
protocol buffers
flow
multiple content checks
metadata
classtype
references
thresholding
state
```

Когда будете читать такое правило, задавайте не вопрос:

> «что делает каждый keyword?»

а:

> **«какую detection hypothesis пытается выразить автор и какие тесты нужны, чтобы ей доверять?»**

---

## 17. Инженерная последовательность для нового detection

Теперь у нас есть практический алгоритм:

```text
1. Сформулировать threat / behavior.
2. Определить observable.
3. Проверить, виден ли он выбранному сенсору.
4. Определить protocol representation.
5. Ограничить область header / flow.
6. Выбрать подходящий buffer.
7. Написать минимальную detection condition.
8. Создать positive test.
9. Создать negative test.
10. Создать variant test.
11. Проверить FP/FN.
12. Изменить правило и повторить regression matrix.
13. Зафиксировать SID/rev и rationale.
```

Если шаги 8–12 отсутствуют, мы ещё не доказали качество detection.

---

## 18. Проверьте понимание

<div class="quiz" data-question-id="chapter8-q1">
  <p><strong>Правило ищет <code>../</code> во всём TCP payload. В POST body легитимного запроса встречается такая последовательность. Какое улучшение наиболее непосредственно соответствует гипотезе «traversal-like marker в HTTP URI»?</strong></p>
  <button data-choice="a">A. Увеличить severity правила</button>
  <button data-choice="b" data-correct="true">B. Ограничить detection HTTP URI buffer и направлением к серверу</button>
  <button data-choice="c">C. Добавить threshold 1 alert/minute</button>
  <button data-choice="d">D. Искать тот же content дважды</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q2">
  <p><strong>После tuning правило перестало срабатывать на benign-like URI, но также пропустило изменённый malicious target. Что мы получили?</strong></p>
  <button data-choice="a">A. Только улучшение precision без побочных эффектов</button>
  <button data-choice="b">B. Ошибку parser</button>
  <button data-choice="c" data-correct="true">C. Снижение одного класса FP ценой нового FN</button>
  <button data-choice="d">D. Проблему placement</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q3">
  <p><strong>Зачем detection regression matrix содержит normal, attack-like и variant cases?</strong></p>
  <button data-choice="a">A. Чтобы увеличить число alerts</button>
  <button data-choice="b">B. Чтобы заменить анализ EVE</button>
  <button data-choice="c">C. Чтобы определить только производительность сенсора</button>
  <button data-choice="d" data-correct="true">D. Чтобы проверить не только срабатывание, но и границы покрытия и ложных совпадений</button>
  <div class="quiz-feedback"></div>
</div>

<div class="chapter-summary">
  <span>Главная мысль главы</span>
  <p>Хорошее сетевое обнаружение начинается не с Suricata syntax. Оно начинается с проверяемой гипотезы: какое поведение нас интересует, какой observable оно оставляет, в каком protocol representation его видит сенсор и какие positive/negative/variant tests должны подтвердить ожидаемый результат. Tuning всегда оценивается через изменение FP/FN, а не только через количество alert.</p>
</div>

<div class="next-step">
<strong>Следующий шаг:</strong> в <a href="../../labs/lab02/">ЛР №2 — Network Detection Engineering</a> вы прогоните одну и ту же detection hypothesis через пять тестовых сценариев и увидите, как изменение buffer и контекста меняет TP/FP/FN.
</div>
