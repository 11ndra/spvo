<div class="hero">
  <div class="hero-kicker">4 курс · Системы информационной безопасности</div>
  <h1>Системы обнаружения и предотвращения вторжений</h1>
  <p class="hero-lead">Интерактивный курс по архитектуре IDPS, сетевому мониторингу, сигнатурному и поведенческому обнаружению, предотвращению атак и проектированию защищённой инфраструктуры.</p>
  <div class="hero-actions">
    <a class="course-btn primary" href="course/01-intro/">Начать обучение</a>
    <a class="course-btn" href="labs/lab01/">Перейти к ЛР №1</a>
  </div>
</div>

## Как устроен курс

<div class="course-grid">
  <div class="course-card"><div class="card-step">01</div><h3>Понять</h3><p>Что такое IDS и IPS, зачем они нужны, какие типы IDPS существуют и где они размещаются.</p></div>
  <div class="course-card"><div class="card-step">02</div><h3>Увидеть</h3><p>Как обычный сетевой пакет превращается в поток, протокольное событие и alert.</p></div>
  <div class="course-card"><div class="card-step">03</div><h3>Настроить</h3><p>Установить Suricata, определить HOME_NET, подключить правила и настроить журналирование.</p></div>
  <div class="course-card"><div class="card-step">04</div><h3>Проверить</h3><p>Сгенерировать нормальный и подозрительный трафик и сопоставить его с телеметрией IDPS.</p></div>
  <div class="course-card"><div class="card-step">05</div><h3>Объяснить</h3><p>Отличить факт срабатывания правила от подтверждённой атаки и аргументировать выбранную защиту.</p></div>
  <div class="course-card"><div class="card-step">06</div><h3>Развивать</h3><p>Дальше курс перейдёт к IPS, TLS, evasion, HIDS, поведенческому анализу и Zero Trust.</p></div>
</div>

## Маршрут первой лабораторной

<div class="learning-path"><span>Основы</span><span>→</span><span>Классификация</span><span>→</span><span>Detection pipeline</span><span>→</span><span>Размещение</span><span>→</span><span>Pre-Lab Test</span><span>→</span><strong>LabBox / Suricata</strong></div>

!!! info "Принцип курса"
    Мы не изучаем Suricata ради Suricata. Инструменты используются для решения конкретных задач защиты инфраструктуры: наблюдения, обнаружения, предотвращения и анализа угроз.

## Что будет дальше

| Блок | Практический результат |
|---|---|
| Основы IDPS | Понимание назначения IDS/IPS и классов IDPS |
| Suricata NIDS | Первый alert и анализ `eve.json` |
| Inline IPS | Реальное блокирование и цена False Positive |
| TLS 1.3 | Понимание ограничений сетевой видимости |
| IDS Evasion | TCP/IP reassembly и обход детектирования |
| Wazuh HIDS | Endpoint/FIM telemetry |
| Zeek / Behavioral | C2 beaconing и сетевое поведение |
| Zero Trust | Использование security telemetry при принятии решений доступа |

<div class="callout-banner"><strong>Первый шаг:</strong> если вы впервые сталкиваетесь с IDS/IPS, начните с раздела <a href="course/01-intro/">«Что такое IDS и IPS»</a>.</div>
