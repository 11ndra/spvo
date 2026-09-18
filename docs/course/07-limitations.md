# Глава 7. Почему IDS/IPS ошибается и чего она не видит

<div class="chapter-lead">
<p>До этого момента мы последовательно разобрали, <strong>какие данные получает IDS/IPS, где она наблюдает события, по какому основанию выделяет подозрительную активность и как правило формализует проверку</strong>. Теперь нужен следующий инженерный шаг: понять, почему даже корректно работающая система не обладает полной видимостью и почему отсутствие alert нельзя автоматически трактовать как отсутствие события.</p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь:</strong>
<p>различать ложноположительную и ложноотрицательную ошибку; объяснять разницу между ошибкой детектора и слепой зоной; находить возможный разрыв между событием, точкой наблюдения, получением данных, представлением, логикой обнаружения и выводом; объяснять влияние шифрования, потерь данных, состояния протокола и нормализации; а также формулировать, что можно и чего нельзя заключить из отсутствия alert.</p>
</div>

---

## 1. IDS/IPS видит не «реальность», а доступный ей след

В инженерном смысле IDS/IPS никогда не получает полную картину происходящего. Она получает только те данные, которые:

```text
возникли в результате события;
прошли через доступную точку наблюдения;
были получены системой без критической потери;
были корректно декодированы или представлены;
попали в область применимости выбранной логики;
привели к наблюдаемому результату.
```

Поэтому между реальным событием и alert находится несколько независимых условий.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 1 · ЦЕПОЧКА, В КОТОРОЙ МОЖЕТ ВОЗНИКНУТЬ РАЗРЫВ</div>
<div class="idps-gates">
  <div class="idps-gate"><span>1 · СОБЫТИЕ</span><strong>Что-то действительно произошло</strong><small>Запрос, соединение, изменение файла, запуск процесса или иной факт.</small></div>
  <div class="idps-gate"><span>2 · НАБЛЮДЕНИЕ</span><strong>След прошёл через доступную точку</strong><small>Сенсор или агент вообще имел возможность получить соответствующие данные.</small></div>
  <div class="idps-gate"><span>3 · ПОЛУЧЕНИЕ</span><strong>Данные не были потеряны</strong><small>Захват, очередь, память и другие ресурсы позволили принять нужный фрагмент наблюдения.</small></div>
  <div class="idps-gate"><span>4 · ПРЕДСТАВЛЕНИЕ</span><strong>Данные стали пригодны для проверки</strong><small>Поток собран, протокол распознан, нужное поле доступно и не скрыто шифрованием.</small></div>
  <div class="idps-gate"><span>5 · ЛОГИКА</span><strong>Условие обнаружения выполнилось</strong><small>Правило, модель или другой детектор получил именно тот контекст, который ему нужен.</small></div>
  <div class="idps-gate"><span>6 · РЕЗУЛЬТАТ</span><strong>Результат сохранился и доступен</strong><small>Alert не был подавлен, потерян в очереди или исключён настройкой вывода.</small></div>
</div>
<div class="figure-caption">Отсутствие результата на последнем шаге не объясняет автоматически, на каком именно шаге произошёл разрыв.</div>
</div>

Это центральная идея главы:

<div class="principle-box">
<strong>НЕТ ALERT ≠ НЕТ СОБЫТИЯ</strong>
<p>Чтобы объяснить отсутствие alert, нужно определить, существовало ли событие, было ли оно наблюдаемо, какие данные реально получила система, какое представление использовал детектор и дошёл ли результат до журнала.</p>
</div>

---

## 2. Ошибка результата и слепая зона — не одно и то же

Для контролируемой оценки детектор обычно рассматривают как систему, которая принимает решение относительно заранее определённого объекта оценки.

Если объект должен считаться положительным, а детектор его не выделил, получаем **ложноотрицательный результат (False Negative, FN)**.

Если объект должен считаться отрицательным, но детектор его выделил, получаем **ложноположительный результат (False Positive, FP)**.

<div class="idps-grid idps-grid--2">
  <div class="idps-card idps-card--danger"><span class="idps-card__eyebrow">FALSE POSITIVE · FP</span><strong class="idps-card__title">Детектор выделил отрицательный объект</strong><p>Например, легитимная административная активность удовлетворила слишком широкому условию.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">FALSE NEGATIVE · FN</span><strong class="idps-card__title">Детектор не выделил положительный объект</strong><p>Причиной может быть логика, слепая зона, потеря данных, шифрование, неполное состояние или неверная конфигурация.</p></div>
