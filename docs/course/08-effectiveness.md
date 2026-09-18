# Глава 8. Как проверить и обосновать эффективность IDS/IPS

<div class="chapter-lead">
<p>Работающая IDS/IPS ещё не обязательно является эффективной. Система может стабильно запускаться, получать трафик и создавать alert, но при этом пропускать нужные события, генерировать неприемлемый шум, терять данные под нагрузкой или давать выводы, которые нельзя воспроизвести и защитить доказательствами.</p>
<p>Поэтому финальный вопрос базовой части курса звучит так: <strong>как перейти от фразы «у нас IDS работает» к проверяемому утверждению «в заданных условиях этот контроль решает конкретную задачу с известными ограничениями»?</strong></p>
</div>

<div class="chapter-outcomes">
<strong>После этой главы вы должны уметь:</strong>
<p>задавать контракт оценки; определять единицу оценки и ground truth; строить матрицу TP/FP/TN/FN; интерпретировать recall, precision, FPR и accuracy; объяснять влияние базовой частоты; проверять покрытие, устойчивость, производительность и задержку; отделять качество детектора от качества предотвращения; а также оформлять вывод так, чтобы было ясно, что именно доказано экспериментом и где заканчиваются границы доказательства.</p>
</div>

---

## 1. Эффективность начинается не с метрики, а с задачи

Фраза «проверим эффективность IDS» слишком неопределённа. Нельзя измерить качество системы, пока не зафиксировано, **что именно она должна обнаруживать или предотвращать**.

Например, это три разные задачи:

<div class="idps-grid idps-grid--3">
  <div class="idps-card"><span class="idps-card__eyebrow">ЦЕЛЬ A</span><strong class="idps-card__title">Определить конкретный HTTP-признак</strong><p>Проверяется правило над доступным прикладным представлением.</p></div>
  <div class="idps-card"><span class="idps-card__eyebrow">ЦЕЛЬ B</span><strong class="idps-card__title">Выделить сетевое сканирование</strong><p>Проверяется серия событий, окно времени и выбранное основание решения.</p></div>
  <div class="idps-card"><span class="idps-card__eyebrow">ЦЕЛЬ C</span><strong class="idps-card__title">Заблокировать запрещённый обмен</strong><p>Помимо detection нужно отдельно проверить исполнительное воздействие и влияние на разрешённый трафик.</p></div>
</div>

У каждой задачи будут разные:

```text
объект оценки;
эталон истинного состояния;
тестовый набор;
метрики;
стоимость FP и FN;
допустимая задержка;
границы вывода.
```

<div class="principle-box">
<strong>ЭФФЕКТИВНОСТЬ ВСЕГДА ОТНОСИТЕЛЬНА К ЗАРАНЕЕ ОПРЕДЕЛЁННОЙ ЦЕЛИ</strong>
<p>Без detection objective число alert, процент CPU и даже высокий recall сами по себе не отвечают на вопрос, полезен ли контроль для конкретной задачи.</p>
</div>

---

## 2. Нужно различать объект оценки: правило, детектор или весь контроль

Одна из самых частых ошибок — переносить результат теста одной функции на всю систему.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 1 · ТРИ РАЗНЫХ УРОВНЯ УТВЕРЖДЕНИЯ</div>
<div class="idps-eval-levels">
  <article><span>УРОВЕНЬ 1</span><strong>Конкретное правило</strong><p>Выполняется ли условие на заданном представлении данных?</p><small>Например, SID 1000005 на фиксированном HTTP-наборе.</small></article>
  <div class="idps-eval-levels__arrow">→</div>
  <article><span>УРОВЕНЬ 2</span><strong>Детектор / движок</strong><p>Получает ли он нужные данные, сохраняет состояние, выдерживает нагрузку и формирует результаты?</p><small>Качество правила не доказывает отсутствие потерь в capture path.</small></article>
  <div class="idps-eval-levels__arrow">→</div>
  <article><span>УРОВЕНЬ 3</span><strong>Защитный контроль</strong><p>Обеспечивает ли вся архитектура нужное обнаружение или предотвращение в реальной области применения?</p><small>Здесь важны placement, coverage, доставка результата и исполнительное воздействие.</small></article>
