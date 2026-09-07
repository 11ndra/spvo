# Глава 7. Где размещать сенсоры и что они действительно видят

<div class="chapter-lead">
<p>Хорошее правило бесполезно, если нужный трафик никогда не попадает в систему обнаружения. Поэтому размещение сенсора — не вопрос «куда удобнее поставить сервер», а вопрос <strong>какие взаимодействия мы хотим наблюдать и через какую точку они реально проходят</strong>.</p>

<p>В этой главе мы будем использовать одну и ту же инфраструктуру и менять только точку наблюдения. Это позволит увидеть главное: один и тот же NIDS получает совершенно разную картину сети в зависимости от placement.</p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь объяснить:</strong>
<p>почему периметровый сенсор не гарантирует видимость east-west трафика; чем отличаются пассивное наблюдение и inline; зачем нужны зеркалирование трафика (SPAN) и сетевой ответвитель (TAP); как TLS termination и асимметричная маршрутизация влияют на visibility; и как аргументированно выбрать точки наблюдения для конкретных сценариев угроз.</p>
</div>

---

## 1. Сенсор видит не сеть — сенсор видит доставленный ему трафик

Представим, что Suricata запущена, правила загружены и сервис работает без ошибок.

Это ещё не означает, что она видит всю инфраструктуру.

Если два сервера взаимодействуют внутри одного сегмента, а сенсор получает только интернет-трафик на периметре, внутреннее соединение может вообще не попасть в движок обнаружения.

Поэтому первый вопрос при проектировании visibility звучит так:

> **Какой поток я хочу контролировать и через какую физическую или логическую точку он проходит?**

Только после этого имеет смысл выбирать способ подключения сенсора.

---

## 2. Референсная инфраструктура

Ниже одна учебная топология, которую будем использовать на протяжении главы.

<div class="placement-lab" data-placement="perimeter">

  <div class="placement-controls">
    <button class="placement-choice active" data-placement-choice="perimeter">Периметр</button>
    <button class="placement-choice" data-placement-choice="dmz">DMZ → Internal</button>
    <button class="placement-choice" data-placement-choice="eastwest">Внутренний сегмент</button>
    <button class="placement-choice" data-placement-choice="inline">Inline IPS</button>
  </div>

  <div class="reference-topology">

    <section class="topology-zone external">
      <span class="zone-label">Внешняя сеть</span>
      <div class="topology-node">
        <strong>Internet</strong>
        <small>пользователи и внешние узлы</small>
      </div>
    </section>

    <div class="topology-flow flow-internet-web" data-flow="internet-web">
      <span>HTTPS 443</span>
      <b>↓</b>
    </div>

    <section class="topology-zone perimeter-zone">
      <span class="zone-label">Периметр</span>
      <div class="topology-node security">
        <strong>NGFW</strong>
        <small>сетевые политики</small>
      </div>
      <div class="sensor-marker sensor-perimeter">
        <strong>NIDS</strong>
        <small>точка A</small>
      </div>
    </section>

    <div class="topology-flow flow-firewall-web" data-flow="internet-web">
      <span>разрешённый HTTPS</span>
      <b>↓</b>
    </div>

    <section class="topology-zone dmz-zone">
      <span class="zone-label">DMZ</span>
      <div class="topology-node">
        <strong>Web</strong>
        <small>публичный сервис</small>
      </div>
      <div class="sensor-marker sensor-dmz">
        <strong>NIDS</strong>
        <small>точка B</small>
      </div>
    </section>

    <div class="topology-flow flow-web-app" data-flow="web-app">
      <span>Web → App</span>
      <b>↓</b>
    </div>

    <section class="topology-zone internal-zone">
      <span class="zone-label">Внутренняя сеть</span>

      <div class="internal-nodes">
        <div class="topology-node">
          <strong>Users</strong>
          <small>рабочие станции</small>
        </div>

        <div class="topology-node">
          <strong>App</strong>
          <small>бизнес-логика</small>
        </div>

        <div class="topology-node">
          <strong>Database</strong>
          <small>чувствительные данные</small>
        </div>
      </div>

      <div class="internal-flows">
        <div data-flow="users-app">
          <span>Users ↔ App</span>
        </div>
        <div data-flow="app-db">
          <span>App ↔ Database</span>
        </div>
        <div data-flow="east-west">
          <span>Host ↔ Host</span>
        </div>
      </div>

      <div class="sensor-marker sensor-eastwest">
        <strong>NIDS</strong>
        <small>точка C</small>
      </div>
    </section>

  </div>

  <div class="placement-explanation">
    <div>
      <span>Выбрана точка наблюдения</span>
      <strong class="placement-title">После периметрового firewall</strong>
    </div>
    <p class="placement-text">Сенсор хорошо видит разрешённые north-south соединения между Интернетом и DMZ, но не получает автоматически внутренние взаимодействия App ↔ Database или Host ↔ Host.</p>
    <div class="placement-blind">
      <strong>Слепая зона:</strong>
      <span class="placement-blind-text">east-west трафик внутри внутренних сегментов.</span>
    </div>
  </div>

