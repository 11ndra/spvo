function initializeQuizzes() {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    // Pre-Lab has its own assessment logic: no immediate correctness reveal.
    if (quiz.closest(".prelab-assessment")) return;

    const feedback = quiz.querySelector(".quiz-feedback");
    const buttons = quiz.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("correct", "incorrect", "selected"));
        button.classList.add("selected");

        const ok = button.dataset.correct === "true";
        quiz.dataset.answered = "true";
        quiz.dataset.result = ok ? "correct" : "incorrect";
        button.classList.add(ok ? "correct" : "incorrect");

        feedback.textContent = ok
          ? "Верно."
          : "Неверно. Проверьте соответствующий теоретический раздел.";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeQuizzes);


function initializeIdsIpsDemo() {
  document.querySelectorAll(".ids-ips-demo").forEach((demo) => {
    const buttons = demo.querySelectorAll(".demo-mode");
    const sensorName = demo.querySelector(".sensor-name");
    const sensorAction = demo.querySelector(".sensor-action");
    const explanation = demo.querySelector(".demo-text");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.demoMode;
        demo.dataset.mode = mode;

        buttons.forEach((b) => b.classList.toggle("active", b === button));

        if (mode === "ips") {
          sensorName.textContent = "IPS-система";
          sensorAction.textContent = "проверяет до передачи дальше";
          explanation.textContent =
            "система находится в пути передачи и может остановить трафик до того, как он достигнет сервера.";
        } else {
          sensorName.textContent = "IDS-сенсор";
          sensorAction.textContent = "наблюдает копию данных";
          explanation.textContent =
            "основной трафик продолжает идти к серверу, а система обнаружения формирует оповещение.";
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeIdsIpsDemo);



function initializeDetectionPipeline() {
  const stages = [
    {
      title: "Получение данных",
      text: "Система должна сначала получить наблюдаемые данные. Для сетевой IDS это пакеты, поступающие с выбранного интерфейса или другого источника трафика.",
      example: "сырые кадры и пакеты"
    },
    {
      title: "Декодирование",
      text: "Система разбирает структуру сетевых заголовков и определяет протоколы нижних уровней: например Ethernet, IP и TCP.",
      example: "src/dst IP, TCP-порты, флаги и структура пакета"
    },
    {
      title: "Состояние потока",
      text: "Связанные пакеты объединяются в поток, а TCP-данные при необходимости восстанавливаются в правильной последовательности.",
      example: "логическое соединение и восстановленный TCP-stream"
    },
    {
      title: "Разбор протокола",
      text: "Прикладной разборщик превращает поток в смысловые поля протокола: например HTTP method, URI, Host или DNS query.",
      example: "HTTP URI = /download?file=../../etc/passwd"
    },
    {
      title: "Логика обнаружения",
      text: "К подготовленным данным применяется правило, модель или другой метод обнаружения. Здесь проверяется, соответствует ли наблюдение интересующему условию.",
      example: "условие совпало с содержимым URI"
    },
    {
      title: "Результат",
      text: "Если условие выполнено, система формирует событие. В IDS это может быть alert, а в IPS к событию может добавляться блокирующее действие.",
      example: "alert создан; дальнейшая интерпретация остаётся отдельной задачей"
    }
  ];

  document.querySelectorAll(".detection-pipeline").forEach((pipeline) => {
    let current = 0;
    const stageEls = pipeline.querySelectorAll(".detect-stage");
    const resetBtn = pipeline.querySelector(".pipeline-reset");
    const nextBtn = pipeline.querySelector(".pipeline-next");
    const detailStep = pipeline.querySelector(".pipeline-detail-step");
    const detailTitle = pipeline.querySelector(".pipeline-detail h3");
    const detailText = pipeline.querySelector(".pipeline-detail p");
    const detailExample = pipeline.querySelector(".pipeline-example code");

    function render() {
      pipeline.dataset.step = String(current);

      stageEls.forEach((el, i) => {
        el.classList.toggle("active", i === current);
        el.classList.toggle("passed", i < current);
      });

      const data = stages[current];
      detailStep.textContent = `Шаг ${current + 1} из ${stages.length}`;
      detailTitle.textContent = data.title;
      detailText.textContent = data.text;
      detailExample.textContent = data.example;
      nextBtn.textContent =
        current === stages.length - 1 ? "Вернуться к началу" : "Следующий шаг →";
    }

    nextBtn.addEventListener("click", () => {
      current = current === stages.length - 1 ? 0 : current + 1;
      render();
    });

    resetBtn.addEventListener("click", () => {
      current = 0;
      render();
    });

    stageEls.forEach((el, i) => {
      el.addEventListener("click", () => {
        current = i;
        render();
      });
    });

    render();
  });
}

function initializeDiagnosticChain() {
  const messages = {
    capture: "Проверьте: проходит ли нужный трафик через точку наблюдения и действительно ли сенсор получает его на выбранном интерфейсе?",
    decode: "Проверьте: удаётся ли системе корректно разобрать сетевые заголовки и определить нужные протоколы?",
    flow: "Проверьте: правильно ли определено направление соединения и восстановлены ли данные потока?",
    parser: "Проверьте: распознан ли прикладной протокол и присутствует ли нужное значение в том поле, с которым работает детектор?",
    rule: "Проверьте: загружено ли правило, относится ли оно к этому трафику и выполняются ли все его условия?",
    output: "Проверьте: создаётся ли событие и ищете ли вы его в правильном журнале или интерфейсе?"
  };

  document.querySelectorAll(".diagnostic-chain").forEach((chain) => {
    const buttons = chain.querySelectorAll("button[data-diagnostic]");
    const result = chain.querySelector(".diagnostic-result");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.toggle("active", b === button));
        result.textContent = messages[button.dataset.diagnostic] || "";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDetectionPipeline();
  initializeDiagnosticChain();
});






function getChapterSlug(pathname = window.location.pathname) {
  const match = pathname.match(/\/course\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function chapterProgressKey(slug) {
  return `idps:chapter-progress:${slug}`;
}

function readSavedChapterProgress(slug) {
  if (!slug) return 0;
  const raw = Number(localStorage.getItem(chapterProgressKey(slug)) || 0);
  return Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
}

function saveChapterProgress(slug, percent) {
  if (!slug) return;
  const previous = readSavedChapterProgress(slug);
  const next = Math.max(previous, percent >= 95 ? 100 : percent);
  localStorage.setItem(chapterProgressKey(slug), String(next));
}

function initializeChapterProgress() {
  const slug = getChapterSlug();
  if (!slug) return;

  const inner = document.querySelector(".md-content__inner.md-typeset");
  const h1 = inner?.querySelector(":scope > h1");
  if (!inner || !h1 || inner.querySelector(".chapter-progress")) return;

  const headings = [...inner.querySelectorAll(":scope > h2")];

  const widget = document.createElement("div");
  widget.className = "chapter-progress";
  widget.innerHTML = `
    <div class="chapter-progress__meta">
      <span class="chapter-progress__section">Начало главы</span>
      <span class="chapter-progress__value">0%</span>
    </div>
    <div class="chapter-progress__track" aria-hidden="true">
      <div class="chapter-progress__bar"></div>
    </div>
  `;
  h1.insertAdjacentElement("afterend", widget);

  const bar = widget.querySelector(".chapter-progress__bar");
  const value = widget.querySelector(".chapter-progress__value");
  const section = widget.querySelector(".chapter-progress__section");

  function update() {
    const top = window.scrollY || window.pageYOffset;
    const start = h1.getBoundingClientRect().top + top;
    const end = inner.getBoundingClientRect().top + top + inner.scrollHeight - window.innerHeight;
    const range = Math.max(end - start, 1);
    const percent = Math.round(Math.max(0, Math.min(1, (top - start) / range)) * 100);

    bar.style.width = `${percent}%`;
    value.textContent = percent >= 95 ? "Прочитано" : `${percent}%`;
    widget.classList.toggle("is-complete", percent >= 95);

    let currentIndex = -1;
    const threshold = 145;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= threshold) currentIndex = index;
    });

    if (currentIndex >= 0) {
      const title = headings[currentIndex].textContent.trim();
      section.textContent = `Раздел ${currentIndex + 1} из ${headings.length} · ${title}`;
    } else if (headings.length) {
      section.textContent = `Раздел 1 из ${headings.length}`;
    }

    saveChapterProgress(slug, percent);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initializeHomeChapterProgress() {
  document.querySelectorAll(".course-route a[href*='course/']").forEach((link) => {
    if (link.querySelector(".route-progress")) return;

    const url = new URL(link.getAttribute("href"), window.location.href);
    const slug = getChapterSlug(url.pathname);
    if (!slug) return;

    const percent = readSavedChapterProgress(slug);
    const progress = document.createElement("div");
    progress.className = "route-progress";
    progress.innerHTML = `
      <div class="route-progress__track">
        <div class="route-progress__bar" style="width:${percent}%"></div>
      </div>
      <span class="route-progress__label">${
        percent >= 100 ? "Прочитано" : percent > 0 ? `${percent}%` : "Не начато"
      }</span>
    `;
    link.appendChild(progress);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeChapterProgress();
  initializeHomeChapterProgress();
});



function initializeMethodDemo() {
  const content = {
    signature: {
      title: "Есть ли известный признак?",
      text: "Сигнатурный метод ищет заранее определённое условие в доступной телеметрии.",
      outcome: "Если известного признака нет, одно это поведение может остаться без сигнатурного alert."
    },
    protocol: {
      title: "Соответствует ли взаимодействие ожидаемой логике протокола?",
      text: "Анализ состояния оценивает структуру и последовательность протокольных действий.",
      outcome: "Необычная последовательность может стать сигналом, но сама по себе ещё не доказывает атаку."
    },
    behavior: {
      title: "Похоже ли это на нормальное поведение?",
      text: "Поведенческий метод смотрит на частоту, повторяемость, направления и другие признаки во времени.",
      outcome: "Регулярность соединений может стать аномальным сигналом даже без известной сигнатуры."
    }
  };

  document.querySelectorAll(".method-demo").forEach((demo) => {
    const buttons = demo.querySelectorAll(".method-choice");
    const title = demo.querySelector(".method-demo__title");
    const text = demo.querySelector(".method-demo__text");
    const outcome = demo.querySelector(".method-demo__outcome");

    function render(method) {
      demo.dataset.method = method;
      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.methodChoice === method);
      });

      const data = content[method];
      title.textContent = data.title;
      text.textContent = data.text;
      outcome.textContent = data.outcome;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.methodChoice));
    });

    render(demo.dataset.method || "signature");
  });
}

