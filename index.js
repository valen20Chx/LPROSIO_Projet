const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var firebase = require('firebase');

// const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
    console.log(`listening on *:${3000}`);
});

// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.statusCode = 200;
//     res.sendFile(__dirname + '/public' + '/index.html');
// });

//////////////////////
//    Firebase
//////////////////////

var firebase_app = firebase.initializeApp({
    apiKey: 'AIzaSyDynJXJrx-4loDRF3z3yx_g9_Ku0xI0AZc',
    authDomain: '<your-auth-domain>',
    databaseURL: 'https://lprosio-projet.firebaseio.com',
    projectId: 'lprosio-projet',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-sender-id>'
});

//////////////////////
//    Socket.io
//////////////////////

io.on('connection', (socket) => { // Pour le client
    console.log('New connection: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('New disconnection: ') + socket.id;
    });
    socket.on('getRoomCode', () => {
        var code = '0000';
        console.log('Creating Room: ' + code);
        // TODO: Recuperer un nouveau code (DB)
        var obj = {
            roomCode: code
        };
        socket.emit('init', obj);
    });
});