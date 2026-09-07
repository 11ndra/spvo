document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    const id = quiz.dataset.questionId || "quiz";
    const feedback = quiz.querySelector(".quiz-feedback");
    const buttons = quiz.querySelectorAll("button[data-choice]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("correct", "incorrect"));
        if (button.dataset.correct === "true") {
          button.classList.add("correct");
          feedback.textContent = "Верно. Alert означает, что событие совпало с логикой обнаружения.";
          localStorage.setItem(`idps-${id}`, "correct");
        } else {
          button.classList.add("incorrect");
          feedback.textContent = "Неверно. Вернитесь к различию между Detection, Prevention и подтверждённым инцидентом.";
        }
      });
    });

    if (localStorage.getItem(`idps-${id}`) === "correct") {
      feedback.textContent = "Этот вопрос уже был отвечен правильно на данном устройстве.";
    }
  });
});