</div>
</div>

Из успешного теста одного правила нельзя автоматически заключить:

> «IDS обнаруживает все атаки этого класса во всей инфраструктуре».

Для такого вывода не хватает доказательств о маршрутах, точках наблюдения, вариантах представления, нагрузке, конфигурации и тестовом покрытии.

---

## 3. Evaluation Contract: сначала зафиксировать условия измерения

До расчёта метрик нужен **контракт оценки (Evaluation Contract)** — набор условий, без которых результаты нельзя корректно интерпретировать или сравнивать.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 2 · EVALUATION CONTRACT</div>
<div class="idps-eval-contract">
  <article><span>1</span><strong>Цель</strong><small>Какое свойство должен выделять контроль?</small></article>
  <article><span>2</span><strong>Единица оценки</strong><small>Запрос, flow, файл, хост, временное окно или иной объект.</small></article>
  <article><span>3</span><strong>Ground truth</strong><small>Откуда независимо известно истинное состояние объекта?</small></article>
  <article><span>4</span><strong>Правило сопоставления</strong><small>Как alert связывается с одной единицей оценки?</small></article>
  <article><span>5</span><strong>Выборка и окно</strong><small>Какие positive/negative cases и какой период входят в тест?</small></article>
  <article><span>6</span><strong>Среда и версия</strong><small>Placement, интерфейс, конфигурация, ruleset, версия продукта.</small></article>
  <article><span>7</span><strong>Критерии приёмки</strong><small>Какие показатели считаются приемлемыми именно для этой задачи?</small></article>
  <article><span>8</span><strong>Границы</strong><small>На какие среды, сценарии и варианты результат не распространяется?</small></article>
</div>
</div>

Если два теста используют разные единицы оценки или разные ground truth, их значения precision/recall могут быть математически корректными, но **несопоставимыми по смыслу**.

---

## 4. Ground truth должен быть независим от самого alert

**Ground truth** — независимое основание считать единицу оценки положительной или отрицательной.

Плохая логика:

```text
Suricata создала alert
→ значит событие было атакой
→ этот же alert используем как доказательство TP
```

Это замкнутое доказательство: решение детектора объявляется одновременно и проверяемым результатом, и эталоном истины.

Хорошая логика в контролируемом эксперименте:

<div class="idps-process">
  <div class="idps-process__step idps-process__step--source"><span>1</span><strong>Заранее размеченный сценарий</strong><small>мы знаем, какой запрос считается positive и какой negative</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step"><span>2</span><strong>Независимое подтверждение события</strong><small>PCAP, лог приложения, журнал ОС или другой независимый источник</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--sensor"><span>3</span><strong>Результат детектора</strong><small>alert / отсутствие alert для конкретного правила</small></div>
  <div class="idps-process__arrow">→</div>
  <div class="idps-process__step idps-process__step--result"><span>4</span><strong>Сопоставление</strong><small>только теперь определяется TP, FP, TN или FN</small></div>
</div>

Ground truth тоже имеет ограничения. Например, отсутствие записи в одном application log ещё не доказывает, что сетевого пакета не существовало. Эталон должен соответствовать тому факту, который оценивается.

---

## 5. Матрица результатов: TP, FP, TN и FN

После фиксации единицы оценки и ground truth бинарный детектор даёт четыре типа результата.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 3 · CONFUSION MATRIX</div>
<div class="idps-confusion" role="table" aria-label="Матрица результатов бинарного детектора">
  <div class="idps-confusion__corner"></div>
  <div class="idps-confusion__head">Ground truth: positive</div>
  <div class="idps-confusion__head">Ground truth: negative</div>
  <div class="idps-confusion__side">Детектор: positive</div>
  <div class="idps-confusion__cell idps-confusion__cell--tp"><strong>TP</strong><span>положительный объект обнаружен</span></div>
  <div class="idps-confusion__cell idps-confusion__cell--fp"><strong>FP</strong><span>отрицательный объект ошибочно выделен</span></div>
  <div class="idps-confusion__side">Детектор: negative</div>
  <div class="idps-confusion__cell idps-confusion__cell--fn"><strong>FN</strong><span>положительный объект не обнаружен</span></div>
  <div class="idps-confusion__cell idps-confusion__cell--tn"><strong>TN</strong><span>отрицательный объект корректно не выделен</span></div>