</div>

Но **слепая зона** описывает не результат классификации, а ограничение наблюдаемости или доступности данных.

<div class="idps-contrast">
  <div class="idps-node idps-node--observation"><strong>Слепая зона</strong><small>система не располагает нужным наблюдением или представлением</small></div>
  <div class="idps-contrast__arrow">≠</div>
  <div class="idps-node idps-node--result"><strong>False Negative</strong><small>положительный объект оценки не был обнаружен</small></div>
</div>

Слепая зона **может привести** к FN, но это не единственная возможная причина FN.

И наоборот, не каждый случай отсутствия alert можно уже назвать FN: сначала нужен **эталон (ground truth)**, то есть независимое основание считать конкретную единицу оценки положительной. Полный контракт оценки и расчёт метрик будут темой Главы 8.

---

## 3. Первая естественная граница — точка наблюдения

В Главе 4 мы уже установили:

```text
точка наблюдения относится к конкретному потоку;
одна точка не даёт автоматически видимость всей инфраструктуры.
```

Если интересующий трафик прошёл другим маршрутом, локальное изменение произошло только на хосте или событие возникло внутри сервиса после сетевого обмена, сетевой сенсор может не получить нужный след вообще.

<div class="idps-source-hub">
  <div class="idps-source-hub__sources">
    <div class="idps-source-hub__source"><strong>Сетевой путь A</strong><small>проходит через сенсор</small></div>
    <div class="idps-source-hub__source"><strong>Сетевой путь B</strong><small>обходит точку наблюдения</small></div>
    <div class="idps-source-hub__source"><strong>Хостовое действие</strong><small>может не иметь достаточного сетевого следа</small></div>
    <div class="idps-source-hub__source"><strong>Внутреннее событие приложения</strong><small>видно в журнале сервиса, но не обязательно в сети</small></div>
  </div>
  <div class="idps-source-hub__arrow">→</div>
  <div class="idps-source-hub__core"><strong>Конкретная IDS/IPS</strong><small>получает только доступные ей источники и пути</small></div>
  <div class="idps-source-hub__boundary"><strong>Граница:</strong><small>если нужный след не достигает источника данных системы, последующая логика обнаружения не может восстановить его из ничего.</small></div>
</div>

Отсюда важный инженерный вопрос:

> **До анализа правила сначала нужно доказать, что нужное событие вообще могло попасть в наблюдаемую область системы.**

---

## 4. Наблюдаемый трафик ещё нужно получить без критической потери

Даже правильная точка наблюдения не гарантирует, что движок получил каждый пакет или каждое событие.

Причинами могут быть:

- перегрузка интерфейса или механизма захвата;
- ограничение очередей;
- нехватка памяти для потока, дефрагментации или другого состояния;
- ошибка декодирования;
- неполные данные TCP-потока;
- переполнение очереди результатов;
- иная ресурсная или конфигурационная проблема.

Suricata, например, публикует статистику захвата и внутренней обработки. В EVE statistics присутствуют поля `stats.capture.kernel_packets`, `stats.capture.kernel_drops`, счётчики дефрагментации и exception policy, а также `stats.detect.alert_queue_overflow` и `stats.detect.alerts_suppressed`.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 2 · «СЕНСОР РАБОТАЕТ» ЕЩЁ НЕ ДОКАЗЫВАЕТ ПОЛНОТУ ДАННЫХ</div>
<div class="idps-process">
  <div class="idps-process__step idps-process__step--source"><span>1</span><strong>Трафик пришёл к интерфейсу</strong><small>физическая или виртуальная точка наблюдения</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step"><span>2</span><strong>Механизм захвата</strong><small>часть пакетов может быть потеряна до userspace</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--sensor"><span>3</span><strong>Движок состояния и анализа</strong><small>лимиты памяти и ошибки представления тоже имеют значение</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--result"><span>4</span><strong>Alert / stats / иной output</strong><small>очередь результата также может иметь ограничения</small></div>
</div>
<div class="figure-caption">Диагностика начинается не с предположения «правило плохое», а с проверки качества получения и обработки данных.</div>
</div>

Поэтому наличие работающего процесса Suricata и нулевое число alert не позволяют сделать вывод, что весь интересующий трафик был полностью обработан.

---

## 5. Шифрование меняет доступное представление, а не уничтожает все наблюдения

Тема шифрования из силлабуса здесь напрямую связана с IDPS.

Рассмотрим сетевой сенсор на пути HTTPS-соединения.

Для незашифрованного HTTP ему потенциально доступны прикладные поля:

```text
метод HTTP;
URI;
заголовки;
часть или всё тело запроса/ответа — в зависимости от точки и возможностей движка.
```

После установления TLS прикладные HTTP-данные защищены шифрованием. Для внешнего сетевого сенсора без расшифрования путь `/admin/export` уже не является просто доступной строкой сетевого содержимого (payload).

<div class="idps-grid idps-grid--3">
  <div class="idps-card idps-card--success"><span class="idps-card__eyebrow">НЕЗАШИФРОВАННЫЙ HTTP</span><strong class="idps-card__title">Прикладное содержимое потенциально доступно</strong><p>Метод, URI, заголовки и другое представление могут быть разобраны сетевым движком.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">TLS 1.3</span><strong class="idps-card__title">Содержимое приложения защищено</strong><p>После ServerHello последующие сообщения handshake защищены, а application data передаётся в зашифрованном виде.</p></div>
  <div class="idps-card idps-card--observation"><span class="idps-card__eyebrow">МЕТАДАННЫЕ</span><strong class="idps-card__title">Часть признаков может оставаться наблюдаемой</strong><p>IP/порт, направление, размеры, время, а также некоторые свойства TLS — в зависимости от версии протокола и конфигурации.</p></div>
</div>

RFC 8446 для TLS 1.3 прямо устанавливает, что handshake-сообщения после `ServerHello` шифруются. Это означает не «сетевой IDS больше ничего не видит», а более точное утверждение:

<div class="principle-box">
<strong>ШИФРОВАНИЕ СКРЫВАЕТ ЧАСТЬ ПРЕДСТАВЛЕНИЯ</strong>
<p>Сетевой сенсор может продолжать видеть сам факт соединения и часть метаданных, но правило, которому нужен скрытый HTTP URI или другое содержимое приложения, не получает прежнего представления без дополнительной архитектуры расшифрования или другого источника данных.</p>
</div>

---

## 6. Метаданные тоже не являются неизменной гарантией

Даже формулировка «при TLS всегда виден SNI» уже слишком сильна.

Классический `ClientHello` может содержать открытый **Server Name Indication (SNI)**, и Suricata умеет регистрировать/проверять такие TLS-поля, а также дополнительные отпечатки вроде JA3/JA4 при соответствующей конфигурации.

Но современный механизм **Encrypted ClientHello (ECH)**, стандартизованный RFC 9849, предназначен именно для защиты SNI и других чувствительных полей `ClientHello`.

Поэтому корректная модель выглядит так:

<div class="idps-question-model">
  <div class="idps-question-model__cell"><span>НАДЁЖНО ДОСТУПНО НА СЕТЕВОМ ПУТИ</span><strong>только то, что реально остаётся наблюдаемым в данном протоколе и данной точке</strong></div>
  <div class="idps-question-model__cell"><span>МОЖЕТ БЫТЬ ДОСТУПНО</span><strong>TLS-метаданные, SNI, ALPN, fingerprint и другие поля — если они не защищены и движок их получает</strong></div>
  <div class="idps-question-model__cell"><span>НЕ СЛЕДУЕТ ПРЕДПОЛАГАТЬ</span><strong>что любой домен, URI, сертификат или прикладное содержимое всегда видны любому сетевому IDS</strong></div>
  <div class="idps-question-model__boundary"><strong>Вывод:</strong> видимость зависит от конкретного протокола, версии, расширений, места наблюдения и конфигурации системы.</div>
</div>

Именно поэтому правила должны опираться не на абстрактное «сетевой IDS это видит», а на проверяемое представление данных.

---

## 7. Расшифрование — архитектурное решение, а не бесплатная функция IDS

Если организации необходимо анализировать содержимое зашифрованного трафика, возможны разные архитектурные подходы:

<div class="idps-grid idps-grid--4 idps-grid--compact">
  <div class="idps-card idps-card--observation"><strong class="idps-card__title">Наблюдение до шифрования</strong><p>Телеметрия приложения, прокси или endpoint-компонента в точке, где содержимое ещё доступно.</p></div>
  <div class="idps-card idps-card--sensor"><strong class="idps-card__title">Контролируемое расшифрование</strong><p>Специализированный proxy/inspection-компонент при допустимой архитектуре и политике организации.</p></div>
  <div class="idps-card idps-card--source"><strong class="idps-card__title">Хостовый источник</strong><p>Процесс, файл, системный журнал или EDR/AV-телеметрия могут дать иной след того же эпизода.</p></div>
  <div class="idps-card idps-card--interpretation"><strong class="idps-card__title">Метаданные сети</strong><p>Когда содержимое недоступно, остаётся анализ доступных сетевых и временных признаков.</p></div>
