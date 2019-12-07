var gameContainer = document.getElementById('game-container');
var socket = io();

const game_states = {
    NONE: "none",
    LOBBY: "lobby",
    PLAYING: "playing"
};

const MAX_PLAYER = 8; // CAN CHANGE

var player_list = [];

var game_state = game_states.NONE;

// Server calls
socket.on('init', init_funct);
socket.on('add-player', (args) => {
    add_player(args);
});

function init_funct(args) {
    // INIT GAME AND ENTER LOBBY

    game_state = game_states.LOBBY;

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
        document.getElementById('game-container').remove();

        // TODO: Start Game
    } else {
        console.log('Error startGame: Can\'t start game when not in lobby');
    }
}


// TEST THE METHODS

init_funct({a: 0});

// add_player({name: 'valen20'});