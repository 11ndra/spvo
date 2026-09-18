# Глава 9. Протоколы, приложения и зашифрованный трафик глазами IDPS

<div class="chapter-lead">
<p>В базовых главах мы уже установили, что IDS/IPS принимает решение не по «реальности вообще», а по конкретному <strong>представлению данных</strong>, доступному в выбранной точке наблюдения. Теперь эту идею нужно углубить. Один и тот же прикладной смысл может быть представлен как отдельный пакет, восстановленный поток байтов, DNS-транзакция, HTTP-запрос, TLS-handshake, QUIC-соединение или запись журнала приложения. Для детектора это <strong>разные объекты анализа</strong>.</p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь:</strong>
<p>объяснять, почему номер порта не доказывает прикладной протокол; различать пакет, поток, реконструированный поток, протокол и транзакцию; описывать влияние reassembly, шифрования, туннелей и protocol parsing на доступные признаки; сравнивать наблюдаемость DNS, HTTP, TLS, QUIC, SSH и SMB; находить границу между сетевой и прикладной телеметрией; а также проектировать условие обнаружения от доступного представления данных, а не от предположения о том, «что должно быть видно».</p>
</div>

---

## 1. Протокол для IDPS — это не просто номер порта

Упрощённая модель часто выглядит так:

```text
TCP/80  = HTTP
TCP/443 = HTTPS
TCP/22  = SSH
TCP/445 = SMB
UDP/53  = DNS
```

Такие соответствия полезны как начальная подсказка, но они не являются доказательством прикладного протокола.

Причины очевидны:

- сервис может работать на нестандартном порту;
- один порт может использоваться несколькими протоколами или режимами;
- протокол может измениться внутри уже существующего соединения;
- туннелирование и проксирование могут скрывать внутренний протокол за внешним;
- современная реализация IDPS может распознавать протокол по структуре обмена, а не только по порту.

Suricata, например, имеет отдельный механизм определения прикладного протокола и различает состояния `unknown`, `failed`, первоначально распознанный и итоговый протокол. Это хороший пример общей инженерной идеи: **protocol identification — отдельный шаг анализа**.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 1 · ПОРТ — ПРИЗНАК, НО НЕ ДОКАЗАТЕЛЬСТВО ПРОТОКОЛА</div>
<div class="idps-process">
  <div class="idps-process__step idps-process__step--source"><span>1</span><strong>TCP/UDP + port</strong><small>сетевой ориентир и часть контекста</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step"><span>2</span><strong>Protocol identification</strong><small>структура обмена, состояние, сигнатуры протокола, конфигурация</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--sensor"><span>3</span><strong>Parser</strong><small>превращает поток в поля и транзакции конкретного протокола</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--result"><span>4</span><strong>Detection logic</strong><small>проверяет уже доступное представление</small></div>
</div>
<div class="figure-caption">Правило «порт 443 означает HTTPS» смешивает транспортный признак и вывод о прикладном протоколе. Зрелая модель разводит эти шаги.</div>
</div>

Отсюда первое правило главы:

<div class="principle-box">
<strong>PORT ≠ APPLICATION PROTOCOL</strong>
<p>Порт может ограничить область поиска, но утверждение о протоколе должно опираться на реально распознанное представление, если конкретная реализация это позволяет.</p>
</div>

---

## 2. Один обмен существует сразу в нескольких представлениях

Возьмём обычный HTTP-запрос. На проводе он не существует как одна готовая строка «GET /report».

В зависимости от точки анализа система может иметь дело с такими уровнями:

```text
кадр канального уровня
        ↓
IP-пакет
        ↓
TCP-сегмент
        ↓
состояние TCP-потока
        ↓
восстановленный поток байтов
        ↓
распознанный HTTP
        ↓
HTTP-транзакция
        ↓
method / target / headers / body
        ↓
условие обнаружения
```

Каждый переход создаёт новое представление и новые предпосылки.

<div class="idps-gates">
  <div class="idps-gate"><span>1 · PACKET</span><strong>Отдельный сетевой фрагмент</strong><small>Может содержать только часть прикладного сообщения.</small></div>
  <div class="idps-gate"><span>2 · FLOW</span><strong>Контекст обмена</strong><small>Направление, участники, состояние и связность пакетов.</small></div>
  <div class="idps-gate"><span>3 · REASSEMBLY</span><strong>Восстановленный поток</strong><small>Байты приводятся к порядку, пригодному для дальнейшего разбора.</small></div>
  <div class="idps-gate"><span>4 · PROTOCOL</span><strong>Прикладной протокол</strong><small>Движок определяет, какой parser применим к потоку.</small></div>
  <div class="idps-gate"><span>5 · TRANSACTION</span><strong>Структурированное событие</strong><small>Например, DNS query/response или HTTP request/response.</small></div>
  <div class="idps-gate"><span>6 · FIELD</span><strong>Семантическое поле</strong><small>URI, hostname, qname, command, filename и другие доступные признаки.</small></div>
