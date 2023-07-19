'use strict';

const socket = io();
const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');
const playerImage = $('#player-image')[0];
const officeMap = $('#office-map')[0];
let movement = {};


function gameStart(){
    socket.emit('game-start');
}

$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
        'ArrowUp': 'forward',
        'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if(command){
        if(event.type === 'keydown'){
            movement[command] = true;
        }else{ /* keyup */
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
});

socket.on('state', (players, bullets, walls) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.beginPath();
//    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();

    Object.values(players).forEach((player) => {
        context.drawImage(playerImage, player.x, player.y,30,40);
        context.font = '15px Bold Arial';
        context.fillText('朝日', player.x, player.y - 5);
    });
});

// 自分を含む全員宛にメッセージを送信
$("#sendMessageBtn").click( function() {
    // メッセージの内容を取得し、その後フォームをクリア
    var message = $("#messageForm").val();
    // クライアントからサーバーへ送信
    socket.emit('message', message);
    $("#messageForm").val("");
    });

socket.on('message', function(msg){
    console.log("aaad2");
    $("#messageView").append( "<div>" + msg + "</div>" );
});

socket.on('connect', gameStart);