</div>
</div>

Важно сохранить связь с Главой 7:

- **FN** — результат оценки;
- **слепая зона** — возможная причина FN;
- отсутствие alert ещё не является FN, пока нет ground truth, подтверждающего положительный объект.

---

## 6. Метрики отвечают на разные вопросы

Одна метрика не описывает качество детектора целиком.

<div class="idps-metric-grid">
  <article><span>RECALL / TPR</span><strong>TP / (TP + FN)</strong><p>Какую долю положительных объектов мы обнаружили?</p></article>
  <article><span>PRECISION</span><strong>TP / (TP + FP)</strong><p>Какую долю положительных решений детектора можно подтвердить?</p></article>
  <article><span>FPR</span><strong>FP / (FP + TN)</strong><p>Какую долю отрицательных объектов детектор ошибочно выделяет?</p></article>
  <article><span>ACCURACY</span><strong>(TP + TN) / N</strong><p>Какова общая доля правильных решений на данной выборке?</p></article>
</div>

Например, тест дал:

```text
TP = 92
FN = 8
FP = 18
TN = 882
```

Тогда:

```text
Recall    = 92 / 100  = 92%
Precision = 92 / 110  ≈ 83.6%
FPR       = 18 / 900  = 2%
Accuracy  = 974 / 1000 = 97.4%
```

`97.4% accuracy` выглядит очень хорошо, но не заменяет остальные показатели. В задачах с редкими положительными событиями accuracy особенно легко создаёт ложное ощущение качества.

<div class="principle-box">
<strong>МЕТРИКА ОТВЕЧАЕТ ТОЛЬКО НА СВОЙ ВОПРОС</strong>
<p>Recall не описывает шум. Precision не говорит, сколько положительных объектов пропущено. FPR зависит от количества отрицательных объектов. Accuracy зависит от состава выборки.</p>
</div>

---

## 7. Базовая частота может радикально изменить практический смысл результата

Intrusion detection часто работает в среде, где интересующие события встречаются намного реже нормальной активности. Поэтому даже небольшой False Positive Rate может дать большое абсолютное число ложных alert.

<div class="teaching-figure">
<div class="figure-label">ИНТЕРАКТИВНАЯ МОДЕЛЬ · BASE-RATE EFFECT</div>
<div class="idps-base-rate" data-idps-base-rate>
  <div class="idps-base-rate__controls">
    <label><span>Всего единиц оценки</span><input type="number" min="100" step="100" value="100000" data-idps-br-total></label>
    <label><span>Доля positive</span><input type="range" min="0.01" max="10" step="0.01" value="0.10" data-idps-br-prevalence><strong data-idps-br-prevalence-value>0.10%</strong></label>
    <label><span>Recall / TPR</span><input type="range" min="50" max="100" step="0.1" value="99" data-idps-br-tpr><strong data-idps-br-tpr-value>99.0%</strong></label>
    <label><span>False Positive Rate</span><input type="range" min="0" max="10" step="0.1" value="1" data-idps-br-fpr><strong data-idps-br-fpr-value>1.0%</strong></label>
  </div>
  <div class="idps-base-rate__matrix">
    <article class="is-tp"><span>TP</span><strong data-idps-br-tp>99</strong><small>positive обнаружены</small></article>
    <article class="is-fn"><span>FN</span><strong data-idps-br-fn>1</strong><small>positive пропущены</small></article>
    <article class="is-fp"><span>FP</span><strong data-idps-br-fp>999</strong><small>ложные positive</small></article>
    <article class="is-tn"><span>TN</span><strong data-idps-br-tn>98901</strong><small>корректные negative</small></article>
  </div>
  <div class="idps-base-rate__result"><span>Precision</span><strong data-idps-br-precision>9.0%</strong><p data-idps-br-explanation>При редких positive даже небольшой FPR создаёт много ложных alert.</p></div>
