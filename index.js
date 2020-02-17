const express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

// const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
	console.log(`listening on *:${port}`);
});

let firebaseMod = new require('./firebase');
let firebase = new firebaseMod("./lprosio-projet-firebase-adminsdk-fk5af-4e315c4f6e.json");

let themeArray = [
	"Medieval",
	"Fantastique",
	"Science-Fiction",
	"Horreur",
	"Erotique",
	"Policier",
	"Romantique",
	"Gangster",
	"Tragique"
];

//////////////////////
//    Socket.io
//////////////////////

const socket_types = {
	PLAYER: 1,
	GAME_HOST: 2,
	NONE: 0
};

let gameHosts = new Map();

const MAX_PLAYERS = 8;

const MAX_STAGES = 3;

io.on('connection', (socket) => { // Pour le client
	console.log('New connection: ' + socket.id);
	socket.on('disconnect', () => {
		console.log('New disconnection: ') + socket.id;
	});
});

// GAME HOST HERE
io.of('/host').on('connection', (socket) => {
	console.log('New Game Host: ' + socket.id);
	socket.on('disconnect', () => {
		console.log('Game Host disconnection: ') + socket.id;

		// TODO : remove in DB and FS
		// firebase.deleteParti(socket.roomCode);
		// firebase.deleteDIR(socket.roomCode);
	});
	// Game Host asks for new code to create a new Game
	socket.on('getRoomCode', () => {
		firebase.getNewRoomCode((code) => {

			console.log('Creating Room: ' + code);

			socket.emit('init', {
				roomCode : code
			});

			socket.roomCode = code;
			socket.join(code);
			socket.type = socket_types.GAME_HOST;

			// Socket Variables
			socket.nbPlayers = 0;
			socket.nbVotes = 0;
			socket.nbUploads = 0;
			socket.nbCompo = 0;
			socket.nbPres = 0;
			socket.stage = 0;

			gameHosts.set(code, {
				socket: socket,
				roomCode: code,
				id: socket.id,
				players: new Map()
			});
			firebase.createDIR(socket.roomCode);
		});
	});

	// Game Host asks for new theme
	socket.join(socket.roomCode);

	socket.on('getTheme', () => {

		let theme = themeArray[Math.floor(Math.random() * themeArray.length)];
		let stage = 1;

		socket.emit('getThemeRes', {
			theme: theme,
			stage: stage
		});
	});

	// Game host tells that they displayed the theme
	socket.on('themeDisplayed', () => {
		const uploadTime = 3 * 60 * 1000;
		setTimeout(() => {
			socket.emit('photoUploadCompleted');
		}, uploadTime);

		io.of('/player').in(socket.roomCode).emit('player-uploadPage', {
			nbPhotos: 5
		});
		socket.nbUploads = 0;
	});

	// Game host tells that they displayed the task
	socket.on('consigneDisplayed', () => {
		const taskTime = 3 * 60 * 1000;
		setTimeout(newPresentation, taskTime);
	});
	
	function newPresentation() {

		firebase.getAllPlayer(socket.roomCode, (data) => {

			let presPlayer;
			let presImages = [];

			let foundGoodPlayer = false;
			while(!foundGoodPlayer) {
				presPlayer = data[Math.floor(Math.random() * data.length)];

				if(presPlayer.hasPres == false) {
					foundGoodPlayer = true;
				}
			}
			firebase.getCompo(socket.roomCode, socket.playername, 'Chosen', (data) => {
				data.forEach(element => {
					firebase.readFileImg(socket.roomCode, element, (data) => {
						presImage.push(data);
					});
				});
			
				const presTime = (1 * 60 * 1000) + (30 * 1000);

				socket.emit('presentation', {
					playerName: presPlayer,
					images: presImages
				});

				setTimeout(() => {
					if(socket.nbPres >= socket.nbPlayers) {
						newPresentation();
					} else {
						socket.emit('end-presentation');
						socket.emit('vote-screen');
					}
				}, presTime);
			});

			socket.nbPres++;
		});
	}
});


