const tileAtlas = new Image();
tileAtlas.src = './sprites/map.png';

const map = {
  cols: 8,
  rows: 8,
  tsize: 64,
  tiles: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  getTile(col, row) {
    return this.tiles[row * map.cols + col];
  },
};

function draw() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(tileAtlas, 100, 100);
}

function drawMap() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

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

        context.strokeRect(c * map.tsize, r * map.tsize, map.tsize, map.tsize);
      }
    }
  }
}

(() => {
  function main() {
    window.requestAnimationFrame(main);
    drawMap();
  }
  main();
})();
