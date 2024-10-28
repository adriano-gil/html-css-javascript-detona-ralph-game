const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        startButton: document.querySelector(".start-game"), // Seleciona o botão de início
        livesLeft: document.querySelector("#lives-left"),
    },

    values: {
        gameVelocity: 600,
        hitPosition: null,
        result: 0,
        currentTime: 60,
        delay: 1000,
        currentLives: 5,
    },

    actions: {
        timerId: null, // Inicializa como null
        countDownTimerId: null, // Inicializa como null
    },
};

// Função para tocar o som
function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.12;
    audio.play();
}

// Função para fazer a contagem regressiva
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime === 0) {
        clearInterval(state.actions.countDownTimerId); // Para o temporizador de contagem regressiva
        clearInterval(state.actions.timerId); // Para o temporizador de mudança de quadrados
        disableHitboxes(); // Desativa os eventos de clique nos quadrados
        playSound(state.values.result === 0 ? "fail" : "gameover"); // Toca o som apropriado
    }
}

// Função para selecionar um quadrado aleatório
function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy"); // Remove a classe de inimigo de todos os quadrados
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy"); // Adiciona a classe de inimigo ao quadrado aleatório
    state.values.hitPosition = randomSquare.id; // Atualiza a posição do hit
}

// Função para adicionar o listener aos quadrados
function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.removeEventListener("mousedown", hitHandler); // Remove listeners existentes para evitar duplicação
        square.addEventListener("mousedown", hitHandler); // Adiciona o listener ao quadrado
    });
}

// Função para lidar com o hit
function hitHandler(event) {
    const square = event.currentTarget; // Obtém o quadrado atual
    if (square.id === state.values.hitPosition) {
        state.values.result++;  //Aumenta o ponto
        state.view.score.textContent = state.values.result; // Atualiza o placar
        state.values.hitPosition = null; // Reseta a posição do hit
        playSound("hit");
    } else {
        state.values.currentLives--; //Diminui 1 vida
        state.view.livesLeft.textContent = state.values.currentLives; //Atualiza a quantidade de vida
        playSound("wronghit");

        // Verifica se as vidas chegaram a 0
        if (state.values.currentLives <= 0) {
            clearInterval(state.actions.timerId); // Para o temporizador de mudança de quadrados
            clearInterval(state.actions.countDownTimerId); // Para o temporizador de contagem regressiva
            disableHitboxes(); // Desativa os eventos de clique nos quadrados
            playSound("gameover"); // Toca o som de game over
        }
    }
}

// Função para desativar os quadrados
function disableHitboxes() {
    state.view.squares.forEach((square) => {
        square.removeEventListener("mousedown", hitHandler); // Remove o listener de hit
    });
}

// Função para inicializar o jogo
function initialize() {
    state.values.result = 0; // Reseta a pontuação
    state.values.currentTime = 60; // Reseta o tempo
    state.values.currentLives = 5;
    state.view.score.textContent = state.values.result; // Atualiza o placar
    state.view.timeLeft.textContent = state.values.currentTime; // Atualiza o tempo
    state.view.livesLeft.textContent = state.values.currentLives; //Atualiza a vida

    clearInterval(state.actions.timerId); // Limpa temporizadores anteriores
    clearInterval(state.actions.countDownTimerId); // Limpa temporizadores de contagem regressiva

    // Remove a classe "enemy" de todos os quadrados
    state.view.squares.forEach(square => square.classList.remove("enemy"));

    addListenerHitbox(); // Adiciona o listener para os quadrados
}

// Função para iniciar o jogo
function startGame() {
    initialize(); // Inicializa o jogo
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity); // Inicia o intervalo para quadrados
    state.actions.countDownTimerId = setInterval(countDown, state.values.delay); // Inicia o intervalo da contagem regressiva

    
}

// Adiciona o listener ao botão de "NEW GAME"
state.view.startButton.addEventListener("click", startGame); // Chama a função startGame ao clicar no botão