//// PLAYER HERE
io.of('/player').on('connection', (socket)  => {
	console.log('New Player : ' + socket.id);
	socket.on('disconnect', () => {
		console.log('Player disconnection: ') + socket.id;
	});
	
	socket.on('playerConnect', (args) => {
		firebase.partieExist(args.roomCode, (data) => {
			if(data) {
				if(gameHosts.get(args.roomCode).socket.nbPlayers < MAX_PLAYERS) {

					firebase.setJoueur(args.roomCode, args.username, {
						nom : args.username,
						points : 0,
						id : gameHosts.get(args.roomCode).socket.nbPlayers + 1,
						hasPres: false
					});

					socket.type = socket_types.PLAYER;
					socket.roomCode = args.roomCode;
					socket.playerName = args.username;

					socket.join(socket.roomCode);
					gameHosts.get(socket.roomCode).players.set(socket.playerName, {
						socket: socket,
					});

					io.of('/host').in(socket.roomCode).emit('add-player', {name: socket.playerName});

					socket.emit('playerConnect-ok', {
						isVip: (gameHosts.get(socket.roomCode).socket.nbPlayers == 0 ? true : false)
					});

					gameHosts.get(socket.roomCode).socket.nbPlayers++;

				} else {
					socket.emit('playerConnect-error', {
						msg: "Game Full"
					});
				}
			} else {
				// Game Room dont Exist
				socket.emit('playerConnect-error', {
					msg: "Game Room doesnt exist"
				});
			}
		});
	});

	socket.on('player-startGame', () => {
		io.of('/host').in(socket.roomCode).emit('startGame', socket.roomCode);
	});

	socket.on('player-upload-images', (args) => {
		args.photos.forEach(element => {
			firebase.creatFileImg(roomCode, element);
		});

		gameHosts.get(socket.roomCode).socket.nbUploads++;

		if(gameHosts.get(socket.roomCode).socket.nbUploads >= gameHosts.get(socket.roomCode).socket.nbPlayers) {
			let arrIdImg = firebase.attribueIdImages(gameHosts.get(socket.roomCode).socket.nbPlayers, 5);
			firebase.distribueIdImage(socket.roomCode, arrIdImg, gameHosts.get(socket.roomCode).socket.nbPlayers, () => {
				io.of('/host').in(socket.roomCode).emit('photoUploadCompleted');
				gameHosts.get(socket.roomCode).socket.nbUploads = 0;
	
				let servCount = 0;
				// console.log(io.of('/player').in(socket.roomCode));
				gameHosts.get(socket.roomCode).players.forEach(element => {
					const cliSock = io.to(element.socket.id);
	
					let playername = element.socket.playerName;
					console.log('getCompo for ' + socket.roomCode + ' : ' + playername);
					firebase.getCompo(socket.roomCode, playername, 'Get', (compoGet) =>{
	
						let imagesDataArray = [];
						let imagesDataArrayId = [];
	
						compoGet.forEach(element => {
							readFileImg(socket.roomCode, element, (data) => {
								imagesDataArray.push(data);
							});
							imageDataArrayId.push(element);
						});
						
						cliSock.emit('player-make-story', {
							images: imagesDataArray,
							imagesId: imagesDataArrayId
						});
					});
				});
			});
		}
			
		socket.emit('player-upload-images-ok');
	});

	socket.on('player-upload-compo', (args) => {

		firebase.set_CompoChosen(socket.roomCode, socket.playerName, args.images);
		firebase.set_Titre(socket.roomCode, socket.playerName, args.title);

		gameHosts.get(socket.roomCode).socket.nbCompo++;

		if(gameHosts.get(socket.roomCode).socket.nbCompo >= gameHosts.get(socket.roomCode).socket.nbPlayers) {
			o.of('/host').in(socket.roomCode).emit('presentation');
			gameHosts.get(socket.roomCode).socket.nbCompo = 0;
		}

		socket.emit('player-upload-compo-ok');
	});

	socket.on('player-vote', (args) => {
		addPoint(socket.roomCode, args.playername, 100 * gameHosts.get(socket.roomCode).socket.stage);
		o.of('/host').in(socket.roomCode).emit('player-vote', {
			player: socket.playerName
		});

		gameHosts.get(socket.roomCode).socket.nbVotes++;

		if(gameHosts.get(socket.roomCode).socket.nbVotes >= gameHosts.get(socket.roomCode).socket.nbPlayers) {
			o.of('/host').in(socket.roomCode).emit('vote-finished');
			gameHosts.get(socket.roomCode).socket.nbVotes = 0;
			gameHosts.get(socket.roomCode).socket.stage++;
		}

		socket.emit('player-vote-ok');
	});
});