function migrateChapterProgressKeys() {
  const migrations = {
    "04-firewall-vs-idps": "05-firewall-vs-idps",
    "05-detection-quality": "06-detection-quality",
    "06-placement": "07-placement"
  };

  Object.entries(migrations).forEach(([oldSlug, newSlug]) => {
    const oldKey = chapterProgressKey(oldSlug);
    const newKey = chapterProgressKey(newSlug);
    const oldValue = localStorage.getItem(oldKey);

    if (oldValue !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, oldValue);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  migrateChapterProgressKeys();
  initializeMethodDemo();
});



function initializeBaseRateLab() {
  document.querySelectorAll(".base-rate-lab").forEach((lab) => {
    const totalInput = lab.querySelector("[data-base-total]");
    const prevalenceInput = lab.querySelector("[data-base-prevalence]");
    const tprInput = lab.querySelector("[data-base-tpr]");
    const fprInput = lab.querySelector("[data-base-fpr]");

    const prevalenceValue = lab.querySelector("[data-base-prevalence-value]");
    const tprValue = lab.querySelector("[data-base-tpr-value]");
    const fprValue = lab.querySelector("[data-base-fpr-value]");

    const tpEl = lab.querySelector("[data-base-tp]");
    const fnEl = lab.querySelector("[data-base-fn]");
    const fpEl = lab.querySelector("[data-base-fp]");
    const tnEl = lab.querySelector("[data-base-tn]");
    const precisionEl = lab.querySelector("[data-base-precision]");
    const explanationEl = lab.querySelector("[data-base-explanation]");

    const formatInt = (value) => Math.round(value).toLocaleString("ru-RU");

    function render() {
      const total = Math.max(1, Number(totalInput.value) || 100000);
      const prevalence = Number(prevalenceInput.value) / 100;
      const tpr = Number(tprInput.value) / 100;
      const fpr = Number(fprInput.value) / 100;

      const positives = total * prevalence;
      const negatives = Math.max(0, total - positives);

      const tp = positives * tpr;
      const fn = positives - tp;
      const fp = negatives * fpr;
      const tn = negatives - fp;
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;

      prevalenceValue.textContent = `${Number(prevalenceInput.value).toFixed(2)}%`;
      tprValue.textContent = `${Number(tprInput.value).toFixed(1)}%`;
      fprValue.textContent = `${Number(fprInput.value).toFixed(1)}%`;

      tpEl.textContent = formatInt(tp);
      fnEl.textContent = formatInt(fn);
      fpEl.textContent = formatInt(fp);
      tnEl.textContent = formatInt(tn);
      precisionEl.textContent = `${(precision * 100).toFixed(1)}%`;

      const ratio = tp > 0 ? fp / tp : Infinity;

      if (!Number.isFinite(ratio)) {
        explanationEl.textContent =
          "Детектор не формирует истинных положительных срабатываний при выбранных параметрах.";
      } else if (ratio > 5) {
        explanationEl.textContent =
          `На каждый полезный alert приходится примерно ${ratio.toFixed(1)} ложных. Низкая базовая частота атак делает даже небольшой FPR очень дорогим для SOC.`;
      } else if (ratio > 1) {
        explanationEl.textContent =
          `Ложных alert всё ещё больше, чем истинных: примерно ${ratio.toFixed(1)} FP на один TP.`;
      } else {
        explanationEl.textContent =
          "При выбранных параметрах большинство положительных срабатываний являются истинными, но отдельно всё равно нужно оценивать пропущенные атаки.";
      }
    }

    [totalInput, prevalenceInput, tprInput, fprInput].forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
    });

    render();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeBaseRateLab();
});






