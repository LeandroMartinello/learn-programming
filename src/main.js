import {
  DIRECTIONS,
  createInitialState,
  setDirection,
  step,
  togglePause,
} from "./snakeLogic.js";

const config = {
  width: 20,
  height: 20,
  tickMs: 140,
  cellPx: 20,
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("restart");
const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");

let state = createInitialState(config);

function setStatusText() {
  if (state.gameOver) {
    statusEl.textContent = "Game Over";
    pauseBtn.textContent = "Pause";
    return;
  }

  if (state.paused) {
    statusEl.textContent = "Paused";
    pauseBtn.textContent = "Resume";
    return;
  }

  statusEl.textContent = "Running";
  pauseBtn.textContent = "Pause";
}

function drawCell(cell, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    cell.x * config.cellPx,
    cell.y * config.cellPx,
    config.cellPx,
    config.cellPx
  );
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      ctx.strokeStyle = "#e0e0e0";
      ctx.strokeRect(x * config.cellPx, y * config.cellPx, config.cellPx, config.cellPx);
    }
  }

  if (state.food) {
    drawCell(state.food, "#d64545");
  }

  state.snake.forEach((segment, index) => {
    drawCell(segment, index === 0 ? "#2d7a2d" : "#3f9a3f");
  });

  scoreEl.textContent = String(state.score);
  setStatusText();
}

function tick() {
  state = step(state);
  render();
}

function reset() {
  state = createInitialState(config);
  render();
}

function onDirection(direction) {
  state = setDirection(state, direction);
  render();
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") onDirection(DIRECTIONS.UP);
  if (key === "arrowdown" || key === "s") onDirection(DIRECTIONS.DOWN);
  if (key === "arrowleft" || key === "a") onDirection(DIRECTIONS.LEFT);
  if (key === "arrowright" || key === "d") onDirection(DIRECTIONS.RIGHT);
  if (key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
  }
});

pauseBtn.addEventListener("click", () => {
  state = togglePause(state);
  render();
});
restartBtn.addEventListener("click", reset);
upBtn.addEventListener("click", () => onDirection(DIRECTIONS.UP));
downBtn.addEventListener("click", () => onDirection(DIRECTIONS.DOWN));
leftBtn.addEventListener("click", () => onDirection(DIRECTIONS.LEFT));
rightBtn.addEventListener("click", () => onDirection(DIRECTIONS.RIGHT));

setInterval(tick, config.tickMs);
render();