</div>

Топология специально упрощена. В реальной сети маршруты, VLAN, VRF, балансировщики, VPN, облачные сегменты и резервирование делают картину сложнее. Но принцип остаётся тем же.

---

## 3. Точка A: после периметрового firewall

Периметровая позиция отвечает на важный вопрос:

> **Что из внешней сети действительно прошло через сетевую политику?**

Это часто полезнее, чем анализировать весь «грязный» трафик до firewall.

Если firewall уже отбросил миллионы пакетов к закрытым портам, NIDS после него может сосредоточиться на том, что реально достигло разрешённых сервисов.

Но такая позиция не даёт магической видимости внутренних взаимодействий.

Например:

```text
App → Database
User workstation → Internal server
Compromised host → another host
```

могут никогда не проходить через периметровую точку.

---

## 4. Точка B: граница DMZ и внутренней сети

После компрометации публичного Web-сервера атакующий часто пытается двигаться дальше.

Теперь интересующий поток уже другой:

```text
Web → App
```

Если сенсор стоит только на интернет-периметре, внутреннее соединение может оказаться за пределами его наблюдения.

Поэтому отдельная точка между DMZ и внутренними системами отвечает на другой вопрос:

> **Что публичный сервис пытается делать по отношению к внутренней инфраструктуре?**

Это пример того, почему placement должен следовать за **сценарием угрозы**, а не за привычкой «ставить IDS возле firewall».

---

## 5. Точка C: east-west внутри инфраструктуры

**North-south** обычно называют взаимодействия между внешней и внутренней средой.

**East-west** — взаимодействия между внутренними узлами и сегментами.

После первичной компрометации злоумышленнику часто нужно:

```text
найти другие узлы
→ подключиться к ним
→ получить дополнительные привилегии
→ добраться до целевых систем
```

Если visibility существует только на периметре, такая активность может происходить внутри слепой зоны.

Поэтому на критичных внутренних направлениях могут появляться дополнительные точки наблюдения.

Но ставить сенсор «в каждый VLAN» тоже не является универсальным ответом. Каждая новая точка означает новые объёмы трафика, вычислительные ресурсы, хранение, правила и эксплуатацию.

Снова работает знакомый принцип:

> **Собираем не максимум трафика, а достаточную телеметрию для нужных сценариев detection.**

---

## 6. Как пассивный NIDS вообще получает копию трафика

До сих пор мы говорили «сенсор наблюдает этот сегмент», но физически пассивный NIDS не обязан находиться в основном пути передачи данных.

Ему нужно **доставить копию** интересующего трафика.

Один распространённый способ — **зеркалирование трафика (SPAN, port mirroring)**.

```text
Client ───────► Switch ───────► Server
                  │
                  └── копия ──► NIDS
```

Коммутатор копирует выбранные порты или VLAN на порт мониторинга.

Преимущество очевидно: сенсор не находится в основном data path, поэтому его отказ обычно не останавливает рабочее соединение.

Но копия тоже является ресурсом. При неправильной конфигурации или перегрузке часть трафика может не попасть к сенсору.

Поэтому фраза:

> «SPAN настроен»

ещё не доказывает полноту visibility.

---

## 7. TAP: отдельный способ получить наблюдаемую копию

Другой вариант — **сетевой ответвитель (Network TAP)**.

Он устанавливается в сетевой путь и предоставляет отдельный выход с копией трафика для мониторинга.

