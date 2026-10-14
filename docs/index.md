<div class="home-hero">
  <div class="home-eyebrow">4 курс · Системы информационной безопасности</div>
  <h1>Системы обнаружения и предотвращения вторжений</h1>
  <p class="home-hero-lead">
    Курс об IDS/IPS, сетевой и хостовой наблюдаемости, обнаружении и предотвращении атак, безопасности протоколов и приложений, а также доказательной работе с событиями и журналами.
  </p>

  <div class="home-hero-question">
    <span>Принцип курса</span>
    <strong>Событие → наблюдаемый след → источник данных → логика обнаружения → результат → обоснованный вывод.</strong>
  </div>

  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Начать обучение с IDS/IPS</a>
    <a class="course-btn" href="syllabus/">Темы силлабуса</a>
    <a class="course-btn" href="resources/test-bank/">Тестовый тренажёр</a>
    <a class="course-btn" href="labs/environment/">Лабораторные работы</a>
  </div>
</div>

## Как работать с курсом

<div class="big-question-grid">
  <article class="big-question">
    <div class="question-number">01</div>
    <h3>Изучите тему</h3>
    <p>Сначала разберите понятия и механизм. Не переходите к инструменту, пока не ясно, что именно он наблюдает и зачем.</p>
  </article>

  <article class="big-question">
    <div class="question-number">02</div>
    <h3>Проверьте понимание</h3>
    <p>Используйте вопросы в конце темы, банк из 90 контрольных вопросов и интерактивный тестовый тренажёр.</p>
  </article>

  <article class="big-question">
    <div class="question-number">03</div>
    <h3>Закрепите практикой</h3>
    <p>В лаборатории связывайте действие с исходными данными (raw evidence), результатом детектора и границами допустимого вывода.</p>
  </article>
</div>

## Основной курс: 15 последовательных глав

**Начните с главы 01 и двигайтесь по основному маршруту 01–15.** Здесь находятся подробные объяснения, примеры, схемы и самопроверка. Дополнительные инженерные исследования доступны отдельно и не заменяют обязательную лекцию.

### Основы IDS/IPS — главы 01–08

1. [Что такое IDS/IPS и зачем они нужны](course/01-intro.md)
2. [Какие виды IDS/IPS существуют](course/02-classification.md)
3. [Из чего состоит IDS/IPS и как она работает](course/03-detection.md)
4. [Где и как размещают IDS/IPS](course/04-detection-methods.md)
5. [Как IDS/IPS обнаруживает подозрительную активность](course/05-firewall-vs-idps.md)
6. [Что такое правила и как они устроены](course/06-rules.md)
7. [Почему IDS/IPS ошибается и чего она не видит](course/07-limitations.md)
8. [Как проверить и обосновать эффективность IDS/IPS](course/08-effectiveness.md)

Для изучения исходного контекста используйте [угрозы, уязвимости и риски](course/01a-threat-context.md). Дополнительная архитектурная перспектива — [интеграция IDS/IPS](course/08a-integration-context.md).

### Протоколы, приложения и защита — главы 09–15

9. [Модель OSI](topics/09-osi.md)
10. [Симметричное и асимметричное шифрование](topics/10-crypto.md)
11. [Безопасность сетевых протоколов](topics/11-network-protocol-security.md)
12. [Безопасность приложений](topics/12-application-security.md)
13. [Безопасность веб-сервисов](topics/13-web-services-security.md)
14. [Антивирусная и проактивная защита](topics/14-antivirus-proactive.md)
15. [Подготовка специалиста по кибербезопасности](topics/15-professional-preparation.md)

### Инженерные расширения — после основных глав

[Протокольная наблюдаемость и шифрование](course/09-protocol-visibility.md) · [Прикладная и веб-безопасность глазами IDPS](course/09a-application-web-security.md) · [Защита конечных систем](course/09b-endpoint-protection.md) · [Профессиональная практика](course/09c-professional-practice.md) · [Эксплуатация возможностей обнаружения](course/10-operations-lifecycle.md) · [Корреляция нескольких источников](course/11-multi-source-correlation.md).

**Как соотносится курс с программой.** Первые восемь авторских глав не повторяют буквально названия первых восьми тем SOPV 4311. В [программе дисциплины](syllabus/index.md) приведено нормативное тематическое деление; его краткие обзорные страницы не заменяют основной учебный маршрут.

## Практика

Лабораторная часть начинается с подготовки стенда и вводного практикума. Текущие лаборатории последовательно отрабатывают наблюдение сетевого события, сопоставление нескольких источников, выбор точки наблюдения, разные основания обнаружения и изменение detection logic.

<div class="home-actions">
  <a class="course-btn primary" href="labs/environment/">Подготовить среду</a>
  <a class="course-btn" href="labs/orientation/">Практикум 0</a>
  <a class="course-btn" href="labs/lab01/">ЛР №1</a>
</div>

## Самопроверка

Форма итогового или промежуточного контроля определяется преподавателем. Поэтому курс даёт два независимых инструмента: полный перечень контрольных вопросов и тестовый тренажёр с вариантами ответа.

<div class="home-actions">
  <a class="course-btn primary" href="resources/test-bank/">Открыть тестовый тренажёр</a>
  <a class="course-btn" href="resources/exam-prep/">90 контрольных вопросов</a>
</div>

## Самостоятельная работа

СРО распределена по 15 неделям и связана с Cisco Endpoint Security, теорией курса и итоговым проектом.

- [План СРО](resources/sro-plan/)
- [Итоговый проект](resources/project-brief/)
