# Глава 1. Что такое IDS/IPS и зачем они нужны

<div class="chapter-lead">
<p>Информационная система уже защищена межсетевым экраном. Из внешней сети разрешён доступ только к публичному веб-сервису, остальные ненужные взаимодействия запрещены.</p>
<p>Но остаётся ключевой вопрос: <strong>что произойдёт, если нежелательная активность будет использовать именно тот путь, который системе необходимо оставить доступным?</strong></p>
</div>

<div class="chapter-outcomes">
<strong>После изучения главы студент должен уметь:</strong>
<p>объяснить назначение IDS и IPS; отличить detection от prevention; объяснить, почему firewall и IDS/IPS решают разные защитные задачи; на базовом уровне отличить WAF от IDS/IPS; объяснить, почему alert сам по себе ещё не означает компрометацию.</p>
</div>

---

## 1. Сначала обычная информационная система

<div class="teaching-figure" markdown="1">
<div class="figure-label">СХЕМА 1 · БАЗОВЫЙ СЕТЕВОЙ КОНТУР</div>

```mermaid
flowchart LR
    I[Internet] -->|сетевой трафик| F[Firewall]
    F -->|разрешённый трафик| W[Web Server]
```

<div class="figure-caption">Firewall находится на пути сетевого взаимодействия и применяет установленную политику доступа.</div>
</div>

Веб-сервер должен быть доступен пользователям. Полностью запретить обращения к нему нельзя, иначе сервис перестанет выполнять свою функцию.

<div class="policy-grid">
  <div class="policy-row allow"><span>Internet → Web Server</span><strong>ALLOW</strong></div>
  <div class="policy-row deny"><span>Internet → Database</span><strong>DENY</strong></div>
  <div class="policy-row deny"><span>Internet → SSH Management</span><strong>DENY</strong></div>
</div>

Если взаимодействие не требуется для работы системы, его следует ограничить политикой доступа, а не оставлять открытым в надежде, что IDS обнаружит каждую попытку атаки.

Но разрешённый веб-сервис всё равно остаётся доступным для взаимодействия.

<div class="concept-formula primary-formula">
  <span class="formula-left">ALLOWED</span>
  <span class="formula-sign">≠</span>
  <span class="formula-right">SAFE</span>
  <p>Разрешённое взаимодействие не обязательно является безопасным взаимодействием.</p>
</div>

---

## 2. Какую задачу решает Firewall

**Firewall** контролирует прохождение сетевого трафика в соответствии с установленной политикой безопасности.

Важно не сводить его работу к формуле `Firewall = IP + Port`. Простейшие механизмы фильтрации действительно могут принимать решения на основании адресов, протокола, портов и направления. Stateful firewall также учитывает состояние соединения, поэтому ответный трафик установленной допустимой сессии рассматривается в контексте этого соединения.

Современные NGFW могут учитывать приложения, пользователей и свойства прикладных протоколов. Поэтому противопоставление `Firewall = L3/L4`, а `IDS = L7` некорректно.

<div class="control-question-grid">
  <article class="control-question firewall-question">
    <span>FIREWALL</span>
    <strong>Допустимо ли данное сетевое взаимодействие?</strong>
    <p>Решение принимается в контексте политики доступа.</p>
  </article>
  <article class="control-question detection-question">
    <span>IDS/IPS</span>
    <strong>Есть ли в наблюдаемой активности признаки, требующие detection?</strong>
    <p>Это уже другая защитная задача.</p>
  </article>
</div>

Например, `Internet → Database:5432` может быть запрещено вообще, независимо от того, содержит ли соединение атаку. А обращение к публичному веб-сервису может быть разрешено, потому что без него система не выполняет свою функцию.

---

## 3. Где возникает задача обнаружения

!!! note "Учебная модель / синтетический сценарий"
    В этой главе намеренно используется обычный HTTP без TLS. Мы изолируем один механизм: различие между контролем допустимости взаимодействия и обнаружением. Ограничения видимости зашифрованного трафика будут изучаться позднее.

<div class="teaching-figure" markdown="1">
<div class="figure-label">СХЕМА 2 · РАЗРЕШЁННЫЙ WEB-ПУТЬ</div>