</div>

Поэтому два правила, которые выглядят похожими, могут на самом деле работать с разными объектами:

```text
content:"/admin";
```

проверяет последовательность байтов в выбранном буфере, а

```text
http.uri; content:"/admin";
```

проверяет содержимое конкретного HTTP-представления, которое parser уже выделил как URI.

Это не косметическая разница. Второй вариант зависит от успешного распознавания и разбора HTTP.

---

## 3. Reassembly нужен потому, что прикладное сообщение не обязано совпадать с границей пакета

TCP предоставляет приложению упорядоченный поток байтов. Сетевой сенсор при этом видит отдельные сегменты, которые могут:

- приходить несколькими пакетами;
- прибывать не по порядку;
- передаваться повторно;
- наблюдаться не с самого начала соединения;
- содержать пропуски из-за packet loss в точке наблюдения.

Если интересующая строка разделена между двумя TCP-сегментами, поиск только внутри каждого отдельного пакета может её не увидеть.

Поэтому stateful NIDS обычно содержит stream tracking и reassembly.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 2 · ПРИКЛАДНОЕ ПОЛЕ МОЖЕТ БЫТЬ РАЗДЕЛЕНО МЕЖДУ ПАКЕТАМИ</div>
<div class="idps-fanout">
  <div class="idps-fanout__origin"><strong>HTTP target</strong><small><code>/reports/export</code></small></div>
  <div class="idps-fanout__arrow">→</div>
  <div class="idps-fanout__targets">
    <div class="idps-fanout__target"><strong>TCP segment A</strong><small><code>/reports/ex</code></small></div>
    <div class="idps-fanout__target"><strong>TCP segment B</strong><small><code>port</code></small></div>
    <div class="idps-fanout__target"><strong>Reassembled stream</strong><small><code>/reports/export</code></small></div>
  </div>
</div>
<div class="figure-caption">Полезное прикладное представление появляется только после восстановления контекста потока. Конкретные границы сегментов не должны считаться границами прикладной семантики.</div>
</div>

Но reassembly тоже не является абсолютной истиной. Оно зависит от:

- полноты захваченного трафика;
- состояния соединения;
- лимитов памяти и глубины обработки;
- правил обработки неоднозначных или повреждённых последовательностей;
- конкретной реализации.

Следовательно, утверждение «сигнатура не совпала» ещё не объясняет, получил ли parser полный поток, на котором она должна была работать.

---

## 4. Parser превращает поток байтов в объект, имеющий смысл для правила

После восстановления потока движок всё ещё видит только байты. Чтобы появилось понятие «HTTP method», «DNS qname» или «SMB filename», нужен parser конкретного протокола.

Parser выполняет несколько функций:

```text
определяет границы сообщений;
учитывает направление;
сопоставляет request и response;
извлекает поля;
поддерживает состояние протокола;
сообщает о некорректных или неожиданных состояниях.
```

Именно здесь возникает важное слово **transaction — транзакция протокола**.

Для разных протоколов транзакция означает разное:

| Протокол | Пример структурированной единицы |
|---|---|
| DNS | запрос + соответствующий ответ |
| HTTP | request и связанный response |
| TLS | handshake/состояние TLS-сессии и доступные метаданные |
| SMB | команда/операция и связанный результат |
| SSH | доступные до/во время установления защищённого сеанса параметры |

Не все протоколы укладываются в одинаковую request/response-модель, но общий принцип сохраняется: **detector может работать не с packet payload, а с результатом stateful parsing**.

---

## 5. DNS: один и тот же вопрос может иметь разные сетевые оболочки

Классический DNS обычно ассоциируется с UDP/53, но даже базовая спецификация допускает DNS поверх UDP и TCP. Современная инфраструктура добавляет защищённые варианты:

- DNS over TLS (DoT);
- DNS over HTTPS (DoH);
- DNS over QUIC (DoQ).

Семантический вопрос может оставаться тем же:

```text
Какой адрес соответствует example.test?
```

Но доступное сетевому сенсору представление меняется.

<div class="idps-grid idps-grid--4 idps-grid--compact">
  <div class="idps-card idps-card--success"><span class="idps-card__eyebrow">DNS / UDP,TCP</span><strong class="idps-card__title">DNS parser</strong><p>При достаточной видимости доступны поля DNS-запроса и ответа: имя, тип записи, ответ и другие элементы.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">DoT</span><strong class="idps-card__title">DNS внутри TLS</strong><p>Без расшифрования сетевой сенсор не получает обычные DNS-поля как открытое содержимое.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">DoH</span><strong class="idps-card__title">DNS внутри HTTPS</strong><p>DNS query/response отображается в HTTP exchange, который обычно защищён TLS.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">DoQ</span><strong class="idps-card__title">DNS поверх QUIC</strong><p>DNS-семантика переносится в защищённый QUIC transport.</p></div>