</div>
<div class="figure-caption">Модель использует заранее известную prevalence тестовой выборки. Она показывает влияние состава выборки, а не предсказывает частоту реальных атак в конкретной организации.</div>
</div>

При исходных значениях из 100 000 объектов только 100 являются positive. Детектор с `99% recall` обнаружит примерно 99 из них, но `1% FPR` на 99 900 negative даст примерно 999 FP. В результате precision окажется около 9%.

Именно поэтому качество нельзя описывать фразой «99% detection rate» без контекста выборки и ошибок на negative-классе.

---

## 8. Threshold и tuning меняют компромисс, но не дают бесплатного улучшения

Во многих детекторах есть параметр, который влияет на чувствительность: порог частоты, score, величина отклонения или иная decision boundary.

<div class="idps-threshold-tradeoff">
  <div><strong>Чувствительнее</strong><span>обычно меньше FN</span><span>часто больше FP</span></div>
  <div class="idps-threshold-tradeoff__track"><span></span></div>
  <div><strong>Строже</strong><span>часто меньше FP</span><span>обычно больше FN</span></div>
</div>

Это не универсальный закон для любого изменения правила: не каждое редактирование монотонно двигает один и тот же порог. Но **если меняется одна decision boundary при прочих равных**, появляется измеримый trade-off.

Tuning поэтому оценивают не по количеству отключённых alert, а по тому, как изменение влияет на заранее определённые positive и negative cases.

---

## 9. Coverage: высокий результат на узком наборе ещё не означает широкое покрытие

Представим правило, которое идеально обнаруживает один подготовленный HTTP-запрос. Это доказывает его работу только для проверенного представления и контекста.

Чтобы говорить о покрытии, нужно определить пространство вариантов.

<div class="idps-coverage-map">
  <article><span>СЦЕНАРИЙ</span><strong>Что происходит?</strong><small>запрос, последовательность, сетевое поведение, хостовое действие</small></article>
  <article><span>ПРЕДСТАВЛЕНИЕ</span><strong>Как событие выглядит для сенсора?</strong><small>raw/normalized, stream, app-layer buffer, metadata</small></article>
  <article><span>КОНТЕКСТ</span><strong>При каких условиях?</strong><small>направление, состояние, сегмент, роль узла, временное окно</small></article>
  <article><span>ВАРИАНТ</span><strong>Какие допустимые изменения проверены?</strong><small>размер, частота, последовательность, кодирование, маршрут</small></article>
</div>

Полезный тестовый набор обычно включает не только один positive и один negative, а несколько классов:

<div class="idps-test-matrix">
  <article class="idps-test-matrix__positive"><span>POSITIVE</span><strong>Известный целевой случай</strong><p>Должен быть обнаружен.</p><small>Проверяет базовую способность детектора.</small></article>
  <article class="idps-test-matrix__negative"><span>NEGATIVE</span><strong>Обычная активность</strong><p>Не должна удовлетворять условию.</p><small>Проверяет очевидный шум.</small></article>
  <article class="idps-test-matrix__negative"><span>NEAR-MISS</span><strong>Похожий, но отрицательный случай</strong><p>Специально близок к границе правила.</p><small>Ищет риск FP.</small></article>
  <article class="idps-test-matrix__positive"><span>VARIANT</span><strong>Изменённый positive</strong><p>Смысл сохраняется, представление меняется.</p><small>Ищет риск FN и хрупкость правила.</small></article>
</div>

<div class="admonition warning">
<p class="admonition-title">Граница безопасности курса</p>
<p>Вариантные тесты используются для контролируемой проверки устойчивости логики в учебном стенде. Цель — понять границы собственного детектора, а не обучать обходу защитных систем в чужой инфраструктуре.</p>
</div>

---

## 10. Проверять нужно не только классификацию, но и путь данных

