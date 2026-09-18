# Глава 2. Какие виды IDS/IPS существуют и что они могут наблюдать

<div class="chapter-lead">
<p>В первой главе сетевой сенсор получил копию HTTP-трафика и сформировал оповещение. Но вторжение не обязательно оставляет только сетевые следы.</p>
<p>Запуск процесса, изменение файла, неизвестная точка Wi‑Fi и необычный сетевой обмен — разные явления. <strong>Один источник данных не обязан одинаково хорошо показывать их все.</strong></p>
</div>

<div class="chapter-outcomes">
<strong>После изучения главы студент должен уметь:</strong>
<p>объяснить различия между сетевыми, хостовыми и беспроводными IDS/IPS; объяснить место анализа сетевого поведения (NBA) в классической классификации; определить, какие сведения потенциально доступны каждому типу; не путать источник данных с методом обнаружения.</p>
</div>

---

## 1. Почему одной IDS недостаточно

Рассмотрим один эпизод: сетевой запрос приводит к запуску процесса на сервере, процесс изменяет файл и устанавливает исходящее соединение.

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 1 · ОДИН ЭПИЗОД ОСТАВЛЯЕТ РАЗНЫЕ СЛЕДЫ</div>
  <article class="idps-card idps-card--primary">
    <span class="idps-card__eyebrow">УЧЕБНЫЙ ЭПИЗОД</span>
    <strong class="idps-card__title">Запрос → запуск процесса → изменение файла + исходящее соединение</strong>
    <p>Это одна причинная цепочка в учебном сценарии, но наблюдать её части можно в разных средах.</p>
  </article>
  <div class="idps-grid idps-grid--2 idps-grid--compact">
    <article class="idps-card idps-card--source">
      <span class="idps-card__eyebrow">СЕТЕВОЙ СЛЕД</span>
      <strong class="idps-card__title">Сеть</strong>
      <p>Адреса, порты, соединения, протоколы, объёмы, время передачи и другие доступные сетевые признаки.</p>
    </article>
    <article class="idps-card idps-card--source">
      <span class="idps-card__eyebrow">ХОСТОВЫЙ СЛЕД</span>
      <strong class="idps-card__title">Операционная система</strong>
      <p>Процессы, пользователи, файлы, системные события и локальный контекст — если соответствующая телеметрия собирается.</p>
    </article>
  </div>
  <div class="idps-figure__caption">Сетевой сенсор и агент на хосте получают не одинаковые представления одного эпизода. Каждый источник подтверждает только тот факт, который реально зафиксирован.</div>
</div>

<div class="idps-equation idps-equation--primary">
  <div class="idps-equation__expression"><span>РАЗНЫЕ СЛЕДЫ</span><b>→</b><span>РАЗНЫЕ ИСТОЧНИКИ НАБЛЮДЕНИЯ</span></div>
  <p>Чтобы увидеть разные стороны эпизода, могут потребоваться разные источники данных. Это не означает, что один источник автоматически «лучше» другого.</p>
</div>

---

## 2. Классическая классификация IDPS

В NIST SP 800-94 выделялись четыре основных типа IDPS. Эту классификацию важно знать, потому что она встречается в учебной и профессиональной литературе.