function initializePlacementScenarioLab() {
  const scenarios = {
    "web-attack": {
      title: "Внешний узел атакует публичный Web-сервис",
      goal: "Подозрительную активность внутри разрешённого входящего трафика.",
      route: "Internet → NGFW → Web",
      point: "A — Internet / DMZ",
      why: "Этот поток проходит через границу Internet / DMZ и может быть предоставлен сетевому сенсору.",
      blind: "наличие visibility на Web → App, App → Database и другие внутренние взаимодействия."
    },
    "web-compromised": {
      title: "Скомпрометированный Web пытается обратиться к внутреннему App",
      goal: "Попытку дальнейшего продвижения из DMZ во внутренний сегмент.",
      route: "Web → App",
      point: "B — DMZ / Internal",
      why: "Интересующий поток возникает уже после внешнего периметра и проходит через границу DMZ / Internal.",
      blind: "взаимодействия между другими внутренними узлами, которые не проходят через точку B."
    },
    "lateral": {
      title: "Скомпрометированная рабочая станция выполняет lateral movement",
      goal: "Внутренние соединения между рабочими станциями, серверами и критичными системами.",
      route: "Users → Internal Host → Database",
      point: "C — Internal",
      why: "Нужный сетевой след существует внутри инфраструктуры и может вообще не пересекать внешний периметр или DMZ.",
      blind: "трафик других внутренних сегментов, который не проходит через выбранную внутреннюю точку наблюдения."
    }
  };

  document.querySelectorAll(".placement-scenario-lab").forEach((lab) => {
    const buttons = lab.querySelectorAll(".scenario-choice");
    const title = lab.querySelector(".scenario-title");
    const goal = lab.querySelector(".scenario-goal");
    const route = lab.querySelector(".scenario-route");
    const point = lab.querySelector(".scenario-point");
    const why = lab.querySelector(".scenario-why");
    const blind = lab.querySelector(".scenario-blind-text");

    function render(scenario) {
      lab.dataset.scenario = scenario;

      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.scenarioChoice === scenario);
      });

      const data = scenarios[scenario];
      title.textContent = data.title;
      goal.textContent = data.goal;
      route.textContent = data.route;
      point.textContent = data.point;
      why.textContent = data.why;
      blind.textContent = data.blind;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.scenarioChoice));
    });

    render(lab.dataset.scenario || "web-attack");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializePlacementScenarioLab();
});



