const SNAKE_COLOR = 'rebeccapurple';
const APPLE_COLOR = '#ff0800';
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';

const VELOCITY = 1;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const tileAtlas = new Image();
tileAtlas.src = './sprites/map.png';

const map = {
  cols: 16,
  rows: 16,
  tSize: 32,
};

const game = {
  score: 0,
  applePos: [7, 7],
  cols: 16,
  rows: 16,
  tileSize: 32,
};

const snake = {
  body: [], //body[0] is HEAD of SNAKE
  turns: [],
  currentSize: 1,
  tSize: 32,
  vx: 1, //determines direction | pos == right | neg == left
  vy: 1, //determines direction | pos == down  | neg == up
  userInput: RIGHT,
  nextInput: RIGHT,

  draw() {
    if (this.body.length === 0) {
      return;
    }

    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(this.body[i].x, this.body[i].y, this.tSize, this.tSize);
      this.drawCorners(this.body[i].x, this.body[i].y);
    }
  },
  drawCorners(col, row) {
    cords = calcCornerCords(col, row);
    ctx.fillStyle = 'white';
    ctx.fillRect(cords[0].x, cords[0].y, 4, 4);
    ctx.fillRect(cords[1].x - 4, cords[1].y, 4, 4);
    ctx.fillRect(cords[2].x - 4, cords[2].y - 4, 4, 4);
    ctx.fillRect(cords[3].x, cords[3].y - 4, 4, 4);
  },
  increaseBody(col, row, direction = '') {
    if (direction === '') {
      console.log('hit if increasebody');
      this.body.push({
        x: toCordinate(col),
        y: toCordinate(row),
        direction:
          this.body.length > 0
            ? this.body[this.body.length - 1].direction
            : direction,
        nextDirection:
          this.body.length > 0
            ? this.body[this.body.length - 1].direction
            : direction,
      });
    } else {
      console.log('hit else increasebody');
      this.body.push({
        x: toCordinate(col),
        y: toCordinate(row),
        direction: direction,
        nextDirection: direction,
      });
    }
  },
  addTurn(x, y, direction) {
    this.turns.push({ x: x, y: y, currentIndex: 0, direction: direction });
  },
  increaseTurnIndex() {
    if (this.turns[0].currentIndex > this.body.length) {
      this.turns.splice(0, 1);
    } else {
      this.turns[0].currentIndex++;
    }
  },
};

function toCordinate(cord) {
  return (cord - 1) * game.tileSize;
}

function calcCornerCords(x, y) {
  //x1 == original point x | x2 == top right | x3 == bottom right | x4 == bottom left
  //y2 == original point y | y2 == top right | y3 == bottom right | y4 == bottom left

  return [
    { x: x, y: y },
    { x: x + game.tileSize, y: y },
    { x: x + game.tileSize, y: y + game.tileSize },
    { x: x, y: y + game.tileSize },
  ];
}

function updateHead() {
  switch (snake.userInput) {
    case UP:
      snake.body[0].y += -1 * snake.vy * VELOCITY;
      break;
    case DOWN:
      snake.body[0].y += VELOCITY;
      break;
    case RIGHT:
      snake.body[0].x += VELOCITY;
      break;
    case LEFT:
      snake.body[0].x += -1 * VELOCITY;
      break;
    default:
      console.log('should not have hit');
      break;
  }
}

function updateBody() {
  for (let i = 1; i < snake.body.length; i++) {
    const cbody = snake.body[i];
    switch (cbody.direction) {
      case UP:
        cbody.y += -1 * snake.vy * VELOCITY;
        break;
      case DOWN:
        cbody.y += VELOCITY;
        break;
      case RIGHT:
        cbody.x += VELOCITY;
        break;
      case LEFT:
        cbody.x += -1 * VELOCITY;
        break;
      default:
        console.log('should not have hit body');
        break;
    }
    snake.body[i] = cbody;
  }
}
function updateSnakePosition() {
  updateHead();
  updateBody();
}

// function updateSnakePositionn() {
//   //Updating direction for head should be immediate
//   switch (snake.userInput) {
//     case UP:
//       snake.body[0].y += -1 * snake.vy * VELOCITY;
//       snake.body[1].nextDirection = UP;
//       break;
//     case DOWN:
//       snake.body[0].y += snake.vy * VELOCITY;
//       snake.body[1].nextDirection = DOWN;
//       break;
//     case RIGHT:
//       snake.body[0].x += snake.vx * VELOCITY;
//       snake.body[1].nextDirection = RIGHT;
//       break;
//     case LEFT:
//       snake.body[0].x += -1 * snake.vx * VELOCITY;
//       snake.body[1].nextDirection = LEFT;
//       break;
//     default:
//       console.log('reached default');
//   }