<div class="idps-switcher" data-idps-switcher>
  <div class="idps-switcher__header">
    <strong>Четыре типа в классической модели NIST</strong>
    <p>Переключатель показывает область наблюдения, типичные данные и границу вывода. Без JavaScript все четыре блока остаются доступны как обычный текст.</p>
  </div>
  <div class="idps-switcher__controls" aria-label="Классическая классификация IDPS">
    <button id="chapter2-control-network" class="idps-switcher__button" type="button" aria-controls="chapter2-panel-network" data-idps-switch="network">Сетевая</button>
    <button id="chapter2-control-wireless" class="idps-switcher__button" type="button" aria-controls="chapter2-panel-wireless" data-idps-switch="wireless">Беспроводная</button>
    <button id="chapter2-control-nba" class="idps-switcher__button" type="button" aria-controls="chapter2-panel-nba" data-idps-switch="nba">NBA</button>
    <button id="chapter2-control-host" class="idps-switcher__button" type="button" aria-controls="chapter2-panel-host" data-idps-switch="host">Хостовая</button>
  </div>
  <div class="idps-switcher__panels">
    <section id="chapter2-panel-network" class="idps-switcher__panel" data-idps-panel="network">
      <h3 class="idps-switcher__panel-title">Сетевая IDS/IPS</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>Доступная сетевой системе активность в конкретной точке наблюдения</strong></div>
        <div class="idps-question-model__cell"><span>Типичные данные</span><strong>Адреса, порты, протоколы, поля сообщений, характеристики потоков</strong></div>
        <div class="idps-question-model__cell"><span>Класс</span><strong>Network-Based IDS/IPS — NIDS/NIPS</strong></div>
        <div class="idps-question-model__boundary"><strong>Граница вывода:</strong> сетевые данные сами по себе не раскрывают автоматически локальный процесс, пользователя или изменение файла на узле.</div>
      </div>
    </section>
    <section id="chapter2-panel-wireless" class="idps-switcher__panel" data-idps-panel="wireless">
      <h3 class="idps-switcher__panel-title">Беспроводная IDS/IPS</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>Радиосреда и протоколы семейства IEEE 802.11</strong></div>
        <div class="idps-question-model__cell"><span>Типичные данные</span><strong>Точки доступа, клиенты, служебные кадры и другие доступные признаки радиообмена</strong></div>
        <div class="idps-question-model__cell"><span>Класс</span><strong>Wireless IDS/IPS — WIDS/WIPS</strong></div>
        <div class="idps-question-model__boundary"><strong>Граница вывода:</strong> представление радиообмена не тождественно картине проводного IP-трафика за точкой доступа.</div>
      </div>
    </section>
    <section id="chapter2-panel-nba" class="idps-switcher__panel" data-idps-panel="nba">
      <h3 class="idps-switcher__panel-title">Анализ сетевого поведения</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>Сетевой трафик, потоки и статистика сетевой активности</strong></div>
        <div class="idps-question-model__cell"><span>Акцент анализа</span><strong>Объём, частота, направления, структура и изменения поведения</strong></div>
        <div class="idps-question-model__cell"><span>Класс NIST</span><strong>Network Behavior Analysis — NBA</strong></div>
        <div class="idps-question-model__boundary"><strong>Важная оговорка:</strong> NBA не образует идеально независимую от NIDS «среду». Здесь класс сильнее характеризует вид сетевой телеметрии и характер анализа.</div>
      </div>
    </section>
    <section id="chapter2-panel-host" class="idps-switcher__panel" data-idps-panel="host">
      <h3 class="idps-switcher__panel-title">Хостовая IDS/IPS</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>События и характеристики конкретного вычислительного узла</strong></div>
        <div class="idps-question-model__cell"><span>Типичные данные</span><strong>Процессы, пользователи, файлы, конфигурация, журналы и локальные соединения</strong></div>
        <div class="idps-question-model__cell"><span>Класс</span><strong>Host-Based IDS/IPS — HIDS/HIPS</strong></div>
        <div class="idps-question-model__boundary"><strong>Граница вывода:</strong> агент видит только реально доступные ему и настроенные источники данных на конкретном узле.</div>
      </div>
    </section>
  </div>
</div>

Классификация NIST не идеально симметрична: сетевая, хостовая и беспроводная категории в основном различаются средой наблюдения, тогда как NBA сильнее характеризует вид сетевой телеметрии и характер анализа.

<div class="idps-equation idps-equation--warning">
  <div class="idps-equation__expression"><span>ИСТОЧНИК ДАННЫХ</span><b>≠</b><span>МЕТОД АНАЛИЗА</span></div>
  <p>Откуда система получает сведения и как она принимает решение — два разных вопроса.</p>
</div>

---

## 3. Сетевая IDS/IPS — NIDS/NIPS

**Сетевая IDS/IPS (Network-Based IDS/IPS, NIDS/NIPS)** анализирует доступную ей сетевую активность.

<div class="idps-figure" markdown="1">
<div class="idps-figure__label">СХЕМА 2 · СЕТЕВОЙ ВЗГЛЯД</div>

```mermaid
flowchart LR
    A[Узел A] -->|сетевое взаимодействие| P((Точка наблюдения)) --> B[Узел B]
    P -.->|копия доступной активности| N[NIDS]
    N --> X[Доступное сетевое представление]
```

