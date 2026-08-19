const params = new URLSearchParams(window.location.search);

const courseId = params.get("course");

let quiz = null;


// Load Quiz
async function loadQuiz() {

    try {

        const response = await fetch(
            `${API}/api/quiz/course/${courseId}`
        );

        quiz = await response.json();

        if (!response.ok) {
            throw new Error(quiz.message);
        }

        document.getElementById("quizTitle").innerText =
            quiz.title;

        const form = document.getElementById("quizForm");

        form.innerHTML = "";

        quiz.questions.forEach((q, index) => {

            let optionsHTML = "";

            q.options.forEach(option => {

                optionsHTML += `
                    <label>
                        <input
                            type="radio"
                            name="question${index}"
                            value="${option}"
                        >
                        ${option}
                    </label>
                    <br>
                `;

            });

            form.innerHTML += `
                <div class="quiz-question">

                    <h3>
                        ${index + 1}. ${q.question}
                    </h3>

                    ${optionsHTML}

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        document.getElementById("quizTitle").innerText =
            "Quiz could not be loaded";

    }
}


// Submit Quiz
function submitQuiz() {

    let score = 0;

    quiz.questions.forEach((q, index) => {

        const selected = document.querySelector(
            `input[name="question${index}"]:checked`
        );

        if (selected && selected.value === q.correctAnswer) {
            score++;
        }

    });

    const percentage =
        (score / quiz.questions.length) * 100;

    const result = document.getElementById("result");

    if (percentage >= quiz.passMark) {

        result.innerHTML = `
            <h2>🎉 Congratulations!</h2>

            <p>
                Score: ${score}/${quiz.questions.length}
            </p>

            <p>
                Percentage: ${percentage}%
            </p>

            <p>
                You passed the quiz!
            </p>

            <button onclick="getCertificate()">
                Get Certificate
            </button>
        `;

    } else {

        result.innerHTML = `
            <h2>❌ Quiz Failed</h2>

            <p>
                Score: ${score}/${quiz.questions.length}
            </p>

            <p>
                Percentage: ${percentage}%
            </p>

            <p>
                You need ${quiz.passMark}% to pass.
            </p>

            <button onclick="location.reload()">
                Try Again
            </button>
        `;

    }

}


// Certificate
function getCertificate() {

    alert("Certificate feature next step lo create chestam.");

}


loadQuiz();