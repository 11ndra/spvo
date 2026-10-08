# Тестовый тренажёр по IDS/IPS

Тренажёр использует банк контрольных вопросов курса и помогает проверить понимание терминов, механизмов и ограничений IDS/IPS. Это **учебная самопроверка**, а не привязка курса к конкретной форме экзамена.

Выберите блок и количество вопросов. После ответа тренажёр сразу покажет пояснение; в конце будет итоговый результат.

<div class="quiz-shell" id="idps-quiz" data-quiz-ready="false">
  <div class="quiz-toolbar">
    <label>Блок вопросов
      <select id="quiz-range">
        <option value="all">Все темы</option>
        <option value="1-15">1–15 · основы IDS/IPS</option>
        <option value="16-30">16–30 · anomaly, DIDS, журналы</option>
        <option value="31-45">31–45 · heuristics, DPI, TI, Zero-Day</option>
        <option value="46-60">46–60 · IPS, SIEM, стандарты, политики</option>
        <option value="61-75">61–75 · EDR, атаки, корреляция, архитектура</option>
        <option value="76-90">76–90 · эффективность, ограничения, развитие</option>
      </select>
    </label>
    <label>Количество
      <select id="quiz-count">
        <option value="10">10</option>
        <option value="20" selected>20</option>
        <option value="30">30</option>
        <option value="all">Все доступные</option>
      </select>
    </label>
    <button class="quiz-btn quiz-btn--primary" id="quiz-start" type="button">Начать тест</button>
  </div>

  <div class="quiz-stage" id="quiz-stage" hidden>
    <div class="quiz-progress-row">
      <span id="quiz-progress-text"></span>
      <span id="quiz-score"></span>
    </div>
    <div class="quiz-progress"><span id="quiz-progress-bar"></span></div>
    <article class="quiz-card">
      <div class="quiz-number" id="quiz-number"></div>
      <h2 id="quiz-question"></h2>
      <div class="quiz-options" id="quiz-options"></div>
      <div class="quiz-feedback" id="quiz-feedback" hidden></div>
      <div class="quiz-actions">
        <button class="quiz-btn quiz-btn--primary" id="quiz-next" type="button" hidden>Следующий вопрос</button>
      </div>
    </article>
  </div>

  <div class="quiz-result" id="quiz-result" hidden></div>
</div>

!!! tip "Как использовать тренажёр"
    Если ответ оказался неверным, не запоминайте букву варианта. Прочитайте пояснение и вернитесь к соответствующей теме курса. Цель теста — проверить понимание, а не выучить расположение ответов.
