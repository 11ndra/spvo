<div class="home-hero">
  <div class="home-eyebrow">4 курс · Системы информационной безопасности</div>
  <h1>Системы обнаружения и предотвращения вторжений</h1>
  <p class="home-hero-lead">
    Университетский курс об IDS/IPS как классе систем защиты: какие данные они получают, как обнаруживают подозрительную активность,
    где размещаются, почему ошибаются, как обосновывать эффективность и как современные протоколы меняют доступную системе наблюдаемость.
  </p>

  <div class="home-hero-question">
    <span>Принцип курса</span>
    <strong>Теория → понятный пример → схема → проверяемый вывод → лабораторное закрепление.</strong>
  </div>

  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Начать с Главы 1</a>
    <a class="course-btn" href="labs/environment/">Подготовить лабораторный стенд</a>
    <a class="course-btn" href="labs/orientation/">Знакомство с рабочей IDPS</a>
  </div>
</div>

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

После Главы 1 подготовьте две виртуальные машины и пройдите короткий вводный практикум. Он нужен, чтобы ЛР №1 не начиналась с незнакомых параметров Suricata.

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

---

## Текущий учебный маршрут

<div class="course-route" aria-label="Текущий учебный маршрут">
  <a class="course-route__item course-route__item--theory" href="course/01-intro/">
    <span class="course-route__type">Теория</span>
    <strong>Глава 1 — Что такое IDS/IPS и зачем они нужны</strong>
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
    <strong>ЛР №4 — Четыре основания решения</strong>
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

  <a class="course-route__item course-route__item--theory" href="course/09-protocol-visibility/">
    <span class="course-route__type">Углубление</span>
    <strong>Глава 9 — Протоколы, приложения и зашифрованный трафик глазами IDPS</strong>
  </a>
</div>

Маршрут читается сверху вниз. Главы 1–8 формируют базовое инженерное ядро; Глава 9 начинает углублённый блок. Лабораторные закрепляют уже введённые понятия и пока не расширяются новыми работами.

---

## Инструменты курса

| Инструмент | Роль в курсе |
|---|---|
| **Suricata** | основная практическая реализация сетевой IDS/IPS |
| **tcpdump / Wireshark** | независимое подтверждение наличия и представления сетевого трафика |
| **Linux Audit** | источник хостовой телеметрии в контролируемых экспериментах |
| **Zeek / Wazuh** | дополнительные реализации для сопоставления общих принципов IDPS |

Инструмент не является предметом курса сам по себе. Сначала формулируется инженерный вопрос, затем выбирается реализация, которая позволяет его проверить.

<div class="home-final-cta">
  <span>Первый шаг</span>
  <h2>Начните с Главы 1. Лабораторный стенд понадобится после того, как сформирована базовая модель IDS/IPS.</h2>
  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Глава 1</a>
    <a class="course-btn" href="labs/environment/">Подготовка среды</a>
  </div>
</div>
