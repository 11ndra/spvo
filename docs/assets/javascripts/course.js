function initializeQuizzes(){document.querySelectorAll(".quiz").forEach((quiz)=>{const feedback=quiz.querySelector(".quiz-feedback");const buttons=quiz.querySelectorAll("button");buttons.forEach((button)=>{button.addEventListener("click",()=>{buttons.forEach((b)=>b.classList.remove("correct","incorrect","selected"));button.classList.add("selected");const ok=button.dataset.correct==="true";quiz.dataset.answered="true";quiz.dataset.result=ok?"correct":"incorrect";button.classList.add(ok?"correct":"incorrect");feedback.textContent=ok?"Верно.":"Неверно. Проверьте соответствующий теоретический раздел.";});});});document.querySelectorAll(".calculate-score").forEach((button)=>{button.addEventListener("click",()=>{const test=button.closest(".prelab-test");const quizzes=[...test.querySelectorAll(".quiz")];const total=quizzes.length;const correct=quizzes.filter(q=>q.dataset.result==="correct").length;const answered=quizzes.filter(q=>q.dataset.answered==="true").length;const score=total?Math.round(correct/total*100):0;const pass=parseInt(test.dataset.pass||"70",10);const out=test.querySelector(".score-output");if(answered<total){out.textContent=`Ответьте на все вопросы. Сейчас заполнено: ${answered}/${total}.`;return;}out.innerHTML=score>=pass?`Результат: <strong>${score}%</strong> — зачёт. Можно переходить к лабораторной работе.`:`Результат: <strong>${score}%</strong>. Рекомендуется повторить теорию и пройти тест ещё раз.`;localStorage.setItem("idps-prelab-1-score",String(score));});});}document.addEventListener("DOMContentLoaded",initializeQuizzes);


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
