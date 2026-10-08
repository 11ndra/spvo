# Виды IDS/IPS и источники наблюдения

<div class="chapter-lead">
<p>В первой главе сетевой сенсор получил копию HTTP-трафика и сформировал оповещение. Но вторжение не обязательно оставляет только сетевые следы.</p>
<p>Запуск процесса, изменение файла, неизвестная точка Wi‑Fi и необычный сетевой обмен — разные явления. <strong>Один источник данных не обязан одинаково хорошо показывать их все.</strong></p>
</div>

<div class="chapter-outcomes">
<strong>После изучения главы студент должен уметь:</strong>
<p>объяснить место IDPS среди функций предотвращения, обнаружения, реагирования и восстановления; различать сервис безопасности, защитную меру и конкретный продукт; назвать основные организационные и технические меры, которые работают рядом с IDPS (политика, оценка рисков, MFA, VPN, шифрование, защита конечных систем, SIEM/SOC, реагирование, форензика, резервное копирование и тестирование безопасности); объяснить различия между сетевыми, хостовыми и беспроводными IDS/IPS; объяснить место анализа сетевого поведения в классической классификации; определить, какие сведения потенциально доступны каждому типу; не путать источник данных с методом обнаружения.</p>
</div>

---

## Где IDPS находится среди других защитных функций

Одна из типичных ошибок — пытаться описать всю защиту организации через один класс средств. Для разговора об IDPS удобно сначала выделить несколько **защитных функций**, а уже потом смотреть, какие продукты их реализуют. Это учебная группировка для текущей главы, а не исчерпывающая модель кибербезопасности.

<div class="idps-grid idps-grid--4 idps-grid--compact">
  <article class="idps-card idps-card--primary"><span class="idps-card__eyebrow">ПРЕДОТВРАЩЕНИЕ</span><strong class="idps-card__title">Снизить вероятность или возможность нежелательного действия</strong><p>Например: безопасная настройка, контроль доступа, сегментация, межсетевой экран, IPS при реально включённом блокировании.</p></article>
  <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">ОБНАРУЖЕНИЕ</span><strong class="idps-card__title">Выделить признаки интересующей активности</strong><p>Например: IDS, HIDS/EDR, мониторинг журналов, аналитика сетевого поведения.</p></article>
  <article class="idps-card idps-card--warning"><span class="idps-card__eyebrow">РЕАГИРОВАНИЕ</span><strong class="idps-card__title">Оценить событие и выполнить ответное действие</strong><p>Например: работа аналитика, изоляция узла, изменение политики, расследование.</p></article>
  <article class="idps-card idps-card--result"><span class="idps-card__eyebrow">ВОССТАНОВЛЕНИЕ</span><strong class="idps-card__title">Вернуть систему к приемлемому состоянию</strong><p>Например: восстановление конфигурации, данных или сервиса после инцидента.</p></article>
</div>

Эта схема не классифицирует продукты раз и навсегда. Один продукт может совмещать несколько функций, а одна функция может реализовываться разными средствами. Поэтому корректнее спрашивать не «что это за коробка?», а:

```text
какие данные доступны?
какая логика применяется?
какой результат формируется?
может ли система инициировать воздействие?
```

<div class="principle-box">
<strong>ПРОДУКТ ≠ ОДНА ЗАЩИТНАЯ ФУНКЦИЯ</strong>
<p>NGFW может выполнять контроль доступа и инспекцию, EDR — обнаружение и изоляцию, IPS — обнаружение и блокирование. В курсе функции оцениваются по фактическим возможностям и конфигурации.</p>
</div>

---

## Комплексная защита: что находится рядом с IDPS

IDS/IPS является только частью системы кибербезопасности. Для понимания роли IDPS полезно знать основные организационные и технические меры, которые встречаются рядом с ней.