</div>

Отсюда нельзя делать вывод:

```text
нет DNS-события у сетевой IDS
→ хост не выполнял DNS-разрешение
```

Допустимый вывод уже:

```text
в доступном источнике не наблюдалась DNS-транзакция того представления,
которое способен разбирать выбранный сенсор при данной конфигурации.
```

Это длиннее, но инженерно корректнее.

---

## 6. HTTP — это семантика, а HTTP/1.1, HTTP/2 и HTTP/3 имеют разные wire representations

RFC 9110 задаёт общую семантику HTTP: method, target resource, header fields, status codes и другие элементы. Но то, как эти элементы представлены «на проводе», зависит от версии HTTP.

### HTTP/1.x

Человек может узнать значительную часть сообщения прямо в текстовом представлении:

```http
GET /api/report HTTP/1.1
Host: app.example
User-Agent: ...
```

### HTTP/2

HTTP-семантика сохраняется, но обмен использует бинарное framing и multiplexing. Простая идея «найти строку запроса в TCP payload» уже не является универсальной моделью.

### HTTP/3

HTTP-семантика отображается на QUIC. RFC 9114 прямо определяет HTTP/3 как mapping HTTP semantics over QUIC.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 3 · ОДИН ПРИКЛАДНОЙ СМЫСЛ — РАЗНЫЕ ПРЕДСТАВЛЕНИЯ</div>
<div class="idps-source-hub">
  <div class="idps-source-hub__sources">
    <div class="idps-source-hub__source"><strong>HTTP/1.1</strong><small>HTTP message поверх TCP; для HTTPS — внутри TLS</small></div>
    <div class="idps-source-hub__source"><strong>HTTP/2</strong><small>HTTP semantics в бинарных frames; обычно защищены TLS при HTTPS</small></div>
    <div class="idps-source-hub__source"><strong>HTTP/3</strong><small>HTTP semantics поверх QUIC</small></div>
  </div>
  <div class="idps-source-hub__arrow">→</div>
  <div class="idps-source-hub__core"><strong>Один логический запрос</strong><small><code>GET /api/report</code></small></div>
  <div class="idps-source-hub__boundary"><strong>Инженерный вывод:</strong><small>условие обнаружения должно соответствовать представлению, которое parser действительно способен получить в выбранной версии протокола и при данной видимости.</small></div>
</div>
<div class="figure-caption">Нельзя переносить правило, рассчитанное на текстовый HTTP/1 payload, на HTTP/2 или HTTP/3 только потому, что прикладная операция для пользователя выглядит одинаково.</div>
</div>

Поэтому зрелая detection logic привязывается не к «видимому в Wireshark тексту вообще», а к определённому нормализованному полю или другому явно выбранному представлению.

---

## 7. TLS 1.3: после шифрования меняется не событие, а доступный сенсору слой

TLS создаёт защищённый канал между сторонами. Для TLS 1.3 актуальная спецификация — RFC 9846.

Для внешнего сетевого сенсора без ключей или архитектурно предусмотренного расшифрования принципиально важно различать:

```text
метаданные соединения
≠
содержимое прикладного протокола внутри TLS
```

В TLS 1.3 значительная часть handshake после `ServerHello`, включая сертификат сервера, защищена. Application data также шифруется.

При этом до и во время установления соединения отдельные метаданные могут оставаться наблюдаемыми. Конкретный набор зависит от версии протокола, расширений, точки наблюдения и возможностей реализации IDPS.

Suricata, например, может журналировать различные TLS-поля и fingerprints при соответствующей конфигурации. Но наличие поля в документации продукта не означает, что оно гарантированно присутствует в каждом соединении.

<div class="idps-grid idps-grid--3">
  <div class="idps-card idps-card--source"><span class="idps-card__eyebrow">ДОСТУПНОЕ ПРЕДСТАВЛЕНИЕ</span><strong class="idps-card__title">Сетевые и handshake-признаки</strong><p>Адреса, порты, объём, timing и отдельные доступные поля установления защищённого канала.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">ЗАЩИЩЁННЫЙ СЛОЙ</span><strong class="idps-card__title">Application data</strong><p>URI, HTTP body, команды приложения и другие внутренние данные не становятся открытым payload только потому, что сенсор находится на пути.</p></div>
  <div class="idps-card idps-card--result"><span class="idps-card__eyebrow">СЛЕДСТВИЕ</span><strong class="idps-card__title">Меняется класс возможных правил</strong><p>Правило по URI и правило по TLS-метаданным отвечают на разные вопросы и поддерживают разные выводы.</p></div>
