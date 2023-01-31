const BOARD_SIZE = 18;
const SNAKE_SIZE = 25;
const SNAKE_COLOR = '#50C878';

const map = {
  cols: 8,
  rows: 8,
  tsize: 64,
  tiles: [
    1, 3, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1,
    1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,
  ],
  getTile(col, row) {
    return this.tiles[row * map.cols + col];
  },
};

const tileAtlas = new Image();
tileAtlas.src = 'map.png';
function drawMap(context) {
  for (let c = 0; c < map.cols; c++) {
    for (let r = 0; r < map.rows; r++) {
      const tile = map.getTile(c, r);
      if (tile !== 0) {
        // 0 => empty tile
        context.drawImage(
          tileAtlas, // image
          (tile - 1) * map.tsize, // source x
          0, // source y
          map.tsize, // source width
          map.tsize, // source height
          c * map.tsize, // target x
          r * map.tsize, // target y
          map.tsize, // target width
          map.tsize // target height
        );
        context.strokeStyle = '#228B22';
        context.strokeRect(c * map.tsize, r * map.tsize, map.tsize, map.tsize);
      }
    }
  }
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
drawMap(context);

// function update(tFrame) {
//   const canvas = document.getElementById('canvas');
//   const context = canvas.getContext('2d');
//   drawMap(context);
// }

// function render() {}

// let game;

// () => {
//   function main(tFrame) {
//     game.stopMain = window.requestAnimationFrame(main);
//     update(tFrame);
//     // render();
//   }

//   main();
// };
