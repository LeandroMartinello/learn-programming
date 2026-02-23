import { useEffect, useMemo, useRef, useState } from "react";
import { DIRECTIONS, createInitialState, setDirection, step, togglePause, type Direction } from "../game/snakeLogic";

const CONFIG = { width: 20, height: 20, tickMs: 140, cellPx: 20 };

export default function SnakeGame() {
  const [state, setState] = useState(() => createInitialState(CONFIG));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const statusText = useMemo(() => {
    if (state.gameOver) return "Game Over";
    if (state.paused) return "Paused";
    return "Running";
  }, [state.gameOver, state.paused]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => step(prev));
    }, CONFIG.tickMs);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const map: Record<string, Direction> = {
        arrowup: DIRECTIONS.UP,
        w: DIRECTIONS.UP,
        arrowdown: DIRECTIONS.DOWN,
        s: DIRECTIONS.DOWN,
        arrowleft: DIRECTIONS.LEFT,
        a: DIRECTIONS.LEFT,
        arrowright: DIRECTIONS.RIGHT,
        d: DIRECTIONS.RIGHT,
      };

      if (map[key]) setState((prev) => setDirection(prev, map[key]));
      if (key === " ") {
        event.preventDefault();
        setState((prev) => togglePause(prev));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < CONFIG.height; y += 1) {
      for (let x = 0; x < CONFIG.width; x += 1) {
        ctx.strokeStyle = "#e2e9f5";
        ctx.strokeRect(x * CONFIG.cellPx, y * CONFIG.cellPx, CONFIG.cellPx, CONFIG.cellPx);
      }
    }

    if (state.food) {
      ctx.fillStyle = "#d84b4b";
      ctx.fillRect(state.food.x * CONFIG.cellPx, state.food.y * CONFIG.cellPx, CONFIG.cellPx, CONFIG.cellPx);
    }

    state.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#2f7f4f" : "#48a968";
      ctx.fillRect(segment.x * CONFIG.cellPx, segment.y * CONFIG.cellPx, CONFIG.cellPx, CONFIG.cellPx);
    });
  }, [state]);

  return (
    <div className="game-panel">
      <h2>Snake</h2>
      <p className="muted">Score: {state.score} · {statusText}</p>
      <canvas
        ref={canvasRef}
        width={CONFIG.width * CONFIG.cellPx}
        height={CONFIG.height * CONFIG.cellPx}
        className="snake-canvas"
        aria-label="Snake game board"
      />
      <div className="controls">
        <button type="button" onClick={() => setState((prev) => togglePause(prev))}>
          {state.paused ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={() => setState(createInitialState(CONFIG))}>
          Restart
        </button>
      </div>
      <div className="controls mobile-controls">
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.UP))}>Up</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.LEFT))}>Left</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.DOWN))}>Down</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.RIGHT))}>Right</button>
      </div>
    </div>
  );
}
