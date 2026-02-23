export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
export type Cell = { x: number; y: number };

export type SnakeState = {
  width: number;
  height: number;
  snake: Cell[];
  direction: Direction;
  food: Cell | null;
  score: number;
  gameOver: boolean;
  paused: boolean;
};

const DELTAS: Record<Direction, Cell> = {
  [DIRECTIONS.UP]: { x: 0, y: -1 },
  [DIRECTIONS.DOWN]: { x: 0, y: 1 },
  [DIRECTIONS.LEFT]: { x: -1, y: 0 },
  [DIRECTIONS.RIGHT]: { x: 1, y: 0 },
};

function sameCell(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

function isOutsideBounds(cell: Cell, width: number, height: number): boolean {
  return cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= height;
}

export function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === DIRECTIONS.UP && b === DIRECTIONS.DOWN) ||
    (a === DIRECTIONS.DOWN && b === DIRECTIONS.UP) ||
    (a === DIRECTIONS.LEFT && b === DIRECTIONS.RIGHT) ||
    (a === DIRECTIONS.RIGHT && b === DIRECTIONS.LEFT)
  );
}

export function placeFood(snake: Cell[], width: number, height: number, rng = Math.random): Cell | null {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const freeCells: Cell[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!occupied.has(`${x},${y}`)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) return null;
  return freeCells[Math.floor(rng() * freeCells.length)];
}

export function createInitialState(
  config: Pick<SnakeState, "width" | "height">,
  rng = Math.random
): SnakeState {
  const centerY = Math.floor(config.height / 2);
  const startX = Math.floor(config.width / 2);
  const snake: Cell[] = [
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

export function setDirection(state: SnakeState, nextDirection: Direction): SnakeState {
  if (isOppositeDirection(state.direction, nextDirection)) return state;
  return { ...state, direction: nextDirection };
}

export function togglePause(state: SnakeState): SnakeState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function step(state: SnakeState, rng = Math.random): SnakeState {
  if (state.gameOver || state.paused) return state;

  const head = state.snake[0];
  const delta = DELTAS[state.direction];
  const nextHead: Cell = { x: head.x + delta.x, y: head.y + delta.y };

  if (isOutsideBounds(nextHead, state.width, state.height)) {
    return { ...state, gameOver: true };
  }

  const grows = state.food !== null && sameCell(nextHead, state.food);
  const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
  const collidesWithBody = bodyToCheck.some((segment) => sameCell(segment, nextHead));
  if (collidesWithBody) return { ...state, gameOver: true };

  const nextSnake = [nextHead, ...state.snake];
  if (!grows) nextSnake.pop();

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

  return { ...state, snake: nextSnake };
}
