const QUIZ_TIME = 0;
const QUIZ_QUESTION_POINTS = 1;
const PASS_PERCENT = 50;

let quiz = [];
let timer = 0;
let availableQuestions = [];


let timerAudio = document.getElementById('timerAudio');
let cheerAudio = document.getElementById('cheerAudio');
let booAudio = document.getElementById('booAudio');
// let quizBox = document.getElementById('quiz-box');
let quizQuestion = document.getElementById('quiz-question');
let options = document.querySelectorAll('.option');

let questionAnswers = [];
let currentQuestion = {};


async function fetchQuizData(){
    const response = await fetch('quiz.json');
    const data = await response.json();
    
    questionAnswers = data.quiz;
    startQuiz();
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

showModule('quiz-module');

const startQuiz = () => {
    showModule("quiz-module");
    availableQuestions = [...questionAnswers];
    // console.log(availableQuestions);
    getNewQuestion();
}

const getNewQuestion = () => {
    if(availableQuestions.length == 0){
        console.log('end');
        return;
    }

    let questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    quizQuestion.innerHTML = currentQuestion['question'];
    
    for (const answerIndex in options) {
        options[answerIndex].innerHTML = currentQuestion['options'][answerIndex];
    }
    
}

options.forEach((option) => {
    option.addEventListener('click', (c) => {
        let selectedOption = c.target;
        // console.log(selectedOption.innerHTML);
        if(selectedOption.innerHTML == currentQuestion['answer']){}
    });
});