function initializePrelabAssessment() {
  const domainNames = {
    architecture: "Архитектура и роль IDPS",
    telemetry: "Телеметрия и pipeline",
    quality: "Качество detection",
    placement: "Placement и доставка"
  };

  document.querySelectorAll(".prelab-assessment").forEach((test) => {
    const quizzes = [...test.querySelectorAll(".assessment-question")];
    const answeredOutput = test.querySelector(".assessment-answered");
    const bestOutput = test.querySelector(".assessment-best");
    const scoreOutput = test.querySelector(".score-output");
    const domainOutput = test.querySelector(".assessment-domain-results");
    const reviewOutput = test.querySelector(".assessment-review-list");
    const submitButton = test.querySelector(".submit-assessment");
    const resetButton = test.querySelector(".reset-assessment");
    const pass = Number(test.dataset.pass || 75);
    const storageKey = "idps-prelab-1-best-score";

    let submitted = false;

    function readBest() {
      const value = Number(localStorage.getItem(storageKey));
      return Number.isFinite(value) && value >= 0 ? value : null;
    }

    function renderBest() {
      const best = readBest();
      bestOutput.textContent = best === null ? "—" : `${best}%`;
    }

    function answeredCount() {
      return quizzes.filter((quiz) => quiz.dataset.answered === "true").length;
    }

    function updateAnswered() {
      answeredOutput.textContent = String(answeredCount());
    }

    quizzes.forEach((quiz) => {
      const buttons = [...quiz.querySelectorAll("button")];

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          if (submitted) return;

          buttons.forEach((item) => item.classList.remove("selected"));
          button.classList.add("selected");
          quiz.dataset.answered = "true";
          quiz.dataset.selectedCorrect =
            button.dataset.correct === "true" ? "true" : "false";

          updateAnswered();
        });
      });
    });

    function revealQuestion(quiz) {
      const buttons = [...quiz.querySelectorAll("button")];
      const selected = buttons.find((button) => button.classList.contains("selected"));
      const correct = buttons.find((button) => button.dataset.correct === "true");
      const feedback = quiz.querySelector(".quiz-feedback");
      const rationale = quiz.querySelector(".quiz-rationale");
      const ok = selected?.dataset.correct === "true";

      buttons.forEach((button) => {
        button.disabled = true;
        button.classList.remove("correct", "incorrect");

        if (button === correct) {
          button.classList.add("correct");
        } else if (button === selected && !ok) {
          button.classList.add("incorrect");
        }
      });

      quiz.dataset.result = ok ? "correct" : "incorrect";
      feedback.textContent = ok
        ? "Верно."
        : "Неверно. Ниже показано объяснение и раздел для повторения.";

      if (rationale) rationale.hidden = false;
    }

    function renderDomainResults() {
      const groups = {};

      quizzes.forEach((quiz) => {
        const domain = quiz.dataset.domain || "other";
        groups[domain] ||= { total: 0, correct: 0 };
        groups[domain].total += 1;
        if (quiz.dataset.result === "correct") groups[domain].correct += 1;
      });

      domainOutput.innerHTML = Object.entries(groups)
        .map(([domain, data]) => `
          <div class="assessment-domain-result">
            <span>${domainNames[domain] || domain}</span>
            <strong>${data.correct} / ${data.total}</strong>
          </div>
        `)
        .join("");
    }

    function renderReviewList() {
      const wrong = quizzes.filter((quiz) => quiz.dataset.result !== "correct");

      if (!wrong.length) {
        reviewOutput.innerHTML = `
          <div class="assessment-review-success">
            Ошибок нет. Базовая инженерная модель сформирована достаточно уверенно для перехода к ЛР №1.
          </div>
        `;
        return;
      }

      const items = wrong.map((quiz) => {
        const meta = quiz.querySelector(".assessment-question-meta")?.textContent?.trim() || "Вопрос";
        const link = quiz.querySelector(".quiz-review");
        const href = link?.getAttribute("href") || "#";
        const label = link?.textContent?.replace("→", "").trim() || "Повторить материал";

        return `<li><span>${meta}</span><a href="${href}">${label} →</a></li>`;
      }).join("");

      reviewOutput.innerHTML = `
        <strong>Что повторить перед следующей попыткой</strong>
        <ul>${items}</ul>
      `;
    }

    submitButton.addEventListener("click", () => {
      if (submitted) return;

      const answered = answeredCount();
      if (answered < quizzes.length) {
        scoreOutput.innerHTML =
          `Ответьте на все вопросы. Сейчас заполнено: <strong>${answered}/${quizzes.length}</strong>.`;
        return;
      }

      submitted = true;
      quizzes.forEach(revealQuestion);

      const correct = quizzes.filter((quiz) => quiz.dataset.result === "correct").length;
      const score = Math.round((correct / quizzes.length) * 100);
      const passed = score >= pass;
      const best = readBest();

      if (best === null || score > best) {
        localStorage.setItem(storageKey, String(score));
      }

      renderBest();
      renderDomainResults();
      renderReviewList();

      scoreOutput.innerHTML = passed
        ? `Результат: <strong>${correct}/${quizzes.length} (${score}%)</strong> — зачёт. Можно переходить к ЛР №1.`
        : `Результат: <strong>${correct}/${quizzes.length} (${score}%)</strong>. Для зачёта нужно не менее <strong>9/12 (75%)</strong>. Разберите ошибки и повторите попытку.`;

      test.classList.toggle("assessment-passed", passed);
      test.classList.toggle("assessment-failed", !passed);
    });

    resetButton.addEventListener("click", () => {
      submitted = false;
      test.classList.remove("assessment-passed", "assessment-failed");

      quizzes.forEach((quiz) => {
        delete quiz.dataset.answered;
        delete quiz.dataset.result;
        delete quiz.dataset.selectedCorrect;

        quiz.querySelectorAll("button").forEach((button) => {
          button.disabled = false;
          button.classList.remove("selected", "correct", "incorrect");
        });

        const feedback = quiz.querySelector(".quiz-feedback");
        const rationale = quiz.querySelector(".quiz-rationale");
        if (feedback) feedback.textContent = "";
        if (rationale) rationale.hidden = true;
      });

      scoreOutput.textContent = "";
      domainOutput.innerHTML = "";
      reviewOutput.innerHTML = "";
      updateAnswered();

      test.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderBest();
    updateAnswered();
  });
}

