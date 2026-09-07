# Pre-Lab Test №1

<div class="chapter-lead">
<p>Этот тест проверяет не запоминание терминов, а готовность применять материал Глав 1–7 перед первой лабораторной работой.</p>

<p>В каждом вопросе дан небольшой инженерный сценарий. Нужно определить, <strong>какое решение или объяснение лучше всего следует из уже изученной модели IDPS</strong>.</p>
</div>

<div class="prelab-overview">
  <div>
    <span>12</span>
    <strong>ситуационных задач</strong>
  </div>
  <div>
    <span>75%</span>
    <strong>проходной результат</strong>
  </div>
  <div>
    <span>9 / 12</span>
    <strong>минимум верных ответов</strong>
  </div>
</div>

!!! note
    Это самопроверка на статическом GitHub Pages, а не защищённый экзаменационный механизм. Правильные ответы и объяснения открываются только после завершения попытки.

<div class="assessment-instruction">
<strong>Как проходить:</strong> выберите один ответ в каждом сценарии. До завершения теста выбранный вариант не помечается как правильный или неправильный. После сдачи можно разобрать ошибки и пройти тест заново.
</div>

<div class="prelab-test prelab-assessment" data-pass="75">

<div class="assessment-status">
  <span>Ответов: <strong class="assessment-answered">0</strong> / <strong>12</strong></span>
  <span>Лучший результат: <strong class="assessment-best">—</strong></span>
</div>

## Архитектура и роль IDPS

<div class="quiz assessment-question" data-question-id="pre-1" data-domain="architecture">
  <div class="assessment-question-meta">Сценарий 1 · Главы 1 и 5</div>
  <div class="assessment-scenario">
    Публичный Web-сервер должен принимать HTTPS. Firewall разрешает <code>Internet → Web:443</code>. Внутри разрешённого HTTPS-запроса находится попытка эксплуатации приложения.
  </div>
  <p><strong>Какое объяснение наиболее корректно?</strong></p>
  <button>A. Если firewall разрешил соединение, дальнейший анализ угроз уже не нужен</button>
  <button data-correct="true">B. Политика доступа разрешила необходимый сетевой путь, а detection должен отдельно анализировать активность внутри этого разрешённого взаимодействия</button>
  <button>C. Любой HTTPS-запрос автоматически считается безопасным из-за шифрования</button>
  <button>D. Нужно закрыть TCP/443 для всех пользователей</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Firewall и IDPS отвечают на разные вопросы. Разрешённый бизнесом сетевой путь всё ещё может переносить вредоносную активность.
    <a class="quiz-review" href="../course/01-intro/">Повторить Главу 1 →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-2" data-domain="architecture">
  <div class="assessment-question-meta">Сценарий 2 · Глава 5</div>
  <div class="assessment-scenario">
    SSH к внутреннему серверу не требуется из Интернета, но сейчас порт открыт. SOC получает множество alert о попытках brute-force.
  </div>
  <p><strong>Какое действие является лучшим первым архитектурным решением?</strong></p>
  <button>A. Оставить SSH открытым и увеличить количество сигнатур</button>
  <button data-correct="true">B. Убрать ненужный сетевой доступ, а detection использовать для тех взаимодействий, которые действительно необходимо оставить разрешёнными</button>
  <button>C. Отключить firewall и использовать только IPS</button>
  <button>D. Отключить alert, чтобы уменьшить нагрузку SOC</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Если сетевой путь не нужен бизнесу, сильнее устранить саму возможность взаимодействия, чем пытаться компенсировать избыточную поверхность атаки detection-механизмом.
    <a class="quiz-review" href="../course/05-firewall-vs-idps/">Повторить Главу 5 →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-3" data-domain="architecture">
  <div class="assessment-question-meta">Сценарий 3 · Глава 5</div>
  <div class="assessment-scenario">
    Один NGFW применяет access policy, application control и встроенную IPS-инспекцию. Соединение разрешено сетевой политикой, но затем блокируется IPS-правилом.
  </div>
  <p><strong>Что это показывает?</strong></p>
  <button>A. Access policy и IPS — одна и та же логическая функция</button>
  <button>B. Если функции находятся в одном устройстве, определить причину блокировки невозможно</button>
  <button data-correct="true">C. Одна физическая платформа может последовательно выполнять разные логические функции и принимать разные решения над одним потоком</button>
  <button>D. NGFW не является firewall</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Физически функции могут быть объединены, но инженеру всё равно нужно различать решение о доступе и решение о наличии угрозы.
    <a class="quiz-review" href="../course/05-firewall-vs-idps/">Повторить раздел про NGFW →</a>
  </div>
</div>

## Телеметрия и detection pipeline