</div>

---

## 8. ECH показывает, почему даже метаданные нельзя считать вечной гарантией

Исторически SNI из `ClientHello` широко использовался сетевыми средствами наблюдения как указание имени сервера.

Но RFC 9849 определяет **Encrypted Client Hello (ECH)**. ECH позволяет защищать внутренний `ClientHello`, включая чувствительные расширения, такие как SNI и список ALPN.

Это важный урок шире самого TLS:

<div class="principle-box">
<strong>МЕТАДАННЫЕ — ТОЖЕ ЧАСТЬ КОНКРЕТНОГО ПРЕДСТАВЛЕНИЯ</strong>
<p>Нельзя проектировать долгоживущую detection logic из предположения, что определённое поле «всегда видно в сети». Его доступность зависит от эволюции протокола, конфигурации и архитектуры наблюдения.</p>
</div>

Поэтому условие вида «если SNI содержит X» должно документировать предпосылку:

```text
SNI должен быть доступен выбранному сенсору в анализируемом соединении.
```

Без этой предпосылки отсутствие совпадения нельзя автоматически трактовать как отсутствие обращения к интересующему сервису.

---

## 9. QUIC и HTTP/3 ломают привычку мыслить только моделью «TCP-поток → HTTP parser»

QUIC определён как защищённый transport поверх UDP. Он предоставляет потоки, multiplexing, управление соединением и криптографическую защиту как часть собственного transport design.

HTTP/3, в свою очередь, отображает HTTP semantics на QUIC.

Для IDPS это означает архитектурный сдвиг:

```text
HTTP/1.1 over TCP
TCP state → reassembly → HTTP parser

HTTP/2 over TLS/TCP
TCP state → TLS → HTTP/2 representation (при доступе к содержимому)

HTTP/3 over QUIC/UDP
QUIC connection/state → protected QUIC streams → HTTP/3 representation
```

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 4 · HTTP/3 НЕ ЯВЛЯЕТСЯ «HTTP В ОБЫЧНОМ UDP PAYLOAD»</div>
<div class="idps-process">
  <div class="idps-process__step idps-process__step--source"><span>1</span><strong>UDP datagrams</strong><small>внешний транспортный слой для QUIC</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step"><span>2</span><strong>QUIC</strong><small>connection IDs, packet types, streams, cryptographic protection</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--sensor"><span>3</span><strong>HTTP/3</strong><small>HTTP semantics отображаются на QUIC streams</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--result"><span>4</span><strong>Detection representation</strong><small>зависит от того, что конкретная реализация умеет распознать и получить</small></div>
</div>
<div class="figure-caption">UDP-порт 443 не даёт сетевому правилу открытый HTTP request. Сначала нужен корректный разбор QUIC и доступ к соответствующему представлению.</div>
</div>

Suricata 8.x распознаёт QUIC как отдельный app-layer protocol и предоставляет ограниченные QUIC-specific поля. Это полезный пример, но не основание считать, что любой NIDS автоматически имеет полную видимость HTTP/3 application data.

---

## 10. SSH: распознавание защищённого протокола не означает видимость удалённой команды

SSH хорошо показывает разницу между:

```text
«сенсор распознал протокол SSH»
```

и

```text
«сенсор видит действия пользователя внутри SSH-сеанса».
```

До включения криптографической защиты стороны обмениваются идентификационной и negotiation-информацией. После согласования ключей SSH обеспечивает шифрование и целостность дальнейшего трафика.

Реализация NIDS может поэтому получить, например:

- факт SSH-соединения;
- адреса, порты, timing и объём;
- доступную идентификационную/negotiation-информацию;
- fingerprint, если конкретный продукт его вычисляет.

Но из этого не следует, что внешнему сетевому сенсору известна команда:

```bash
sudo systemctl restart nginx
```

выполненная пользователем внутри уже защищённой SSH-сессии.

Для такого вывода обычно нужен другой источник: audit/logging на endpoint, shell/session recording, PAM/PAM-like telemetry или иной хостовый/административный контроль.

---

## 11. SMB: имя файла может быть доступно в одном режиме и скрыто в другом

SMB 2/3 — stateful прикладной протокол для файловых и других операций. При достаточной видимости parser может выделять такие представления, как:

- dialect;
- command;
- share;
- filename;
- session-related fields;
- status/result.

Это значительно сильнее, чем поиск случайной строки в TCP payload.

Но современные варианты SMB поддерживают криптографическую защиту. В частности, семейство SMB 3.x может использовать шифрование client/server traffic.

Кроме того, SMB 3.1.1 может работать поверх QUIC, а значит привычная модель «SMB = TCP/445» тоже перестаёт быть универсальной.

