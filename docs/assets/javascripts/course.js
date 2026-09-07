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



function initializeVisibilityDemo() {
  const sourceMeta = {
    network: {
      name: "сетевую систему",
      description:
        "Она видит сетевые взаимодействия, которые проходят через её точку наблюдения: адреса, порты, потоки и доступные протокольные данные.",
      blind:
        "она не знает, какой локальный процесс изменил файл на рабочей станции."
    },
    host: {
      name: "хостовую систему",
      description:
        "Она видит события конкретного компьютера: процессы, изменения файлов, аутентификацию и другие данные операционной системы.",
      blind:
        "она не даёт полной картины сетевых взаимодействий всей инфраструктуры."
    },
    wireless: {
      name: "беспроводную систему",
      description:
        "Она наблюдает среду Wi‑Fi и может обнаруживать неизвестные точки доступа, служебные кадры и нарушения беспроводной политики.",
      blind:
        "она не предназначена для анализа процессов на сервере или всего проводного сетевого трафика."
    },
    behavior: {
      name: "анализ сетевого поведения",
      description:
        "Он ищет закономерности в сетевых взаимодействиях: периодичность, необычные направления, объёмы и отклонения от нормального поведения.",
      blind:
        "он не всегда способен объяснить точную причину аномалии без дополнительных источников."
    }
  };

  document.querySelectorAll(".visibility-demo").forEach((demo) => {
    const buttons = demo.querySelectorAll(".visibility-mode");
    const nodes = demo.querySelectorAll(".incident-node");
    const name = demo.querySelector(".visibility-name");
    const description = demo.querySelector(".visibility-description");
    const blind = demo.querySelector(".visibility-blind");

    function applySource(source) {
      demo.dataset.source = source;

      buttons.forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.visibility === source
        );
      });

      nodes.forEach((node) => {
        const seenBy = (node.dataset.seenBy || "").split(/\s+/);
        node.classList.toggle("visible-source", seenBy.includes(source));
      });

      const meta = sourceMeta[source];
      if (meta) {
        name.textContent = meta.name;
        description.textContent = meta.description;
        blind.textContent = meta.blind;
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        applySource(button.dataset.visibility);
      });
    });

    applySource(demo.dataset.source || "network");
  });
}

document.addEventListener("DOMContentLoaded", initializeVisibilityDemo);