document.addEventListener("DOMContentLoaded", initializePrelabAssessment);


function initializeDetectionWorkbench() {
  const rules = {
    payload: {
      code: 'payload contains "../"',
      note: 'Упрощённая модель Rule A: marker ищется во всём клиентском HTTP request payload.',
      match: (c) => c.raw.includes("../")
    },
    uri: {
      code: 'HTTP URI contains "../"',
      note: 'Упрощённая модель Rule B: marker должен находиться именно в URI запроса.',
      match: (c) => c.uri.includes("../")
    },
    passwd: {
      code: 'HTTP URI contains "../" AND "etc/passwd"',
      note: 'Упрощённая модель Rule C: detection дополнительно привязан к одному конкретному target.',
      match: (c) => c.uri.includes("../") && c.uri.includes("etc/passwd")
    }
  };

  const cases = {
    normal: {
      id: "T1",
      label: "GET /",
      malicious: false,
      uri: "/",
      raw: "GET / HTTP/1.1\\r\\nHost: lab.local\\r\\n\\r\\n"
    },
    passwd: {
      id: "T2",
      label: "GET /download?file=../../etc/passwd",
      malicious: true,
      uri: "/download?file=../../etc/passwd",
      raw: "GET /download?file=../../etc/passwd HTTP/1.1\\r\\nHost: lab.local\\r\\n\\r\\n"
    },
    benign: {
      id: "T3",
      label: "GET /docs/../index.html",
      malicious: false,
      uri: "/docs/../index.html",
      raw: "GET /docs/../index.html HTTP/1.1\\r\\nHost: lab.local\\r\\n\\r\\n"
    },
    body: {
      id: "T4",
      label: "POST /submit + marker in body",
      malicious: false,
      uri: "/submit",
      raw: "POST /submit HTTP/1.1\\r\\nHost: lab.local\\r\\n\\r\\ncomment=example../../text"
    },
    variant: {
      id: "T5",
      label: "GET /download?file=../../var/log/auth.log",
      malicious: true,
      uri: "/download?file=../../var/log/auth.log",
      raw: "GET /download?file=../../var/log/auth.log HTTP/1.1\\r\\nHost: lab.local\\r\\n\\r\\n"
    }
  };

  document.querySelectorAll(".detection-workbench").forEach((box) => {
    const buttons = [...box.querySelectorAll(".workbench-rule")];
    const code = box.querySelector(".workbench-rule-code");
    const note = box.querySelector(".workbench-rule-note");
    const summary = box.querySelector(".workbench-summary");
    const exportButton = box.querySelector(".workbench-export");

    function render(ruleId) {
      const rule = rules[ruleId];
      box.dataset.rule = ruleId;

      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.workbenchRule === ruleId);
      });

      if (code) code.textContent = rule.code;
      if (note) note.textContent = rule.note;

      const stats = { TP: 0, FP: 0, TN: 0, FN: 0 };
      const evidence = [
        "IDPS Course — Lab 02 Browser Evidence",
        `Rule: ${ruleId}`,
        `Logic: ${rule.code}`,
        ""
      ];

      box.querySelectorAll(".workbench-case").forEach((row) => {
        const c = cases[row.dataset.case];
        const matched = rule.match(c);
        const quality = c.malicious
          ? (matched ? "TP" : "FN")
          : (matched ? "FP" : "TN");

        stats[quality] += 1;

        const matchNode = row.querySelector(".workbench-match");
        const qualityNode = row.querySelector(".workbench-quality");

        if (matchNode) {
          matchNode.textContent = matched ? "MATCH" : "NO MATCH";
          matchNode.className = `workbench-match ${matched ? "is-match" : "is-no-match"}`;
        }

        if (qualityNode) {
          qualityNode.textContent = quality;
          qualityNode.className = `workbench-quality quality-${quality.toLowerCase()}`;
        }

        evidence.push(`${c.id}: ${matched ? "MATCH" : "NO MATCH"} -> ${quality} | ${c.label}`);
      });

      if (summary) {
        summary.innerHTML = `
          <strong>Regression result</strong>
          <span>TP ${stats.TP}</span>
          <span>FP ${stats.FP}</span>
          <span>TN ${stats.TN}</span>
          <span>FN ${stats.FN}</span>
        `;
      }

      box.dataset.evidence = evidence.join("\n");
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.workbenchRule));
    });

    exportButton?.addEventListener("click", () => {
      const content = [
        box.dataset.evidence || "",
        "",
        "Limitation:",
        "This browser workbench is a simplified logical simulator.",
        "It is not evidence of actual Suricata engine execution."
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lab02-browser-evidence.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });

    render(box.dataset.rule || "payload");
  });
}

document.addEventListener("DOMContentLoaded", initializeDetectionWorkbench);
