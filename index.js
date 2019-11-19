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

// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.statusCode = 200;
//     res.sendFile(__dirname + '/public' + '/index.html');
// });

//////////////////////
//    Socket.io
//////////////////////

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('disconnect', () => {
        console.log('New disconnection');
    });
});
