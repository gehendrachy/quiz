const QUIZ_TIME_PER_QUESTION = 10;  // in seconds
const QUIZ_QUESTION_POINT = 1;
const PASS_PERCENT = 50;
const BULLET_POINTS = ['A', 'B', 'C', 'D'];
const MAX_QUESTIONS = 5;
const TOTAL_CHANCES = 3;

let quiz = [];
let timer = 0;
let score = 0;
let questionAttemped = 0;
let alreadyAnswered = false;
let availableQuestions = [];
let totalChances = 0;


let timerAudio = document.getElementById('timerAudio');
let cheerAudio = document.getElementById('cheerAudio');
let booAudio = document.getElementById('booAudio');
let chanceIconSpan = document.getElementById('chance-icons');
// let quizBox = document.getElementById('quiz-box');

let options = document.querySelectorAll('.options');

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
    score = 0;
    totalChances = TOTAL_CHANCES;
    
    showModule("quiz-module");
    showChances(totalChances);
    
    availableQuestions = [...questionAnswers];
    // console.log(availableQuestions);
    getNewQuestion();
}

const getNewQuestion = () => {
    
    if(availableQuestions.length == 0 || questionAttemped >= MAX_QUESTIONS || totalChances <= 0){
        console.log('end');
        return;
    }
    
    timer = QUIZ_TIME_PER_QUESTION;
    
    let quizQuestion = document.getElementById('quiz-question');
    let quizAnswersUL = document.getElementById('quiz-answers');
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
        
        // console.log(score);
    }else{
        totalChances -= 1;
        if(totalChances <= 0) alert('Game Over');
        showChances(totalChances);
    }
    
    setTimeout(() => {
        option.classList.remove(resultClass);
        getNewQuestion();
    }, 700);
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