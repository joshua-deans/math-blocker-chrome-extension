const currentUrl = window.location.href;
let numQuestions = 1;
let currQuestion = 1;
let questionDifficulty = 1;
let questionDelay = 2;
let siteList;
let siteObj;
let questionObj;

// eslint-disable-next-line no-undef
chrome.storage.sync.get(['siteList', 'questionDifficulty', 'numQuestions', 'questionDelay'], (result) => {
    if (result && result.siteList){
        if (result.numQuestions) {
            numQuestions = parseInt(result.numQuestions, 10);
        }
        if (result.questionDifficulty){
            questionDifficulty = parseInt(result.questionDifficulty, 10);
        }
        if (result.questionDelay){
            questionDelay = parseInt(result.questionDelay, 10);
        }
        for (let i = 0; i < result.siteList.length; i++){
            siteList = result.siteList;
            if (currentUrl.indexOf(result.siteList[i].url) !== -1 && 
            moment().isAfter(moment(result.siteList[i]["validUntil"]))){
                siteObj = result.siteList[i];
                showQuestionPopup();
                document.body.classList.add("math-stop-scrolling");
                break;
            }
        };
    }
});

function showQuestionPopup(){
    fetch(chrome.extension.getURL('/modal.html'))
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML += data;
        startMathQuestions();
    })
    .catch(err => {
        console.log(err);
    });
}

function startMathQuestions(){
    document.querySelector('#math-popup-form').addEventListener("submit", onSubmit);
    populateMathQuestion();
}

function populateMathQuestion(){
    questionObj = generateQuestion(questionDifficulty);
    document.querySelector('#math-popup-title').innerText = "You have been blocked from " + siteObj.url;
    document.querySelector('#math-popup-question').innerText = questionObj.text;
    document.querySelector('#math-popup-question').innerText += " (" + currQuestion + "/" + numQuestions + ")"
}

function onSubmit(event){
    event.preventDefault();
    event.stopPropagation()
    let inputElement = document.querySelector('#math-popup-input');
    if(inputElement.value === questionObj.answer){
        currQuestion++;
        if (currQuestion > numQuestions){
            questionsFinished();
        } else {
            populateMathQuestion();
        }
    }
    inputElement.value = "";
}

function questionsFinished() {
    var index = siteList.indexOf(siteObj);
    var newSiteList = siteList.slice(0);
    if (index !== -1) {
        newSiteList[index]["validUntil"] = moment().add(questionDelay, 'minutes').valueOf();
        chrome.storage.sync.set({ siteList: newSiteList }, () => {
            window.location.reload();
        });
    } else {
        console.log("index not found");
    }
}

function generateQuestion(questionDifficulty){
    let result = {};
    let a;
    let b;
    let c;
    if (questionDifficulty === 1){
        a = Math.floor(Math.random() * 10 + 1);
        b = Math.floor(Math.random() * 10 + 1);
        result.text = a + " + " + b;
        result.answer = a + b;
    } else if (questionDifficulty === 2){
        a = Math.floor(Math.random() * 25 + 1);
        b = Math.floor(Math.random() * 25 + 1);
        result.text = a + " + " + b;
        result.answer = a + b;
    } else if (questionDifficulty === 3){
        a = Math.floor(Math.random() * 50 + 1);
        b = Math.floor(Math.random() * 50 + 1);
        c = Math.floor(Math.random() * 50 + 1);
        result.text = a + " + " + b + " + " + c;
        result.answer = a + b + c;
    } else if (questionDifficulty === 4){
        a = Math.floor(Math.random() * 100 + 1);
        b = Math.floor(Math.random() * 10 + 1);
        c = Math.floor(Math.random() * 50 + 1);
        result.text = "(" + a + " * " + b + ") + " + c;
        result.answer = (a * b) + c;
    } else if (questionDifficulty === 5){
        a = Math.floor(Math.random() * 50 + 1);
        b = Math.floor(Math.random() * 25 + 1);
        c = Math.floor(Math.random() * 500 + 1);
        result.text = "(" + a + " * " + b + ") + " + c;
        result.answer = (a * b) + c;
    } 
    result.answer = result.answer.toString();
    return result;
}