</div>

Но это разные источники и разные точки доверия. Нельзя просто написать:

```text
HTTPS → IDS расшифрует
```

Расшифрование связано с управлением ключами, архитектурой доверия, производительностью, требованиями приватности и организационной политикой. В рамках этой главы важно только одно: **если детектору нужен признак внутри защищённого содержимого, нужно заранее определить, откуда этот признак реально будет получен**.

---

## 8. Сетевой протокол нужно сначала корректно реконструировать и интерпретировать

Тема безопасности сетевых протоколов из силлабуса важна не только из-за «опасных протоколов». Для IDS/IPS критично, что наблюдаемое сообщение может быть распределено по нескольким пакетам или фрагментам и иметь несколько представлений.

Например, TCP-приложение передаёт логическую строку:

```text
ATTACK-LAB
```

Она не обязана находиться в одном IP-пакете или одном TCP-сегменте. Поэтому современный сетевой движок выполняет отслеживание и повторную сборку потока (stream reassembly), чтобы анализировать данные в более устойчивом представлении.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 3 · ПАКЕТЫ И ЛОГИЧЕСКОЕ ПРЕДСТАВЛЕНИЕ НЕ ОБЯЗАНЫ СОВПАДАТЬ</div>
<div class="idps-fanout">
  <div class="idps-fanout__origin"><strong>Логические данные приложения</strong><small><code>ATTACK-LAB</code></small></div>
  <div class="idps-fanout__arrow">⇄</div>
  <div class="idps-fanout__targets">
    <div class="idps-fanout__target"><strong>Сегмент 1</strong><small><code>ATT</code></small></div>
    <div class="idps-fanout__target"><strong>Сегмент 2</strong><small><code>ACK-</code></small></div>
    <div class="idps-fanout__target"><strong>Сегмент 3</strong><small><code>LAB</code></small></div>
  </div>
</div>
<div class="figure-caption">Это иллюстрация необходимости корректной повторной сборки потока, а не описание конкретного способа обхода. Проверка должна выполняться над тем представлением, которое действительно формирует движок.</div>
</div>

Suricata различает анализ отдельных пакетов и повторно собранного потока, а его документация подчёркивает роль stream reassembly для устойчивого анализа данных.

---

## 9. Неоднозначность представления создаёт ещё одну границу

Даже после получения данных остаётся вопрос: **какое именно представление проверяется?**

В Главе 6 мы уже сравнивали `http.uri` и `http.uri.raw`.

Один и тот же прикладной запрос может существовать одновременно как:

```text
сырые байты на линии;
реконструированный поток;
разобранное поле протокола;
нормализованное поле;
событие приложения;
запись в хостовом журнале.
```

<div class="idps-process">
  <div class="idps-process__step idps-process__step--source"><span>1</span><strong>Сетевые байты</strong><small>то, что пришло к точке наблюдения</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step"><span>2</span><strong>Поток</strong><small>результат повторной сборки и состояния</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--sensor"><span>3</span><strong>Прикладное представление</strong><small>например, распознанный HTTP URI</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--result"><span>4</span><strong>Условие правила</strong><small>проверяет выбранное представление, а не абстрактную «атаку»</small></div>
</div>

Если конечная система (endpoint) и сенсор интерпретируют сложное или пограничное сообщение по-разному, возможен разрыв между тем, **что фактически обработал сервис**, и тем, **что проверил детектор**.

Это одна из причин, почему нормализация, повторная сборка и корректный протокольный анализатор являются частью защитной устойчивости, а не косметической обработкой данных.

---

## 10. Stateful-логика зависит от полноты контекста

Детектору состояния недостаточно увидеть один пакет. Ему может понадобиться начало соединения, направление потока, предыдущая транзакция или иная последовательность.

Если сенсор начал наблюдение посередине соединения, видит только одно направление из-за асимметричной маршрутизации или потерял значимый фрагмент состояния, логика может получить другой контекст.

<div class="idps-grid idps-grid--3">
  <div class="idps-card idps-card--success"><span class="idps-card__eyebrow">ПОЛНЫЙ КОНТЕКСТ</span><strong class="idps-card__title">Начало и обе стороны потока доступны</strong><p>Система имеет больше оснований корректно построить состояние.</p></div>
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">MIDSTREAM</span><strong class="idps-card__title">Наблюдение началось не с начала</strong><p>Некоторые свойства состояния могут быть недоступны или восстановлены с ограничениями.</p></div>
  <div class="idps-card idps-card--danger"><span class="idps-card__eyebrow">НЕПОЛНЫЙ ПУТЬ</span><strong class="idps-card__title">Видно только часть обмена</strong><p>Асимметрия маршрута или потеря данных может разрушить ожидаемую модель последовательности.</p></div>
