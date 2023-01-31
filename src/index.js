const SNAKE_COLOR = '#50C878';
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
  x: 0,
  y: 0,
  tSize: 32,
  vx: 1, //determines direction | pos == right | neg == left
  vy: 1, //determines direction | pos == down  | neg == up
  xCurrentDirection: true,
  directionChanged: false,
  draw() {
    ctx.strokeStyle = SNAKE_COLOR;
    ctx.fillRect(this.x, this.y, this.tSize, this.tSize);
  },
};

function drawMap() {
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

function drawSnake() {
  snake.draw();
  updateDirection();
  if (snake.xCurrentDirection && snake.y % 64 === 0) {
    snake.x += snake.vx * VELOCITY;
  }

  if (!snake.xCurrentDirection && snake.x % 64 === 0) {
    snake.y += snake.vy * VELOCITY;
  }
}

function updateDirection() {
  if (snake.directionChanged && snake.xCurrentDirection && snake.x % 64 === 0) {
    console.log('updated direction to y');
    snake.xCurrentDirection = false;
    snake.directionChanged = false;
  }
  if (
    snake.directionChanged &&
    !snake.xCurrentDirection &&
    snake.y % 64 === 0
  ) {
    console.log('updated direction to x');
    snake.xCurrentDirection = true;
    snake.directionChanged = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawMap();
  drawSnake();
}

function handleKeyboardInput() {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'ArrowUp') {
      snake.directionChanged = true;
      snake.vy = -1;
    } else if (keyName === 'ArrowDown') {
      snake.directionChanged = true;
      snake.vy = 1;
    } else if (keyName === 'ArrowLeft') {
      snake.directionChanged = true;
      snake.vx = -1;
    } else if (keyName === 'ArrowRight') {
      snake.directionChanged = true;
      snake.vx = 1;
    }
  });
}

(() => {
  function main() {
    window.requestAnimationFrame(main);
    draw();
  }

  handleKeyboardInput();
  main();
})();
