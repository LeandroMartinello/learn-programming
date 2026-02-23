const canvas = document.getElementById("adventure");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("adventure-status");

const TILE = 20;
const WIDTH = 16;
const HEIGHT = 16;

const mapRows = [
  "################",
  "#......#......#",
  "#.####.#.####.#",
  "#.#....#....#.#",
  "#.#.######.#..#",
  "#.#......#.#.##",
  "#.####.#.#.#..#",
  "#......#.#.##.#",
  "######.#.#....#",
  "#....#.#.####.#",
  "#.##.#.#......#",
  "#.#..#.######.#",
  "#.#.##......#.#",
  "#.#....####.#.#",
  "#......#....#.#",
  "################",
];

const tiles = {
  wall: "#2f3a44",
  floor: "#ccd7e0",
  goal: "#d5b04a",
  hero: "#2066b0",
};

const state = {
  player: { x: 1, y: 1 },
  goal: { x: 14, y: 14 },
};

function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return false;
  return mapRows[y][x] !== "#";
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
}

function render() {
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const isWall = mapRows[y][x] === "#";
      drawTile(x, y, isWall ? tiles.wall : tiles.floor);
    }
  }

  drawTile(state.goal.x, state.goal.y, tiles.goal);
  drawTile(state.player.x, state.player.y, tiles.hero);

  if (state.player.x === state.goal.x && state.player.y === state.goal.y) {
    statusEl.textContent = "Goal reached. Press R to restart.";
  }
}

function move(dx, dy) {
  const next = { x: state.player.x + dx, y: state.player.y + dy };
  if (!isWalkable(next.x, next.y)) return;
  state.player = next;
  render();
}

function reset() {
  state.player = { x: 1, y: 1 };
  statusEl.textContent = "Move with Arrow Keys or WASD.";
  render();
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "arrowup" || key === "w") move(0, -1);
  if (key === "arrowdown" || key === "s") move(0, 1);
  if (key === "arrowleft" || key === "a") move(-1, 0);
  if (key === "arrowright" || key === "d") move(1, 0);
  if (key === "r") reset();
});

render();