```mermaid
flowchart LR
    C[Client] -->|HTTP| F[Firewall]
    F -->|ALLOW TCP/8080| W[Web Server]
```

<div class="figure-caption">Оба запроса ниже проходят по одному и тому же разрешённому сетевому пути.</div>
</div>

<div class="example-compare">
  <article class="example-card normal-example">
    <span class="example-label">ШТАТНЫЙ ЗАПРОС</span>
    <pre><code>GET /lab-test HTTP/1.1
Host: web.lab</code></pre>
    <p>Запрос использует разрешённый web-сервис.</p>
  </article>
  <article class="example-card signal-example">
    <span class="example-label">ЗАПРОС С УЧЕБНЫМ МАРКЕРОМ</span>
    <pre><code>GET /admin-test?marker=ATTACK-LAB HTTP/1.1
Host: web.lab</code></pre>
    <p>Сетевой путь тот же, но наблюдаемая активность отличается.</p>
  </article>
</div>

С точки зрения рассмотренной сетевой политики оба запроса используют разрешённое взаимодействие с опубликованным сервисом.

Мы не предполагаем, что firewall умеет только проверять номер порта. В конкретной инфраструктуре он может обладать дополнительными функциями инспекции. Но сам факт разрешённости взаимодействия не отвечает на другой вопрос:

> **Содержит ли наблюдаемая активность признаки, которые система безопасности должна обнаружить?**

Это уже задача intrusion detection.

---

## 4. Что такое IDS

**IDS — Intrusion Detection System — система обнаружения вторжений.**

В общем виде IDS получает доступные ей сведения о происходящей активности и анализирует их на наличие заданных признаков возможных инцидентов или иной security-relevant activity.

<div class="process-strip">
  <div><span>1</span><strong>Активность</strong><small>в системе или сети</small></div>
  <b>→</b>
  <div><span>2</span><strong>Доступные данные</strong><small>то, что реально получает IDS</small></div>
  <b>→</b>
  <div><span>3</span><strong>Анализ</strong><small>применение detection logic</small></div>
  <b>→</b>
  <div><span>4</span><strong>Результат</strong><small>например, alert</small></div>
</div>

Ключевое выражение — **«доступные системе данные»**. IDS не обладает абсолютной наблюдаемостью. Что именно она сможет получить, зависит от типа системы, места размещения, способа получения данных, шифрования и конфигурации.

---

## 5. Event и Alert — не одно и то же

<div class="concept-pair compact-pair">
  <article class="concept-card">
    <span class="concept-index">EVENT</span>
    <h3>Зафиксированное событие</h3>
    <p>Например: соединение установлено, DNS-запрос получен, процесс запущен, файл изменён.</p>
  </article>
  <article class="concept-card accent-card">
    <span class="concept-index">ALERT</span>
    <h3>Выделенный результат detection</h3>
    <p>Наблюдаемая активность удовлетворила условию, которое требует внимания или дальнейшей обработки.</p>
  </article>
</div>

Конкретные продукты могут использовать термины `event`, `alert`, `finding` и `detection` по-разному. Для первой главы достаточно различать факт наблюдения и результат работы детектора.

---

## 6. Что означает Alert

Добавим к стенду пассивный сетевой сенсор.

<div class="teaching-figure" markdown="1">
<div class="figure-label">СХЕМА 3 · ПАССИВНЫЙ NIDS НЕ НАХОДИТСЯ В ТРАНЗИТНОМ ПУТИ</div>

```mermaid
flowchart LR
    C[Client] --> F[Firewall]
    F --> S((Наблюдаемый сегмент))
    S --> W[Web Server]
    S -. копия доступного трафика .-> N[NIDS]
    N --> A[Alert]
```

<div class="figure-caption">Основной трафик направляется к серверу. NIDS получает копию доступной ему активности из выбранной точки наблюдения.</div>
</div>

Пусть detector ищет маркер `ATTACK-LAB` в определённом поле HTTP-запроса. При получении запроса с этим маркером система формирует alert.

