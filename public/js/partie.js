let socket = io('/host');

let gameContainer = document.getElementById('game-container');
let initButton = document.getElementById('init-button');
let initContainer = document.getElementById('init-container');
let loadingContainer = document.getElementById('loading-container');

const game_states = {
    NONE: "none",
    LOBBY: "lobby",
    PLAYING: "playing",
    VOTING: "voting"
};

const MAX_PLAYER = 8; // CAN CHANGE

let player_list = [];

let game_state = game_states.NONE;

let roomCode = null;

var roomCode = null;

// Server calls
socket.on('connect', () => {
    console.log(socket);
    connectionEstablished();
});

socket.on('init', init_funct);

socket.on('add-player', (args) => {
    add_player(args);
});

socket.on('startGame', startGame);

initButton.onclick = () => {
    socket.emit('getRoomCode');

    socket.on('game-launched', (args) => {
        roomCode = args.roomCode;
    });
};

socket.on('getRoomCodeRes', (args) => { // TODO: Do serverSide
    roomCode = args.roomCode;
    init_funct({
        roomCode: args.roomCode
    });
});

function init_funct(args) {
    // INIT GAME AND ENTER LOBBY
    let roomCode = args.roomCode;
    game_state = game_states.LOBBY;

    gameContainer.style.display = 'inline';
    initContainer.style.display = 'none';

    let roomCodeEle = document.createElement('p');
    roomCodeEle.classList.add('roomCode');
    roomCodeEle.innerText = roomCode;
    gameContainer.append(roomCodeEle);

    let player_list_ele = document.createElement('li');
    player_list_ele.classList.add('player-list');
    for(let i = 0; i < MAX_PLAYER; i++) {
        // Create Empty Slot
        let player_ele = document.createElement('div');

        let player_image_ele = document.createElement('img');
        player_image_ele.classList.add('player-img');
        player_image_ele.src = '/res/img/Empty-Player_QM.png';
        player_image_ele.style.background = `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%)`;

        let player_name_ele = document.createElement('p');
        player_name_ele.innerText = "Waiting...";
        player_name_ele.classList.add('player-name');

        player_list_ele.appendChild(player_ele);
        player_ele.appendChild(player_image_ele);
        player_ele.appendChild(player_name_ele);
        console.log('Test');
    }
    gameContainer.appendChild(player_list_ele);
}

function add_player(player) {
    if(game_state == game_states.LOBBY) {
        if(player_list.length < MAX_PLAYER) { // Correct amount of player
            player_list.push(player);

            let player_img_ele = document.getElementsByClassName('player-img').item(player_list.length - 1);
            let player_name_ele = document.getElementsByClassName('player-name').item(player_list.length - 1);

            player_name_ele.innerText = player.name;
            player_img_ele.style.background = `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(${(150 * ((player_list.length - 1) + 1) + ((player_list.length - 1) * 33)) % 256},${(200 * ((player_list.length - 1) + 1) + ((player_list.length - 1) * 33)) % 256},${(255 * ((player_list.length - 1) + 1) + ((player_list.length - 1) * 33)) % 256},1) 100%)`;
            player_img_ele.src = '/res/img/Empty-Player-Man.png';
        } else { // Adding more players than expected
            console.log('Error add_player: You cant add more player than MAX_PLAYER: ' + MAX_PLAYER);
        }
    } else { // Not in lobby
        console.log('Error add_player: You can only add players while in the game lobby');
    }
}

function startGame() {
    if(game_state == game_states.LOBBY) {
        game_state = game_states.PLAYING;

        // Start Game
        // TODO: Explications
        socket.emit('getTheme');

    } else {
        console.log('Error startGame: Can\'t start game when not in lobby');
    }
}

socket.on('getThemeRes', (args) => {
    clearGameContainer();
    let stageTxt = document.createElement('p');
    stageTxt.classList.add('gmae-stage');
    stageTxt.innerText = 'Stage ' + args.stage;
    gameContainer.append(stageTxt);

    let themeTxt = document.createElement('p');
    themeTxt.classList.add('theme-name'); // TODO : ADD in stylesheet
    themeTxt.innerText = args.theme;
    gameContainer.append(themeTxt);
    
    let hintTxt = document.createElement('p');
    hintTxt.classList.add('theme-hint'); // TODO : ADD in stylesheet
    hintTxt.innerText = 'Envoyez des photos ayant un rapport avec le theme.';
    gameContainer.append(hintTxt);
    socket.emit('themeDisplayed');
});

socket.on('photoUploadCompleted', () => {
    clearGameContainer();
    // Redistribution des photos (ServerSide)
    let consigneEle = document.createElement('p');
    consigneEle.classList.add('consigne');
    consigneEle.innerText = 'Rearengez les photos recu pour faire une histoire';
    gameContainer.append(consigneEle);
    socket.emit('consigneDisplayed');
});

socket.on('presentation', (args) => {
    clearGameContainer();

    let playerNameEle = document.createElement('p');
    playerNameEle.classList.add('story-player-name');
    playerNameEle.innerText = args.playerName;
    gameContainer.append(playerNameEle);

    const presDelay = 1000;

    window.setTimeout(() => {
        for(let i = 0; i < args.photos; i++) {
            let tempImg = document.createElement('img');
    
            tempImg.src = args.images[i]; // Add image data
    
            tempImg.classList.add('story-img');
    
            gameContainer.append(tempImg);
        }
    }, presDelay);

});

socket.on('end-presentation', () => {
    clearGameContainer();
});

socket.on('vote-screen', () => {
    clearGameContainer();
    game_state = game_states.VOTING;

    const voteTime = 60 * 1000;

    let voteTitle = document.createElement('p');
    voteTitle.classList.add('vote-title');
    voteTitle.innerText('Votez pour la meilleur histoire');

    let countdownEle = document.createElement('p');
    countdownEle.classList.add('vote-countdown');

    let timeCounter = 0;
    let countDownId = window.setInterval(() => {

        countdownEle.innerText = Math.floor((voteTime - (timeCounter * 1000)) / 1000);

        timeCounter++;
        if((timeCounter * 1000) > voteTime) {
            window.clearInterval(countDownId); // Removes Countdown
        }
    }, 1000);

    socket.on('vote-finished', () => {
        window.clearInterval(countDownId); // Removes Countdown
    });
    
    socket.on('player-vote', (data) => {
        if(game_state == game_states.VOTING) {
            // TODO : Player as voted
        } else {
            // ERROR
        }
    });
});

// TODO : Continue Here

function clearGameContainer() { // Clear the game container
    while(gameContainer.childElementCount > 0) { 
        gameContainer.removeChild(gameContainer.firstChild);
    }
}

function connectionEstablished() {
    loadingContainer.style.display = 'none';
    initContainer.style.display = 'inline';
}

function endGame() {
    game_state = game_states.NONE; // Reset game state
    while(gameContainer.childElementCount > 0) { // Clear the game container
        gameContainer.removeChild(gameContainer.firstChild);
    }
    gameContainer.style.display = 'none';
    loadingContainer.style.display = 'none';
    initContainer.style.display = 'none';
    let gameOverParagraph = document.createElement('p');
    gameOverParagraph.innerText = "Game Over.";
    gameOverParagraph.style.fontSize = "50px";
    gameOverParagraph.style.fontWeight = "bold";
    gameOverParagraph.style.fontFamily = "Monospace";
    document.body.appendChild(gameOverParagraph);
}

// TEST THE METHODS

// init_funct({a: 0});

// add_player({name: 'valen20'});