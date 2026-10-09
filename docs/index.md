<div class="home-hero">
  <div class="home-eyebrow">4 курс · Системы информационной безопасности</div>
  <h1>Системы обнаружения и предотвращения вторжений</h1>
  <p class="home-hero-lead">
    Университетский курс об IDS/IPS как классе систем защиты: какие данные они получают, как обнаруживают подозрительную активность,
    где размещаются, почему ошибаются, как обосновывать эффективность, как современные протоколы меняют наблюдаемость
    как сохранять подтверждённые возможности обнаружения после изменений системы и как доказательно сопоставлять несколько источников.
  </p>

  <div class="home-hero-question">
    <span>Принцип курса</span>
    <strong>Теория → понятный пример → схема → проверяемый вывод → лабораторное закрепление.</strong>
  </div>

  <div class="home-actions">
    <a class="course-btn primary" href="syllabus/">Открыть маршрут по syllabus</a>
    <a class="course-btn" href="course/01-intro/">Начать с основ IDS/IPS</a>
    <a class="course-btn" href="labs/environment/">Подготовить лабораторный стенд</a>
    <a class="course-btn" href="labs/orientation/">Знакомство с рабочей IDPS</a>
  </div>
</div>

## Как курс связан с рабочей программой

Основная последовательность дисциплины задаётся рабочей программой: **15 лекционных тем, 15 лабораторных тем и 15 недель СРО**. Внутренние главы этого сайта организованы как сквозной инженерный маршрут и поэтому не обязаны совпадать с официальной нумерацией тем.

!!! important "Не смешивайте две системы нумерации"
    **Тема 8 syllabus** — «Принципы работы системы предотвращения вторжений». **Внутренняя Глава 8 курса** — «Как проверить и обосновать эффективность IDS/IPS». При подготовке к экзамену основной является нумерация syllabus. Используйте [маршрут по рабочей программе](syllabus/) как точку входа.

## С чего начинается курс

Сначала студент должен понимать, **что такое IDS/IPS и зачем система вообще нужна**. Установка инструмента не является первым учебным результатом.

До правил Suricata, сложных метрик качества и Detection Engineering нужно последовательно ответить на базовые вопросы:

```text
Что произошло?
      ↓
Какой след остался?
      ↓
Где этот след можно наблюдать?
      ↓
Какие данные получила система?
      ↓
Почему сформирован конкретный результат?
      ↓
Что из него можно и нельзя заключить?
```

<div class="big-question-grid">
  <article class="big-question">
    <div class="question-number">01</div>
    <h3>Понять систему</h3>
    <p>IDS/IPS, обнаружение, предотвращение и оповещение — без преждевременного погружения в синтаксис конкретного продукта.</p>
  </article>

  <article class="big-question">
    <div class="question-number">02</div>
    <h3>Понять данные</h3>
    <p>Сетевые, хостовые и другие источники дают разные сведения. Один сенсор не обладает полной наблюдаемостью всей системы.</p>
  </article>

  <article class="big-question">
    <div class="question-number">03</div>
    <h3>Проверить экспериментом</h3>
    <p>В лаборатории сначала подтверждается сам факт события и наблюдаемость, затем результат детектора и только после этого формулируется вывод.</p>
  </article>
</div>

---

## Перед первой лабораторной

После Главы 1 пройдите короткий контекстный модуль об угрозах, уязвимостях и риске, затем подготовьте две виртуальные машины и вводный практикум. Это даёт общий язык безопасности до того, как курс переходит к конкретной телеметрии и параметрам Suricata.

<div class="course-grid">
  <article class="course-card">
    <div class="card-step">ШАГ 00</div>
    <h3>Подготовка среды</h3>
    <p>Две Ubuntu VM, NAT для установки пакетов и отдельная сеть IDPS-LAB для экспериментов.</p>
    <a href="labs/environment/">Открыть подготовку →</a>
  </article>

  <article class="course-card">
    <div class="card-step">ПРАКТИКУМ 0</div>
    <h3>Знакомство с рабочей IDPS</h3>
    <p>Процесс Suricata, конфигурация, интерфейс получения данных, подготовленное условие обнаружения и EVE JSON.</p>
    <a href="labs/orientation/">Открыть практикум →</a>
  </article>
</div>

Практикум 0 не оценивается. Его задача — дать студенту операционную карту системы до первого сетевого эксперимента.

Перед первым техническим тестом выполните также **Практический блок A — Этичное тестирование, разрешение и scope**. В нём фиксируются authorization, Rules of Engagement, stop conditions и границы учебного стенда. Эти правила действуют для всех последующих offensive/assessment-действий курса.

[Открыть практический блок A →](labs/pentest-foundations/)

---

## Текущий учебный маршрут

