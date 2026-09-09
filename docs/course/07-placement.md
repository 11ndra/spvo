# Глава 7. Где размещать сенсоры и что они действительно видят

<div class="chapter-lead">
<p>Хорошее правило бесполезно, если нужный трафик никогда не попадает в систему обнаружения. Поэтому placement начинается не с вопроса «куда поставить NIDS», а с вопроса: <strong>какую активность мы хотим обнаружить и где в сети существует её наблюдаемый след?</strong></p>

<p>В этой главе точки наблюдения не будут «прыгать» по сети. Мы зафиксируем несколько возможных точек и будем менять только <strong>сценарий угрозы</strong>. Так становится видно, почему для разных attack paths нужны разные места наблюдения.</p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь объяснить:</strong>
<p>как перейти от threat scenario к сетевому пути и точке наблюдения; почему периметровый сенсор не гарантирует visibility east-west трафика; чем отличаются точка наблюдения и способ подключения; зачем нужны SPAN и TAP; когда passive IDS превращается в inline IPS; и как проверить реальную границу видимости сенсора.</p>
</div>

---

## 1. Placement начинается со сценария угрозы

Представим одну инфраструктуру:

```text
Internet
   ↓
 NGFW
   ↓
  Web
   ↓
  App
   ↓
Database

Users ───────→ App
  │
  └──────────→ другие внутренние узлы
```

На ней можно заранее выделить несколько **возможных точек наблюдения**:

```text
A — Internet / DMZ
B — DMZ / Internal
C — внутри Internal
```

Это пока не «места, куда мы обязаны поставить IDS».

Это **candidate observation points** — точки, через которые могут проходить интересующие нас сетевые пути.

Правильный порядок мышления такой:

```text
Что хотим обнаружить?
        ↓
Какой сетевой след это оставляет?
        ↓
Между какими узлами проходит этот поток?
        ↓
Через какие точки он реально проходит?
        ↓
Какая точка даёт нужную visibility?
```

---

## 2. От сценария угрозы к точке наблюдения

Выберите сценарий. Топология остаётся неизменной, но подсвечивается именно тот путь, который имеет значение для выбранной угрозы.

<div class="placement-scenario-lab" data-scenario="web-attack">

  <div class="scenario-controls">
    <button class="scenario-choice active" data-scenario-choice="web-attack">Атака на Web</button>
    <button class="scenario-choice" data-scenario-choice="web-compromised">Web скомпрометирован</button>
    <button class="scenario-choice" data-scenario-choice="lateral">Lateral movement</button>
  </div>

  <div class="scenario-topology">

    <div class="scenario-row external-row">
      <div class="scenario-node external" data-node="internet">
        <strong>Internet</strong>
        <small>внешние пользователи и узлы</small>
      </div>
    </div>

    <div class="scenario-path vertical" data-path="internet-ngfw">
      <span>HTTPS 443</span>
      <b>↓</b>
    </div>

    <div class="scenario-row">
      <div class="observation-point point-a" data-point="A">
        <span>A</span>
        <strong>Internet / DMZ</strong>
        <small>кандидатная точка наблюдения</small>
      </div>

      <div class="scenario-node security" data-node="ngfw">
        <strong>NGFW</strong>
        <small>сетевые политики</small>
      </div>
    </div>

    <div class="scenario-path vertical" data-path="ngfw-web">
      <span>разрешённый трафик</span>
      <b>↓</b>
    </div>

    <div class="scenario-row">
      <div class="scenario-node" data-node="web">
        <strong>Web</strong>
        <small>DMZ / публичный сервис</small>
      </div>
    </div>

    <div class="scenario-path vertical" data-path="web-app">
      <span>Web → App</span>
      <b>↓</b>
    </div>

    <div class="scenario-row">
      <div class="observation-point point-b" data-point="B">
        <span>B</span>
        <strong>DMZ / Internal</strong>
        <small>кандидатная точка наблюдения</small>
      </div>

      <div class="scenario-node" data-node="app">
        <strong>App</strong>
        <small>внутренний сервис</small>
      </div>
    </div>

    <div class="internal-scenario-area">

      <div class="internal-scenario-nodes">
        <div class="scenario-node" data-node="users">
          <strong>Users</strong>
          <small>рабочие станции</small>
        </div>

        <div class="scenario-node" data-node="internal-host">
          <strong>Internal Host</strong>
          <small>внутренний сервер</small>
        </div>

        <div class="scenario-node" data-node="database">
          <strong>Database</strong>
          <small>чувствительные данные</small>
        </div>
      </div>

      <div class="internal-scenario-paths">
        <div data-path="users-host">
          <span>Users ↔ Host</span>
        </div>
        <div data-path="host-database">
          <span>Host ↔ Database</span>
        </div>
        <div data-path="app-database">
          <span>App ↔ Database</span>
        </div>
      </div>

      <div class="observation-point point-c" data-point="C">
        <span>C</span>
        <strong>Internal</strong>
        <small>кандидатная точка наблюдения</small>
      </div>

    </div>

  </div>

  <div class="scenario-reasoning">

    <div class="reasoning-primary">
      <span>Сценарий</span>
      <strong class="scenario-title">Внешний узел атакует публичный Web-сервис</strong>
    </div>

    <div class="reasoning-grid">
      <div>
        <span>Что хотим увидеть</span>
        <strong class="scenario-goal">Подозрительную активность внутри разрешённого входящего трафика.</strong>
      </div>

      <div>
        <span>Наблюдаемый путь</span>
        <strong class="scenario-route">Internet → NGFW → Web</strong>
      </div>

      <div>
        <span>Полезная точка</span>
        <strong class="scenario-point">A</strong>
      </div>

      <div>
        <span>Почему</span>
        <strong class="scenario-why">Этот поток проходит через границу Internet / DMZ и может быть предоставлен сетевому сенсору.</strong>
      </div>
    </div>

    <div class="scenario-blind">
      <strong>Что эта точка не доказывает:</strong>
      <span class="scenario-blind-text">наличие visibility на Web → App, App → Database и другие внутренние взаимодействия.</span>
    </div>

  </div>

