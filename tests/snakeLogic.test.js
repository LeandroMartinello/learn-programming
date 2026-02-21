import test from "node:test";
import assert from "node:assert/strict";
import {
  DIRECTIONS,
  createInitialState,
  placeFood,
  setDirection,
  step,
} from "../src/snakeLogic.js";

test("snake moves one cell in current direction", () => {
  const state = {
    width: 10,
    height: 10,
    snake: [
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
    ],
    direction: DIRECTIONS.RIGHT,
    food: { x: 8, y: 8 },
    score: 0,
    gameOver: false,
    paused: false,
  };

  const next = step(state, () => 0);
  assert.deepEqual(next.snake, [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  assert.equal(next.score, 0);
});

test("snake grows and score increases when food is eaten", () => {
  const state = {
    width: 10,
    height: 10,
    snake: [
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
    ],
    direction: DIRECTIONS.RIGHT,
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false,
    paused: false,
  };

  const next = step(state, () => 0);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.notDeepEqual(next.food, { x: 5, y: 5 });
});

test("wall collision sets game over", () => {
  const state = {
    width: 5,
    height: 5,
    snake: [{ x: 4, y: 2 }],
    direction: DIRECTIONS.RIGHT,
    food: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    paused: false,
  };

  const next = step(state, () => 0);
  assert.equal(next.gameOver, true);
});

test("body collision sets game over", () => {
  const state = {
    width: 8,
    height: 8,
    snake: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    direction: DIRECTIONS.DOWN,
    food: { x: 7, y: 7 },
    score: 0,
    gameOver: false,
    paused: false,
  };

  const next = step(state, () => 0);
  assert.equal(next.gameOver, true);
});

test("food placement never returns a snake-occupied cell", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = placeFood(snake, 4, 4, () => 0);
  assert.notEqual(`${food.x},${food.y}`, "0,0");
  assert.notEqual(`${food.x},${food.y}`, "1,0");
  assert.notEqual(`${food.x},${food.y}`, "2,0");
});

test("reverse direction is ignored", () => {
  const state = createInitialState({ width: 20, height: 20 }, () => 0);
  const next = setDirection(state, DIRECTIONS.LEFT);
  assert.equal(next.direction, DIRECTIONS.RIGHT);
});
