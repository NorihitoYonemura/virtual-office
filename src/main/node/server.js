'use strict';

const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

const FIELD_WIDTH = 3000, FIELD_HEIGHT = 3000;

class Player{
    constructor(obj={}){
        this.id = Math.floor(Math.random()*1000000000);
        this.width = 80;
        this.height = 80;
        this.x = this.width;
        this.y = this.height;
        this.angle = 0;
        this.movement = {};
    }
    move(r,l,u,d){
        this.x += r-l;
        this.y += u-d;
    }
};

let players = {};

io.on('connection', function(socket) {
    let player = null;
    socket.on('game-start', (config) => {
        player = new Player({
            socketId: socket.id,
        });
        players[player.id] = player;
    });
    socket.on('movement', function(movement) {
        if(!player){return;}
        player.movement = movement;
    });
    socket.on('disconnect', () => {
        if(!player){return;}
        delete players[player.id];
        player = null;
    });
});

setInterval(function() {
    Object.values(players).forEach((player) => {
        const movement = player.movement;
        if(movement.forward){
            player.move(0,0,0,10);
        }
        if(movement.back){
            player.move(0,0,10,0);
        }
        if(movement.left){
            player.move(0,10,0,0);
        }
        if(movement.right){
            player.move(10,0,0,0);
        }
    });
    io.sockets.emit('state', players);
}, 1000/30);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/display', (request, response) => {
   const filePath = request.query.filePath; // クエリパラメータから背景画像のパスを取得
   console.log(filePath);
   response.render('display', { filePath: filePath });
});

app.get('/background', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/index2.html'));
});

// multerの設定
const upload = multer({
  dest: 'static/uploads/', // アップロード先のディレクトリを指定
});

app.post('/background2',upload.single('file'),(request, response) => {
　 const uploadedFile = request.file; // アップロードされたファイルの情報
   console.log(uploadedFile);
   // アップロードされたファイルのパスを取得
   const filePath = `/uploads/${uploadedFile.filename}`;
   // リダイレクトにより、背景画像が反映される画面に遷移する
   response.redirect(`/display?filePath=${encodeURIComponent(filePath)}`);
   // response.send('ファイルがアップロードされました');
});

server.listen(3000, function() {
  console.log('Starting server on port 3000');
});