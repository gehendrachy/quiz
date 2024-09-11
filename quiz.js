const QUIZ_TIME_PER_QUESTION = 100;  // in seconds
const QUIZ_QUESTION_POINT = 10;
const PASS_PERCENT = 50;
const BULLET_POINTS = ['A', 'B', 'C', 'D'];
const MAX_QUESTIONS = 8;
const TOTAL_CHANCES = 3;

let quiz = [];
let score = 0;
let questionAttemped = 0;
let alreadyAnswered = false;
let availableQuestions = [];
let totalChances = 0;
let quizTimerID = 0;
let playerName = "";


let timerAudio = document.getElementById('timerAudio');
let cheerAudio = document.getElementById('cheerAudio');
let booAudio = document.getElementById('booAudio');
let chanceIconSpan = document.getElementById('chance-icons');
let timerElement = document.getElementById('timer')
let timerBox = document.getElementById('timer-box');

let options = document.querySelectorAll('.options');
let highScoreSpan = document.getElementById('highScore');
let currentScoreSpan = document.getElementById('currentScore');

let localHighScores = localStorage.getItem('quizHighScores');
let highScores = JSON.parse(localHighScores) || [];
let currentHighScore = 0;

let questionAnswers = [];
let currentQuestion = {};



async function fetchQuizData(){
    const response = await fetch('quiz.json');
    const data = await response.json();
    
    questionAnswers = data.quiz;
    // startQuiz();
}

fetchQuizData();

function showModule(moduleId){
    
    const moduleList = document.querySelectorAll('.module');
    
    for (module of moduleList) {
        if(module.id == moduleId){
            module.style.display = "block";
        }else{
            module.style.display = "none";
        }
    }
}

showModule('start-module');

const submitForm = (myForm) => {
    
    const formData = new FormData(myForm);
    playerName = formData.get('name');
    const playerNameSpan = document.getElementById("playerName");
    playerNameSpan.innerHTML = playerName;
    startQuiz();
}

const startQuiz = () => {

    currentHighScore = highScores.reduce((highScore, obj) => {
        return Math.max(highScore, obj.score)
      }, 0);
    
    highScoreSpan.innerText = currentHighScore;

    score = 0;
    totalChances = TOTAL_CHANCES;
    questionAttemped = 0;
    alreadyAnswered = false;
    
    showModule("quiz-module");
    showChances(totalChances);
    
    availableQuestions = [...questionAnswers];
    console.log(availableQuestions);
    getNewQuestion();
}

const getNewQuestion = () => {
    
    if(availableQuestions.length == 0 || questionAttemped >= MAX_QUESTIONS || totalChances <= 0){
        stopQuiz();
        return;
    }

    clearInterval(quizTimerID);
    timer = QUIZ_TIME_PER_QUESTION;
    
    let quizQuestion = document.getElementById('quiz-question');
    let quizAnswersUL = document.getElementById('quiz-answers');

    let currentQuestionSpan = document.getElementById('currentQuestionNo');
    currentQuestionSpan.innerHTML = (questionAttemped+1) + "/" + MAX_QUESTIONS;
    quizAnswersUL.innerHTML = "";
      
    let questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    
    quizQuestion.innerHTML = currentQuestion['question'];
    
    const quizOptions = currentQuestion['options'];
    alreadyAnswered = false;
    
    for (const answerIndex in quizOptions) {
        
        optionValue = currentQuestion['options'][answerIndex];
        
        const optionList = document.createElement('li');
        optionList.classList.add('options');
        optionList.setAttribute('data-value', optionValue);
        optionList.setAttribute('onclick', 'checkAnswer(this)');
        
        
        const bulletSpan = document.createElement('span');
        bulletSpan.classList.add('bullet');
        bulletSpan.innerHTML = BULLET_POINTS[answerIndex];
        optionList.append(bulletSpan);
        
        const optionSpan = document.createElement('span');
        optionSpan.classList.add('option');
        optionSpan.innerHTML = optionValue;
        optionList.append(optionSpan);
        
        // console.log(optionList);
        // let optionSpan = options[answerIndex].querySelector('span.option');
        // optionSpan.innerHTML = ;
        quizAnswersUL.append(optionList);
        
        
    }
    
    // console.log(availableQuestions);
    // console.log("================================= index = " + questionIndex);
    availableQuestions.splice(questionIndex, 1);
    questionAttemped++;
    // console.log("questions attemped = " + questionAttemped);
    
    timer = QUIZ_TIME_PER_QUESTION;
    timerElement.innerText = timer;
    timerBox.style.display = "flex";
    quizTimerID = setInterval(checkTimer, 1000);
    
}

function checkAnswer(option){
    
    if(alreadyAnswered) {
        return;
    }
    
    alreadyAnswered = true;
    let selectedOption = option.getAttribute('data-value');
    let resultClass =  selectedOption == currentQuestion['answer'] ? 'border-green' : 'border-red';
    option.classList.add(resultClass);
    
    if(selectedOption == currentQuestion['answer']){
        score += QUIZ_QUESTION_POINT;
        currentScoreSpan.innerText = score;

        if(score > currentHighScore){
            
            // currentScoreSpan         
            setInterval(function(){
                currentScoreSpan.style.display = (currentScoreSpan.style.display == '' ? 'none' : '' );
            }, 500);
        }
        // console.log(score);
    }else{
        decreaseChances();
    }
    
    setTimeout(() => {
        option.classList.remove(resultClass);
        getNewQuestion();
    }, 700);
}

function decreaseChances(){
    totalChances -= 1;
    showChances(totalChances);
    // if(totalChances <= 0) alert('Game Over');
}

function showChances(number){
    console.log(number);
    chanceIconSpan.innerHTML = "";
    let icons = '';
    
    for(i=0; i<number; i++){
        icons += '<i class="fa-solid fa-heart"></i> ';
    }
    
    chanceIconSpan.innerHTML = icons;
    
    
}

function checkTimer(){
    timer -= 1;
    timerElement.innerText = timer;
    
    // timerAudio.play();
    
    if(timer <= 0){
        clearInterval(quizTimerID);
        decreaseChances();
        getNewQuestion();
    }
    
}

function stopQuiz(){
    clearInterval(quizTimerID);
    timerBox.style.display = "none";
    showModule('score-module');
    
    const scoreSpan = document.getElementById('score');
    scoreSpan.innerText = score;

    saveHighScores();
}

function saveHighScores(){
    localHighScores = localStorage.getItem('quizHighScores');
    highScores = JSON.parse(localHighScores) || [];

    console.log(highScores);

    const info = {
        "name" : playerName,
        "score" : score
    }

    highScores.push(info);
    highScores.sort((a,b) => b.score - a.score);
    highScores.splice(10);

    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
    
}

function viewHighScores(){
    localHighScores = localStorage.getItem('quizHighScores');
    highScores = JSON.parse(localHighScores) || [];

    showModule('highscore-module');
    const tBody = document.getElementById('scoreBody');
    tBody.innerHTML = '';
    for (highScore of highScores) {
        const trElement = `<tr>
                                <td>${highScore.name}</td>
                                <td>${highScore.score}</td>
                            </tr>`;
        
        tBody.innerHTML += trElement;
    }
}

// function resetQuiz(){
//     showModule('quiz-module');
// }