<div class="idps-figure__caption">Сплошные стрелки показывают основной путь сетевого взаимодействия. Пунктир означает копию наблюдаемых данных в NIDS. Система получает только ту активность, которая доступна в выбранной точке и фактически захвачена.</div>
</div>

В зависимости от точки наблюдения, конфигурации и возможностей системы NIDS может получать адреса, порты, признаки TCP/UDP/ICMP, DNS- и HTTP-поля, сведения о TLS-сеансе, характеристики сетевых потоков и другие доступные признаки.

<div class="idps-evidence-grid idps-evidence-grid--compact">
  <article class="idps-evidence idps-evidence--supported"><span>СЕТЕВОЙ ИСТОЧНИК МОЖЕТ ПОДДЕРЖАТЬ ВЫВОД</span><p>Наблюдалось соединение <code>10.10.1.15 → 10.10.2.20:445</code> — если соответствующий обмен действительно попал в точку наблюдения и был захвачен.</p></article>
  <article class="idps-evidence idps-evidence--not-proven"><span>ЭТО НЕ ДОКАЗЫВАЕТ АВТОМАТИЧЕСКИ</span><p>Какой локальный процесс создал соединение, от какого пользователя он работал и что произошло внутри операционной системы.</p></article>
</div>

---

## 4. Хостовая IDS/IPS — HIDS/HIPS

**Хостовая IDS/IPS (Host-Based IDS/IPS, HIDS/HIPS)** работает с событиями и характеристиками конкретного вычислительного узла.

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 3 · ХОСТОВЫЙ ВЗГЛЯД</div>
  <div class="idps-grid idps-grid--3 idps-grid--compact">
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИСТОЧНИК</span><strong class="idps-card__title">Процессы</strong><p>Запуск, завершение и доступный контекст процесса.</p></article>
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИСТОЧНИК</span><strong class="idps-card__title">Пользователи</strong><p>Учётные записи и доступные события аутентификации/действий.</p></article>
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИСТОЧНИК</span><strong class="idps-card__title">Файлы и конфигурация</strong><p>Изменения объектов, если они контролируются.</p></article>
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИСТОЧНИК</span><strong class="idps-card__title">Журналы и аудит</strong><p>Системные и прикладные события, которые реально журналируются.</p></article>
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИСТОЧНИК</span><strong class="idps-card__title">Локальные соединения</strong><p>Сетевой контекст, доступный на самом узле.</p></article>
    <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">СБОР / АНАЛИЗ</span><strong class="idps-card__title">Агент HIDS</strong><p>Получает только те данные, к которым имеет доступ и которые настроены для сбора.</p></article>
  </div>
  <div class="idps-figure__caption">Наличие агента не означает автоматической доступности любой телеметрии. Реальный набор данных зависит от продукта, ОС, настроек аудита, прав и конфигурации.</div>
</div>

### Один эпизод глазами NIDS и HIDS

Пусть веб-сервер устанавливает соединение `Web Server → 203.0.113.50:443`.

<div class="idps-grid idps-grid--2">
  <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">NIDS</span><strong class="idps-card__title">Сетевой контекст</strong><p>Кто с кем взаимодействовал, когда, по какому протоколу и какие доступные сетевые признаки наблюдались.</p></article>
  <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">HIDS</span><strong class="idps-card__title">Контекст узла</strong><p>Какой процесс инициировал действие, от какого пользователя, какой файл или конфигурация были затронуты — если эти данные собираются.</p></article>
</div>

Один источник не является автоматически «лучше» другого: они отвечают на разные вопросы.

---

## 5. Беспроводная IDS/IPS — WIDS/WIPS

**Беспроводная IDS/IPS (Wireless IDS/IPS, WIDS/WIPS)** наблюдает беспроводную среду и протоколы семейства IEEE 802.11.

<div class="idps-figure" markdown="1">
<div class="idps-figure__label">СХЕМА 4 · ПРОВОДНАЯ И БЕСПРОВОДНАЯ НАБЛЮДАЕМОСТЬ НЕ ТОЖДЕСТВЕННЫ</div>

```mermaid
flowchart LR
    C[Клиент Wi-Fi] -->|радиообмен 802.11| R((Радиосреда / точка наблюдения)) --> AP[Точка доступа]
    R -.->|копия наблюдаемых кадров| W[WIDS]
    AP -->|проводной IP-трафик| SW[Коммутатор]
    SW -.->|копия наблюдаемого IP-трафика| N[NIDS]
```