<div class="idps-grid idps-grid--2">
  <div class="idps-card idps-card--success"><span class="idps-card__eyebrow">СТРУКТУРИРОВАННЫЙ SMB</span><strong class="idps-card__title">Parser видит операцию</strong><p>Если представление доступно, правило может работать с конкретным command, share или filename, а не с произвольным участком payload.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">ЗАЩИЩЁННЫЙ SMB</span><strong class="idps-card__title">Видимость меняется</strong><p>При шифровании или другом transport path внешний сетевой сенсор может потерять доступ к полям, на которых строилось правило.</p></div>
</div>

Инженерный вопрос поэтому звучит не «поддерживает ли IDS SMB», а:

> **Какой вариант SMB, на каком transport path и какие именно поля доступны этому сенсору в данной конфигурации?**

---

## 12. Encapsulation и tunnel создают внешний и внутренний уровни наблюдения

Туннель не уничтожает внутренний обмен. Он меняет то, на каком уровне он доступен конкретной точке наблюдения.

Рассмотрим абстрактный пример:

```text
внутренний HTTP запрос
        ↓
зашифрованный VPN tunnel
        ↓
Internet
```

Сенсор снаружи туннеля потенциально видит:

```text
outer addresses;
tunnel protocol;
объём;
timing;
другие доступные свойства внешнего соединения.
```

Но он не получает автоматически внутренний HTTP request.

Сенсор после termination туннеля может видеть уже другой набор данных.

<div class="idps-contrast">
  <div class="idps-node idps-node--observation"><strong>До termination</strong><small>outer representation туннеля</small></div>
  <div class="idps-contrast__arrow">≠</div>
  <div class="idps-node idps-node--result"><strong>После termination</strong><small>inner representation может снова стать доступным</small></div>
</div>

Поэтому placement и representation нельзя анализировать отдельно друг от друга.

---

## 13. Parser и endpoint могут интерпретировать неоднозначные данные по-разному

Сетевой сенсор пытается реконструировать то, что получит и поймёт endpoint. Но сенсор не является самим endpoint.

Между ними могут различаться:

- состояние, с которого началось наблюдение;
- полнота полученных пакетов;
- политика TCP reassembly;
- обработка повреждённых или нестандартных сообщений;
- canonicalization/normalization;
- версия parser;
- поддерживаемые расширения протокола;
- поведение конкретного приложения поверх формально допустимого протокола.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 5 · ОДИН НАБЛЮДАЕМЫЙ ПОТОК — ДВЕ РЕАЛИЗАЦИИ ИНТЕРПРЕТАЦИИ</div>
<div class="idps-proof-map">
  <div class="idps-proof-map__fact idps-proof-map__fact--source"><strong>Наблюдаемый сетевой поток</strong><small>пакеты, состояние, порядок, возможные gaps</small></div>
  <div class="idps-proof-map__operator">→</div>
  <div class="idps-proof-map__fact idps-proof-map__fact--observation"><strong>Parser сенсора</strong><small>собственная модель reassembly и протокола</small></div>
  <div class="idps-proof-map__operator">↔</div>
  <div class="idps-proof-map__fact"><strong>Parser endpoint</strong><small>реализация ОС/сервера/клиента</small></div>
  <div class="idps-proof-map__operator">→</div>
  <div class="idps-proof-map__conclusion"><strong>Нужно доказать согласованность для интересующего случая</strong><small>совпадение интерпретации нельзя объявлять абсолютным свойством всех входных данных.</small></div>
</div>
<div class="figure-caption">Robustness-тест проверяет, остаётся ли вывод детектора корректным при допустимых вариантах представления. Цель курса — понять границу интерпретации, а не учить обходу средства защиты.</div>
</div>

Эта проблема известна как один из источников **semantic gap** между наблюдателем и конечной системой.

Важно не превращать её в рецепт evasion. Учебная задача здесь другая:

```text
знать, какое представление использует сенсор;
проверять нормальные и граничные варианты;
сравнивать вывод сенсора с независимым фактом на endpoint;
документировать границу применимости правила.
```

---

## 14. Normalization уменьшает неоднозначность, но сама становится частью логики

Протокол может позволять несколько представлений, которые приложение считает эквивалентными или обрабатывает сходным образом.

Если правило работает только по raw representation, оно может реагировать на синтаксис, а не на смысл.

Поэтому parser часто создаёт нормализованные поля.

Упрощённая модель:

```text
raw bytes
   ↓
protocol parser
   ↓
normalization / canonical representation
   ↓
sticky buffer / semantic field
   ↓
detection condition
```

Преимущество такого подхода — правило меньше зависит от случайной формы передачи.

Но возникает новая зависимость:

> **правильность правила теперь зависит от корректности parser и выбранной normalization semantics.**

Это ещё одна причина документировать, на каком representation построено условие.

---

## 15. Application/API telemetry — другой источник, а не «расшифрованная NIDS»

