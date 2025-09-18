// p5.js 벽돌깨기 게임 (모바일 대응)
let paddle, ball, bricks = [];
let rows = 5, cols = 8;
let brickW, brickH;
let playing = true, win = false;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.7);
  paddle = new Paddle();
  ball = new Ball();
  brickW = width / cols;
  brickH = height / 18;
  bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push(new Brick(c * brickW, r * brickH + 40, brickW - 4, brickH - 4));
    }
  }
}

function draw() {
  background(30, 30, 50);
  if (!playing) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(win ? 'yellow' : 'red');
    text(win ? 'YOU WIN!' : 'GAME OVER', width/2, height/2);
    textSize(20);
    fill(255);
    text('Tap to restart', width/2, height/2 + 40);
    return;
  }
  paddle.show();
  ball.update();
  ball.show();
  for (let b of bricks) b.show();
  ball.checkPaddle(paddle);
  for (let i = bricks.length - 1; i >= 0; i--) {
    if (bricks[i].hit(ball)) {
      bricks.splice(i, 1);
      ball.dy *= -1;
      break;
    }
  }
  if (bricks.length === 0) {
    playing = false;
    win = true;
  }
  if (ball.offScreen()) {
    playing = false;
    win = false;
  }
}

function touchMoved() {
  // 모바일 터치로 패들 이동
  paddle.x = constrain(mouseX - paddle.w/2, 0, width - paddle.w);
  return false;
}

function mouseDragged() {
  // 데스크탑 마우스 드래그도 지원
  paddle.x = constrain(mouseX - paddle.w/2, 0, width - paddle.w);
}

function mousePressed() {
  if (!playing) {
    setup();
    playing = true;
    win = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.7);
  brickW = width / cols;
  brickH = height / 18;
  paddle.y = height - 30;
}

class Paddle {
  constructor() {
    this.w = width / 5;
    this.h = 18;
    this.x = width/2 - this.w/2;
    this.y = height - 30;
  }
  show() {
    fill(200, 220, 255);
    rect(this.x, this.y, this.w, this.h, 10);
  }
}

class Ball {
  constructor() {
    this.r = 14;
    this.x = width/2;
    this.y = height/2;
    this.dx = random([-5, 5]);
    this.dy = -6;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < this.r || this.x > width - this.r) this.dx *= -1;
    if (this.y < this.r) this.dy *= -1;
  }
  show() {
    fill(255, 200, 100);
    ellipse(this.x, this.y, this.r*2);
  }
  checkPaddle(p) {
    if (this.y + this.r > p.y && this.x > p.x && this.x < p.x + p.w && this.dy > 0) {
      this.dy *= -1;
      let hitPos = (this.x - (p.x + p.w/2)) / (p.w/2);
      this.dx = hitPos * 7;
    }
  }
  offScreen() {
    return this.y - this.r > height;
  }
}

class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = color(random(100,255), random(100,255), random(100,255));
  }
  show() {
    fill(this.col);
    rect(this.x, this.y, this.w, this.h, 6);
  }
  hit(ball) {
    return ball.x + ball.r > this.x && ball.x - ball.r < this.x + this.w &&
           ball.y + ball.r > this.y && ball.y - ball.r < this.y + this.h;
  }
}