| Мера / функция | Основная задача | Связь с IDPS |
|---|---|---|
| Политика безопасности и оценка рисков | определить правила, приоритеты и допустимый уровень риска | задают контекст: что именно важно обнаруживать и защищать |
| Управление доступом и MFA | ограничить доступ и усилить проверку личности | события аутентификации могут становиться источником для обнаружения |
| VPN и шифрование | защищать передаваемые данные и удалённый доступ | шифрование одновременно снижает доступность содержимого для внешнего сетевого сенсора |
| Защита облачной среды | управлять облачными идентификаторами, конфигурацией, секретами, журналированием и сетевыми границами | облачные audit/API logs могут дополнять сетевые и хостовые данные IDPS |
| Межсетевые экраны и сегментация | ограничивать разрешённые направления взаимодействия | сокращают поверхность взаимодействия; IDS/IPS анализирует то, что остаётся доступным в её точке наблюдения |
| Антивирус / защита конечных систем | выявлять и блокировать вредоносную активность на узле | даёт хостовую телеметрию, которую можно сопоставлять с сетевыми событиями |
| SIEM и мониторинг безопасности | собирать и сопоставлять события из нескольких источников | позволяют объединять результаты IDPS с журналами других систем |
| Threat intelligence / управление информацией об угрозах | поддерживать контекст об известных инфраструктурах, техниках, индикаторах и кампаниях | может обогащать результаты обнаружения, но не превращает индикатор в доказательство компрометации |
| SOC | организационно обеспечивать постоянный мониторинг и разбор событий | использует результаты защитных средств, но сам по себе не является одним детектором |
| Реагирование и форензика | подтвердить масштаб события, ограничить последствия, сохранить и анализировать доказательства | начинается после первичного сигнала, но не сводится к автоматическому alert |
| Резервное копирование и восстановление / DRP | вернуть данные и сервисы в рабочее состояние после сбоя или инцидента | не обнаруживает атаку, но снижает последствия и поддерживает восстановление |
| Обучение пользователей | уменьшить вероятность ошибок и успешной социальной инженерии | воздействует на причину риска, которую технический детектор может вообще не видеть |
| Тестирование безопасности | выявлять слабости до реальной эксплуатации | помогает проверять, какие сценарии должны наблюдаться и какие детекторы требуется развивать |

<div class="principle-box">
<strong>КОМПЛЕКСНАЯ ЗАЩИТА ≠ НАБОР НЕЗАВИСИМЫХ «КОРОБОК»</strong>
<p>Политика, контроль доступа, VPN, межсетевой экран, IDPS, защита конечных систем, SIEM, SOC, реагирование и восстановление решают разные задачи и обмениваются контекстом. Наличие одного элемента не делает остальные ненужными.</p>
</div>

### Сервис, мера и продукт — не одно и то же

В учебных материалах рядом могут встречаться слова «сервис безопасности», «мера защиты» и название конкретного продукта. Их полезно развести:

| Уровень | Вопрос | Пример |
|---|---|---|
| Защитная функция / сервис | какую задачу решаем? | предотвращение, обнаружение, реагирование, восстановление |
| Мера / механизм | каким способом решаем? | MFA, резервное копирование, сегментация, шифрование, анализ журналов |
| Продукт / платформа | чем реализуем в инфраструктуре? | межсетевой экран, IDPS, SIEM, EDR, VPN-шлюз |

Один продукт может реализовать несколько функций, а одна функция обычно требует нескольких мер. Поэтому выражение «у нас есть SIEM/Firewall/EDR, значит функция закрыта» без проверки конфигурации и процесса недостаточно.

### Проактивные и реактивные меры

**Проактивные** меры уменьшают вероятность или поверхность сценария до инцидента: патчи, безопасная конфигурация, MFA, сегментация, обучение, тестирование безопасности. **Реактивные** меры вступают в работу после появления события или инцидента: анализ alert, изоляция узла, форензика, восстановление. Некоторые механизмы работают на обеих сторонах: например, мониторинг поддерживает раннее обнаружение, а накопленные журналы — последующее расследование.

### Как связаны мониторинг, SIEM и SOC

- **мониторинг безопасности** — процесс наблюдения и анализа доступной телеметрии;
- **SIEM** — технологическая платформа для сбора, нормализации, поиска, корреляции и хранения событий в пределах её реализации и настройки;
- **SOC** — организационная функция/команда, которая использует процессы, людей и инструменты для мониторинга и реагирования.

<div class="idps-equation idps-equation--warning">
  <div class="idps-equation__expression"><span>SIEM</span><b>≠</b><span>SOC</span></div>
  <p>Платформа не заменяет организационный процесс, а SOC не является одним детектором.</p>
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

