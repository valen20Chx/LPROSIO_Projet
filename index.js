const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
	console.log(`listening on *:${port}`);
});

var firebaseMod = new require('./firebase');
var firebase = new firebaseMod("./lprosio-projet-firebase-adminsdk-fk5af-4e315c4f6e.json");

// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.statusCode = 200;
//     res.sendFile(__dirname + '/public' + '/index.html');
// });

//////////////////////
//    Socket.io
//////////////////////

const socket_types = {
	PLAYER: 1,
	GAME_HOST: 2,
	NONE: 0
};

const MAX_PLAYERS = 8;

io.on('connection', (socket) => { // Pour le client
	console.log('New connection: ' + socket.id);
	socket.on('disconnect', () => {
		console.log('New disconnection: ') + socket.id;
	});
});

// GAME HOST HERE
io.of('/host').on('connection', (socket) => {

	// Game Host asks for new code to create a new Game
	socket.on('getRoomCode', () => {
		var code = creatRoomCode();
		console.log('Creating Room: ' + code);
		// TODO: Recuperer un nouveau code (DB)
		var obj = {
			roomCode: code
		};
		socket.emit('init', obj);
		socket.roomCode = code;
		socket.join(code);
		socket.type = socket_types.GAME_HOST;

		// Socket Variables
		socket.nbPlayers = 0;
		socket.nbVotes = 0;
		socket.nbUploads = 0;
		socket.nbCompo = 0;

		socket.emit('game-launched', {roomCode: code});
	});

	// Game Host asks for new theme
	socket.join(socket.roomCode);

	socket.on('getTheme', ()=> {

		let theme = 'Exemple'; // TODO : Find current stage of game for the room
		let stage = 1; // TODO: Generate Theme

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
	});

	// Game host tells that they displayed the task
	socket.on('consigneDisplayed', () => {
		const taskTime = 3 * 60 * 1000;
		setTimeout(newPresentation, taskTime);
	});

	function newPresentation() {
		let presPlayer; // TODO : choose a random player in game
		let presImages; // TODO : Get Images from ressources

		const presTime = (1 * 60 * 1000) + (30 * 1000);

		socket.emit('presentation', {
			playerName: presPlayer,
			images: presImages
		});

		setTimeout(() => {
			if(true) { // TODO: check if there is a player left to present
				newPresentation();
			} else {
				socket.emit('end-presentation');
				socket.emit('vote-screen');
			}
		}, presTime);
	}
});


//// PLAYER HERE
io.of('/player').on('connection', (socket)  => {
	
	socket.on('playerConnect', (args) => {
		// TODO: Verify if room exist
		if(MAX_PLAYERS > io.of('/host').in(socket.roomCode).nbPlayers) {
			// TODO: Enregistre joueur
			socket.type = socket_types.PLAYER;
			socket.roomCode = args.roomCode;
			socket.playerName = args.username;

			io.of('/host').in(socket.roomCode).emit('add-player', socket.playerName);

			socket.emit('playerConnect-ok', {
				isVIP: (io.of('/host').in(socket.roomCode).nbPlayers == 0 ? true : false)
			});
		} else {
			socket.emit('playerConnect-error', {
				msg: "Wrong arguments"
			});
		}
	});

	socket.on('player-startGame', () => {
		io.of('/host').in(socket.roomCode).emit('startGame', socket.roomCode);
	});

	socket.on('player-upload-images', (args) => {
		args.photos.forEach(element => {
			// TODO : Save element (image) is ressource
		});

		if(io.of('/host').in(socket.roomCode).nbUploads >= io.of('/host').in(socket.roomCode).nbPlayers) {
			// TODO : Mix photos


			io.of('/host').in(socket.roomCode).emit('photoUploadCompleted');
			io.of('/host').in(socket.roomCode).nbUploads = 0;

			let servCount = 0;

			io.of('/player').in(socket.roomCode).clients.forEach(element => {
				const cliSock = io.to(element.id);

				let imagesDataArray = [];
				let imagesDataArrayId = [];
				
				let playername = cliSock.playerName;

				// TODO : Serve Images (Compo get)

				cliSock.emit('player-make-story', {
					images: imagesDataArray,
					imagesId: imagesDataArrayId
				});

				serveCount++;
			});
		}

		socket.emit('player-upload-images-ok');
	});

	socket.on('player-upload-compo', (args) => {
		args.images.forEach(element => {
			// TODO: add element (photo id) to DB as composition
		});

		if(io.of('/host').in(socket.roomCode).nbCompo >= io.of('/host').in(socket.roomCode).nbPlayers) {
			io.of('/host').in(socket.roomCode).emit('presentation');
			io.of('/host').in(socket.roomCode).nbCompo = 0;
		}

		socket.emit('player-upload-compo-ok');
	});

	socket.on('player-vote', (args) => {
		// TODO : vote for args.player in DB

		io.of('/host').in(socket.roomCode).emit('player-vote', {
			player: socket.playerName
		});

		// TODO : Verify if everyone has voted

		if(io.of('/host').in(socket.roomCode).nbVotes >= io.of('/host').in(socket.roomCode).nbPlayers) {
			io.of('/host').in(socket.roomCode).emit('vote-finished');
			io.of('/host').in(socket.roomCode).nbVotes = 0;
		}

		socket.emit('player-vote-ok')
	});
});
