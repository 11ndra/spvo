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

## Основной курс: системы обнаружения и предотвращения вторжений

Теоретические главы изучаются последовательно: от назначения и устройства IDS/IPS до правил, оценки эффективности и эксплуатации. **Содержание главы, её схемы, примеры и интерактивная самопроверка находятся на одной странице.**

### Основы IDPS

1. [Что такое IDS/IPS и зачем они нужны](course/01-intro.md)
2. [Какие виды IDS/IPS существуют](course/02-classification.md)
3. [Из чего состоит IDS/IPS и как она работает](course/03-detection.md)
4. [Где и как размещают IDS/IPS](course/04-detection-methods.md)
5. [Как IDS/IPS обнаруживает подозрительную активность](course/05-firewall-vs-idps.md)
6. [Что такое правила и как они устроены](course/06-rules.md)
7. [Почему IDS/IPS ошибается и чего она не видит](course/07-limitations.md)
8. [Как проверить и обосновать эффективность IDS/IPS](course/08-effectiveness.md)

Дополняют основы [контекст угроз и рисков](course/01a-threat-context.md) и [архитектура, интеграция и современный контекст](course/08a-integration-context.md).

### Эксплуатация и современные IDPS

9. [Протоколы, приложения и зашифрованный трафик глазами IDPS](course/09-protocol-visibility.md)
10. [Как поддерживать возможности обнаружения в рабочем состоянии](course/10-operations-lifecycle.md)
11. [Как сопоставлять несколько источников и контекст угроз](course/11-multi-source-correlation.md)

Дополнительные материалы: [веб-безопасность глазами IDPS](course/09a-application-web-security.md), [защита конечных систем](course/09b-endpoint-protection.md) и [профессиональная практика](course/09c-professional-practice.md).

**Официальная рабочая программа** содержит [15 тем силлабуса](syllabus/). Они доступны отдельно для подготовки и проверки соответствия дисциплине; нумерация тем программы не заменяет учебную последовательность глав IDS/IPS.

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