</div>

Это ещё один пример того, почему:

```text
событие прошло по сети
```

не эквивалентно:

```text
детектор получил весь контекст, необходимый конкретному правилу.
```

---

## 11. Почему возникают False Positive

Ложноположительное срабатывание означает, что отрицательный объект оценки был выделен детектором как положительный. Причины могут находиться на разных уровнях.

<div class="idps-grid idps-grid--4 idps-grid--compact">
  <div class="idps-card idps-card--warning"><strong class="idps-card__title">Слишком широкое условие</strong><p>Признак встречается и в нормальной активности.</p></div>
  <div class="idps-card idps-card--warning"><strong class="idps-card__title">Недостаток контекста</strong><p>Одинаковое действие может иметь разный смысл для администратора и злоумышленника.</p></div>
  <div class="idps-card idps-card--warning"><strong class="idps-card__title">Изменившаяся среда</strong><p>Новый сервис или нормальный процесс больше не соответствует старой модели baseline.</p></div>
  <div class="idps-card idps-card--warning"><strong class="idps-card__title">Слабый критерий интерпретации</strong><p>Alert ошибочно принимается за подтверждённый incident без независимой проверки.</p></div>
</div>

Пример:

```text
условие: много SSH-соединений за короткое время
```

может соответствовать brute-force, но также может быть результатом штатной автоматизации.

Alert сообщает, что условие выполнилось. Контекст эксплуатации определяет, что это означает в конкретной среде.

---

## 12. Почему возникают False Negative

Ложноотрицательная ошибка имеет более широкий набор возможных причин.

<div class="idps-grid idps-grid--4 idps-grid--compact">
  <div class="idps-card idps-card--danger"><strong class="idps-card__title">Нет нужной видимости</strong><p>Событие прошло вне точки наблюдения или осталось только на endpoint.</p></div>
  <div class="idps-card idps-card--danger"><strong class="idps-card__title">Нужные данные потеряны</strong><p>Захват, повторная сборка, лимиты памяти или очередь результата не сохранили необходимый контекст.</p></div>
  <div class="idps-card idps-card--danger"><strong class="idps-card__title">Признак скрыт</strong><p>Шифрование или другое представление не даёт детектору поле, для которого написано условие.</p></div>
  <div class="idps-card idps-card--danger"><strong class="idps-card__title">Условие не покрывает вариант</strong><p>Фактическое наблюдение не удовлетворяет конкретной логике правила или модели.</p></div>
</div>

Дополнительно возможны:

```text
неверная конфигурация области правила;
неполное состояние потока;
протокольный анализатор (parser) не распознал ожидаемое представление;
правило не загрузилось или было пропущено;
результат совпадения был подавлен политикой вывода;
alert был потерян после обнаружения.
```

Последние два случая особенно полезно отличать от «детектор не совпал»: движок мог получить совпадение, но пользователь не увидел соответствующий alert.

---

## 13. Хостовые и прикладные источники уменьшают отдельные слепые зоны, но не дают абсолютной истины

Если сетевой сенсор не видит HTTP URI внутри TLS, приложение на сервере всё равно может оставить журнал запроса. Если сеть не показывает изменение файла, ОС или EDR могут зафиксировать действие процесса.

<div class="idps-evidence-grid">
  <article class="idps-evidence idps-evidence--supported"><span>СЕТЕВОЙ ИСТОЧНИК</span><strong>Может подтвердить</strong><p>соединение, направление, доступные сетевые/протокольные поля, объём и временные свойства — в пределах точки наблюдения.</p></article>
  <article class="idps-evidence idps-evidence--supported"><span>ПРИКЛАДНОЙ ЖУРНАЛ</span><strong>Может подтвердить</strong><p>что приложение зарегистрировало конкретный запрос или внутреннее событие — если соответствующее журналирование включено и корректно.</p></article>
  <article class="idps-evidence idps-evidence--supported"><span>ХОСТОВЫЙ ИСТОЧНИК</span><strong>Может подтвердить</strong><p>процесс, файл, системный вызов или другой локальный факт — в пределах настроенного аудита/сенсора.</p></article>
  <article class="idps-evidence idps-evidence--not-proven"><span>НИ ОДИН ИЗ НИХ АВТОМАТИЧЕСКИ</span><strong>Не является полной эталонной картиной</strong><p>каждый источник имеет собственные границы, задержки, настройки и возможные потери.</p></article>
