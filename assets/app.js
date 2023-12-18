// DOM elements
const startButton = document.getElementById("start-btn");
const highScoresLink = document.getElementById("high-scores-link");
const welcomeMessage = document.getElementById("Welcome-message");
const quizContentContainer = document.getElementById("quiz-content");
const quizQuestionContainer = document.getElementById("quiz-question-container");
const quizChoicesContainer = document.getElementById("quiz-choices-container");
const quizContainer = document.getElementById("quiz-container");
const finalScoreElement = document.getElementById("finalScoreElement");
const timerElement = document.getElementById("timerElement");
const gameOverContainer = document.getElementById("game-over-container");
const initialsInput = document.getElementById("initials");
const feedbackContainer = document.getElementById("feedback-container");
const submitButton = document.getElementById("save-score-btn");
const highScoresContainer = document.getElementById("high-scores-container");
const highScoresList = document.getElementById("high-scores-list");

// Quiz questions
const questions = [
  {
    question: "What is JavaScript?",
    choices: ["A programming language", "A type of coffee", "A planet"],
    correctAnswerIndex: 0,
  },
  {
    question: "What is the correct way to declare a variable in JavaScript? ",
    choices: ["variable x = 10", "var x = 10", "int x = 10"],
    correctAnswerIndex: 1,
  },
  {
    question: "What is the index of the first element in an array?",
    choices: ["0", "1", "2"],
    correctAnswerIndex: 0,
  },
  {
    question: "How do you properly comment on a single line in JavaScript?",
    choices: ["#/", "/*", "//"],
    correctAnswerIndex: 2,
  },
  {
    question: "Which loop is ideal when you want to iterate over an array in JavaScript?",
    choices: ["for loop", "while loop", "repeat..until loop"],
    correctAnswerIndex: 0,
  },
  {
    question: "How do you check if an element exists in an array?",
    choices: ["Using the includes() method", "Using the search() method", "Using the check() method"],
    correctAnswerIndex: 0,
  },
  {
    question: "Which method do you use to add elements to the end of an array? ",
    choices: ["pull()", "add()", "push()"],
    correctAnswerIndex: 2,
  },
];

let score = 0;
let currentQuestionIndex = 0;
let time = 60;
let timerInterval;

// Event listener for the Start Quiz button
startButton.addEventListener("click", function () {
  welcomeMessage.style.display = "none";
  quizContentContainer.style.display = "block";
  showQuestion();
  startTimer();
});

highScoresLink.addEventListener("click", function () {
  showHighScores();
});

submitButton.addEventListener("click", function () {
  saveScore();
});

function showHighScores() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  highScoresList.innerHTML = "";

  scores.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("high-score");
    listItem.innerHTML = `<span class="initials">${score.initials}:</span> <span class="score">${score.score}</span>`;
    highScoresList.appendChild(listItem);
  });

  hideQuizContent();
  hideGameOverContainer();
  showHighScoresContainer();
}

function showQuizContent() {
  quizContentContainer.classList.add("show");
}

function showGameOverContainer() {
  gameOverContainer.classList.add("show");
}

function showHighScoresContainer() {
  highScoresContainer.classList.add("show");
}

function hideQuizContent() {
  quizContentContainer.classList.remove("show");
}

function hideGameOverContainer() {
  gameOverContainer.classList.remove("show");
}

function hideHighScoresContainer() {
  highScoresContainer.classList.remove("show");
}

function showQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    quizQuestionContainer.textContent = currentQuestion.question;
    quizChoicesContainer.innerHTML = "";

    currentQuestion.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.textContent = choice;
      button.setAttribute("data-index", index);
      button.addEventListener("click", handleChoice);
      quizChoicesContainer.appendChild(button);
    });
  } else {
    endQuiz();
  }
}

function handleChoice(event) {
  const selectedButton = event.target;
  const selectedChoiceIndex = parseInt(selectedButton.getAttribute("data-index"));

  if (!isNaN(selectedChoiceIndex)) {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedChoiceIndex === currentQuestion.correctAnswerIndex) {
      score += 1;
      displayFeedback("Correct! Well done!");
    } else {
      time -= 5;
      displayFeedback("Oops! That's incorrect.");
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  } else {
    console.error("Invalid choice. Please try again.");
  }
}

function displayFeedback(message) {
  feedbackContainer.textContent = message;

  setTimeout(() => {
    feedbackContainer.textContent = "";
  }, 2000);
}

function startTimer() {
  timerInterval = setInterval(function () {
    time--;
    timerElement.textContent = time;

    if (time <= 0) {
      endQuiz();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function saveScore() {
  const initialsInput = document.getElementById("initials");
  const initials = initialsInput.value;
  const finalScore = time < 0 ? 0 : time;

  if (typeof localStorage !== "undefined" && localStorage !== null) {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];

    const existingScoreIndex = scores.findIndex((s) => s.initials === initials.toUpperCase() && s.score === finalScore);

    if (existingScoreIndex === -1) {
      scores.push({ initials: initials.toUpperCase(), score: finalScore });
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem("scores", JSON.stringify(scores));

      console.log("Score saved successfully!");
    } else {
      console.log("Score already exists. Not saving.");
    }
  } else {
    console.error("LocalStorage is not available or disabled. Unable to save the score.");
  }

  stopTimer();
  showHighScores();
}

function endQuiz() {
  clearInterval(timerInterval);
  gameOverContainer.style.display = "block";

  const finalScore = time < 0 ? 0 : time;
  finalScoreElement.textContent = `Your score: ${finalScore} seconds`;
  quizContainer.style.display = "none";
  saveScore();
  showHighScores();
}