<div class="alert-demo">
  <span class="alert-demo-label">DETECTION RESULT</span>
  <strong>LAB1 HTTP marker observed</strong>
  <code>sid: 1000001 · marker: ATTACK-LAB</code>
</div>

<div class="evidence-boundary">
  <article class="evidence-supported">
    <span>ПОДТВЕРЖДЕНО</span>
    <p>В анализируемом системой представлении запроса присутствовал признак, удовлетворивший условию detector.</p>
  </article>
  <article class="evidence-not-proven">
    <span>НЕ ПОДТВЕРЖДЕНО</span>
    <p>Что приложение уязвимо, эксплуатация была успешной, атакующий получил доступ или сервер был скомпрометирован.</p>
  </article>
</div>

<div class="concept-formula danger-formula">
  <span class="formula-left">ALERT</span>
  <span class="formula-sign">≠</span>
  <span class="formula-right">COMPROMISE</span>
  <p>Alert сообщает о результате обнаружения, но сам по себе не доказывает успешный взлом.</p>
</div>

---

## 7. Что такое IPS

**IPS — Intrusion Prevention System — система предотвращения вторжений.** Она выполняет detection и дополнительно может инициировать действие, направленное на предотвращение или прекращение обнаруженной нежелательной активности.

<div class="ids-ips-contrast">
  <article>
    <span>IDS</span>
    <strong>Обнаружить</strong>
    <p>Получить данные, применить detection logic, сформировать результат.</p>
  </article>
  <div class="contrast-arrow">→</div>
  <article class="ips-card">
    <span>IPS</span>
    <strong>Обнаружить + воздействовать</strong>
    <p>После detection система может инициировать prevention action.</p>
  </article>
</div>

Не следует запоминать `IDS = сбоку`, `IPS = inline`. Это смешивает две характеристики: **как система получает данные** и **может ли она инициировать воздействие**.

Inline-система может работать в режиме `alert-only`. А пассивный detector в некоторых архитектурах может инициировать действие через другой control, например firewall API.

<div class="concept-formula warning-formula">
  <span class="formula-left">DETECTION</span>
  <span class="formula-sign">≠</span>
  <span class="formula-right">PREVENTION</span>
  <p>Обнаружение и воздействие — разные операции и имеют разную цену ошибки.</p>
</div>

---

## 8. Почему ошибка Prevention имеет другую цену

<div class="impact-grid">
  <article>
    <span>ALERT-ONLY</span>
    <strong>Ошибочное решение</strong>
    <p>Может создать лишнее оповещение и потребовать дополнительной проверки.</p>
  </article>
  <article class="impact-active">
    <span>AUTOMATIC PREVENTION</span>
    <strong>Ошибочное решение</strong>
    <p>Может отбросить легитимный трафик, прервать сессию или нарушить бизнес-процесс.</p>
  </article>
</div>

Это не означает, что IPS «опасен». Вывод другой:

> **Автоматическое предотвращение требует более строгой проверки detection logic и понимания последствий ошибочного воздействия.**

FP/FN и методы оценки качества появятся позднее, когда у студента уже будет базовая модель IDS/IPS.

---

## 9. Firewall и IDS/IPS не заменяют друг друга

Если внешний SSH-доступ не требуется, правильное решение — запретить его политикой доступа:

<div class="policy-decision deny-decision"><code>Internet → Server:22</code><strong>DENY</strong><span>ненужный путь закрывается</span></div>

IDS/IPS не должна подменять возможность устранить ненужный сетевой путь.

Но если публичный сервис должен обслуживать клиентов, некоторый набор взаимодействий необходимо разрешить. После этого остаётся задача наблюдения за security-relevant activity внутри доступной системе области.

<div class="concept-formula neutral-formula">
  <span class="formula-left">FIREWALL</span>
  <span class="formula-sign">≠</span>
  <span class="formula-right">IDS/IPS</span>
  <p>Это разные защитные функции, даже когда они реализованы внутри одного продукта.</p>
</div>

---

## 10. Функция и продукт — разные вещи

Одна NGFW-платформа может совмещать несколько функций.

