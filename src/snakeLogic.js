export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const DELTAS = {
  [DIRECTIONS.UP]: { x: 0, y: -1 },
  [DIRECTIONS.DOWN]: { x: 0, y: 1 },
  [DIRECTIONS.LEFT]: { x: -1, y: 0 },
  [DIRECTIONS.RIGHT]: { x: 1, y: 0 },
};

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOutsideBounds(cell, width, height) {
  return cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= height;
}

export function isOppositeDirection(a, b) {
  return (
    (a === DIRECTIONS.UP && b === DIRECTIONS.DOWN) ||
    (a === DIRECTIONS.DOWN && b === DIRECTIONS.UP) ||
    (a === DIRECTIONS.LEFT && b === DIRECTIONS.RIGHT) ||
    (a === DIRECTIONS.RIGHT && b === DIRECTIONS.LEFT)
  );
}

export function placeFood(snake, width, height, rng = Math.random) {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const freeCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const index = Math.floor(rng() * freeCells.length);
  return freeCells[index];
}

export function createInitialState(config, rng = Math.random) {
  const centerY = Math.floor(config.height / 2);
  const startX = Math.floor(config.width / 2);
  const snake = [
    { x: startX, y: centerY },
    { x: startX - 1, y: centerY },
    { x: startX - 2, y: centerY },
  ];

  return {
    width: config.width,
    height: config.height,
    snake,
    direction: DIRECTIONS.RIGHT,
    food: placeFood(snake, config.width, config.height, rng),
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function setDirection(state, nextDirection) {
  if (!DELTAS[nextDirection]) {
    return state;
  }

  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return { ...state, direction: nextDirection };
}

export function togglePause(state) {
  if (state.gameOver) {
    return state;
  }
  return { ...state, paused: !state.paused };
}

export function step(state, rng = Math.random) {
  if (state.gameOver || state.paused) {
    return state;
  }

  const head = state.snake[0];
  const delta = DELTAS[state.direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (isOutsideBounds(nextHead, state.width, state.height)) {
    return { ...state, gameOver: true };
  }

  const grows = state.food && sameCell(nextHead, state.food);
  const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
  const collidesWithBody = bodyToCheck.some((segment) => sameCell(segment, nextHead));

  if (collidesWithBody) {
    return { ...state, gameOver: true };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!grows) {
    nextSnake.pop();
  }

  if (grows) {
    const nextFood = placeFood(nextSnake, state.width, state.height, rng);
    return {
      ...state,
      snake: nextSnake,
      food: nextFood,
      score: state.score + 1,
      gameOver: nextFood === null,
    };
  }

  return {
    ...state,
    snake: nextSnake,
  };
}
