const state = {
    view:{
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },

    values:{
        
        gameVelocity: 600,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
    },

    actions: {
        timerId: setInterval(randomSquare, 600),
        countDownTimerId: setInterval(countDown, 1000),
    },
};

function playSound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.12;
    audio.play();
}

function countDown() {
    state.values.currentTime --;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime === 0) {

        if(state.values.result === 0) {
            clearInterval(state.actions.countDownTimerId)
            clearInterval(state.actions.timerId)
            clearInterval(state.values.hitPosition = null)
            playSound("fail");
        } else {
        clearInterval(state.actions.countDownTimerId)
        clearInterval(state.actions.timerId)
        clearInterval(state.values.hitPosition = null)
        playSound("gameover");
        }        
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitbox(){
    state.view.squares.forEach((square) =>{
        square.addEventListener("mousedown", () =>  {
            if(square.id === state.values.hitPosition){
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null
                playSound("hit");
            } else {
                playSound("wronghit");
            }
        });
    });
}

function initialize(){
    alert("Bem vindo! aperte (ok) para começar!")
    addListenerHitbox();
}

initialize();