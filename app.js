var stompClient = null;

   class Circle{ //円クラス
    constructor(canvas,x,y,r){
      this.canvas = canvas;
      this.x = x;
      this.y = y;
      this.r = r;
      this.speed = 5;

      this.ArrowUp = this.ArrowDown = this.ArrowRight = this.ArrowLeft = false;
    }

    draw(){ //描画
      this.canvas.beginPath(); //パスの初期化
      this.canvas.fillStyle = this.color;
      this.canvas.drawImage(PEOPLE, this.x,this.y,80,80);
      this.canvas.closePath(); //パスを閉じる
      this.canvas.fill();
    }

    move(){ //動き
      if(this.ArrowUp && this.y-(this.r+this.speed)>=0){this.y -= this.speed;}
      if(this.ArrowDown && this.y+(this.r+this.speed)<=HEIGHT){this.y += this.speed;}
      if(this.ArrowRight && this.x+(this.r+this.speed)<=WIDTH){this.x += this.speed;}
      if(this.ArrowLeft && this.x-(this.r+this.speed)>=0){this.x -= this.speed;}
      console.log(this.x,this.y);
    }
  }

  const FRAME_RATE = 50; //フレームレート
  const TIMER_ID = window.setInterval(update,1000/FRAME_RATE); //ループ処理(フレーム数はFRAME_RATE)
  const WIDTH = 1000; //キャンバスの横軸
  const HEIGHT = 600; //キャンバスの縦軸
  const RADIUS = 10; //円の半径

  const HTML_CVS = document.querySelector(".canvas"); //キャンバスの領域の取得
  const CANVAS = HTML_CVS.getContext("2d"); //キャンバスの描画機能を有効
  const PLAYER = new Circle(CANVAS,RADIUS,RADIUS,RADIUS) //インスタンスの生成


  // 画像読み込み(背景)
  const IMAGE = new Image();
  IMAGE.src = "office.jpg";

  // 画像読み込み(人物)
  const PEOPLE = new Image();
  PEOPLE.src = "people.png"


  window.onload = () =>{
    HTML_CVS.width = WIDTH;
    HTML_CVS.height = HEIGHT;
  }

  function update(){ //ループ処理(フレーム数はFRAME_RATE)
    CANVAS.fillStyle = "black";
    CANVAS.fillRect(0,0,WIDTH,HEIGHT) //キャンバスを描画
    CANVAS.drawImage(IMAGE, 0, 0,WIDTH,HEIGHT);


    PLAYER.draw(); //プレイヤーの描画
    PLAYER.move(); //プレイヤーの動き
  }

  window.addEventListener("keydown",keydown);
  window.addEventListener("keyup",keyup);

  function keydown(event){
    if(event.keyCode==38){PLAYER.ArrowUp=true;}
    if(event.keyCode==40){PLAYER.ArrowDown=true;}
    if(event.keyCode==39){PLAYER.ArrowRight=true;}
    if(event.keyCode==37){PLAYER.ArrowLeft=true;}
  }

  function keyup(event){
    if(event.keyCode==38){PLAYER.ArrowUp=false;}
    if(event.keyCode==40){PLAYER.ArrowDown=false;}
    if(event.keyCode==39){PLAYER.ArrowRight=false;}
    if(event.keyCode==37){PLAYER.ArrowLeft=false;}
  }

setTimeout("connect()", 3000);