**NIST** — Национальный институт стандартов и технологий США (National Institute of Standards and Technology). Английское название приведено для происхождения аббревиатуры, под которой публикуются документы института. В NIST SP 800-94 выделялись четыре основных типа IDPS. Эту классификацию важно знать, потому что она встречается в учебной и профессиональной литературе. В оригинале используются названия `Network-Based`, `Wireless`, `Network Behavior Analysis` и `Host-Based`; английские формы приведены здесь один раз, потому что от них образованы распространённые сокращения NIDS/NIPS, WIDS/WIPS, NBA и HIDS/HIPS. Далее в объяснении используются русские названия и сокращения.

<div class="idps-switcher" data-idps-switcher>
  <div class="idps-switcher__header">
    <strong>Четыре типа в классической модели NIST</strong>
    <p>Переключатель показывает область наблюдения, типичные данные и границу допустимого вывода для каждого класса.</p>
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
        <div class="idps-question-model__cell"><span>Класс</span><strong>Сетевая IDS/IPS — NIDS/NIPS</strong></div>
        <div class="idps-question-model__boundary"><strong>Граница вывода:</strong> сетевые данные сами по себе не раскрывают автоматически локальный процесс, пользователя или изменение файла на узле.</div>
      </div>
    </section>
    <section id="chapter2-panel-wireless" class="idps-switcher__panel" data-idps-panel="wireless">
      <h3 class="idps-switcher__panel-title">Беспроводная IDS/IPS</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>Радиосреда и протоколы семейства IEEE 802.11</strong></div>
        <div class="idps-question-model__cell"><span>Типичные данные</span><strong>Точки доступа, клиенты, служебные кадры и другие доступные признаки радиообмена</strong></div>
        <div class="idps-question-model__cell"><span>Класс</span><strong>Беспроводная IDS/IPS — WIDS/WIPS</strong></div>
        <div class="idps-question-model__boundary"><strong>Граница вывода:</strong> представление радиообмена не тождественно картине проводного сетевого трафика за точкой доступа.</div>
      </div>
    </section>
    <section id="chapter2-panel-nba" class="idps-switcher__panel" data-idps-panel="nba">
      <h3 class="idps-switcher__panel-title">Анализ сетевого поведения</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>Сетевой трафик, потоки и статистика сетевой активности</strong></div>
        <div class="idps-question-model__cell"><span>Акцент анализа</span><strong>Объём, частота, направления, структура и изменения поведения</strong></div>
        <div class="idps-question-model__cell"><span>Класс NIST</span><strong>Анализ сетевого поведения — NBA</strong></div>
        <div class="idps-question-model__boundary"><strong>Важная оговорка:</strong> NBA не образует идеально независимую от NIDS «среду». Здесь класс сильнее характеризует вид сетевой телеметрии и характер анализа.</div>
      </div>
    </section>
    <section id="chapter2-panel-host" class="idps-switcher__panel" data-idps-panel="host">
      <h3 class="idps-switcher__panel-title">Хостовая IDS/IPS</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>Область наблюдения</span><strong>События и характеристики конкретного вычислительного узла</strong></div>
        <div class="idps-question-model__cell"><span>Типичные данные</span><strong>Процессы, пользователи, файлы, конфигурация, журналы и локальные соединения</strong></div>
        <div class="idps-question-model__cell"><span>Класс</span><strong>Хостовая IDS/IPS — HIDS/HIPS</strong></div>
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

**Сетевая IDS/IPS (NIDS/NIPS)** анализирует доступную ей сетевую активность. Обозначение `NIPS` добавляет возможность предотвращающего воздействия на сетевое взаимодействие, но не означает, что любой сетевой сенсор обязательно включён в разрыв или блокирует каждый результат обнаружения.

В сетевых примерах дальше используются стандартные обозначения протоколов из сетевого пререквизита курса: **IP (Internet Protocol)**, **TCP (Transmission Control Protocol)**, **UDP (User Datagram Protocol)**, **ICMP (Internet Control Message Protocol)** и **DNS (Domain Name System)**. Английские названия приведены только для происхождения официальных сокращений из спецификаций; далее используются сами сокращения. `HTTP` и `TLS` уже были введены в Главе 1.

<div class="idps-figure" markdown="1">
<div class="idps-figure__label">СХЕМА 2 · СЕТЕВОЙ ВЗГЛЯД</div>

