<div class="home-hero">
  <div class="home-eyebrow">4 курс · Системы информационной безопасности</div>
  <h1>Системы обнаружения и предотвращения вторжений</h1>
  <p class="home-hero-lead">
    Университетский курс об IDS/IPS как классе систем защиты: зачем они нужны, какие данные наблюдают,
    как принимают решения, где размещаются, почему ошибаются и как проверять их эффективность.
  </p>

  <div class="home-hero-question">
    <span>Текущий учебный маршрут</span>
    <strong>Лекция → короткая практическая работа → воспроизводимый лабораторный эксперимент → разбор evidence.</strong>
  </div>

  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Глава 1</a>
    <a class="course-btn" href="practice/practice01/">Практика №1</a>
    <a class="course-btn" href="labs/lab01/">ЛР №1</a>
  </div>
</div>

## С чего начинается курс

Первый модуль намеренно начинается с элементарных вопросов. До правил Suricata, reassembly, FP/FN и Detection Engineering студент должен понимать:

```text
Что такое IDS и IPS?
Почему одного firewall недостаточно?
Чем detection отличается от prevention?
Что означает alert?
Какие виды IDS/IPS существуют?
Какие данные доступны каждому типу?
```

<div class="big-question-grid">
  <article class="big-question">
    <div class="question-number">01</div>
    <h3>Понять систему</h3>
    <p>IDS/IPS, Firewall, WAF, Alert, Detection и Prevention без преждевременного погружения в syntax конкретного продукта.</p>
  </article>

  <article class="big-question">
    <div class="question-number">02</div>
    <h3>Увидеть разные источники</h3>
    <p>Network, Host и Wireless дают разные evidence. Один сенсор не обладает полной наблюдаемостью всей информационной системы.</p>
  </article>

  <article class="big-question">
    <div class="question-number">03</div>
    <h3>Проверить руками</h3>
    <p>Каждая базовая идея закрепляется практикой и лабораторией: сначала evidence, затем вывод.</p>
  </article>
</div>

---

## Первый учебный цикл

### 1. Теория

[Глава 1 — Что такое IDS/IPS и зачем они нужны](course/01-intro/){ .md-button .md-button--primary }

Ключевые отношения:

```text
ALLOWED ≠ SAFE
FIREWALL ≠ IDS/IPS
DETECTION ≠ PREVENTION
ALERT ≠ COMPROMISE
```

### 2. Практика

[Практическая работа №1 — Какую задачу решает средство защиты?](practice/practice01/){ .md-button }

Короткие архитектурные ситуации без командной строки: студент должен различать access control, detection, prevention и область применения WAF.

### 3. Лаборатория

[ЛР №1 — Первый NIDS: visibility → alert → interpretation](labs/lab01/){ .md-button }

Лаборатория строится вокруг одной воспроизводимой цепочки:

```text
traffic exists
      ↓
visibility proven
      ↓
Suricata receives data
      ↓
negative / positive test
      ↓
alert in EVE JSON
      ↓
correct interpretation
```

---

## Далее по теории

[Глава 2 — Какие виды IDS/IPS существуют и что они могут наблюдать](course/02-classification/){ .md-button .md-button--primary }

Следующие главы пока сохраняются в редакции v2.16.1 и будут мигрировать по той же схеме: **теория → практика → лабораторная → QA**.

!!! warning "Переходная версия курса"
    Главы 1–2 и ЛР №1 уже переведены на новую структуру. Главы 3–8, Pre-Lab Test №1 и ЛР №2 пока сохранены из v2.16.1 и явно помечены в навигации как предыдущая редакция. Это сделано намеренно, чтобы не смешивать новые материалы с ещё не переработанными.

---

## Инструменты курса

| Инструмент | Роль |
|---|---|
| **Suricata** | основной экспериментальный NIDS/NIPS для сетевых лабораторий |
| **tcpdump / Wireshark** | независимая проверка факта и представления сетевого трафика |
| **Wazuh** | host telemetry и FIM в последующих работах |
| **Zeek** | структурированные сетевые события и анализ поведения |

Инструмент не является предметом курса сам по себе. Сначала формулируется задача и изучается механизм, затем используется подходящая реализация.

<div class="home-final-cta">
  <span>Начать сейчас</span>
  <h2>Пройдите Главу 1 и сразу закрепите её Практикой №1 и ЛР №1.</h2>
  <div class="home-actions">
    <a class="course-btn primary" href="course/01-intro/">Открыть Главу 1</a>
    <a class="course-btn" href="labs/lab01/">Открыть ЛР №1</a>
  </div>
</div>