Когда сетевому сенсору недоступно содержимое HTTPS, возникает соблазн сказать: «возьмём лог приложения — это то же самое».

Нет. Это **другой источник данных** с другой точкой формирования и другими границами.

Например, web/API service может журналировать:

```text
request method;
route;
status code;
authenticated user/service identity;
application error;
business operation id.
```

Сетевой сенсор одновременно может иметь:

```text
src/dst;
transport state;
TLS/QUIC metadata;
volume/timing;
network anomalies;
некоторые protocol-specific поля.
```

<div class="idps-source-hub">
  <div class="idps-source-hub__sources">
    <div class="idps-source-hub__source"><strong>Network telemetry</strong><small>что прошло через конкретную сетевую точку наблюдения</small></div>
    <div class="idps-source-hub__source"><strong>Application telemetry</strong><small>что приложение распознало и решило записать</small></div>
    <div class="idps-source-hub__source"><strong>Host telemetry</strong><small>что произошло на ОС/процессе/файловой системе</small></div>
  </div>
  <div class="idps-source-hub__arrow">→</div>
  <div class="idps-source-hub__core"><strong>Сопоставление evidence</strong><small>источники дополняют друг друга, но не становятся взаимозаменяемыми</small></div>
  <div class="idps-source-hub__boundary"><strong>Граница:</strong><small>совпадение времени, адреса или request id может поддерживать связь событий; само по себе оно не отменяет ограничения каждого отдельного источника.</small></div>
</div>

Именно на этой базе позже будет строиться глава о multi-source correlation.

---

## 16. Три контролируемых случая: как меняется допустимый вывод

### Случай A — открытый HTTP

Условие эксперимента:

```text
клиент отправляет GET /LAB9-VISIBLE
сенсор видит этот сетевой путь
HTTP parser распознаёт транзакцию
```

Возможный артефакт:

```text
http event / alert с соответствующим URI
```

Допустимый вывод:

> В данной точке наблюдения и конфигурации движок получил HTTP-представление, содержащее `/LAB9-VISIBLE`, и конкретное условие могло быть проверено на этом поле.

Что это не доказывает:

- что любой HTTP-вариант будет виден;
- что HTTPS даст то же поле без расшифрования;
- что приложение выполнило бизнес-операцию только на основании сетевого alert.

### Случай B — HTTPS без расшифрования

Условие:

```text
тот же логический web request передаётся внутри TLS
```

Внешний сенсор может получить TLS/network metadata, но не открытый URI.

Допустимый вывод:

> Отсутствие совпадения правила по URI ожидаемо, если это представление защищено TLS и сенсор не получает расшифрованное приложение.

Нельзя говорить:

> Запроса `/LAB9-VISIBLE` не было.

### Случай C — тот же DNS-вопрос через разные transports

Сравниваются:

```text
обычный DNS
DoH/DoT/DoQ
```

Инженерный вопрос:

> Какие поля доступны сетевому сенсору в каждом представлении и какое условие обнаружения вообще имеет смысл применять?

Цель такого эксперимента — не «победить IDS», а показать, что **detection condition существует только относительно доступного representation**.

---

## 17. Как проектировать detection condition от представления данных

До написания правила полезно заполнить короткую цепочку.

| Шаг | Вопрос | Пример |
|---|---|---|
| 1. Событие | Что должно действительно произойти? | HTTP request к тестовому route |
| 2. Observation point | Где его след проходит? | интерфейс перед web server |
| 3. Acquisition | Получает ли сенсор нужный трафик? | capture подтверждён |
| 4. Protocol | Что реально распознано? | HTTP / TLS / QUIC / unknown |
| 5. Representation | Какое поле доступно? | `http.uri`, TLS metadata, DNS qname |
| 6. Condition | Что именно проверяется? | точное значение/паттерн/состояние |
| 7. Result | Как фиксируется совпадение? | alert/EVE event |
| 8. Boundary | Что результат не доказывает? | alert не равен incident; отсутствие поля не равно отсутствию события |

Эта таблица предотвращает типичную ошибку:

```text
я знаю, что приложение делает X
→ значит сетевой сенсор обязан видеть X
```

Между этими двумя утверждениями всегда есть цепочка observation/acquisition/representation.

---

## 18. Матрица наблюдаемости: не «видно / не видно», а «какой слой доступен»

Следующая таблица специально упрощена до инженерного вопроса, а не продуктовой гарантии.