</div>

Тема антивирусной и проактивной защиты из силлабуса здесь используется именно так: AV/EDR может быть **дополнительным хостовым источником и защитным механизмом**, но его нельзя автоматически объявлять «HIDS» только по названию продукта.

---

## 14. Web/API-сценарий: одинаковый эпизод даёт разные возможности проверки

Возьмём один абстрактный запрос к веб-сервису:

```text
GET /api/export?scope=all
```

<div class="idps-grid idps-grid--3">
  <div class="idps-card idps-card--source"><span class="idps-card__eyebrow">HTTP БЕЗ TLS</span><strong class="idps-card__title">NIDS потенциально видит URI</strong><p>Если трафик проходит через точку наблюдения и HTTP корректно распознан.</p></div>
  <div class="idps-card idps-card--observation"><span class="idps-card__eyebrow">HTTPS</span><strong class="idps-card__title">NIDS видит ограниченный набор сетевых/TLS-признаков</strong><p>Сам URI обычно недоступен внешнему сенсору без расшифрования.</p></div>
  <div class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">ЛОГ ПРИЛОЖЕНИЯ</span><strong class="idps-card__title">Сервис может зарегистрировать URI после расшифрования</strong><p>Но только если соответствующий запрос действительно журналируется.</p></div>
</div>

Этот пример связывает темы силлабуса «безопасность приложений» и «безопасность веб-сервисов» с предметом IDPS, не превращая главу в курс по эксплуатации веб-приложений.

---

## 15. Диагностика: почему нет ожидаемого alert

Ниже один и тот же внешний симптом — «ожидаемого alert нет» — разложен на разные классы причин.

<div class="idps-switcher" data-idps-switcher>
  <div class="idps-switcher__header">
    <strong>Один симптом — разные причины</strong>
    <p>Переключайте уровень диагностики. Ни один из вариантов нельзя выбрать только по факту отсутствия alert.</p>
  </div>
  <div class="idps-switcher__controls" role="tablist" aria-label="Причина отсутствия alert">
    <button class="idps-switcher__button" type="button" role="tab" data-idps-switch="visibility" aria-controls="ch7-visibility">Наблюдаемость</button>
    <button class="idps-switcher__button" type="button" role="tab" data-idps-switch="acquisition" aria-controls="ch7-acquisition">Получение</button>
    <button class="idps-switcher__button" type="button" role="tab" data-idps-switch="representation" aria-controls="ch7-representation">Представление</button>
    <button class="idps-switcher__button" type="button" role="tab" data-idps-switch="logic" aria-controls="ch7-logic">Логика</button>
    <button class="idps-switcher__button" type="button" role="tab" data-idps-switch="output" aria-controls="ch7-output">Вывод</button>
  </div>
  <div class="idps-switcher__panels">
    <section class="idps-switcher__panel" id="ch7-visibility" data-idps-panel="visibility" role="tabpanel">
      <h3 class="idps-switcher__panel-title">1. Проверить наблюдаемость</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>ВОПРОС</span><strong>Прошёл ли интересующий поток через эту точку?</strong></div>
        <div class="idps-question-model__cell"><span>НЕЗАВИСИМОЕ СВИДЕТЕЛЬСТВО</span><strong>pcap/tcpdump, маршрутизация, журнал приложения или другой источник</strong></div>
        <div class="idps-question-model__boundary"><strong>Если нет:</strong> проблема находится раньше правила — детектор не получил нужный поток.</div>
      </div>
    </section>
    <section class="idps-switcher__panel" id="ch7-acquisition" data-idps-panel="acquisition" role="tabpanel">
      <h3 class="idps-switcher__panel-title">2. Проверить получение данных</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>ВОПРОС</span><strong>Нет ли drops, gaps, memcap/exception событий?</strong></div>
        <div class="idps-question-model__cell"><span>СВИДЕТЕЛЬСТВО</span><strong>capture/stream/defrag/detect statistics</strong></div>
        <div class="idps-question-model__boundary"><strong>Если данные потеряны:</strong> отсутствие alert нельзя использовать как тест содержательной логики правила.</div>
      </div>
    </section>
    <section class="idps-switcher__panel" id="ch7-representation" data-idps-panel="representation" role="tabpanel">
      <h3 class="idps-switcher__panel-title">3. Проверить представление</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>ВОПРОС</span><strong>Доступно ли поле, к которому обращается условие?</strong></div>
        <div class="idps-question-model__cell"><span>ПРИМЕР</span><strong>HTTP URI скрыт TLS или протокольный анализатор не сформировал ожидаемый buffer</strong></div>
        <div class="idps-question-model__boundary"><strong>Если представление недоступно:</strong> текст правила может быть корректен, но ему нечего проверять.</div>
      </div>
    </section>
    <section class="idps-switcher__panel" id="ch7-logic" data-idps-panel="logic" role="tabpanel">
      <h3 class="idps-switcher__panel-title">4. Проверить само условие</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>ВОПРОС</span><strong>Фактическое наблюдение действительно удовлетворяет всем ограничениям правила?</strong></div>
        <div class="idps-question-model__cell"><span>СВИДЕТЕЛЬСТВО</span><strong>positive/negative tests и точное сопоставление значений полей</strong></div>
        <div class="idps-question-model__boundary"><strong>Если нет:</strong> это уже вопрос detection condition, а не точки наблюдения.</div>
      </div>
    </section>
    <section class="idps-switcher__panel" id="ch7-output" data-idps-panel="output" role="tabpanel">
      <h3 class="idps-switcher__panel-title">5. Проверить вывод результата</h3>
      <div class="idps-question-model">
        <div class="idps-question-model__cell"><span>ВОПРОС</span><strong>Мог ли результат быть подавлен или потерян после совпадения?</strong></div>
        <div class="idps-question-model__cell"><span>ПРИМЕР</span><strong>threshold/noalert, очередь alert, неправильный output или поиск не в том журнале</strong></div>
        <div class="idps-question-model__boundary"><strong>Важно:</strong> «не вижу alert в файле» и «условие не совпало» — не тождественные утверждения.</div>
      </div>
    </section>
  </div>