</div>

Здесь важно заметить изменение логики.

Мы не говорим:

> «Теперь перенесём IDS из A в B».

Мы говорим:

> **«Изменился сценарий угрозы — значит, изменился интересующий сетевой путь. Теперь нужна другая точка наблюдения».**

---

## 3. Что меняется между тремя сценариями

### Сценарий 1: атака на публичный Web

Интересующий путь:

```text
Internet → NGFW → Web
```

Точка **A** полезна, потому что этот поток проходит через границу внешней сети и DMZ.

Точка **C** для этого вопроса не нужна.

Она может быть важна для других задач, но не добавляет необходимой visibility именно к рассматриваемому пути.

### Сценарий 2: Web уже скомпрометирован

Теперь атакующий пытается двигаться дальше:

```text
Web → App
```

Это уже другой поток.

Периметровая точка A перестаёт быть основной точкой наблюдения, потому что интересующее действие происходит **после** внешнего периметра.

Полезной становится точка **B** — граница между DMZ и внутренней сетью.

### Сценарий 3: lateral movement внутри сети

Например:

```text
Compromised workstation
        ↓
Internal Host
        ↓
Database
```

Здесь ни внешний периметр, ни граница DMZ не гарантируют visibility.

Нужна точка **C** или другой источник внутренней сетевой телеметрии на соответствующем маршруте.

Отсюда главный вывод:

> **NIDS на интернет-периметре не означает, что организация имеет network visibility внутри сети.**

---

## 4. Точка наблюдения и способ подключения — не одно и то же

После выбора точки появляется следующий инженерный вопрос:

> **Как доставить интересующий трафик в NIDS?**

И только здесь появляются SPAN и TAP.

Допустим, мы решили, что нам нужна visibility на пути:

```text
Web → App
```

Это означает:

```text
нужная точка = B
```

Но ещё не определяет способ подключения.

Для пассивного наблюдения можно предоставить сенсору **копию** трафика.

### Зеркалирование трафика (SPAN)

```text
Web ───────► Switch ───────► App
                │
                └── copy ──► NIDS
```

Коммутатор копирует выбранный трафик на monitoring port.

Преимущество: NIDS не находится в основном data path.

Ограничение: полнота копии зависит от конфигурации и доступной производительности зеркалирования.

### Network TAP

Другой вариант — **сетевой ответвитель (Network TAP)**:

```text
Web ─────── TAP ─────── App
              │
              └────────► NIDS
```

Он предоставляет отдельную копию наблюдаемого трафика.

Но:

> **В этом курсе TAP и SPAN рассматриваются как разные способы доставки копии трафика, а не как универсальная шкала «лучше/хуже».**

NIST SP 800-94 приводит и spanning port, и network tap как варианты для passive network sensor. Выбор между ними является инженерным решением и зависит от требований к полноте наблюдения, производительности, физической архитектуре и эксплуатации.

SPAN и TAP отвечают на вопрос:

> **как получить данные в выбранной точке?**

а не:

> «какую атаку обнаруживать?»

---

## 5. Passive IDS и Inline IPS — это другое измерение

После того как точка наблюдения выбрана, нужно определить роль системы.

### Passive IDS

