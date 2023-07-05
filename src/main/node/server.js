'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

const FIELD_WIDTH = 3000, FIELD_HEIGHT = 3000;
class Player {
    constructor(obj = {}) {
        this.id = Math.floor(Math.random() * 1000000000);
        this.width = 80;
        this.height = 80;
        this.x = this.width;
        this.y = this.height;
        this.angle = 0;
        this.movement = {};
        this.name = obj.name;
        this.socketId = obj.socketId;
    }
    move(r, l, u, d) {
        this.x += r - l;
        this.y += u - d;
    }
};

let players = {};

io.on('connection', function (socket) {
    let player = null;
    socket.on('game-start', (config) => {
        player = new Player({
            socketId: socket.id,
            name: config.name,
        });
        players[player.id] = player;
    });
    socket.on('movement', function (movement) {
        if (!player) { return; }
        player.movement = movement;
    });
    socket.on('disconnect', () => {
        if (!player) { return; }
        delete players[player.id];
        player = null;
    });
});

setInterval(function () {
    Object.values(players).forEach((player) => {
        const movement = player.movement;
        if (movement.forward) {
            player.move(0, 0, 0, 5);
        }
        if (movement.back) {
            player.move(0, 0, 5, 0);
        }
        if (movement.left) {
            player.move(0, 5, 0, 0);
        }
        if (movement.right) {
            player.move(5, 0, 0, 0);
        }
    });
    io.sockets.emit('state', players);
}, 1000 / 30);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/static/index.html'));
});

server.listen(3000, function () {
    console.log('Starting server on port 3000');
});