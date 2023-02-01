const SNAKE_COLOR = 'rebeccapurple';
const APPLE_COLOR = '#ff0800';
const VELOCITY = 1;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const tileAtlas = new Image();
tileAtlas.src = './sprites/map.png';

const map = {
  cols: 16,
  rows: 16,
  tSize: 32,
  tiles: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
  ],
  getTile(col, row) {
    return this.tiles[row * map.cols + col];
  },
};

const snake = {
  x: toCord(3),
  y: toCord(3),
  body: [{ x: toCord(2), y: toCord(3) }],
  currentSize: 1,
  tSize: 32,
  vx: 1, //determines direction | pos == right | neg == left
  vy: 1, //determines direction | pos == down  | neg == up
  xCurrentDirection: true,
  userInput: '',
  nextInput: '',
  draw() {
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fillRect(this.x, this.y, this.tSize, this.tSize);
    this.drawCorners(this.x, this.y);
    this.drawBody();
  },
  drawBody() {
    if (this.body.length === 0) {
      return;
    }

    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(this.body[i].x, this.body[i].y, this.tSize, this.tSize);
      this.drawCorners(this.body[i].x, this.body[i].y);
    }
  },
  drawCorners(x, y) {
    cords = calcCornerCords(x, y);
    ctx.fillStyle = 'white';
    ctx.fillRect(cords[0].x, cords[0].y, 4, 4);
    ctx.fillRect(cords[1].x - 4, cords[1].y, 4, 4);
    ctx.fillRect(cords[2].x - 4, cords[2].y - 4, 4, 4);
    ctx.fillRect(cords[3].x, cords[3].y - 4, 4, 4);
  },
};

const game = {
  score: 0,
  applePos: [7, 7],
};

function toCord(cord) {
  return (cord - 1) * map.tSize;
}

function calcCornerCords(x, y) {
  //x1 == original point x | x2 == top right | x3 == bottom right | x4 == bottom left
  //y2 == original point y | y2 == top right | y3 == bottom right | y4 == bottom left

  let x1, x2, x3, x4, y1, y2, y3, y4;
  x1 = x;
  y1 = y;

  x2 = x + map.tSize;
  y2 = y;

  x3 = x + map.tSize;
  y3 = y + map.tSize;

  x4 = x;
  y4 = y + map.tSize;
  return [
    { x: x, y: y },
    { x: x + map.tSize, y: y },
    { x: x + map.tSize, y: y + map.tSize },
    { x: x, y: y + map.tSize },
  ];
}

function renderMap() {
  for (let c = 0; c < map.cols; c++) {
    for (let r = 0; r < map.rows; r++) {
      ctx.drawImage(
        tileAtlas, // image
        map.tSize, // source x
        0, // source y
        map.tSize, // source width
        map.tSize, // source height
        c * map.tSize, // target x
        r * map.tSize, // target y
        map.tSize, // target width
        map.tSize // target height
      );

      ctx.strokeStyle = 'black';
      ctx.strokeRect(c * map.tSize, r * map.tSize, map.tSize, map.tSize);
    }
  }
}

function renderSnake() {
  snake.draw();
  switch (snake.userInput) {
    case 'ArrowRight':
      snake.x += snake.vx * VELOCITY;
      break;
    case 'ArrowLeft':
      snake.x += -1 * snake.vx * VELOCITY;
      break;
    case 'ArrowUp':
      snake.y += -1 * snake.vy * VELOCITY;
      break;
    case 'ArrowDown':
      snake.y += snake.vy * VELOCITY;
      break;
    default:
      console.log('reached default');
  }
}

function renderApple(col, row) {
  ctx.fillStyle = APPLE_COLOR;
  ctx.fillRect(col * map.tSize, row * map.tSize, map.tSize, map.tSize);
}

function updateDirection() {
  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowRight' || snake.nextInput === 'ArrowLeft') &&
    snake.y % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
  }

  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowUp' || snake.nextInput === 'ArrowDown') &&
    snake.x % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
  }
}

function updateScore() {
  const scoreElement = document.getElementById('score');

  game.score += 1;
  scoreElement.innerText = game.score;
}

function checkCollision() {}
function update() {
  updateDirection();
  // updateScore();
  checkCollision();
}

function render() {
  //TODO: implement locked 60fps
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  renderMap();
  renderApple(game.applePos[0], game.applePos[1]);
  renderSnake();
}

function handleKeyboardInput() {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (
      keyName === 'ArrowUp' ||
      keyName === 'ArrowDown' ||
      keyName === 'ArrowLeft' ||
      keyName === 'ArrowRight'
    ) {
      snake.nextInput = keyName;
      snake.directionChanged = true;
    }
  });
}

(() => {
  function main() {
    window.requestAnimationFrame(main);
    update();
    render();
  }

  handleKeyboardInput();
  main();
})();
