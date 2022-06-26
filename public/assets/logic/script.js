//Variables = qNumber(null), timer(num), score(num), initials(text)
let timer = 600;
let runningTimer;
let score = 0;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 10;

//DOM Objects = START BUTTON, ANSWER BUTTONS, QUESTION CONTAINER, QUESTION ELEMENT
const startButton = document.getElementById("startButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const qImage = document.getElementById("imagem");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");

//LocalStorage Objects
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//

startButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);

//function to start the game
//called when start button is clicked, should run the function to display questions and the function to start the timer

function startGame() {
  startButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(perguntasFacil[getRandomInt(3)]);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//function to display the questions
//should load one object from the questions array into the proper html elements, then run the function to collect answers
function showQuestion(question) {
  document.getElementById("regras").style.display = 'none';
  if(typeof question.imagem == 'undefined'){
  document.getElementById("imagem").style.display = 'hidden';
  } else {
  document.getElementById("imagem").style.display = 'inline-block';
  document.getElementById("imagem").style.display = 'visible';
  qImage.src = question.imagem;
  }
  qElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

//function to start the timer
//should run a countdown that is displayed in the HTML, when time is up, should run the game over function
function startClock() {
  countdown.innerHTML = "Tempo restante em segundos: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}

//function to collect answers
//should listen for what answer the user clicks on, compare it to the correct answer, and decrease the timer if wrong. should then run the next question function
//unless the current question is the last, then it should run the game over function
function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 100;
    console.log(timer);
  }
  shuffle(perguntasMedia);
  if (qNumber == perguntasMedia.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(perguntasMedia[qNumber]);
    console.log(score);
  }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//function to clear the current question
//should empty the HTML elements that are occupied with the currently displayed question
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//function for game over
//should grab the current time remaining and set it as the score, hide the questions area, display the score to the user, and give them the chance to try again or submit
//their high scores via a text box for intials and the high scores function
function gameOver() {
  document.getElementById("regras").style.display = 'block';
  document.getElementById("regras").style.display = 'visible';
  clearInterval(runningTimer);
  countdown.innerHTML = "Finalizado";
  clearQuestion();
  showResults();
  startButton.innerText = "Reiniciar";
  startButton.classList.remove("hide");
  timer = 600;
  score = 0;
}

function showResults() {
  finalScore = timer;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  document.getElementById("imagem").style.display = 'none';
  scoreArea.innerHTML = `Sua pontuação é ${finalScore}!<div id="init">Nome: <input type="text" name="initials" id="initials" placeholder="Digite seu nome"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>Salvar</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function() {
    saveButton.disabled = !username.value;
  });
}

//function to submit high scores
//should grab the users score and initials and add it to the high scores object, ranked numerically, and run the function to display the high scores
function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

//function to display high scores
//should populate the HTML with a ranked display of the high scores and and provide the option to clear the scores via a function
function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>Pontuações</h2><ul id="highScoresList"></ul><div id="clearScores">10 Melhores Pontuações</div>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

//function to clear high scores
//should fire on click, and erase the values of the high scores object
function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>Notas Apagadas</h3>";
  document.getElementById("clearScores").classList.add("hide");
}

/////
//Questions go Here
/////
const perguntasFacil = [
  {
    question: "Qual a mediana [ 2, 6, 6, 6, 8, 8, 9, 11,17]?",
    answers: [
      { text: "6", correct: false },
      { text: "6.5", correct: false },
      { text: "11", correct: false },
      { text: "8.1", correct: false },
      { text: "8", correct: true }
    ]
  },
  {
    question: "Qual a mediana [ 2, 6, 6, 6, 8, 8, 9, 11,17]?",
    answers: [
      { text: "6", correct: false },
      { text: "15", correct: false },
      { text: "8.1", correct: false },
      { text: "6.5", correct: false },
      { text: "8", correct: true }
    ]
  },
  {
    question: "Qual a mediana [ 2, 6, 6, 6, 8, 8, 9, 11,17]?",
    answers: [
      { text: "9", correct: false },
      { text: "6.5", correct: false },
      { text: "8.1", correct: false },
      { text: "2", correct: false },
      { text: "8", correct: true }
    ]
  },
]

  const perguntasMedia = [
    
  {
    question: 'Um bairro chamado Rio Oeste possui uma população total de 1,000 famílias. O instituto PesquiseJá precisa realizar uma pesquisa com erro amostral tolerável de 4%, qual tamanho mínimo da amostra para realizar a pesquisa?',
    answers: [
      { text: '625', correct: false },
      { text: '385', correct: false },
      { text: '152', correct: false },
      { text: '352', correct: false },
      { text: '40', correct: true }
    ]
  },
  {
    question: 'Considerando o infográfico, suponhamos que a distribuição por sexo tenha a mesma proporção por faixa etária, qual a população de meninas entre 14 e 15 anos que trabalham no Brasil?',
    imagem:'./assets/logic/trabalhoinfantil.png',
    answers: [
      { text: '148,500', correct: true },
      { text: '594,000', correct: false },
      { text: '445,500', correct: false },
      { text: '345,250', correct: false },
      { text: '180,000', correct: false }
    ]
    
  },

]

