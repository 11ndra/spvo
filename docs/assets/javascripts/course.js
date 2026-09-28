function initializeQuizzes() {
  document.querySelectorAll(".quiz").forEach((quiz) => {
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
      title: "Есть ли заранее известный признак?",
      text: "Сигнатурный метод сравнивает наблюдение с заранее определённым условием или признаком.",
      outcome: "Совпадение подтверждает выполнение условия, но само по себе не доказывает успешную атаку."
    },
    protocol: {
      title: "Допустимо ли это сообщение в текущем состоянии?",
      text: "Анализ состояния и семантики учитывает смысл сообщений и допустимые переходы протокола.",
      outcome: "Нарушение модели требует внимания, но его причина не обязана быть атакой."
    },
    behavior: {
      title: "Выполнено ли фиксированное условие над серией событий?",
      text: "Фиксированное условие может учитывать частоту, последовательность и повторяемость событий в заданном окне.",
      outcome: "Для такого решения базовая модель нормальной активности не требуется."
    },
    anomaly: {
      title: "Насколько наблюдение отклоняется от ожидаемого профиля?",
      text: "Аномальный метод сравнивает текущую активность с базовой моделью или ожидаемым диапазоном.",
      outcome: "Отклонение от нормы не является автоматическим доказательством вредоносности."
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