<div class="course-route" aria-label="Текущий учебный маршрут">
  <a class="course-route__item course-route__item--theory" href="course/01-intro/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 1 — Что такое IDS/IPS и зачем они нужны</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/01a-threat-context/">
    <span class="course-route__type">Контекст</span>
    <strong>Угрозы, уязвимости, риск и киберпреступность через призму IDPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--setup" href="labs/environment/">
    <span class="course-route__type">Подготовка</span>
    <strong>Шаг 00 — Лабораторная среда</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--practice" href="labs/orientation/">
    <span class="course-route__type">Вводная практика</span>
    <strong>Практикум 0 — Знакомство с рабочей IDPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--practice" href="labs/pentest-foundations/">
    <span class="course-route__type">Практика</span>
    <strong>Этичное тестирование, разрешение и scope</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/02-classification/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 2 — Какие виды IDS/IPS существуют</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/03-detection/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 3 — Из чего состоит IDS/IPS и как она работает</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--lab" href="labs/lab01/">
    <span class="course-route__type">Лаборатория</span>
    <strong>ЛР №1 — Первое сетевое обнаружение</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--lab" href="labs/lab02/">
    <span class="course-route__type">Лаборатория</span>
    <strong>ЛР №2 — Один эпизод, два источника данных</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/04-detection-methods/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 4 — Где и как размещают IDS/IPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--lab" href="labs/lab03/">
    <span class="course-route__type">Лаборатория</span>
    <strong>ЛР №3 — Точка наблюдения</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/05-firewall-vs-idps/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 5 — Как IDS/IPS обнаруживает подозрительную активность</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--lab" href="labs/lab04/">
    <span class="course-route__type">Лаборатория</span>
    <strong>ЛР №4 — Разные основания аналитического решения</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/06-rules/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 6 — Что такое правила и как они устроены</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--lab" href="labs/lab05/">
    <span class="course-route__type">Лаборатория</span>
    <strong>ЛР №5 — Изменяем условие правила</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/07-limitations/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 7 — Почему IDS/IPS ошибается и чего она не видит</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/08-effectiveness/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 8 — Как проверить и обосновать эффективность IDS/IPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/08a-integration-context/">
    <span class="course-route__type">Контекст</span>
    <strong>Архитектура, интеграция и современный контекст IDS/IPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/09-protocol-visibility/">
    <span class="course-route__type">Углубление</span>
    <strong>Глава 9 — Протоколы, приложения и зашифрованный трафик глазами IDPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/09a-application-web-security/">
    <span class="course-route__type">Контекст</span>
    <strong>Прикладная и веб-безопасность глазами IDPS</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/09b-endpoint-protection/">
    <span class="course-route__type">Контекст</span>
    <strong>Защита конечных систем: антивирус, HIDS/HIPS и EDR</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/09c-professional-practice/">
    <span class="course-route__type">Контекст</span>
    <strong>Профессиональная практика специалиста по кибербезопасности</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/10-operations-lifecycle/">
    <span class="course-route__type">Углубление</span>
    <strong>Глава 10 — Как поддерживать возможности обнаружения в рабочем состоянии</strong>
  </a>
  <div class="course-route__connector" aria-hidden="true">↓</div>

  <a class="course-route__item course-route__item--theory" href="course/11-multi-source-correlation/">
    <span class="course-route__type">Углубление</span>
    <strong>Глава 11 — Как сопоставлять несколько источников и контекст угроз</strong>
  </a>
</div>

Маршрут читается сверху вниз. Главы 1–8 и связующий контекстный модуль формируют базовое инженерное ядро; после Главы 9 три коротких контекстных модуля связывают IDPS с безопасностью приложений/веб-сервисов, защитой конечных систем и профессиональной практикой специалиста; Главы 10–11 развивают материал в сторону эксплуатации и доказательного сопоставления нескольких источников. Лабораторные 1–5 формируют первый практический цикл: от наблюдения и evidence к основанию решения и изменению detection logic. Следующий цикл будет добавлять оценку качества, prevention/inline, protocol visibility, lifecycle и корреляцию — по мере готовности и runtime-проверки соответствующих работ.

---

## Инструменты курса

| Инструмент | Роль в курсе |
|---|---|
| **Suricata** | основная практическая реализация сетевой IDS/IPS |
| **tcpdump / Wireshark** | независимое подтверждение наличия и представления сетевого трафика |
| **Linux Audit** | источник хостовой телеметрии в контролируемых экспериментах |
| **Zeek / Wazuh** | дополнительные реализации для теоретического сопоставления и будущих multi-source/correlation практик; в текущих ЛР 1–5 основным сетевым сенсором остаётся Suricata |

Инструмент не является предметом курса сам по себе. Сначала формулируется инженерный вопрос, затем выбирается реализация, которая позволяет его проверить.

---

## Профессиональный контекст

Работа специалиста по кибербезопасности требует сочетания сетей и операционных систем, программирования/автоматизации, криптографии, анализа уязвимостей, мониторинга, реагирования, форензики, безопасной разработки и понимания организационных требований.

Курс углубляет прежде всего **наблюдение, обнаружение и предотвращение вторжений**, а отдельный модуль <a href="course/09c-professional-practice/">«Профессиональная практика специалиста по кибербезопасности»</a> связывает технические навыки с лабораториями, проектами, стажировками, этикой, стандартами, сертификациями и непрерывным обучением.

<div class="home-final-cta">
  <span>Первый шаг</span>
  <h2>Начните с Главы 1. Лабораторный стенд понадобится после того, как сформирована базовая модель IDS/IPS.</h2>
  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Глава 1</a>
    <a class="course-btn" href="labs/environment/">Подготовка среды</a>
  </div>
</div>


## Подготовка к итоговому контролю

Официальный перечень из 90 вопросов собран на отдельной странице [«Подготовка к устному экзамену»](resources/exam-prep.md). Каждый вопрос связан с основной теорией курса и должен отрабатываться по схеме: определение → механизм → пример → ограничение → evidence.

---

## Самостоятельная работа и итоговый проект

Официальная СРО распределена по 15 неделям: недели 1–14 связаны с Cisco Endpoint Security, неделя 15 — итоговый проект. Этот курс не дублирует внешние материалы, а даёт связку с теорией, лабораториями и требованиями к evidence.

- [Открыть план СРО](resources/sro-plan/)
- [Открыть задание итогового проекта](resources/project-brief/)