```mermaid
flowchart TB
    A["Узел A"] -->|сетевое взаимодействие| P(("Точка наблюдения")) --> B["Узел B"]
    P -.->|копия активности| N["NIDS"]
    N --> X["Доступное сетевое представление"]
    class A,B mm-endpoint
    class P mm-observation
    class N mm-sensor
    class X mm-analysis
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

**Хостовая IDS/IPS (HIDS/HIPS)** работает с событиями и характеристиками конкретного вычислительного узла. Вариант `HIPS` может дополнительно применять локальную политику предотвращения к поддерживаемым действиям или объектам — например, запрещать определённые изменения файлов/конфигурации, запуск действий или сетевую активность приложения, если конкретная реализация умеет это контролировать. Набор контролируемых действий всегда определяется продуктом, правами и конфигурацией.

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 3 · ХОСТОВЫЕ ИСТОЧНИКИ СХОДЯТСЯ К АГЕНТУ, НО НЕ ПОЯВЛЯЮТСЯ АВТОМАТИЧЕСКИ</div>
  <div class="idps-source-hub">
    <div class="idps-source-hub__sources">
      <div class="idps-source-hub__source"><strong>Процессы</strong><small>Запуск, завершение и доступный контекст процесса.</small></div>
      <div class="idps-source-hub__source"><strong>Пользователи</strong><small>Аутентификация и действия, если соответствующие события формируются.</small></div>
      <div class="idps-source-hub__source"><strong>Файлы и конфигурация</strong><small>Изменения объектов, которые включены в контроль.</small></div>
      <div class="idps-source-hub__source"><strong>Журналы и аудит</strong><small>Системные и прикладные события, которые реально журналируются.</small></div>
      <div class="idps-source-hub__source"><strong>Локальные соединения</strong><small>Сетевой контекст, доступный на самом наблюдаемом узле.</small></div>
    </div>
    <div class="idps-source-hub__arrow" aria-hidden="true">→</div>
    <div class="idps-source-hub__core"><strong>Агент HIDS/HIPS</strong><small>Получает только доступную и настроенную телеметрию. Конкретный продукт может собирать не все перечисленные источники.</small></div>
    <div class="idps-source-hub__boundary"><strong>Граница наблюдаемости</strong><small>Установленный агент ≠ полная видимость узла. Реальный набор данных определяется ОС, правами, аудитом, конфигурацией и возможностями реализации.</small></div>
  </div>
  <div class="idps-figure__caption">Схема показывает отношение «источники → агент», а не обязательную внутреннюю архитектуру продукта. Каждый показанный источник должен существовать и быть доступен отдельно.</div>
</div>

### Один эпизод глазами NIDS и HIDS

Пусть веб-сервер устанавливает соединение `Веб-сервер → 203.0.113.50:443`.

<div class="idps-grid idps-grid--2">
  <article class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">NIDS</span><strong class="idps-card__title">Сетевой контекст</strong><p>Кто с кем взаимодействовал, когда, по какому протоколу и какие доступные сетевые признаки наблюдались.</p></article>
  <article class="idps-card idps-card--source"><span class="idps-card__eyebrow">HIDS</span><strong class="idps-card__title">Контекст узла</strong><p>Какой процесс инициировал действие, от какого пользователя, какой файл или конфигурация были затронуты — если эти данные собираются.</p></article>
</div>

Один источник не является автоматически «лучше» другого: они отвечают на разные вопросы.

---

## 5. Беспроводная IDS/IPS — WIDS/WIPS

**Беспроводная IDS/IPS (WIDS/WIPS)** наблюдает беспроводную среду и протоколы семейства IEEE 802.11.

<div class="idps-figure" markdown="1">
<div class="idps-figure__label">СХЕМА 4 · ПРОВОДНАЯ И БЕСПРОВОДНАЯ НАБЛЮДАЕМОСТЬ НЕ ТОЖДЕСТВЕННЫ</div>

```mermaid
flowchart TB
    C["Клиент Wi-Fi"] -->|радиообмен 802.11| R(("Радиосреда / точка наблюдения")) --> AP["Точка доступа"]
    R -.->|копия кадров| W["WIDS"]
    AP -->|проводной IP-трафик| SW["Коммутатор"]
    SW -.->|копия IP-трафика| N["NIDS"]
    class C mm-endpoint
    class R mm-observation
    class AP,SW mm-control
    class W,N mm-sensor