</div>

---

## 16. Что можно заключить из отсутствия alert

<div class="idps-proof-map">
  <div class="idps-proof-map__fact idps-proof-map__fact--source"><strong>Независимо подтверждено событие</strong><span>например, сервер зарегистрировал запрос или pcap содержит нужный поток</span></div>
  <div class="idps-proof-map__operator" aria-hidden="true">+</div>
  <div class="idps-proof-map__fact idps-proof-map__fact--observation"><strong>Подтверждена пригодная точка наблюдения</strong><span>трафик действительно достиг интерфейса сенсора</span></div>
  <div class="idps-proof-map__operator" aria-hidden="true">+</div>
  <div class="idps-proof-map__fact"><strong>Подтверждены данные и состояние</strong><span>нет релевантной потери, нужное представление доступно, правило загружено</span></div>
  <div class="idps-proof-map__operator" aria-hidden="true">⇒</div>
  <div class="idps-proof-map__conclusion"><strong>Только после этого</strong><span>отсутствие ожидаемого alert становится содержательным фактом для анализа логики детектора.</span></div>
</div>

Даже тогда корректная формулировка обычно звучит так:

> «При зафиксированных условиях теста детектор не сформировал ожидаемый результат для данного объекта оценки».

Это намного точнее, чем:

> «IDS не видит атаку».

---

## 17. Что нужно запомнить

<div class="axiom-grid">
  <div class="axiom-card"><span>01</span><strong>IDS/IPS работает с наблюдаемыми следами</strong><p>Она не получает «полную реальность» автоматически.</p></div>
  <div class="axiom-card"><span>02</span><strong>Blind spot ≠ False Negative</strong><p>Слепая зона является возможной причиной ошибки, а FN — результат относительно заранее определённого эталона.</p></div>
  <div class="axiom-card"><span>03</span><strong>Шифрование меняет видимость</strong><p>Payload может стать недоступным, при этом часть сетевых и TLS-метаданных может сохраняться.</p></div>
  <div class="axiom-card"><span>04</span><strong>Получение данных тоже нужно проверять</strong><p>Drops, gaps, memcap и очереди могут нарушить путь от события к результату.</p></div>
  <div class="axiom-card"><span>05</span><strong>Представление определяет применимость правила</strong><p>Raw bytes, reassembled stream, нормализованное поле и журнал приложения — разные представления.</p></div>
  <div class="axiom-card"><span>06</span><strong>Нет alert ≠ нет события</strong><p>Сначала локализуется разрыв: наблюдаемость, получение, представление, логика или output.</p></div>
</div>

---

## 18. Проверка понимания

