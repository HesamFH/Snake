let scoreEl = document.querySelector(".score");
let canvas = document.querySelector(".game-canvas");
let ctx = canvas.getContext("2d");
let unitSize = 20;

let score = 0;

let isRunning = false;

let foodX = 0;
let foodY = 0;

let xVelocity = unitSize;
let yVelocity = 0;

let snakeHead = {x: unitSize * 2, y: 0};

let snakeBody = [
  {x: unitSize, y: 0},
  {x: 0, y: 0},
]

document.addEventListener("keydown", changeDirection);

function randomPosition(amount) {
  return Math.round((Math.random() * (amount - unitSize)) / unitSize) * unitSize;
}

// Fill the canvas black
function clearCanvas() {
  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function setNewFood() {
  foodX = randomPosition(canvas.clientWidth);
  foodY = randomPosition(canvas.clientHeight);
}

function drawFood() {
  ctx.fillStyle = "Red";
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function changeDirection(event) {
  const KEY_LEFT = 37;
  const KEY_UP = 38;
  const KEY_RIGHT = 39;
  const KEY_DOWN = 40;

  switch(true) {
    case (event.keyCode == KEY_LEFT && xVelocity != unitSize):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case (event.keyCode == KEY_UP && yVelocity != unitSize):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case (event.keyCode == KEY_RIGHT && xVelocity != -unitSize):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case (event.keyCode == KEY_DOWN && yVelocity != -unitSize):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function moveSnake() {
  // Add a body tile at the previous location of head
  snakeBody.unshift({x: snakeHead.x, y:snakeHead.y});

  // Delete the tail if snake has not eaten the food
  if (snakeHead.x == foodX && snakeHead.y == foodY) {
    setNewFood();
    score++;
    scoreEl.textContent = score;
  } else {
    snakeBody.pop();
  }

  // Move Head
  snakeHead.x += xVelocity;
  snakeHead.y += yVelocity;
}

function drawSnake() {
  ctx.strokeStyle = "White";

  // Draw Head
  ctx.fillStyle = "Orange"
  ctx.fillRect(snakeHead.x, snakeHead.y, unitSize, unitSize);
  ctx.strokeRect(snakeHead.x, snakeHead.y, unitSize, unitSize);

  // Draw Body
  ctx.fillStyle = "Green"
  snakeBody.forEach(snakePart => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function checkGameOver() {
  if (snakeHead.x < 0 || snakeHead.x >= canvas.clientWidth || snakeHead.y < 0 || snakeHead.y >= canvas.clientHeight) {
    isRunning = false;
    return;
  }

  snakeBody.forEach(snakePart => {
    if (snakeHead.x == snakePart.x && snakeHead.y == snakePart.y) {
      isRunning = false;
      return;
    }
  });
}

function gameLoop() {
  if (isRunning) {
    setTimeout(() => {
      clearCanvas();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      gameLoop();
    }, 100);
  }
}

function startGame() {
  isRunning = true;
  clearCanvas();
  drawSnake();
  setNewFood();
  gameLoop();
}

startGame();