<div class="idps-figure__caption">Сплошные стрелки показывают основной обмен. Пунктир используется только для копии наблюдаемых данных. NIDS за точкой доступа и WIDS в радиоэфире получают разные представления.</div>
</div>

WIDS/WIPS может использоваться для выявления неизвестных точек доступа, неожиданных беспроводных клиентов, подозрительных управляющих кадров и других событий беспроводной среды. Её ограничения связаны с радиопокрытием, каналами, способом сканирования и возможностями оборудования.

---

## 6. Анализ сетевого поведения — NBA

**Анализ сетевого поведения (Network Behavior Analysis, NBA)** рассматривает сетевой трафик или статистику сетевой активности, делая акцент на необычных потоках и изменениях поведения.

<div class="idps-grid idps-grid--2">
  <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">БАЗОВЫЙ ПРОФИЛЬ</span><strong class="idps-card__title">20 внешних соединений в час</strong><p>Наблюдаемая активность соответствует ожидаемому профилю для данного узла и периода.</p></article>
  <article class="idps-card idps-card--warning"><span class="idps-card__eyebrow">НАБЛЮДАЕМОЕ ИЗМЕНЕНИЕ</span><strong class="idps-card__title">12 000 соединений за несколько минут</strong><p>Изменение масштаба или структуры сетевого поведения становится признаком, который требует анализа.</p></article>
</div>

<div class="idps-evidence-grid idps-evidence-grid--compact">
  <article class="idps-evidence idps-evidence--supported"><span>НАБЛЮДЕНИЕ</span><p>Количество, частота или структура сетевых взаимодействий изменились относительно выбранной модели или базового профиля.</p></article>
  <article class="idps-evidence idps-evidence--not-proven"><span>НЕ ДОКАЗЫВАЕТ ПРИЧИНУ</span><p>Само изменение не объясняет, было ли оно атакой, обновлением, резервным копированием или другой легитимной активностью.</p></article>
</div>

NIDS и NBA оба используют сетевые данные, поэтому граница между ними не абсолютна. Исторически NIDS чаще ассоциировалась с более глубоким анализом пакетов и протоколов, а NBA — с потоками, статистикой и изменениями поведения. Современные продукты могут совмещать эти возможности.

Современные названия NTA и NDR встречаются часто, но их границы зависят от конкретного продукта. В курсе мы оцениваем не маркетинговое название, а реальные источники данных и функции.

---

## 7. Прикладная IDS — это пятый тип?

В литературе встречается **прикладная IDS (Application-Based IDPS)**, ориентированная на конкретный сервис, например веб-сервер или СУБД. В классической модели NIST она рассматривается как разновидность хостовой IDS/IPS.

Поэтому мы не создаём отдельную пятую равноправную категорию, но фиксируем идею: источник данных может находиться очень близко к самому приложению.

---

## 8. Тип системы и метод обнаружения — не одно и то же

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 5 · ДВЕ НЕЗАВИСИМЫЕ ОСИ</div>
  <div class="idps-grid idps-grid--2 idps-grid--compact">
    <article class="idps-card idps-card--source">
      <span class="idps-card__eyebrow">ОСЬ 1 · ОТКУДА ПОЛУЧЕНЫ ДАННЫЕ?</span>
      <strong class="idps-card__title">Источник / область наблюдения</strong>
      <p>Сеть · хост · беспроводная среда · приложение.</p>
    </article>
    <article class="idps-card idps-card--sensor">
      <span class="idps-card__eyebrow">ОСЬ 2 · КАК ДАННЫЕ АНАЛИЗИРУЮТСЯ?</span>
      <strong class="idps-card__title">Метод / условие обнаружения</strong>
      <p>Например: заранее известный признак, анализ состояния и семантики, сравнение с ожидаемой моделью.</p>
    </article>
  </div>
  <div class="idps-figure__caption">Одна ось не определяет другую. Здесь приведены только примеры способов анализа; основания обнаружения подробно разбираются в Главе 5.</div>
</div>