<div class="function-stack">
  <span>NGFW platform</span>
  <div>Firewall policy</div>
  <div>IPS</div>
  <div>Application identification</div>
  <div>URL filtering</div>
  <div>Logging</div>
</div>

Нужно отличать **физический продукт** от **защитной функции**. Если IPS встроена в NGFW, intrusion prevention никуда не исчезла — она реализована внутри той же платформы.

---

## 11. А где здесь WAF

**WAF — Web Application Firewall** — специализированное средство защиты веб-приложений и связанного с ними web-трафика.

<div class="scope-compare">
  <article>
    <span>WAF</span>
    <strong>Web application traffic</strong>
    <p>Работает с доступными ему элементами HTTP/web-транзакций и применяет web-specific policy.</p>
  </article>
  <article>
    <span>IDS/IPS</span>
    <strong>Более широкий класс</strong>
    <p>Network-, host- и wireless-based системы используют разные источники данных и не ограничиваются web-трафиком.</p>
  </article>
</div>

Возможности могут пересекаться. Например, WAF и NIDS могут одновременно анализировать один HTTP-запрос и обнаружить в нём один и тот же интересующий признак. Это не делает их одним и тем же классом средств.

---

## 12. Соберём пример целиком

<div class="teaching-figure" markdown="1">
<div class="figure-label">СХЕМА 4 · ОТ РАЗРЕШЁННОГО ТРАФИКА К ALERT</div>

```mermaid
flowchart LR
    C[Client] -->|HTTP request| F[Firewall]
    F -->|ALLOW TCP/8080| S((DMZ segment))
    S --> W[Web Server :8080]
    S -. passive copy .-> N[NIDS]
    N -->|marker matched| A[ALERT]
```

<div class="figure-caption">Схема показывает разные функции: policy допускает взаимодействие, NIDS наблюдает доступную копию и применяет detection logic.</div>
</div>

Клиент отправляет запрос с `ATTACK-LAB`. Firewall применяет policy и допускает взаимодействие с опубликованным сервисом. NIDS получает доступную ему копию активности. Detection condition совпадает с признаком, и система формирует alert.

<div class="evidence-boundary compact-evidence">
  <article class="evidence-supported"><span>МОЖНО СКАЗАТЬ</span><p>Detector получил достаточное представление запроса и его условие выполнилось.</p></article>
  <article class="evidence-not-proven"><span>НЕЛЬЗЯ ДОКАЗАТЬ ЭТИМ ALERT</span><p>Кто именно отправил запрос, уязвимо ли приложение, был ли достигнут нежелательный результат и произошла ли компрометация.</p></article>
</div>

---

## 13. Четыре идеи первой главы

<div class="axiom-grid">
  <article class="axiom-card"><span>01</span><strong>ALLOWED ≠ SAFE</strong><p>Policy разрешила путь, но не доказала безопасность активности.</p></article>
  <article class="axiom-card"><span>02</span><strong>FIREWALL ≠ IDS/IPS</strong><p>Разные защитные функции могут находиться в одном продукте.</p></article>
  <article class="axiom-card"><span>03</span><strong>DETECTION ≠ PREVENTION</strong><p>Обнаружить и воздействовать — разные действия.</p></article>
  <article class="axiom-card"><span>04</span><strong>ALERT ≠ COMPROMISE</strong><p>Срабатывание detector не равно доказанному взлому.</p></article>
</div>

Если эти четыре отношения понятны, первая глава выполнила свою задачу.

---

## 14. Проверка понимания

!!! info "Формат проверки"
    Это **самопроверка после лекции**, а не отдельная практическая работа. Баллы за неё не выставляются. Оценочная часть модуля — воспроизводимая лабораторная работа и короткая защита evidence.