Даже идеальная логика на офлайн-наборе не доказывает, что тот же результат сохранится в рабочей архитектуре.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 4 · ЧЕТЫРЕ ИЗМЕРЕНИЯ ИНЖЕНЕРНОЙ ЭФФЕКТИВНОСТИ</div>
<div class="idps-eval-dimensions">
  <article><span>1 · VISIBILITY</span><strong>Нужные данные доступны?</strong><p>Placement, capture, host telemetry, encryption boundary.</p></article>
  <article><span>2 · DETECTION QUALITY</span><strong>Решение корректно?</strong><p>TP/FP/TN/FN, precision, recall, FPR, coverage.</p></article>
  <article><span>3 · CAPACITY</span><strong>Система выдерживает условия?</strong><p>Drops, resource limits, throughput, queue overflow, стабильность состояния.</p></article>
  <article><span>4 · DELIVERY / ACTION</span><strong>Результат доходит до нужного действия?</strong><p>Запись события, задержка, оповещение, а для IPS — отдельная проверка воздействия.</p></article>
</div>
<div class="figure-caption">Эти измерения связаны, но не взаимозаменяемы. Высокий precision не доказывает полноту visibility; отсутствие packet drops не доказывает корректность detection logic.</div>
</div>

Так мы избегаем неправильного вывода:

```text
правило прошло unit-test
→ значит вся IDS эффективна
```

---

## 11. Производительность оценивается вместе с потерями и рабочей нагрузкой

Для IDPS производительность важна не как абстрактный benchmark, а потому что перегрузка может изменить **доступный системе набор данных**.

Нужно разделять как минимум:

- объём входных данных или событий;
- фактически обработанные данные;
- потери при захвате;
- внутренние исключения/лимиты;
- CPU и память;
- переполнение очередей результатов;
- задержку от события до доступного результата.

Для Suricata конкретными диагностическими артефактами могут быть EVE statistics: capture counters, `kernel_drops`, exception-policy counters, `alert_queue_overflow`, `alerts_suppressed` и другие поля. Они доказывают состояние **конкретной реализации и конкретного запуска**, а не универсальную производительность любой NIDS.

<div class="idps-evidence-strip">
  <article><span>INPUT</span><strong>Сколько данных ожидалось?</strong></article>
  <div>→</div>
  <article><span>CAPTURE</span><strong>Сколько реально получено?</strong></article>
  <div>→</div>
  <article><span>ENGINE</span><strong>Были ли resource/exception limits?</strong></article>
  <div>→</div>
  <article><span>OUTPUT</span><strong>Сохранился ли результат вовремя?</strong></article>
</div>

Если нагрузочный тест не фиксирует потери и фактически обработанный объём, фраза «IDS выдержала 1 Гбит/с» может оказаться необоснованной.

---

## 12. Detection latency — отдельная характеристика

Два детектора могут иметь одинаковые TP/FP/FN, но различаться временем появления результата.

Для некоторых задач alert через несколько секунд приемлем. Для inline-предотвращения или короткого автоматизированного эпизода такое же запаздывание может менять практический эффект.

Поэтому для задачи с требованием по времени заранее фиксируют две точки:

```text
t_event  — момент возникновения/поступления контролируемого события
t_result — момент доступности результата детектора

latency = t_result - t_event
```

Важно использовать согласованные часы или другой детерминированный способ сопоставления времени. Иначе измеренная «задержка» может быть следствием рассинхронизации источников.

---

## 13. Эффективность IPS требует отдельной проверки исполнительного воздействия

Из Глав 1 и 4 мы уже знаем:

```text
detection capability ≠ prevention capability
inline placement ≠ факт блокирования
```

Поэтому для IPS минимум два независимых вопроса:

<div class="idps-grid idps-grid--2">
  <div class="idps-card idps-card--sensor"><span class="idps-card__eyebrow">DETECTION</span><strong class="idps-card__title">Правильно ли выделяется целевое событие?</strong><p>Проверяется ground truth, alert/result и классификационные метрики.</p></div>
  <div class="idps-card idps-card--result"><span class="idps-card__eyebrow">ACTUATION</span><strong class="idps-card__title">Произошло ли требуемое воздействие?</strong><p>Нужен независимый артефакт того, что запрещённый обмен действительно не завершился, а разрешённый трафик не был ошибочно нарушен.</p></div>