| Сценарий | Что потенциально доступно внешнему сетевому сенсору | Что требует другого representation/source |
|---|---|---|
| Plain HTTP | network + TCP + HTTP fields при успешном parsing | серверная бизнес-логика, локальные действия процесса |
| HTTPS/TLS 1.3 | network + доступные TLS/handshake metadata | HTTP URI/body без предусмотренного доступа к plaintext |
| HTTP/3 | network + UDP/QUIC признаки и поддерживаемые parser fields | полный HTTP content без соответствующего доступа/поддержки |
| Plain DNS | DNS query/response fields при успешном parsing | локальная логика resolver/cache вне наблюдаемого обмена |
| DoT/DoH/DoQ | outer TLS/HTTP/QUIC representation в пределах доступной видимости | обычные DNS fields без доступа к внутреннему DNS message |
| SSH | network + доступные SSH negotiation/identification fields | shell commands и действия на endpoint после установления защиты |
| SMB без защищённого payload | структурированные SMB operations при поддержке parser | фактический эффект операции на файловой системе требует независимого host evidence |
| SMB encryption / SMB over QUIC | outer/transport/protocol metadata в доступном объёме | внутренние file/share operations без соответствующей видимости plaintext |

Ключевое слово здесь — **потенциально**. Конкретная конфигурация, версия и точка наблюдения должны быть подтверждены экспериментом или документацией реализации.

---

## 19. Типичные ошибки при анализе протоколов в IDPS

### Ошибка 1 — «443 значит HTTPS»

Порт — подсказка, но не достаточное доказательство protocol identity.

### Ошибка 2 — «UDP не имеет состояния»

UDP сам по себе не предоставляет TCP-подобного состояния соединения, но анализатор может поддерживать собственный flow/protocol state поверх UDP. QUIC — очевидный современный пример сложного stateful transport поверх UDP.

### Ошибка 3 — «если Wireshark показывает поле, правило всегда может его использовать»

GUI-анализатор, IDS parser и конкретная конфигурация могут иметь разные возможности, версии и предпосылки.

### Ошибка 4 — «зашифровано значит ничего не видно»

Остаются сетевые и отдельные protocol metadata. Но это не возвращает скрытое application content.

### Ошибка 5 — «виден TLS SNI значит домен всегда известен»

ECH и другие изменения протокола делают такую гарантию некорректной.

### Ошибка 6 — «нет app-layer event значит трафика не было»

Возможны unknown/failed parsing, encrypted representation, unsupported protocol, packet loss, midstream observation или иной разрыв цепочки.

### Ошибка 7 — «лог приложения заменяет сетевой источник»

Он может дать более богатую прикладную семантику, но формируется в другой точке и имеет собственные ограничения.

---

## 20. Что нужно запомнить

1. Порт относится к транспортному контексту и не доказывает прикладной протокол.
2. Packet, flow, reassembled stream, protocol, transaction и semantic field — разные уровни представления.
3. Stateful reassembly нужен потому, что границы пакетов не обязаны совпадать с границами прикладного сообщения.
4. Parser создаёт структурированные поля, на которых может работать detection logic.
5. HTTP-семантика сохраняется между версиями, но wire representation HTTP/1.x, HTTP/2 и HTTP/3 различается.
6. TLS 1.3 защищает application data; доступные metadata не эквивалентны содержимому приложения.
7. ECH показывает, что даже привычные handshake metadata нельзя считать вечной гарантией наблюдаемости.
8. QUIC требует отдельной модели состояния и не сводится к «обычному UDP payload».
9. SSH и SMB демонстрируют разницу между распознаванием протокола и доступом к действиям внутри защищённого сеанса.
10. Tunnel/encapsulation создаёт внешний и внутренний уровни представления; placement определяет, какой из них доступен.
11. Parser sensor и parser endpoint могут расходиться; robustness нужно проверять контролируемыми тестами.
12. Application, host и network telemetry дополняют друг друга, но не являются взаимозаменяемыми источниками.
13. Условие обнаружения нужно проектировать от реально доступного representation к выводу, а не от желаемого вывода назад.

---

## 21. Проверка понимания