```text
Traffic ─────────────► Server
             │
             └ copy ─► IDS
```

Основной поток не проходит через IDS.

Система наблюдает копию и создаёт события.

### Inline IPS

```text
Traffic ───► IPS ───► Server
```

Теперь система находится непосредственно в пути.

Она может принять решение:

```text
ALLOW
DROP
REJECT
```

Это означает, что понятия:

```text
A / B / C
```

и:

```text
Passive / Inline
```

не являются альтернативами одного уровня.

Правильнее:

```text
ГДЕ наблюдаем?
        ↓
A / B / C

КАК подключена система?
        ↓
Passive / Inline
```

В одной и той же точке B архитектура может использовать пассивный NIDS или inline IPS — в зависимости от требований.

---

## 6. Когда нужен именно prevention

Возможность заблокировать событие не означает, что систему всегда нужно ставить inline.

Если задача:

> увидеть попытку lateral movement и передать событие SOC,

может быть достаточно passive visibility.

Если задача:

> немедленно остановить определённый класс сетевой атаки,

может потребоваться enforcement.

Но тогда меняется влияние на бизнес.

Нужно учитывать:

```text
пропускную способность
packet loss
latency
fail-open / fail-close
HA
ошибочный blocking decision
обновления и rollback
```

Поэтому переход:

```text
IDS → IPS
```

— это изменение архитектурной роли, а не просто замена `alert` на `drop`.

---

## 7. Шифрование меняет полезность одной и той же точки

Даже правильная точка наблюдения может давать разный объём контекста.

Например:

```text
Client
   ↓ TLS
Reverse Proxy
   ↓ HTTP или новый TLS
Application
```

Перед TLS termination сетевой сенсор обычно сохраняет сетевую visibility — адреса, порты, размеры/временные характеристики потока — и может получать часть handshake/metadata, **если она действительно передаётся открыто и доступна в данной версии TLS и конфигурации**. Конкретный набор полей нельзя считать постоянным: он зависит, в частности, от версии протокола, расширений и точки наблюдения.

После termination, если между точкой расшифрования и приложением существует незашифрованный или повторно доступный для анализа поток, сенсору может стать доступен прикладной контекст, которого не было на внешней стороне TLS.

Поэтому вопрос placement должен звучать не только:

> «через какой switch проходит поток?»

но и:

> **«в каком виде этот поток существует в выбранной точке?»**

Шифрование не делает NIDS полностью слепой, но меняет доступные признаки.

!!! note "Актуальность TLS"
    Для TLS 1.3 в курсе используется **RFC 9846 (июль 2026)**. Он заменил RFC 8446, сохранив TLS 1.3 и уточнив ряд требований. Поэтому более старые ссылки на RFC 8446 используются только как исторические.

---

## 8. Асимметричная маршрутизация

Stateful detection становится сложнее, если два направления одного соединения идут разными маршрутами.

```text
Client ──► Sensor ──► Server
Client ◄────────────── Server
          другой путь
```

Сенсор получает запросы, но не получает ответы.

В результате ему может не хватать контекста для:

```text
state tracking
TCP reassembly
protocol analysis
части сигнатур
```

Поэтому недостаточно знать логическую связь:

```text
Client ↔ Server
```

Нужно понимать реальный маршрут **в обоих направлениях**.

---

## 9. Полный алгоритм выбора placement

Теперь всю главу можно свести к одной инженерной цепочке:

```text
Threat scenario
      ↓
Какой сетевой след он оставляет?
      ↓
Network path
      ↓
Какая точка видит этот путь?
      ↓
Observation point
      ↓
Как доставить данные?
      ↓
SPAN / TAP / другой источник
      ↓
Нужно только наблюдать или блокировать?
      ↓
Passive IDS / Inline IPS
      ↓
Validation
```

Пример:

```text
сценарий:
скомпрометированный Web обращается к App

след:
Web → App

точка:
B — DMZ / Internal

доставка:
SPAN

роль:
Passive IDS

проверка:
контролируемый Web → App запрос должен быть виден;
App → Database не обязан быть виден этой же точкой
```

Это уже не «поставили сенсор возле firewall».

Это обоснованное архитектурное решение.

---

## 10. Как проверить, что placement действительно работает

После установки недостаточно увидеть:

```text
systemctl status suricata
active (running)
```

Нужно проверить end-to-end visibility.

```text
1. Сгенерировать контролируемый поток по нужному маршруту.
2. Убедиться, что поток дошёл до интерфейса сенсора.
3. Проверить корректное направление и протокол.
4. Выполнить тестовый detection.
5. Проверить появление события.
6. Сгенерировать соседний поток, который эта точка видеть не должна.
```

