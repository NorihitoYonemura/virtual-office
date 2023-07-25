'use strict';

const socket = io();
const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');
const officeMap = $('#office-map')[0];
let movement = {};


function gameStart() {
    let inputName = prompt("ユーザー名を入力してください", "");
    let inputIconNum = prompt("使用したいアイコンの番号(半角数字)を入力してください。\n1:ヤドキング\n2:クサイハナ\n3:ベロリンガ\n4:モンジャラ\n5:クラウド", "");
    socket.emit('game-start', { name: inputName, iconNum: inputIconNum });
}

$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
        'ArrowUp': 'forward',
        'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if (command) {
        if (event.type === 'keydown') {
            movement[command] = true;
        } else { /* keyup */
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
});

socket.on('state', (players, bullets, walls) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.beginPath();
    // context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();

    Object.values(players).forEach((player) => {
        const key4PlayerImage = '#player-image' + player.iconNum;
        const playerImage = $(key4PlayerImage)[0];
        context.drawImage(playerImage, player.x, player.y, 30, 40);
        context.font = '15px Bold Arial';
        context.fillText(player.name, player.x, player.y - 5);
        if (player.message) {
            context.font = '30px Bold Arial';
            context.fillText(player.message, player.x, player.y - 20);
        }

        //        console.log(player.msg);
        //        if(player.msg == 'undefined'){
        //        context.fillText(player.msg, player.x -10, player.y - 10);
        //        }
    });
});

// 自分を含む全員宛にメッセージを送信
$("#sendMessageBtn").click(function () {
    // メッセージの内容を取得し、その後フォームをクリア
    var message = $("#messageForm").val();
    // クライアントからサーバーへ送信
    socket.emit('message', message);
    $("#messageForm").val("");
});

socket.on('message', function (msg) {
    $("#messageView").append("<div>" + msg + "</div>");
});


socket.on('connect', gameStart);