<div class="idps-equation idps-equation--warning">
  <div class="idps-equation__expression"><span>ТИП ИСТОЧНИКА</span><b>≠</b><span>МЕТОД ОБНАРУЖЕНИЯ</span></div>
  <p>Например, хостовые и сетевые данные могут анализироваться разными методами. Нельзя строить одну плоскую классификацию из понятий разных уровней.</p>
</div>

---

## 9. Один эпизод — разные взгляды

!!! note "Учебная модель / синтетический сценарий"
    На веб-сервере выполняется неизвестный процесс, который изменяет файл и устанавливает множество исходящих соединений.

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 6 · ОДИН ЭПИЗОД, РАЗНЫЕ ДОКАЗАТЕЛЬСТВА</div>
  <div class="idps-grid idps-grid--2 idps-grid--compact">
    <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">NIDS</span><strong class="idps-card__title">Соединения и протокольные признаки</strong><p>Поддерживает сетевые выводы в пределах доступной точки наблюдения.</p></article>
    <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">HIDS</span><strong class="idps-card__title">Процесс, пользователь, изменение файла</strong><p>Может дать локальный контекст узла, если соответствующая телеметрия собирается.</p></article>
    <article class="idps-card idps-card--warning"><span class="idps-card__eyebrow">NBA / NTA</span><strong class="idps-card__title">Изменение количества и характера потоков</strong><p>Показывает изменение поведения, но не устанавливает его причину автоматически.</p></article>
    <article class="idps-card"><span class="idps-card__eyebrow">WIDS</span><strong class="idps-card__title">Может не дать релевантных данных</strong><p>Если эпизод не затрагивает беспроводную область наблюдения, отсутствие релевантного события здесь ожидаемо.</p></article>
  </div>
  <div class="idps-figure__caption">Каждый источник поддерживает разные выводы. Отсутствие данных у одного источника не означает отсутствие самого события.</div>
</div>

Больше телеметрии — не автоматически лучше: дополнительные источники требуют хранения, настройки, вычислительных ресурсов и сопровождения. Цель — достаточная наблюдаемость для конкретной задачи безопасности.

---

## 10. Как выбирать источник наблюдения

Вместо вопроса «какая IDS лучше?» сначала задаётся вопрос:

> **Какое явление требуется наблюдать и где существует нужный след?**

<div class="idps-grid idps-grid--3">
  <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">ИЗМЕНЕНИЕ КРИТИЧНОГО ФАЙЛА</span><strong class="idps-card__title">Типичный источник: хост</strong><p>События файловой системы или контроль целостности могут дать прямой контекст изменения.</p></article>
  <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">ВНУТРЕННЕЕ СЕТЕВОЕ СКАНИРОВАНИЕ</span><strong class="idps-card__title">Типичный источник: сеть</strong><p>Множество сетевых взаимодействий может наблюдаться NIDS или средствами анализа потоков.</p></article>
  <article class="idps-card idps-card--observation"><span class="idps-card__eyebrow">НЕИЗВЕСТНАЯ ТОЧКА WI-FI</span><strong class="idps-card__title">Типичный источник: беспроводная среда</strong><p>Радиообмен и служебные кадры 802.11 требуют соответствующей беспроводной наблюдаемости.</p></article>
</div>

Выбор конкретного продукта появляется после понимания задачи и доступных источников данных.

---

## 11. Сводная карта главы

К этому моменту мы рассмотрели четыре типа, которые студент встретит в классической литературе по IDPS. Вместо набора лозунгов сведём их к одному вопросу: **какие данные получает система и какие выводы эти данные позволяют поддержать?**

| Тип | Основная область наблюдения | Что может дать | Чего не следует автоматически заключать |
|---|---|---|---|
| **NIDS/NIPS** | Сетевой трафик в доступной точке наблюдения | Адреса, соединения, протоколы, доступные поля и характеристики потоков | Какой локальный процесс создал соединение или что произошло внутри ОС |
| **HIDS/HIPS** | События и характеристики конкретного узла | Процессы, пользователи, файлы, конфигурация, локальные события — если эти источники настроены | Что происходило на других узлах или в сегментах, которые агент не наблюдает |
| **WIDS/WIPS** | Беспроводная среда и протоколы 802.11 | Радиообмен, точки доступа, клиенты и события беспроводной среды | Полную картину проводной сети или внутреннего состояния конечного узла |
| **NBA** | Сетевые потоки и статистика сетевой активности | Изменение объёма, частоты, направлений и структуры сетевых взаимодействий | Причину изменения без дополнительного контекста |

