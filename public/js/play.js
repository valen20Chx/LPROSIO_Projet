var socket = io('/player');
let isVip = false;
// DOM Elements
var submit_connect = document.getElementById('connect-submit');
var txt_username = document.getElementById('txt-username');
var txt_roomcode = document.getElementById('txt-room-code');
var err_msg = document.getElementById('err-msg');

var gameContainer = document.querySelector('div#game-container');

submit_connect.addEventListener('click', (ev) => {
    if(txt_username.value === '') {
        err_msg.style.display = "block";
        err_msg.innerText = 'Username is empty';
        return;
    } else if(txt_roomcode.value === '') {
        err_msg.style.display = "block";
        err_msg.innerText = 'Room Code is empty';
    } else {
        // Connect
        socket.emit('playerConnect', {
            username: txt_username.value,
            roomCode: txt_roomcode.value
        });

        socket.on('playerConnect-ok', (args) => {
            isVip = args.isVip;

            clearGameContainer();

            if(isVip) {
                let startBtn = document.createElement('button');
                startBtn.classList('start-button');
                startBtn.innerText = 'Start game';
                startBtn.addEventListener('click', () => {
                    socket.emit('player-startGame');
                });
            }
        });

        socket.on('playerConnect-error', (args) => {
            // Error
            console.log(args.msg);
        });
    }
});

socket.on('player-uploadPage', (args) => {
    clearGameContainer();

    let submitBtn = document.createElement('button');
    submitBtn.classList.add('image-submit-button');
    submitBtn.id = 'image-submit';
    submitBtn.value = 'Submit'

    for (let index = 0; index < args.nbPhotos; index++) {
        let newInputImage = document.createElement('input');
        newInputImage.type = 'file';
        newInputImage.classList.add('input-image');


        gameContainer.append(newInputImage);
    }

    gameContainer.append(submitBtn);

    submitBtn.addEventListener('click', () => {
        if(() => {
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            let valid = false;
            document.querySelector('.input-image').forEach(element => {
                if(element.value = '') {
                    valid = true;
                } else if(!validImageTypes.includes(element['type'])) {
                    valid = true
                }
            });
            return valid;
        }) { // If input 'array' is valid
            let imageDataArray = [];
            document.querySelector('.input-image').forEach(element => {
                getBase64(element.value, (imageData) => {
                    imageDataArray.push(imageData);
                });
            });
            socket.emit('player-upload-images', {
                photos: imageDataArray
            });
        } else { // Input 'array' is not valid (not full or wrong file type)
            // TODO : ERROR MESSAGE
        }
    });
});

// Je joueur a envoyer toutes ses photos et attand que les autre le fasse
socket.on('player-upload-images-ok', () => {
    clearGameContainer();

    let waitTxt = document.createElement('p');

    waitTxt.innerText = 'Veuillez patienter que tout les joueurs envoient leurs images';

    waitTxt.classList.add('wait-text');

    gameContainer.append(waitTxt);
});

socket.on('player-make-story', (args) => { // TODO : Verify (RISKY)
    let compositionIndex = [];
    let composition = [];
    for (let index = 0; index < args.images.length; index++) {
        const element = args.images[index];

        let newImg = document.createElement('img');
        newImg.className.add('image-play');
        newImg.src = element;

        newImg.addEventListener('click', () => {
            if(newImg.className == 'image-play') {
                compositionIndex.push(composition.indexOf(newImg));
                newImg.className = 'image-played';
            } else if(newImg.className == 'image-played') {
                compositionIndex.splice(composition.indexOf(newImg));
                newImg.className = 'image-play';
            }
        });

        let submitBtn = document.createElement('button');
        submitBtn.classList.add('composition-submit');
        submitBtn.value = 'Submit';

        submitBtn.addEventListener('click', () => {
            if(compositionIndex.length >= args.compoMinSize) {
                let compoIds = [];
                for (let index = 0; index < compositionIndex.length; index++) {
                    compoIds.push(args.imagesId[compositionIndex[index]]);
                }
                socket.emit('player-upload-compo', {
                    images: compoIds
                });
            }
        });

        composition.push(newImg);
        gameContainer.append(newImg);
    }
});

socket.on('player-upload-compo-ok', () => {
    clearGameContainer();

    let waitTxt = document.createElement('p');

    waitTxt.innerText = 'Veuillez patienter que tout les joueurs envoient leurs composition';

    waitTxt.classList.add('wait-text');

    gameContainer.append(waitTxt);
});

socket.on('player-vote-screen', (args) => {
    clearGameContainer();

    for (let index = 0; index < args.players.length; index++) {
        let voteDiv = document.createElement('div');
        let newVotePlayer = document.createElement('p');
        let newVoteTitle = document.createElement('p');

        newVotePlayer.classList.add('vote-player');
        newVoteTitle.classList.add('vote-title');

        newVotePlayer.value = args.players[index];
        newVoteTitle.value = args.titles[index];

        voteDiv.append(newVotePlayer);
        voteDiv.append(newVoteTitle);

        voteDiv.addEventListener('click', () => {
            socket.emit('player-vote', {
                player: newVotePlayer.value
            });
            clearGameContainer();
        });
        gameContainer.append(voteDiv);
    }
});

socket.on('player-vote-ok', () => {
    clearGameContainer();

    let waitTxt = document.createElement('p');

    waitTxt.innerText = 'Veuillez patienter que tout les joueurs votent';

    gameContainer.append(waitTxt);

});

// Utilitees
function clearGameContainer() {
    gameContainer.children.forEach(element => {
        element.remove();
    });
}