<div class="quiz" data-question-id="chapter1-v3-q1">
  <p><strong>Публичный web-сервис разрешён политикой firewall. Какой вывод корректен?</strong></p>
  <button data-choice="a">A. Любая активность внутри разрешённого соединения считается безопасной</button>
  <button data-choice="b" data-correct="true">B. Policy допустила взаимодействие, но безопасность конкретной активности требует отдельного анализа</button>
  <button data-choice="c">C. Любой запрос к разрешённому порту автоматически является доверенным</button>
  <button data-choice="d">D. Наличие stateful firewall исключает необходимость detection</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter1-v3-q2">
  <p><strong>NIDS сформировала alert по условию detector. Что подтверждено этим фактом?</strong></p>
  <button data-choice="a">A. Сервер успешно скомпрометирован</button>
  <button data-choice="b">B. Уязвимость на сервере существует</button>
  <button data-choice="c" data-correct="true">C. Наблюдаемая активность удовлетворила заданному условию detection</button>
  <button data-choice="d">D. Инцидент полностью расследован</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter1-v3-q3">
  <p><strong>На сервере открыт ненужный внешний SSH. Какое действие должно быть первым?</strong></p>
  <button data-choice="a">A. Добавить больше IDS signatures</button>
  <button data-choice="b" data-correct="true">B. Ограничить ненужный путь политикой доступа</button>
  <button data-choice="c">C. Включить alert-only режим IPS</button>
  <button data-choice="d">D. Перенести NIDS ближе к серверу</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter1-v3-q4">
  <p><strong>NGFW содержит firewall policy и IPS engine. Что это означает?</strong></p>
  <button data-choice="a">A. Firewall и IPS стали одной и той же функцией</button>
  <button data-choice="b" data-correct="true">B. Одна физическая платформа реализует несколько различных защитных функций</button>
  <button data-choice="c">C. IPS больше не относится к IDPS</button>
  <button data-choice="d">D. Любой разрешённый traffic автоматически проходит IPS без анализа</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter1-v3-q5">
  <p><strong>Inline-система настроена только на alert и ничего не блокирует. Какой вывод корректен?</strong></p>
  <button data-choice="a">A. Само inline-размещение автоматически превращает любой alert в prevention</button>
  <button data-choice="b">B. Такая система не может выполнять detection</button>
  <button data-choice="c" data-correct="true">C. Способ размещения и функция prevention — разные характеристики</button>
  <button data-choice="d">D. Inline-система обязательно является firewall</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter1-v3-q6">
  <p><strong>WAF защищает публичное web-приложение. Что из этого НЕ следует?</strong></p>
  <button data-choice="a">A. WAF может анализировать доступные ему web-транзакции</button>
  <button data-choice="b">B. Его возможности могут пересекаться с NIDS при анализе HTTP</button>
  <button data-choice="c" data-correct="true">C. WAF обеспечивает полную наблюдаемость всей сетевой и хостовой инфраструктуры</button>
  <button data-choice="d">D. WAF специализирован на web-приложениях</button>
  <div class="quiz-feedback"></div>
</div>

<div class="assessment-note">
  <span>ОЦЕНИВАЕТСЯ НЕ ТЕСТ</span>
  <strong>Доказательство в лаборатории + короткая защита</strong>
  <p>На защите студент должен показать собственный traffic/evidence и объяснить, почему наблюдаемый alert не равен compromise. Это сложнее подменить готовым ответом из ИИ.</p>
</div>

<div class="next-step">
<strong>Следующий шаг:</strong> переходите прямо к <a href="../../labs/lab01/">ЛР №1 — «Первый NIDS: visibility → alert → interpretation»</a>.
</div>

<div class="next-step">
<strong>Следующая теория:</strong> после лаборатории разберём, <a href="../02-classification/">какие виды IDS/IPS существуют и почему разные системы наблюдают разные следы</a>.
</div>

---

## Источники и статус утверждений

- NIST SP 800-94, *Guide to Intrusion Detection and Prevention Systems (IDPS)* — фундаментальные определения IDS/IPS и функций detection/prevention. Документ используется как исторический foundational source, а не как описание современных продуктов.
- NIST SP 800-41 Rev.1, *Guidelines on Firewalls and Firewall Policy* — базовая роль firewall и stateful filtering.
- Учебный HTTP-сценарий `ATTACK-LAB` — **SYNTHETIC**, создан специально для курса и не является реальным exploit/case.

Актуальные ссылки собраны в разделе [«Источники курса»](../../resources/sources/).