</div>

Alert с действием `drop` в журнале конкретного движка не следует автоматически объявлять доказательством end-to-end блокирования без проверки режима, placement и фактического результата обмена.

---

## 14. Повторяемость важнее красивого одноразового результата

Хорошая оценка должна позволять другому инженеру повторить тест и получить сопоставимый результат.

Поэтому вместе с числами фиксируются:

<div class="idps-chip-list">
  <span>версия IDPS</span>
  <span>режим запуска</span>
  <span>точка наблюдения</span>
  <span>ruleset / hash</span>
  <span>конфигурация</span>
  <span>test corpus</span>
  <span>время теста</span>
  <span>ground truth</span>
  <span>правила сопоставления</span>
  <span>сырые артефакты</span>
</div>

Если после tuning правило изменилось, старые метрики нельзя автоматически приписывать новой версии. Нужна **регрессионная проверка** на зафиксированном наборе случаев.

---

## 15. Как выглядит минимальный инженерный отчёт об эффективности

Отчёт должен позволять отделить наблюдение от интерпретации.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 5 · ОТ ЭКСПЕРИМЕНТА К ЗАЩИЩАЕМОМУ ВЫВОДУ</div>
<div class="idps-report-chain">
  <article><span>1</span><strong>Цель и scope</strong><small>что именно оценивается и где</small></article>
  <div>→</div>
  <article><span>2</span><strong>Методика</strong><small>unit, ground truth, cases, versions, window</small></article>
  <div>→</div>
  <article><span>3</span><strong>Наблюдения</strong><small>сырые результаты, counters, timestamps, EVE/PCAP/logs</small></article>
  <div>→</div>
  <article><span>4</span><strong>Расчёт</strong><small>матрица ошибок, метрики, coverage, latency, drops</small></article>
  <div>→</div>
  <article><span>5</span><strong>Вывод и границы</strong><small>что доказано и на что результат не распространяется</small></article>
</div>
</div>

Вместо:

> «Правило эффективно на 95%.»

инженерная формулировка выглядит примерно так:

> «На фиксированном наборе из 100 размеченных HTTP-событий, при указанной версии ruleset и точке наблюдения, детектор обнаружил 46 из 50 positive cases и ошибочно выделил 4 из 50 negative cases. Recall составил 92%, precision — 92%. Результат относится только к протестированным представлениям и не доказывает такое же качество для зашифрованного трафика, других маршрутов или непроверенных вариантов события.»

Такой вывод длиннее, но его можно проверить.

---

## 16. Что нельзя доказывать одной успешной оценкой

Даже хороший тест не даёт права утверждать больше, чем покрывает эксперимент.

<div class="idps-claim-matrix" role="table" aria-label="Границы выводов оценки IDPS">
  <div class="idps-claim-matrix__head" role="row">
    <span role="columnheader">Артефакт / результат</span><span role="columnheader">Что поддерживает</span><span role="columnheader">Чего не доказывает</span>
  </div>
  <div class="idps-claim-matrix__row" role="row">
    <div role="cell"><span class="idps-claim-matrix__mobile-label">АРТЕФАКТ / РЕЗУЛЬТАТ</span><strong>100% recall на test corpus</strong></div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">ПОДДЕРЖИВАЕТ</span>все размеченные positive этого набора обнаружены</div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">НЕ ДОКАЗЫВАЕТ</span>что обнаруживаются все возможные варианты в production</div>
  </div>
  <div class="idps-claim-matrix__row" role="row">
    <div role="cell"><span class="idps-claim-matrix__mobile-label">АРТЕФАКТ / РЕЗУЛЬТАТ</span><strong>0 FP в negative-наборе</strong></div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">ПОДДЕРЖИВАЕТ</span>на выбранных negative cases ложных срабатываний не было</div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">НЕ ДОКАЗЫВАЕТ</span>нулевой FPR на всей реальной активности</div>
  </div>
  <div class="idps-claim-matrix__row" role="row">
    <div role="cell"><span class="idps-claim-matrix__mobile-label">АРТЕФАКТ / РЕЗУЛЬТАТ</span><strong>0 kernel drops в тесте</strong></div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">ПОДДЕРЖИВАЕТ</span>в данном запуске этот счётчик не показал kernel capture loss</div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">НЕ ДОКАЗЫВАЕТ</span>полное отсутствие любых потерь во всех внутренних стадиях и при других нагрузках</div>
  </div>
  <div class="idps-claim-matrix__row" role="row">
    <div role="cell"><span class="idps-claim-matrix__mobile-label">АРТЕФАКТ / РЕЗУЛЬТАТ</span><strong>alert с SID</strong></div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">ПОДДЕРЖИВАЕТ</span>конкретная логика сформировала результат</div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">НЕ ДОКАЗЫВАЕТ</span>успешную компрометацию или end-to-end блокирование</div>
  </div>
  <div class="idps-claim-matrix__row" role="row">
    <div role="cell"><span class="idps-claim-matrix__mobile-label">АРТЕФАКТ / РЕЗУЛЬТАТ</span><strong>успешный inline test</strong></div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">ПОДДЕРЖИВАЕТ</span>воздействие сработало в проверенной топологии и сценарии</div>
    <div role="cell"><span class="idps-claim-matrix__mobile-label">НЕ ДОКАЗЫВАЕТ</span>безошибочное предотвращение всех атак этого класса</div>
  </div>
