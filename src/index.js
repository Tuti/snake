const SNAKE_COLOR = 'rebeccapurple';
const APPLE_COLOR = '#ff0800';
const VELOCITY = 2;

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
  bodyCords: [{ x: toCordinate(2), y: toCordinate(3) }], //bodyCords[0] is HEAD of SNAKE
  currentSize: 1,
  tSize: 32,
  vx: 1, //determines direction | pos == right | neg == left
  vy: 1, //determines direction | pos == down  | neg == up
  xCurrentDirection: true,
  userInput: 'ArrowRight',
  nextInput: 'ArrowRight',
  draw() {
    if (this.bodyCords.length === 0) {
      return;
    }

    for (let i = 0; i < this.bodyCords.length; i++) {
      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(
        this.bodyCords[i].x,
        this.bodyCords[i].y,
        this.tSize,
        this.tSize
      );
      this.drawCorners(this.bodyCords[i].x, this.bodyCords[i].y);
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
  increaseBody() {},
};

const game = {
  score: 0,
  applePos: [7, 7],
};

function toCordinate(cord) {
  return (cord - 1) * map.tSize;
}

function calcCornerCords(x, y) {
  //x1 == original point x | x2 == top right | x3 == bottom right | x4 == bottom left
  //y2 == original point y | y2 == top right | y3 == bottom right | y4 == bottom left

  return [
    { x: x, y: y },
    { x: x + map.tSize, y: y },
    { x: x + map.tSize, y: y + map.tSize },
    { x: x, y: y + map.tSize },
  ];
}

function updateSnakePosition() {
  switch (snake.userInput) {
    case 'ArrowRight':
      snake.bodyCords[0].x += snake.vx * VELOCITY;
      break;
    case 'ArrowLeft':
      snake.bodyCords[0].x += -1 * snake.vx * VELOCITY;
      break;
    case 'ArrowUp':
      snake.bodyCords[0].y += -1 * snake.vy * VELOCITY;
      break;
    case 'ArrowDown':
      snake.bodyCords[0].y += snake.vy * VELOCITY;
      break;
    default:
      console.log('reached default');
  }
}

function updateDirection() {
  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowRight' || snake.nextInput === 'ArrowLeft') &&
    snake.bodyCords[0].y % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
  }

  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowUp' || snake.nextInput === 'ArrowDown') &&
    snake.bodyCords[0].x % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
  }
}

function updateScore() {
  const scoreElement = document.getElementById('score');

  game.score += 1;
  scoreElement.innerText = game.score;
}

function renderMap() {
  for (let col = 0; col < map.cols + 1; col++) {
    for (let row = 0; row < map.rows + 1; row++) {
      if (col % 2 === 0 && row % 2 === 0) {
        ctx.fillStyle = '#70c61d';
        ctx.fillRect(toCordinate(col), toCordinate(row), map.tSize, map.tSize);
        ctx.strokeStyle = 'black';
        // ctx.strokeRect(
        //   toCordinate(col),
        //   toCordinate(row),
        //   map.tSize,
        //   map.tSize
        // );
      } else if (col % 2 === 0 && row % 2 !== 0) {
        ctx.fillStyle = '#5aaf06';
        ctx.fillRect(toCordinate(col), toCordinate(row), map.tSize, map.tSize);
        ctx.strokeStyle = 'black';
        // ctx.strokeRect(
        //   toCordinate(col),
        //   toCordinate(row),
        //   map.tSize,
        //   map.tSize
        // );
      } else if (col % 2 !== 0 && row % 2 === 0) {
        ctx.fillStyle = '#5aaf06';
        ctx.fillRect(toCordinate(col), toCordinate(row), map.tSize, map.tSize);
        ctx.strokeStyle = 'black';
        // ctx.strokeRect(
        //   toCordinate(col),
        //   toCordinate(row),
        //   map.tSize,
        //   map.tSize
        // );
      } else {
        ctx.fillStyle = '#70c61d';
        ctx.fillRect(toCordinate(col), toCordinate(row), map.tSize, map.tSize);
        ctx.strokeStyle = 'black';
        // ctx.strokeRect(
        //   toCordinate(col),
        //   toCordinate(row),
        //   map.tSize,
        //   map.tSize
        // );
      }
    }
  }
}

function renderSnake() {
  snake.draw();
}

function renderApple(col, row) {
  ctx.fillStyle = APPLE_COLOR;
  ctx.fillRect(col * map.tSize, row * map.tSize, map.tSize, map.tSize);
}

function update() {
  updateDirection();
  updateSnakePosition();
  // checkCollision();
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