Концептуально:

```text
Network A ─── TAP ─── Network B
                │
                └────► NIDS
```

TAP часто выбирают там, где важна предсказуемая и независимая копия трафика.

Но утверждение:

> «TAP всегда лучше SPAN»

неверно.

Нужно учитывать физическую инфраструктуру, стоимость, тип и скорость линии, резервирование, обслуживание и конкретную задачу наблюдения.

SPAN и TAP — это **способы доставки данных**, а не разные методы обнаружения.

---

## 8. Inline IPS: когда сенсор становится частью пути

В режиме предотвращения ситуация принципиально меняется.

```text
Client ───► IPS ───► Server
```

Теперь пакет должен пройти через IPS, чтобы достичь назначения.

Это даёт системе возможность принять решение:

```text
ALLOW
DROP
REJECT
```

Но вместе с enforcement появляются новые архитектурные вопросы:

```text
выдержит ли IPS нагрузку?
какую задержку она добавляет?
что произойдёт при отказе?
будет ли fail-open или fail-close?
нужно ли HA?
как безопасно обновлять правила?
```

Поэтому переход:

```text
IDS → IPS
```

— это не просто переключение слова `alert` на `drop`.

Это изменение роли устройства в доступности сервиса.

---

## 9. Шифрование меняет полезность точки наблюдения

Placement определяется не только сетевой топологией.

Представим:

```text
Client
   ↓ TLS
Reverse Proxy
   ↓ HTTP или новый TLS
Application
```

Сенсор до TLS termination может видеть адреса, порты, параметры соединения и доступную TLS-метаинформацию, но не открытый HTTP payload.

После точки расшифрования доступный контекст может быть совсем другим.

Поэтому инженер должен спрашивать:

> **На каком этапе жизненного цикла соединения мне нужен анализ?**

А не только:

> «На каком switch стоит сделать SPAN?»

При этом TLS inspection или размещение после termination должно учитывать архитектуру, политику безопасности, конфиденциальность и производительность. Шифрование не делает NIDS полностью слепой, но меняет набор доступных признаков.

---

## 10. Асимметричная маршрутизация

Stateful detection становится сложнее, если разные направления одного соединения проходят по разным маршрутам.

Например:

```text
Client ──► Sensor A ──► Server
Client ◄─────────────── Server
          другой путь
```

Sensor A видит запросы, но не видит ответы.

В результате ему может не хватать контекста для корректного восстановления состояния и некоторых видов протокольного анализа.

Поэтому при выборе placement инженер должен учитывать не только схему «откуда → куда», но и **реальный маршрут в обоих направлениях**.

---

## 11. Как инженер выбирает точку наблюдения

Вместо универсального списка «до firewall / после firewall / в DMZ» полезнее использовать одну последовательность.

```text
Что я хочу обнаружить?
        ↓
Какой сетевой след это оставляет?
        ↓
Между какими узлами проходит этот поток?
        ↓
Через какую точку он гарантированно проходит?
        ↓
Что будет видно в этой точке?
        ↓
Как доставить трафик сенсору?
        ↓
Нужен passive IDS или inline IPS?
```

Например:

```text
сценарий:
скомпрометированный Web пытается подключиться к Database

нужный след:
Web → internal services

полезная точка:
граница DMZ / internal

доставка:
SPAN или TAP

роль:
сначала passive IDS
```

Такое решение уже можно аргументировать технически.

---

## 12. Как проверить, что placement действительно работает

После установки сенсора недостаточно увидеть:

```text
systemctl status suricata
active (running)
```

Нужно проверить end-to-end visibility.

Например:

```text
1. Сгенерировать контролируемый поток по нужному маршруту.
2. Убедиться, что поток физически дошёл до интерфейса сенсора.
3. Проверить, что IDS распознала направление и протокол.
4. Выполнить тестовый detection.
5. Проверить появление события.
6. Повторить тест для соседнего потока, который сенсор видеть не должен.
```

Последний шаг особенно полезен.

Он проверяет не только наличие visibility, но и **границы зоны наблюдения**.

### Реальный случай: CISA Red Team и невидимое lateral movement

В 2023 году CISA опубликовала результаты red-team assessment реальной организации. Команда получила устойчивый доступ и проводила действия, которые защитная инфраструктура должна была иметь возможность заметить.

