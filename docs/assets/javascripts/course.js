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