Шестой шаг принципиально важен.

Он проверяет не только:

> «что система видит?»

но и:

> **«где заканчивается её реальная зона наблюдения?»**

### Реальный случай: CISA Red Team и невидимое lateral movement

В 2023 году CISA опубликовала результаты red-team assessment реальной организации. Команда получила устойчивый доступ и проводила действия, которые защитная инфраструктура должна была иметь возможность заметить.

Среди ключевых выводов CISA указала **недостаточный host и network monitoring**. Значительная часть lateral movement, persistence и command-and-control активности не вызвала эффективной реакции со стороны IDS/IPS, endpoint protection, proxy logs и Windows event logs.

В отчёте приводился, например, lateral movement с использованием SMB/Windows Admin Shares и Windows Service Creation, а также прямое соединение Domain Controller с внешним узлом.

Для нашей главы важен архитектурный вопрос:

> если критичный east-west поток или исходящее соединение от чувствительного сервера не попадает в полезную точку наблюдения, наличие NIDS «где-то в сети» не решает задачу.

<div class="real-case-lesson">
  <strong>Инженерный вывод</strong>
  <p>Placement нужно проверять против конкретных attack paths: workstation → server, admin workstation → domain controller, critical server → Internet. Периметровая visibility не является доказательством внутренней visibility.</p>
</div>

CISA по итогам этого assessment рекомендовала baseline нормального сетевого трафика, tuning сетевых и host-based средств и улучшение мониторинга lateral movement/persistence. **Наш инженерный вывод для placement**: критичные внутренние attack paths должны иметь проверяемую visibility; host telemetry дополняет network visibility, а сегментация помогает направлять нежелательные перемещения через контролируемые границы.

<div class="real-case-source">
<strong>Источники:</strong>
<a href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-059a">CISA — AA23-059A: Red Team Shares Key Findings to Improve Monitoring and Hardening of Networks</a>;
<a href="https://www.cisa.gov/news-events/alerts/2022/01/11/understanding-and-mitigating-russian-state-sponsored-cyber-threats-us-critical-infrastructure">CISA/FBI/NSA — Protective Controls and Architecture guidance</a>
</div>

<div class="chapter-summary">
  <span>Главная мысль главы</span>
  <p>Placement начинается с threat scenario, а не с выбора места для IDS. Сначала определяется нужный сетевой след и его реальный путь, затем выбирается точка наблюдения. Только после этого решается, как доставить трафик сенсору и требуется ли passive monitoring или inline prevention. Хорошая архитектура умеет не только показать, что сенсор видит, но и доказать границы его visibility.</p>
</div>

---

## 11. Проверьте понимание на практике

<div class="quiz" data-question-id="chapter7-q1">
  <p><strong>Web-сервер уже скомпрометирован и начинает обращаться к внутреннему App-серверу. Какая логика выбора placement наиболее корректна?</strong></p>
  <button data-choice="a">A. Всегда использовать сенсор только на интернет-периметре</button>
  <button data-choice="b" data-correct="true">B. Определить путь Web → App и выбрать точку, через которую этот поток реально проходит, например границу DMZ/Internal</button>
  <button data-choice="c">C. Добавить больше сигнатур в любой существующий NIDS</button>
  <button data-choice="d">D. Сначала выбрать TAP, а потом определить, какой трафик нужен</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-q2">
  <p><strong>Что описывают SPAN и TAP?</strong></p>
  <button data-choice="a">A. Разные методы сигнатурного обнаружения</button>
  <button data-choice="b">B. Разные точки A/B/C</button>
  <button data-choice="c" data-correct="true">C. Способы предоставить сенсору копию интересующего сетевого трафика</button>
  <button data-choice="d">D. Только способы блокирования трафика</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-q3">
  <p><strong>Почему «точка B» и «Inline IPS» нельзя считать двумя альтернативными местами размещения?</strong></p>
  <button data-choice="a">A. Потому что inline не работает с сетью</button>
  <button data-choice="b" data-correct="true">B. B описывает где наблюдать, а inline описывает как система включена в выбранной точке и может ли она влиять на поток</button>
  <button data-choice="c">C. Потому что точка B всегда использует Wi‑Fi</button>
  <button data-choice="d">D. Потому что IPS нельзя размещать в DMZ</button>
  <div class="quiz-feedback"></div>
</div>

<div class="next-step">
<strong>Теоретическая база первого блока собрана:</strong> теперь студент может обоснованно ответить, что наблюдать, как система анализирует данные, как оценивать качество detection и как выбрать точку наблюдения. Следующий шаг — <a href="../../prelab/">Pre-Lab Test №1</a> и первая практическая работа.
</div>