</div>

Это ключевой навык всей дисциплины: **формулировать вывод ровно на уровне доступных доказательств**.

---

## 17. Как связать оценку с риском и эксплуатацией

Нет универсального значения recall или precision, которое автоматически означает «хорошая IDS».

Цена ошибок зависит от задачи:

<div class="idps-grid idps-grid--2">
  <div class="idps-card idps-card--warning"><span class="idps-card__eyebrow">ВЫСОКАЯ ЦЕНА FN</span><strong class="idps-card__title">Критичное событие нельзя легко пропустить</strong><p>Организация может принять больше FP, если последующая проверка дешева и пропуск существенно опаснее.</p></div>
  <div class="idps-card idps-card--danger"><span class="idps-card__eyebrow">ВЫСОКАЯ ЦЕНА FP</span><strong class="idps-card__title">Автоматическое воздействие может нарушить сервис</strong><p>Для prevention false positive может означать блокирование легитимного обмена, поэтому критерии приёмки могут быть строже.</p></div>
</div>

Но оценка стоимости ошибок — это уже вход для управленческого решения. Технический отчёт должен сначала честно показать измеренный результат и неопределённость, а не подгонять метрики под желаемый вывод.

---

## 18. Финальная инженерная модель курса

Все восемь базовых глав теперь связываются в один цикл.

<div class="teaching-figure">
<div class="figure-label">ВИЗУАЛЬНАЯ МОДЕЛЬ 6 · ОТ СОБЫТИЯ ДО ОБОСНОВАННОЙ ОЦЕНКИ</div>
<div class="idps-course-loop">
  <article><span>1</span><strong>Что защищаем и зачем?</strong><small>назначение IDS/IPS</small></article>
  <article><span>2</span><strong>Какой источник нужен?</strong><small>network / host / wireless / другие данные</small></article>
  <article><span>3</span><strong>Как устроена функция?</strong><small>сбор, представление, анализ, результат</small></article>
  <article><span>4</span><strong>Где наблюдать?</strong><small>placement и visibility</small></article>
  <article><span>5</span><strong>По какому основанию решать?</strong><small>signature, state, series, anomaly</small></article>
  <article><span>6</span><strong>Как формализовать?</strong><small>правило и его область применимости</small></article>
  <article><span>7</span><strong>Где границы?</strong><small>FP/FN, blind spots, encryption, loss</small></article>
  <article><span>8</span><strong>Как доказать качество?</strong><small>evaluation contract, evidence, metrics, limits</small></article>
</div>
<div class="figure-caption">Это базовый инженерный цикл курса. Он не означает, что восемь глав исчерпывают весь предмет IDPS; они задают общий язык, на который дальше можно накладывать эксплуатацию, современные архитектуры, корреляцию, threat intelligence и другие расширенные темы.</div>
</div>

