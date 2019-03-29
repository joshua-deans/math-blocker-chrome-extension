let currentUrl = window.location.href;
let numQuestions = 1;
let currQuestion = 1;
let questionDifficulty = 1;

// eslint-disable-next-line no-undef
chrome.storage.sync.get(['siteList', 'questionDifficulty', 'numQuestions'], (result) => {
    if (result){
        console.log(result);
        if (result.numQuestions) {
            numQuestions = result.numQuestions;
        }
        if (result.questionDifficulty){
            questionDifficulty = result.questionDifficulty;
        }
        result.siteList.forEach((site) => {
            if (currentUrl.indexOf(site) !== -1){
                while (currQuestion <= numQuestions){
                    let question = generateQuestion(questionDifficulty);
                    console.log(question);
                    let answer = prompt(question.text + " (" + currQuestion + "/" + questionDifficulty + ")");
                    if (answer === question.answer){
                        currQuestion++;
                    }
                }
            }
        });
    }
});

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
    } else if (questionDifficulty === 6){
        a = Math.floor(Math.random() * 200 + 1);
        b = Math.floor(Math.random() * 100 + 1);
        c = Math.floor(Math.random() * 5000 + 1);
        result.text = "(" + a + " * " + b + ") + " + c;
        result.answer = (a * b) + c;
    }
    result.answer = result.answer.toString();
    return result;
}

