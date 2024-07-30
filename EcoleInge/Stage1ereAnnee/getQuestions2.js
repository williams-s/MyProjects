document.addEventListener("DOMContentLoaded", () => {
  fetch("getQuestions.php")
    .then((response) => response.json())
    .then((data) => {
      const questionsContainer = document.getElementById("questionContainer");

      data.forEach((question, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.className = "question-container";
        questionContainer.id = `question${question.id}`;
        questionContainer.style.display = "none";
        questionContainer.innerHTML = `
                <p class="question">${question.question}</p>
                <div class="btn-container2">
                    ${
                      index < data.length - 1
                        ? `
                        <button class="btn-next" onclick="nextQuestion('question${
                          data[index + 1].id
                        }')">Suivant</button>
                    `
                        : `
                        <button class="btn-next" disabled>Fin du quiz</button>
                    `
                    }
                </div>
            `;
        questionsContainer.appendChild(questionContainer);
      });
    })
    .catch((error) => console.error(error));
});