```

<div class="idps-figure__caption">Сплошные стрелки показывают основной обмен. Пунктир используется только для копии наблюдаемых данных. NIDS за точкой доступа и WIDS в радиоэфире получают разные представления.</div>
</div>

WIDS/WIPS может использоваться для выявления неизвестных точек доступа, неожиданных беспроводных клиентов, подозрительных управляющих кадров и других событий беспроводной среды. Её ограничения связаны с радиопокрытием, каналами, способом сканирования и возможностями оборудования.

---

## 6. Анализ сетевого поведения — NBA

**Анализ сетевого поведения (NBA)** рассматривает сетевой трафик или статистику сетевой активности, делая акцент на необычных потоках и изменениях поведения.

<div class="idps-figure">
  <div class="idps-figure__label">ВИЗУАЛЬНЫЙ ПРИМЕР · СРАВНЕНИЕ В ОДИНАКОВОМ ОКНЕ НАБЛЮДЕНИЯ</div>
  <div class="idps-nba-compare" aria-label="Сравниваются одинаковые пятиминутные окна: в базовом профиле наблюдалось от 18 до 22 внешних соединений, а в текущем окне — 180.">
    <div class="idps-nba-compare__group">
      <span>БАЗОВЫЙ ПРОФИЛЬ</span>
      <strong>18–22</strong>
      <b>внешних соединения / 5 минут</b>
      <small>Диапазон, полученный по выбранным опорным окнам.</small>
    </div>
    <div class="idps-nba-compare__arrow" aria-hidden="true">→</div>
    <div class="idps-nba-compare__group idps-nba-compare__group--change">
      <span>ТЕКУЩЕЕ ОКНО</span>
      <strong>180</strong>
      <b>внешних соединений / 5 минут</b>
      <small>Наблюдаемое значение существенно выше выбранного базового диапазона.</small>
    </div>
  </div>
  <div class="idps-figure__caption">Обе величины относятся к одинаковым пятиминутным окнам, поэтому сравнение имеет одну измерительную рамку. NBA фиксирует изменение относительно выбранной модели; причина изменения требует дополнительного контекста.</div>
</div>

<div class="idps-evidence-grid idps-evidence-grid--compact">
  <article class="idps-evidence idps-evidence--supported"><span>НАБЛЮДЕНИЕ</span><p>Количество, частота или структура сетевых взаимодействий изменились относительно выбранной модели или базового профиля.</p></article>
  <article class="idps-evidence idps-evidence--not-proven"><span>НЕ ДОКАЗЫВАЕТ ПРИЧИНУ</span><p>Само изменение не объясняет, было ли оно атакой, обновлением, резервным копированием или другой легитимной активностью.</p></article>
</div>

NIDS и NBA оба используют сетевые данные, поэтому граница между ними не абсолютна. Исторически NIDS чаще ассоциировалась с более глубоким анализом пакетов и протоколов, а NBA — с потоками, статистикой и изменениями поведения. Современные продукты могут совмещать эти возможности.

В современных продуктах также встречаются названия **анализ сетевого трафика (Network Traffic Analysis, NTA)** и **сетевое обнаружение и реагирование (Network Detection and Response, NDR)**. Английские названия приведены только для происхождения распространённых сокращений `NTA` и `NDR`; границы этих классов зависят от конкретного продукта. В курсе мы оцениваем не маркетинговое название, а реальные источники данных и функции.

---

## 7. Прикладная IDS — это пятый тип?

В NIST SP 800-94 встречается категория **прикладной IDPS** (`Application-Based IDPS`), ориентированная на конкретный сервис, например веб-сервер или СУБД. Английское название приведено только потому, что именно так категория названа в первичном источнике. В классической модели NIST она рассматривается как разновидность хостовой IDS/IPS.

Поэтому мы не создаём отдельную пятую равноправную категорию, но фиксируем идею: источник данных может находиться очень близко к самому приложению.

---

## 8. Тип системы и метод обнаружения — не одно и то же

<div class="idps-figure">
  <div class="idps-figure__label">СХЕМА 5 · ИСТОЧНИК ДАННЫХ И СПОСОБ АНАЛИЗА — ДВЕ РАЗНЫЕ ОСИ</div>
  <div class="idps-axis-table-wrap">
    <table class="idps-axis-table">
      <thead>
        <tr><th>Источник / область наблюдения ↓</th><th>Известный признак</th><th>Состояние / семантика</th><th>Отклонение от ожидаемой модели</th></tr>
      </thead>
      <tbody>
        <tr><th>Сетевые данные</th><td data-label="Известный признак"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Например, условие по доступному сетевому признаку.</div></td><td data-label="Состояние / семантика"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Если реализация строит нужный протокольный контекст.</div></td><td data-label="Отклонение от ожидаемой модели"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Потоки и статистика могут сравниваться с моделью поведения.</div></td></tr>
        <tr><th>Хостовые данные</th><td data-label="Известный признак"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Например, известный признак в событии или объекте.</div></td><td data-label="Состояние / семантика"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Анализ последовательности или контекста событий узла.</div></td><td data-label="Отклонение от ожидаемой модели"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Сравнение активности узла с ожидаемым профилем.</div></td></tr>
        <tr><th>Беспроводные данные</th><td data-label="Известный признак"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Известные признаки кадров, точек доступа или клиентов.</div></td><td data-label="Состояние / семантика"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Контекст состояния беспроводного протокола.</div></td><td data-label="Отклонение от ожидаемой модели"><span class="idps-axis-table__possible">Возможна комбинация</span><div class="idps-axis-table__note">Отклонения от ожидаемой картины радиоокружения.</div></td></tr>
      </tbody>
    </table>
  </div>
  <div class="idps-figure__caption">Матрица показывает логическую независимость осей, а не обещает наличие каждой комбинации в любом продукте. Реальная возможность зависит от доступных данных, представления и реализации детектора.</div>
</div>

<div class="idps-equation idps-equation--warning">
  <div class="idps-equation__expression"><span>ТИП ИСТОЧНИКА</span><b>≠</b><span>МЕТОД ОБНАРУЖЕНИЯ</span></div>
  <p>Например, хостовые и сетевые данные могут анализироваться разными методами. Нельзя строить одну плоскую классификацию из понятий разных уровней.</p>
</div>

---

## 9. Один эпизод — разные взгляды

!!! note "Учебная модель / синтетический сценарий"
    На веб-сервере выполняется неизвестный процесс, который изменяет файл и устанавливает множество исходящих соединений.

<div class="idps-focus-map" data-idps-focus-map>
  <div class="idps-focus-map__header">
    <strong>СХЕМА 6 · ОДИН ЭПИЗОД, РАЗНЫЕ ДОКАЗАТЕЛЬСТВА</strong>
    <small>Выберите источник, чтобы подсветить его вклад в общую картину наблюдения.</small>
  </div>
  <div class="idps-focus-map__controls" aria-label="Подсветка источников наблюдения">
    <button class="idps-focus-map__button" type="button" data-idps-focus="all" aria-pressed="true">Все источники</button>
    <button class="idps-focus-map__button" type="button" data-idps-focus="nids" aria-pressed="false">NIDS</button>
    <button class="idps-focus-map__button" type="button" data-idps-focus="hids" aria-pressed="false">HIDS</button>
    <button class="idps-focus-map__button" type="button" data-idps-focus="nba" aria-pressed="false">NBA / NTA</button>
  </div>
  <div class="idps-episode-map-wrap">
    <div class="idps-episode-map">
      <div class="idps-episode-map__cell idps-episode-map__cell--head">Источник</div>
      <div class="idps-episode-map__cell idps-episode-map__cell--head">Входящий HTTP-запрос</div>
      <div class="idps-episode-map__cell idps-episode-map__cell--head">Запуск процесса</div>
      <div class="idps-episode-map__cell idps-episode-map__cell--head">Изменение файла</div>
      <div class="idps-episode-map__cell idps-episode-map__cell--head">Много исходящих соединений</div>

      <div class="idps-episode-map__cell idps-episode-map__cell--row" data-idps-focus-target="nids">NIDS</div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nids"><span class="idps-episode-map__mark">СЕТЕВОЙ СЛЕД</span><strong>Может наблюдать запрос</strong><small>Если он проходит через выбранную точку и доступен анализу.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nids"><span class="idps-episode-map__mark">ГРАНИЦА</span><strong>Не подтверждает процесс напрямую</strong><small>Сетевой артефакт сам по себе не называет локальный процесс.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nids"><span class="idps-episode-map__mark">ГРАНИЦА</span><strong>Не подтверждает изменение файла</strong><small>Для этого нужен соответствующий хостовый или прикладной источник.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nids"><span class="idps-episode-map__mark">СЕТЕВОЙ СЛЕД</span><strong>Может видеть исходящие соединения</strong><small>В пределах своей точки наблюдения.</small></div>

      <div class="idps-episode-map__cell idps-episode-map__cell--row idps-episode-map__cell--hids" data-idps-focus-target="hids">HIDS</div>
      <div class="idps-episode-map__cell" data-idps-focus-target="hids"><span class="idps-episode-map__mark">ЗАВИСИТ ОТ ТЕЛЕМЕТРИИ</span><strong>Может дать локальный контекст</strong><small>Например, через журнал приложения или локальные сетевые события, если они собираются.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="hids"><span class="idps-episode-map__mark">ХОСТОВЫЙ СЛЕД</span><strong>Может подтвердить запуск</strong><small>Если события процессов доступны агенту или аудиту.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="hids"><span class="idps-episode-map__mark">ХОСТОВЫЙ СЛЕД</span><strong>Может подтвердить изменение</strong><small>Если объект контролируется механизмом контроля целостности файлов, аудитом или другим настроенным источником.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="hids"><span class="idps-episode-map__mark">ЛОКАЛЬНЫЙ КОНТЕКСТ</span><strong>Может связать соединение с процессом</strong><small>Только если такая телеметрия реально собирается.</small></div>

      <div class="idps-episode-map__cell idps-episode-map__cell--row idps-episode-map__cell--nba" data-idps-focus-target="nba">NBA / NTA</div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nba"><span class="idps-episode-map__mark">АГРЕГИРОВАННЫЙ ВЗГЛЯД</span><strong>Содержание запроса может быть не нужно</strong><small>Анализ может опираться на потоки и статистику, а не на содержимое конкретного прикладного запроса.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nba"><span class="idps-episode-map__mark">ГРАНИЦА</span><strong>Не устанавливает локальный процесс</strong><small>Это не хостовый источник.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nba"><span class="idps-episode-map__mark">ГРАНИЦА</span><strong>Не подтверждает изменение файла</strong><small>Нужен дополнительный контекст.</small></div>
      <div class="idps-episode-map__cell" data-idps-focus-target="nba"><span class="idps-episode-map__mark">ИЗМЕНЕНИЕ СЕТЕВОЙ АКТИВНОСТИ</span><strong>Хорошо показывает изменение масштаба</strong><small>Но само изменение ещё не объясняет его причину.</small></div>
    </div>
  </div>
  <div class="idps-figure__caption">WIDS здесь намеренно не включена в матрицу: учебный эпизод не задаёт беспроводную область наблюдения. Отсутствие релевантного WIDS-события в таком сценарии ожидаемо и ничего не говорит о фактах на сервере.</div>
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
flowchart TB
    Q["Какое явление нужно наблюдать?"] --> T["Какой след оно оставляет?"]
    T --> N["Сетевой след: NIDS / анализ потоков"]
    T --> H["Хостовый след: HIDS / системный аудит"]
    T --> W["Беспроводной след: WIDS"]
    N --> M["После выбора источника выбираем метод обнаружения"]
    H --> M
    W --> M
    class Q,T mm-interpretation
    class N,H,W mm-sensor
    class M mm-analysis
```

<div class="idps-figure__caption">Сначала определяется нужный след и источник данных. Только после этого выбирается способ анализа. Поэтому тип системы и метод обнаружения нельзя смешивать в одну классификацию.</div>
</div>

<div class="idps-summary-grid">
  <article class="idps-summary-card"><span>01</span><strong>ОДИН ЭПИЗОД → РАЗНЫЕ СЛЕДЫ</strong><p>Сетевой, хостовый и беспроводной источники могут описывать разные стороны одного события.</p></article>
  <article class="idps-summary-card"><span>02</span><strong>ИСТОЧНИК ДАННЫХ ≠ МЕТОД ОБНАРУЖЕНИЯ</strong><p>«Откуда получены данные?» и «как система решила, что событие интересно?» — разные вопросы.</p></article>
</div>

Эти два вывода используются далее в лабораторных работах. Перед практикой нужно изучить функциональное устройство IDS/IPS в Главе 3: студент должен понимать, как полученные данные проходят от источника к логике обнаружения и результату.

---

## Проверка понимания

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