---

## 19. Что нужно запомнить

1. Эффективность нельзя оценивать без заранее определённой задачи.
2. Результат одного правила нельзя автоматически переносить на всю IDS/IPS.
3. TP/FP/TN/FN требуют единицы оценки и независимого ground truth.
4. Recall, precision, FPR и accuracy отвечают на разные вопросы.
5. Базовая частота влияет на практический смысл даже хороших TPR/FPR.
6. Coverage, производительность, потери и задержка являются отдельными измерениями оценки.
7. Для IPS detection и исполнительное воздействие проверяются раздельно.
8. Результат должен быть повторяемым: версия, конфигурация, набор данных и сырые артефакты фиксируются.
9. Хороший отчёт явно указывает границы применимости вывода.
10. «Доказано в этом эксперименте» сильнее и профессиональнее, чем необоснованное «система эффективна вообще».

---

## 20. Проверка понимания

<div class="quiz" data-question-id="chapter8-q1">
  <p><strong>Правило обнаружило все 20 positive cases тестового набора. Что можно утверждать?</strong></p>
  <button data-choice="a">A. Оно обнаруживает все атаки этого класса во всей инфраструктуре</button>
  <button data-choice="b" data-correct="true">B. На данном наборе и в зафиксированных условиях не было FN среди этих 20 positive cases</button>
  <button data-choice="c">C. У него автоматически 100% precision</button>
  <button data-choice="d">D. IPS гарантированно блокирует все такие события</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q2">
  <p><strong>Для чего нужен независимый ground truth?</strong></p>
  <button data-choice="a">A. Чтобы увеличить число alert</button>
  <button data-choice="b">B. Чтобы заменить правила IDS</button>
  <button data-choice="c" data-correct="true">C. Чтобы знать истинное состояние единицы оценки независимо от решения детектора</button>
  <button data-choice="d">D. Только для измерения CPU</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q3">
  <p><strong>Recall высокий, но precision низкий. Что это означает?</strong></p>
  <button data-choice="a" data-correct="true">A. Большая доля positive обнаруживается, но среди положительных решений детектора много FP</button>
  <button data-choice="b">B. Детектор почти не видит positive cases</button>
  <button data-choice="c">C. Нет packet loss</button>
  <button data-choice="d">D. Все alert подтверждают компрометацию</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q4">
  <p><strong>Почему 0 kernel drops недостаточно для вывода «IDS ничего не потеряла»?</strong></p>
  <button data-choice="a">A. Потому что этот счётчик всегда равен нулю</button>
  <button data-choice="b" data-correct="true">B. Он относится только к конкретному месту учёта потерь; другие ограничения обработки и вывода требуют отдельных доказательств</button>
  <button data-choice="c">C. Потому что kernel не участвует в capture</button>
  <button data-choice="d">D. Потому что packet loss измеряется только precision</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz" data-question-id="chapter8-q5">
  <p><strong>Что является наиболее зрелым итогом оценки?</strong></p>
  <button data-choice="a">A. «IDS эффективна»</button>
  <button data-choice="b">B. «Получили много alert»</button>
  <button data-choice="c">C. «CPU был ниже 50%»</button>
  <button data-choice="d" data-correct="true">D. Вывод с указанными scope, методикой, evidence, метриками и границами применимости</button>
  <div class="quiz-feedback"></div>
</div>

---

## Источники и границы главы

Основные основания главы:

- NIST SP 800-94 — исторический фундаментальный источник по IDPS, эксплуатационным факторам, false positive/false negative, tuning и оценке; документ 2007 года не используется как исчерпывающее описание современных продуктов;
- Stefan Axelsson, *The Base-Rate Fallacy and the Difficulty of Intrusion Detection* — классическое объяснение влияния низкой базовой частоты на intrusion detection;
- официальная документация Suricata 8.0.7 — конкретные counters и EVE statistics для проверки capture/output/resource-состояния реализации;
- материал Глав 1–7 этого курса — определения observation point, source, representation, detection result, prevention, blind spot и evidence boundary.


