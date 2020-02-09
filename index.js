const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
	console.log(`listening on *:${3000}`);
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

io.on('connection', (socket) => { // Pour le client
	console.log('New connection: ' + socket.id);
	socket.on('disconnect', () => {
		console.log('New disconnection: ') + socket.id;
	});
	socket.on('getRoomCode', () => {
		var code = creatRoomCode();
		console.log('Creating Room: ' + code);
		// TODO: Recuperer un nouveau code (DB)
		var obj = {
			roomCode: code
		};
		socket.emit('init', obj);
	});
});