<div class="quiz assessment-question" data-question-id="pre-4" data-domain="telemetry">
  <div class="assessment-question-meta">Сценарий 4 · Глава 2</div>
  <div class="assessment-scenario">
    NIDS показывает подозрительное исходящее HTTPS-соединение с сервера. Аналитику нужно понять, какой локальный процесс создал соединение и появился ли после атаки новый файл.
  </div>
  <p><strong>Какого источника данных больше всего не хватает?</strong></p>
  <button>A. Ещё одного внешнего DNS-сервера</button>
  <button data-correct="true">B. Хостовой телеметрии с процессами, файлами и действиями внутри сервера</button>
  <button>C. Только дополнительной копии того же сетевого пакета</button>
  <button>D. WIDS</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Сетевой источник показывает взаимодействие, но не всегда способен связать его с конкретным локальным процессом и изменениями файловой системы.
    <a class="quiz-review" href="../course/02-classification/">Повторить Главу 2 →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-5" data-domain="telemetry">
  <div class="assessment-question-meta">Сценарий 5 · Глава 3</div>
  <div class="assessment-scenario">
    Интересующая строка HTTP-запроса разделена между несколькими TCP-сегментами. Правило должно анализировать логический URI, а не каждый пакет изолированно.
  </div>
  <p><strong>Какой этап особенно важен до применения detection logic?</strong></p>
  <button>A. Только запись alert в SIEM</button>
  <button data-correct="true">B. Связывание пакетов с потоком и корректное восстановление TCP-stream перед разбором прикладного протокола</button>
  <button>C. Удаление TCP-заголовков без сохранения состояния</button>
  <button>D. Преобразование IDS в firewall</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Сигнатура применяется не к абстрактной «атаке», а к подготовленному представлению данных. Ошибка на этапе flow/reassembly способна изменить результат detection.
    <a class="quiz-review" href="../course/03-detection/">Повторить Главу 3 →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-6" data-domain="telemetry">
  <div class="assessment-question-meta">Сценарий 6 · Глава 4</div>
  <div class="assessment-scenario">
    Кампания использует часто меняющиеся домены и URI. Точные IOC полезны после обнаружения, но злоумышленнику легко менять эти значения.
  </div>
  <p><strong>Какой подход устойчивее?</strong></p>
  <button>A. Считать, что сигнатуры больше никогда не нужны</button>
  <button>B. Любую аномалию автоматически считать атакой</button>
  <button data-correct="true">C. Комбинировать известные признаки с протокольным, поведенческим и контекстным анализом более устойчивых свойств активности</button>
  <button>D. Использовать только номер TCP-порта</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Методы обнаружения дополняют друг друга. Точные IOC объяснимы и полезны, но легко изменяемый индикатор не должен быть единственным основанием detection.
    <a class="quiz-review" href="../course/04-detection-methods/">Повторить Главу 4 →</a>
  </div>
</div>

## Качество обнаружения

<div class="quiz assessment-question" data-question-id="pre-7" data-domain="quality">
  <div class="assessment-question-meta">Сценарий 7 · Глава 6</div>
  <div class="assessment-scenario">
    В контролируемом тесте было 100 реальных атак. Детектор обнаружил 95 и пропустил 5.
  </div>
  <p><strong>Какой показатель здесь равен 95%?</strong></p>
  <button>A. Precision</button>
  <button data-correct="true">B. Recall</button>
  <button>C. False Positive Rate</button>
  <button>D. Доля True Negative</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Recall отвечает на вопрос, какую долю реальных положительных событий система обнаружила: <code>TP / (TP + FN)</code>.
    <a class="quiz-review" href="../course/06-detection-quality/">Повторить раздел Recall →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-8" data-domain="quality">
  <div class="assessment-question-meta">Сценарий 8 · Глава 6</div>
  <div class="assessment-scenario">
    Атаки очень редки. Детектор имеет высокий recall и небольшой False Positive Rate, но SOC всё равно получает гораздо больше ложных alert, чем истинных.
  </div>
  <p><strong>Почему это возможно?</strong></p>
  <button>A. Потому что recall всегда равен False Positive Rate</button>
  <button>B. Потому что IDS не умеет работать с редкими событиями</button>
  <button data-correct="true">C. Нормальных событий несравнимо больше, поэтому даже маленькая доля ошибок на большой базе может создать много False Positive</button>
  <button>D. Потому что любой False Positive означает успешную атаку</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Это практический смысл Base-Rate Fallacy: абсолютное количество FP зависит не только от процента ошибки, но и от огромного числа нормальных событий.
    <a class="quiz-review" href="../course/06-detection-quality/">Повторить Base-Rate Fallacy →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-9" data-domain="quality">
  <div class="assessment-question-meta">Сценарий 9 · Глава 6</div>
  <div class="assessment-scenario">
    Из 500 alert в час 470 создаёт легитимный vulnerability scanner. Полностью исключить его IP из любого monitoring технически легко.
  </div>
  <p><strong>Какое tuning-решение зрелее?</strong></p>
  <button>A. Удалить всё правило</button>
  <button>B. Полностью перестать анализировать любой трафик scanner-хоста</button>
  <button data-correct="true">C. Определить конкретный ожидаемый сценарий и сузить исключение так, чтобы убрать известный noise, но сохранить другое полезное покрытие</button>
  <button>D. Увеличить severity всех 500 alert</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Цель tuning — повысить полезность detection, а не просто уменьшить количество событий любой ценой.
    <a class="quiz-review" href="../course/06-detection-quality/">Повторить раздел Tuning →</a>
  </div>
