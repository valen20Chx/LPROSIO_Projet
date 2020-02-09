var socket = io();

var gameContainer = document.getElementById('game-container');
var initButton = document.getElementById('init-button');
var initContainer = document.getElementById('init-container');
var loadingContainer = document.getElementById('loading-container');

const game_states = {
    NONE: "none",
    LOBBY: "lobby",
    PLAYING: "playing"
};

const MAX_PLAYER = 8; // CAN CHANGE

var player_list = [];

var game_state = game_states.NONE;

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

initButton.onclick = () => {
    // TODO: Request Game Code
    socket.emit('getRoomCode');
};

socket.on('getRoomCodeRes', (args) => { // TODO: Do serverSide
    roomCode = args.roomCode;
    init_funct({
        roomCode: args.roomCode
    });
});

function init_funct(args) {
    // INIT GAME AND ENTER LOBBY
    var roomCode = args.roomCode;
    game_state = game_states.LOBBY;

    gameContainer.style.display = 'inline';
    initContainer.style.display = 'none';

    var roomCodeEle = document.createElement('p');
    roomCodeEle.classList.add('roomCode');
    roomCodeEle.innerText = roomCode;
    gameContainer.append(roomCodeEle);

    var player_list_ele = document.createElement('li');
    player_list_ele.classList.add('player-list');
    for(let i = 0; i < MAX_PLAYER; i++) {
        // Create Empty Slot
        var player_ele = document.createElement('div');

        var player_image_ele = document.createElement('img');
        player_image_ele.classList.add('player-img');
        player_image_ele.src = '/res/img/Empty-Player_QM.png';
        player_image_ele.style.background = `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%)`;

        var player_name_ele = document.createElement('p');
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

            var player_img_ele = document.getElementsByClassName('player-img').item(player_list.length - 1);
            var player_name_ele = document.getElementsByClassName('player-name').item(player_list.length - 1);

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
        socket.emit('getTheme', {roomCode: roomCode});

    } else {
        console.log('Error startGame: Can\'t start game when not in lobby');
    }
}

socket.on('getThemeRes', (args) => {
    clearGameContainer();
    var stageTxt = document.createElement('p')
    stageTxt.classList.add('gmae-stage');
    stageTxt.innerText = 'Stage ' + args.stage;
    gameContainer.append(stageTxt);

    var themeTxt = document.createElement('p');
    themeTxt.classList.add('theme-name'); // TODO : ADD in stylesheet
    themeTxt.innerText = args.theme;
    gameContainer.append(themeTxt);
    
    var hintTxt = document.createElement('p');
    hintTxt.classList.add('theme-hint'); // TODO : ADD in stylesheet
    hintTxt.innerText = 'Envoyez des photos ayant un rapport avec le theme.';
    gameContainer.append(hintTxt);

    socket.emit('themeDisplayed', {roomCode: roomCode});
});

socket.on('photoUploadCompleted', (args) => {
    clearGameContainer();
    // Redistribution des photos (ServerSide)
    var consigneEle = document.createElement('p');
    consigneEle.classList.add('consigne');
    consigneEle.innerText = 'Rearengez les photos recu pour faire une histoire';
    gameContainer.append(consigneEle);

    socket.emit('consigneDisplayed', {roomCode: roomCode});
});


// https://stackoverflow.com/questions/26331787/socket-io-node-js-simple-example-to-send-image-files-from-server-to-client
socket.on('presentation', (args) => {
    clearGameContainer();

    var playerNameEle = document.createElement('p');
    playerNameEle.classList.add('presentation-player-name');
    playerNameEle.innerText = args.playerName;
    gameContainer.append(playerNameEle);

    var photoArray = [];
    for(let i = 0; i < args.photos; i++) {
        let tempCanvas = document.createElement('canvas');
        let tempCavasCtx = tempCanvas.getContext('2d');
        let tempPhoto = new Image();
        tempPhoto.src = 'data:image/jpeg;base64,' + args.photos[i].buffer;
        tempCavasCtx.drawImage(tempPhoto, 0, 0);

        photoArray.push(tempCanvas);

        gameContainer.append(photoArray[i]);
    }
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
    var gameOverParagraph = document.createElement('p');
    gameOverParagraph.innerText = "Game Over.";
    gameOverParagraph.style.fontSize = "50px";
    gameOverParagraph.style.fontWeight = "bold";
    gameOverParagraph.style.fontFamily = "Monospace";
    document.body.appendChild(gameOverParagraph);
}

// TEST THE METHODS

// init_funct({a: 0});

// add_player({name: 'valen20'});