<div class="quiz" data-question-id="chapter7-v1-q1">
  <p><strong>Контролируемый запрос подтверждён журналом сервера, но alert NIDS отсутствует. Какой вывод корректен первым?</strong></p>
  <button data-choice="a">A. Запроса не было</button>
  <button data-choice="b">B. Правило точно содержит ошибку</button>
  <button data-choice="c" data-correct="true">C. Нужно проверить точку наблюдения, получение данных, представление, условие и вывод результата</button>
  <button data-choice="d">D. Система обязательно имеет False Negative</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-v1-q2">
  <p><strong>Что точнее всего описывает влияние TLS на сетевую IDS?</strong></p>
  <button data-choice="a">A. При TLS сеть полностью становится невидимой</button>
  <button data-choice="b" data-correct="true">B. Прикладное содержимое может быть скрыто, но часть сетевых и протокольных метаданных может оставаться доступной</button>
  <button data-choice="c">C. TLS автоматически передаёт ключи IDS</button>
  <button data-choice="d">D. TLS влияет только на firewall, но не на IDS</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-v1-q3">
  <p><strong>Как соотносятся blind spot и False Negative?</strong></p>
  <button data-choice="a">A. Это всегда одно и то же</button>
  <button data-choice="b" data-correct="true">B. Слепая зона может стать причиной FN, но FN определяется относительно объекта оценки и независимого эталона</button>
  <button data-choice="c">C. Blind spot означает только False Positive</button>
  <button data-choice="d">D. FN можно определить без эталона</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-v1-q4">
  <p><strong>Почему полезно смотреть `kernel_drops`, stream/defrag statistics и alert queue statistics?</strong></p>
  <button data-choice="a">A. Они автоматически подтверждают компрометацию</button>
  <button data-choice="b">B. Они заменяют pcap</button>
  <button data-choice="c" data-correct="true">C. Они помогают проверить, не возник ли разрыв на этапе получения, реконструкции или вывода данных</button>
  <button data-choice="d">D. Они показывают только номер версии правила</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter7-v1-q5">
  <p><strong>Что меняет ECH относительно прежнего упрощения «SNI всегда виден»?</strong></p>
  <button data-choice="a">A. Ничего, SNI по определению всегда открыт</button>
  <button data-choice="b" data-correct="true">B. ECH может защищать SNI и другие поля ClientHello, поэтому доступность TLS-метаданных нужно проверять для конкретной среды</button>
  <button data-choice="c">C. ECH расшифровывает HTTP для IDS</button>
  <button data-choice="d">D. ECH применяется только к ICMP</button>
  <div class="quiz-feedback"></div>
</div>

---

## Источники и границы главы

- NIST SP 800-94 — исторический фундаментальный источник по ограничениям IDPS, false positive/false negative и необходимости учитывать особенности источника данных. Документ 2007 года не используется как исчерпывающее описание современных продуктов.
- RFC 8446 — TLS 1.3; используется для объяснения того, какие части handshake защищаются и почему содержимое приложения недоступно внешнему сетевому сенсору без дополнительной архитектуры.
- RFC 9849 — Encrypted ClientHello (ECH); используется для актуальной оговорки о том, что SNI и другие поля ClientHello не следует считать неизменно открытыми.
- Suricata 8.0.7 EVE Index / statistics — `stats.capture`, `kernel_drops`, exception-policy counters, `alert_queue_overflow`, `alerts_suppressed` и другие диагностические признаки.
- Suricata 8.0.7 Flow Keywords и документация stream/reassembly — контекст потока, reassembled stream и роль реконструкции данных.
- Suricata TLS/EVE fields — пример того, какие TLS-метаданные конкретная реализация может журналировать при соответствующей наблюдаемости и конфигурации.

Связь с силлабусом: темы **шифрования, безопасности сетевых протоколов, безопасности приложений, веб-сервисов и антивирусной/проактивной защиты** собраны вокруг одного инженерного вопроса — **какие данные доступны IDPS и где проходит граница обоснованного вывода**. Они не превращены в пять несвязанных мини-лекций и не используются как повод превратить курс в pentest.

Полный расчёт TP/FP/TN/FN, precision, recall, влияние base rate и методику оценки эффективности мы намеренно переносим в **Главу 8**.

Следующая глава курса — **Глава 8 «Как проверить и обосновать эффективность IDS/IPS»**. В ней ограничения этой главы станут основой для корректного Evaluation Contract и измерения качества детектора.

Актуальные ссылки собраны в разделе [«Источники курса»](../../resources/sources/).