<div class="quiz" data-question-id="chapter9-q1">
  <p><strong>Сенсор видит соединение на TCP/443. Какой вывод наиболее корректен?</strong></p>
  <button data-choice="a">A. Это гарантированно HTTPS</button>
  <button data-choice="b" data-correct="true">B. Порт является признаком; прикладной протокол нужно определять отдельно, если это требуется для вывода</button>
  <button data-choice="c">C. Внутри обязательно HTTP/2</button>
  <button data-choice="d">D. Содержимое application data доступно IDS</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter9-q2">
  <p><strong>Зачем сетевой IDS TCP reassembly?</strong></p>
  <button data-choice="a">A. Чтобы изменить IP-адрес источника</button>
  <button data-choice="b">B. Чтобы включить TLS</button>
  <button data-choice="c" data-correct="true">C. Чтобы восстановить поток байтов, поскольку прикладное сообщение может быть разделено между несколькими сегментами</button>
  <button data-choice="d">D. Только для подсчёта пакетов</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter9-q3">
  <p><strong>Почему правило по HTTP URI нельзя автоматически считать применимым к тому же запросу внутри HTTPS?</strong></p>
  <button data-choice="a">A. HTTPS использует другой IP-протокол</button>
  <button data-choice="b" data-correct="true">B. URI относится к прикладному представлению, которое для внешнего сенсора без расшифрования защищено TLS</button>
  <button data-choice="c">C. HTTPS не использует HTTP semantics</button>
  <button data-choice="d">D. TLS удаляет URI на сервере</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter9-q4">
  <p><strong>Что лучше всего описывает HTTP/3?</strong></p>
  <button data-choice="a">A. Текстовый HTTP/1.1, переданный одним UDP-пакетом</button>
  <button data-choice="b">B. HTTP без шифрования</button>
  <button data-choice="c" data-correct="true">C. Отображение HTTP semantics на QUIC transport</button>
  <button data-choice="d">D. Разновидность DNS</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter9-q5">
  <p><strong>Сетевой сенсор распознал SSH. Что это само по себе доказывает?</strong></p>
  <button data-choice="a">A. Он видит все shell commands пользователя</button>
  <button data-choice="b">B. Пользователь выполнил вредоносную команду</button>
  <button data-choice="c" data-correct="true">C. Доступное сетевое представление позволило распознать SSH; видимость содержимого защищённой сессии требует отдельного основания</button>
  <button data-choice="d">D. На endpoint включён auditd</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter9-q6">
  <p><strong>Почему application log нельзя считать просто «более подробным network log»?</strong></p>
  <button data-choice="a">A. Потому что приложение не знает HTTP</button>
  <button data-choice="b" data-correct="true">B. Он формируется другим источником и в другой точке обработки, поэтому имеет собственные наблюдения и собственные слепые зоны</button>
  <button data-choice="c">C. Потому что application log всегда недостоверен</button>
  <button data-choice="d">D. Потому что сетевой сенсор всегда видит больше</button>
  <div class="quiz-feedback"></div>
</div>

---

## Источники и границы главы

Основные технические основания главы:

- RFC 9846, *The Transport Layer Security (TLS) Protocol Version 1.3* — актуальная спецификация TLS 1.3, заменившая RFC 8446: https://www.rfc-editor.org/rfc/rfc9846.html
- RFC 9849, *TLS Encrypted Client Hello* — защита внутреннего `ClientHello`, включая SNI и другие чувствительные поля: https://www.rfc-editor.org/rfc/rfc9849.html
- RFC 9000, *QUIC: A UDP-Based Multiplexed and Secure Transport*: https://www.rfc-editor.org/rfc/rfc9000.html
- RFC 9114, *HTTP/3* — отображение HTTP semantics на QUIC: https://www.rfc-editor.org/rfc/rfc9114.html
- RFC 9110, *HTTP Semantics* — общая семантика HTTP независимо от конкретной версии wire protocol: https://www.rfc-editor.org/rfc/rfc9110.html
- RFC 1035 и последующие обновления DNS — базовая модель DNS query/response: https://www.rfc-editor.org/rfc/rfc1035.html
- RFC 7858, DNS over TLS: https://www.rfc-editor.org/rfc/rfc7858.html
- RFC 8484, DNS over HTTPS: https://www.rfc-editor.org/rfc/rfc8484.html
- RFC 9250, DNS over QUIC: https://www.rfc-editor.org/rfc/rfc9250.html
- RFC 4253 и его обновления — SSH Transport Layer Protocol: https://www.rfc-editor.org/rfc/rfc4253.html
- Microsoft Open Specifications `[MS-SMB2]`, SMB Protocol Versions 2 and 3 — современная спецификация SMB 2/3, включая capabilities семейства SMB 3.x: https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/5606ad47-5ee0-437a-817e-70c366052962
- официальная документация Suricata 8.0.7: protocol detection, app-layer rules, flow/reassembly, EVE protocol records и protocol-specific fields: https://docs.suricata.io/en/suricata-8.0.7/

Suricata используется в этой главе только как конкретный пример реализации parser/detection pipeline. Общая модель `packet → flow/state → reassembly → protocol → transaction → field → detection result` не объявляется уникальной архитектурой Suricata и применяется как учебный способ разделять уровни представления.

Глава не обучает обходу IDS/IPS. Неоднозначность parsing, normalization и sensor/endpoint semantic gap рассматриваются как задачи корректности и robustness: цель — понять границы наблюдения и построить проверяемое условие обнаружения.

---

Дальше мы перейдём от отдельного протокола и отдельного правила к эксплуатации IDPS как длительно живущей системы: версиям detection content, тестированию изменений, staged deployment, rollback, health, capacity, времени, хранению и hardening. Этому будет посвящена **Глава 10 «Эксплуатация и жизненный цикл IDPS»**.