Среди ключевых выводов CISA указала **недостаточный host и network monitoring**. Значительная часть lateral movement, persistence и command-and-control активности не вызвала эффективной реакции со стороны IDS/IPS, endpoint protection, proxy logs и Windows event logs.

В отчёте приводился, например, lateral movement с использованием SMB/Windows Admin Shares и Windows Service Creation, а также прямое соединение Domain Controller с внешним узлом.

Для нашей главы важен не конкретный продукт, а архитектурный вопрос:

> если критичный east-west поток или исходящее соединение от чувствительного сервера не попадает в полезную точку наблюдения, наличие NIDS «где-то в сети» не решает задачу.

<div class="real-case-lesson">
  <strong>Инженерный вывод</strong>
  <p>Placement нужно проверять против конкретных attack paths: workstation → server, admin workstation → domain controller, critical server → Internet. Периметровая visibility не является доказательством внутренней visibility.</p>
</div>

Best practice — комбинировать network monitoring на ключевых внутренних направлениях с host telemetry, а сеть сегментировать так, чтобы lateral movement проходил через контролируемые границы. CISA отдельно рекомендует network segmentation для ограничения lateral movement и использование как сетевых, так и host-based источников для его обнаружения.

<div class="real-case-source">
<strong>Источники:</strong>
<a href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-059a">CISA — AA23-059A: Red Team Shares Key Findings to Improve Monitoring and Hardening of Networks</a>;
<a href="https://www.cisa.gov/news-events/alerts/2022/01/11/understanding-and-mitigating-russian-state-sponsored-cyber-threats-us-critical-infrastructure">CISA/FBI/NSA — Protective Controls and Architecture guidance</a>
</div>

<div class="chapter-summary">
  <span>Главная мысль главы</span>
  <p>Размещение сенсора начинается не с выбора порта коммутатора, а с threat scenario и нужного сетевого следа. NIDS видит только тот трафик, который проходит через выбранную точку или доставляется туда копированием. SPAN и TAP решают задачу доставки данных, inline IPS становится частью data path, а шифрование и асимметричная маршрутизация способны существенно изменить доступный контекст.</p>
</div>

---

## 13. Проверьте понимание на практике

<div class="quiz" data-question-id="chapter7-q1">
  <p><strong>App и Database общаются внутри внутреннего сегмента. NIDS получает только трафик после интернет-периметра. Что наиболее вероятно?</strong></p>
  <button data-choice="a">A. NIDS обязательно увидит App ↔ Database</button>
  <button data-choice="b" data-correct="true">B. Этот поток может остаться невидимым, если он не проходит через наблюдаемую точку и не копируется туда</button>
  <button data-choice="c">C. Нужно только добавить сигнатуру</button>
  <button data-choice="d">D. Любой NIDS автоматически получает все VLAN</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-q2">
  <p><strong>В чём принципиальное отличие inline IPS от пассивного NIDS?</strong></p>
  <button data-choice="a">A. Inline IPS не анализирует трафик</button>
  <button data-choice="b" data-correct="true">B. Рабочий трафик проходит через IPS, поэтому её решение или отказ могут непосредственно влиять на доступность соединения</button>
  <button data-choice="c">C. Пассивный NIDS всегда использует Wi‑Fi</button>
  <button data-choice="d">D. Inline IPS не имеет правил</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-q3">
  <p><strong>Почему сенсор перед TLS termination и сенсор после неё могут иметь разную detection visibility?</strong></p>
  <button data-choice="a">A. До termination сеть не использует IP</button>
  <button data-choice="b">B. После termination исчезают все сетевые метаданные</button>
  <button data-choice="c" data-correct="true">C. В разных точках доступен разный протокольный контекст и содержимое приложения</button>
  <button data-choice="d">D. Потому что TLS работает только с TAP</button>
  <div class="quiz-feedback"></div>
</div>

<div class="next-step">
<strong>Теоретическая база первого блока собрана:</strong> теперь студент уже может обоснованно ответить, что наблюдать, как система анализирует данные, как оценивать качество detection и где разместить сенсор. Следующий шаг — <a href="../../prelab/">Pre-Lab Test №1</a> и первая практическая работа.
</div>
