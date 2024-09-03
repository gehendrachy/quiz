const QUIZ_TIME = 60;
const QUIZ_QUESTION_POINTS = 1;
const PASS_PERCENT = 50;

let quiz = [];
let timer = 0;
let setInterValId = 0;

let timerAudio = document.getElementById("timerAudio");
let cheerAudio = document.getElementById("cheerAudio");
let booAudio = document.getElementById("booAudio");
let timerElement = document.getElementById("timer");
let timerBox = document.getElementById("timer-box");
// console.log(timerAudio);

async function fetchQuizQuestion(){
    const response = await fetch("quiz.json");
    const data = await response.json();
    randomQuestions = [];
    randomKeys = [];
    quiz = data.quiz;

    // while(randomQuestions.length < 5){
        
    //     var randomIndex = Math.floor(Math.random() * quiz.length);

    //     if( randomKeys.indexOf(randomIndex) < 0){
    //         randomQuestions.push(quiz[randomIndex]);
    //         randomKeys.push(randomIndex);
    //     }
    // }
    
    // quiz = randomQuestions;

    console.log(quiz);
    
    // console.log(quiz);

}

fetchQuizQuestion();

function showModule(moduleName){
    // get all the module class elements
    
    const moduleList = document.querySelectorAll(".module");
    
    for(m of moduleList){
        
        if(m.id === moduleName){
            m.style.display = "block";
        }else{
            m.style.display = "none";
        }
    }
}

showModule("start-module");


const startQuiz = () => {
    
    showModule("quiz-module");
    timerBox.style.display = "flex";
    const questionUL = document.getElementById("quizList");
    questionUL.innerText = "";
    
    for(quizIndex in quiz){
        
        // console.log(quiz[quizIndex].question);
        
        const questionList = document.createElement("li");
        questionList.classList.add("quiz-question");
        
        const questionSpan = document.createElement("span");
        questionSpan.innerText = quiz[quizIndex].question;
        questionList.append(questionSpan);
        
        const optionsUL = document.createElement("ul");
        optionsUL.classList.add("quiz-answer");
        
        for(optionIndex in quiz[quizIndex].options){
            
            const optionList = document.createElement("li");
            const inputElement = document.createElement("input");
            inputElement.id = "q-" + quizIndex + "-a-" + optionIndex;
            inputElement.name = "question"+quizIndex;
            inputElement.type = 'radio';
            
            const inputLabel = document.createElement("label");
            inputLabel.setAttribute("for", "q-" + quizIndex + "-a-" + optionIndex); 
            inputLabel.innerText = quiz[quizIndex].options[optionIndex];
            
            optionList.append(inputElement);
            optionList.append(inputLabel);
            optionsUL.append(optionList);
        }
        
        questionList.append(optionsUL);
        questionUL.append(questionList);
        
        // console.log(questionList);
    }
    
    // startTimer()
    timer = QUIZ_TIME;
    // setInterValId = setInterval(checkTimer, 1000);
    
};

const checkTimer = () => {
    
    
    timerElement.innerText = timer;
    timer -= 1;
    
    // console.log("timer");
    
    timerAudio.play();
    
    if(timer < 0){
        stopQuiz();
    }
};

const stopQuiz = () => {
    // console.log("stop Quiz");
    timerBox.style.display = "none";

    clearInterval(setInterValId);
    showModule("score-module");
    timerElement.innerHTML = "--";
    calculateResult();
    
}


const  calculateResult = () => {
    const selectedOptionList = document.querySelectorAll('input[type="radio"]:checked');
    
    let score = 0;
    let result = "Failed";
    
    for(item of selectedOptionList){
        // console.log(item.id);

        questionNo = item.id.split("-")[1];
        answerSelected = item.id.split("-")[3];

        // console.log(questionNo, answerSelected);

        console.log("Correct Answer : "+ quiz[questionNo].answer);
        console.log("Selected Answer : "+ quiz[questionNo].options[answerSelected]);


        if(quiz[questionNo].answer === quiz[questionNo].options[answerSelected]){
            console.log('true');
            score = score + QUIZ_QUESTION_POINTS;
        }
    }
    const resultPercent = (score / (QUIZ_QUESTION_POINTS * quiz.length)) * 100;

    if(resultPercent >= PASS_PERCENT){

        result = "PASSED";
        cheerAudio.play();
        
    }else{
        booAudio.play();
    }
    
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = score;
    
    const resultElement = document.getElementById("result");
    resultElement.innerText = result;
}

const resetQuiz = () => {
    // timer = 0;
    setInterValId = 0;
    cheerAudio.pause();
    booAudio.pause();
    
    showModule("start-module");
}