<div class="idps-figure" markdown="1">
<div class="idps-figure__label">СХЕМА 7 · ЛОГИКА ВЫБОРА ИСТОЧНИКА</div>

```mermaid
flowchart LR
    Q[Какое явление нужно наблюдать?] --> T[Какой след оно оставляет?]
    T --> N[Сетевой след: NIDS / анализ потоков]
    T --> H[Хостовый след: HIDS / системный аудит]
    T --> W[Беспроводной след: WIDS]
    N --> M[После выбора источника выбираем метод обнаружения]
    H --> M
    W --> M
```

<div class="idps-figure__caption">Сначала определяется нужный след и источник данных. Только после этого выбирается способ анализа. Поэтому тип системы и метод обнаружения нельзя смешивать в одну классификацию.</div>
</div>

<div class="idps-summary-grid">
  <article class="idps-summary-card"><span>01</span><strong>ОДИН ЭПИЗОД → РАЗНЫЕ СЛЕДЫ</strong><p>Сетевой, хостовый и беспроводной источники могут описывать разные стороны одного события.</p></article>
  <article class="idps-summary-card"><span>02</span><strong>ИСТОЧНИК ДАННЫХ ≠ МЕТОД ОБНАРУЖЕНИЯ</strong><p>«Откуда получены данные?» и «как система решила, что событие интересно?» — разные вопросы.</p></article>
</div>

Эти два вывода подготавливают будущие лабораторные работы. Но перед ними нужно изучить функциональное устройство IDS/IPS в Главе 3: студент должен понимать, как полученные данные проходят от источника к логике обнаружения и результату.

---

## 12. Проверка понимания

<div class="quiz" data-question-id="chapter2-v3-q1">
  <p><strong>NIDS зафиксировала соединение 10.0.10.15 → 203.0.113.50:443. Можно ли только по этому событию утверждать, что его создал процесс powershell.exe?</strong></p>
  <button data-choice="a">A. Да, NIDS автоматически получает контекст процессов узла</button>
  <button data-choice="b" data-correct="true">B. Нет, для этого нужен соответствующий хостовый источник данных</button>
  <button data-choice="c">C. Да, если соединение использует TCP</button>
  <button data-choice="d">D. Да, если порт назначения равен 443</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter2-v3-q2">
  <p><strong>В чём ошибка фразы «поведенческая IDS — четвёртый тип наряду с сетевой, хостовой и беспроводной»?</strong></p>
  <button data-choice="a">A. Поведенческого обнаружения не существует</button>
  <button data-choice="b" data-correct="true">B. Смешиваются источник наблюдения и метод анализа</button>
  <button data-choice="c">C. Хостовая IDS всегда использует только поведенческий анализ</button>
  <button data-choice="d">D. Беспроводная IDS относится только к межсетевым экранам</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter2-v3-q3">
  <p><strong>Нужно обнаруживать неизвестные точки Wi‑Fi рядом с офисом. Достаточно ли NIDS на интернет-шлюзе?</strong></p>
  <button data-choice="a">A. Да, если добавить больше HTTP-правил</button>
  <button data-choice="b">B. Да, если увеличить объём хранилища журналов</button>
  <button data-choice="c" data-correct="true">C. Нет, нужен источник данных из беспроводной среды</button>
  <button data-choice="d">D. Да, если отключить TLS</button>
  <div class="quiz-feedback"></div>
</div>

<div class="next-step">
<strong>Следующий шаг:</strong> переходите к <a href="../03-detection/">Главе 3 — «Из чего состоит IDS/IPS и как она работает»</a>. После неё теоретический фундамент для ЛР №1 и ЛР №2 будет завершён.
</div>

---

## Источники и статус классификации

- NIST SP 800-94 — источник классической четырёхчастной классификации: Network-Based, Wireless, NBA, Host-Based.
- В курсе эта классификация рассматривается как **историческая фундаментальная модель**. NBA/NTA/NDR не выдаются за современный универсальный набор взаимно исключающих категорий.
- Application-Based IDPS в NIST рассматривается как разновидность хостового мониторинга для конкретного прикладного сервиса.

Актуальные ссылки собраны в разделе [«Источники курса»](../../resources/sources/).