//   for (let i = 1; i < snake.body.length; i++) {
//     /*
//     Isn't working because I currently don't have an initial speed,
//     so cBody.x && .y will never be turnCord.x & .y
//     Should i start game with body moving in direction? probably not.
//     Need to think of way to update everything nicely
//     */
//     const cBody = snake.body[i];
//     console.log({ cBody });
//     if (
//       cBody.currentDirection !== cBody.nextDirection &&
//       cBody.x === cBody.turnCord.x &&
//       cBody.y === cBody.turnCords.y
//     ) {
//       console.log('hit switch');
//       cBody.currentDirection = cBody.nextDirection;
//     }

//     switch (cBody.currentDirection) {
//       case UP:
//         console.log('hit up');
//         cBody.y += -1 * VELOCITY;
//         break;
//       case DOWN:
//         console.log('hit down');
//         cBody.y += VELOCITY;
//         break;
//       case RIGHT:
//         console.log('hit right');
//         cBody.x += VELOCITY;
//         break;
//       case LEFT:
//         console.log('hit left');
//         cBody.x += -1 * VELOCITY;
//         break;
//       default:
//         console.log('reached default');
//     }
//     snake.body[i] = cBody;
//   }
// }

function updateSnakeDirection() {
  /* 
    each turn, save turn cords and create new object
    with necessary info, current index and each update

    check if next body part is at cord so it can start turn
    if not skip until next update. on arrival of cord,
    update to new direction and update current index
    continue until current index for turn > size of snake
    should be an array of turns that we are constantly working thru,
    only should be checking the first turn in the array (like a queue)  
  */
  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowRight' || snake.nextInput === 'ArrowLeft') &&
    snake.body[0].y % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
    snake.addTurn(snake.body[0].x, snake.body[0].y, snake.nextInput);
    const turns = snake.turns;
    console.log({ turns });
  }

  if (
    snake.userInput !== snake.nextInput &&
    (snake.nextInput === 'ArrowUp' || snake.nextInput === 'ArrowDown') &&
    snake.body[0].x % 32 === 0
  ) {
    snake.userInput = snake.nextInput;
    snake.addTurn(snake.body[0].x, snake.body[0].y, snake.nextInput);
    const turns = snake.turns;
    console.log({ turns });
  }

  if (
    snake.turns.length > 0 &&
    snake.body[snake.turns[0].currentIndex].x === snake.turns.x &&
    snake.body[snake.turns[0].currentIndex].y === snake.turns.y
  ) {
    snake.body[snake.turns[0].currentIndex].nextDirection =
      snake.turns[0].direction;
    snake.increaseTurnIndex();
  }
}

function updateScore() {
  const scoreElement = document.getElementById('score');

  game.score += 1;
  scoreElement.innerText = game.score;
}

function renderMap() {
  for (let col = 0; col < game.cols + 1; col++) {
    for (let row = 0; row < game.rows + 1; row++) {
      if (col % 2 === 0 && row % 2 === 0) {
        ctx.fillStyle = '#70c61d';
        ctx.fillRect(
          toCordinate(col),
          toCordinate(row),
          game.tileSize,
          game.tileSize
        );
        ctx.strokeStyle = 'black';
      } else if (col % 2 === 0 && row % 2 !== 0) {
        ctx.fillStyle = '#5aaf06';
        ctx.fillRect(
          toCordinate(col),
          toCordinate(row),
          game.tileSize,
          game.tileSize
        );
        ctx.strokeStyle = 'black';
      } else if (col % 2 !== 0 && row % 2 === 0) {
        ctx.fillStyle = '#5aaf06';
        ctx.fillRect(
          toCordinate(col),
          toCordinate(row),
          game.tileSize,
          game.tileSize
        );
        ctx.strokeStyle = 'black';
      } else {
        ctx.fillStyle = '#70c61d';
        ctx.fillRect(
          toCordinate(col),
          toCordinate(row),
          game.tileSize,
          game.tileSize
        );
        ctx.strokeStyle = 'black';
      }
    }
  }
}

function renderSnake() {
  snake.draw();
}

function renderApple(col, row) {
  ctx.fillStyle = APPLE_COLOR;
  ctx.fillRect(
    col * game.tileSize,
    row * game.tileSize,
    game.tileSize,
    game.tileSize
  );
}

function update() {
  updateSnakeDirection();
  updateSnakePosition();
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
  snake.increaseBody(3, 2, RIGHT);
  snake.increaseBody(2, 2);
  snake.increaseBody(1, 2);
  main();
})();