</div>

## Placement и доставка трафика

<div class="quiz assessment-question" data-question-id="pre-10" data-domain="placement">
  <div class="assessment-question-meta">Сценарий 10 · Глава 7</div>
  <div class="assessment-scenario">
    Web-сервер в DMZ уже скомпрометирован и начинает обращаться к внутреннему App-серверу. Существующий NIDS получает только поток Internet ↔ DMZ на внешнем периметре.
  </div>
  <p><strong>Как рассуждать о новой точке наблюдения?</strong></p>
  <button>A. Периметровый NIDS автоматически видит любой внутренний поток</button>
  <button data-correct="true">B. Сначала определить путь Web → App и выбрать точку на границе DMZ/Internal, через которую этот поток реально проходит</button>
  <button>C. Сначала купить TAP, а потом определить, какой трафик нужен</button>
  <button>D. Placement не влияет на detection, если правила актуальны</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Placement следует из threat scenario и network path. Правило бесполезно, если интересующий поток не доставляется сенсору.
    <a class="quiz-review" href="../course/07-placement/">Повторить Главу 7 →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-11" data-domain="placement">
  <div class="assessment-question-meta">Сценарий 11 · Глава 7</div>
  <div class="assessment-scenario">
    Точка наблюдения B уже выбрана. Нужно только наблюдать Web → App без возможности блокирования и без включения сенсора в основной data path.
  </div>
  <p><strong>Какой вариант наиболее соответствует задаче?</strong></p>
  <button data-correct="true">A. Предоставить пассивному NIDS копию нужного трафика через подходящий SPAN/TAP-механизм</button>
  <button>B. Обязательно поставить IPS inline независимо от требований</button>
  <button>C. Перенести сенсор в точку A</button>
  <button>D. Использовать только host FIM вместо сетевой телеметрии</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Сначала выбирается точка наблюдения, затем способ доставки данных. SPAN/TAP могут предоставить копию трафика пассивному NIDS.
    <a class="quiz-review" href="../course/07-placement/">Повторить SPAN/TAP →</a>
  </div>
</div>

<div class="quiz assessment-question" data-question-id="pre-12" data-domain="placement">
  <div class="assessment-question-meta">Сценарий 12 · Глава 7</div>
  <div class="assessment-scenario">
    Сенсор видит Client → Server, но обратный Server → Client идёт другим маршрутом и не проходит через эту точку.
  </div>
  <p><strong>Какое последствие наиболее вероятно?</strong></p>
  <button>A. Никакого: для stateful detection всегда достаточно одного направления</button>
  <button data-correct="true">B. Системе может не хватить контекста для корректного tracking состояния, reassembly и части протокольного анализа</button>
  <button>C. Сенсор автоматически запросит отсутствующие пакеты у сервера</button>
  <button>D. Это влияет только на WIDS</button>
  <div class="quiz-feedback"></div>
  <div class="quiz-rationale" hidden>
    Асимметричная маршрутизация способна лишить stateful NIDS половины соединения и нарушить корректное восстановление контекста.
    <a class="quiz-review" href="../course/07-placement/">Повторить асимметричную маршрутизацию →</a>
  </div>
</div>

<div class="test-summary assessment-summary">
  <div class="assessment-actions">
    <button class="course-btn primary submit-assessment">Завершить тест</button>
    <button class="course-btn reset-assessment" type="button">Начать заново</button>
  </div>

  <div class="score-output" aria-live="polite"></div>
  <div class="assessment-domain-results"></div>
  <div class="assessment-review-list"></div>
</div>

</div>

<div class="next-step">
<strong>После зачёта:</strong> переходите к <a href="../labs/lab01/">ЛР №1 — Основы Suricata</a>. В лабораторной нужно будет уже руками доказать цепочку: <em>трафик дошёл до сенсора → правило было применено → событие появилось → результат можно объяснить</em>.
</div>
