import { useEffect, useMemo, useRef, useState } from "react";
import { DIRECTIONS, createInitialState, setDirection, step, togglePause, type Direction } from "../game/snakeLogic";
import { MESSAGES, type Lang } from "../i18n";

const CONFIG = { width: 20, height: 20, tickMs: 140, cellPx: 20 };

type SnakeGameProps = {
  lang: Lang;
};

export default function SnakeGame({ lang }: SnakeGameProps) {
  const [state, setState] = useState(() => createInitialState(CONFIG));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const m = MESSAGES[lang].snake;

  const statusText = useMemo(() => {
    if (state.gameOver) return m.gameOver;
    if (state.paused) return m.paused;
    return m.running;
  }, [m.gameOver, m.paused, m.running, state.gameOver, state.paused]);

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
    <div className="game-panel fullscreen-panel snake-panel">
      <div className="snake-header">
        <h2>{m.title}</h2>
        <p className="muted">{m.score}: {state.score} · {statusText}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={CONFIG.width * CONFIG.cellPx}
        height={CONFIG.height * CONFIG.cellPx}
        className="snake-canvas"
        aria-label="Snake game board"
      />
      <div className="controls">
        <button type="button" onClick={() => setState((prev) => togglePause(prev))}>
          {state.paused ? m.resume : m.pause}
        </button>
        <button type="button" onClick={() => setState(createInitialState(CONFIG))}>
          {m.restart}
        </button>
      </div>
      <div className="controls mobile-controls">
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.UP))}>{m.up}</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.LEFT))}>{m.left}</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.DOWN))}>{m.down}</button>
        <button type="button" onClick={() => setState((prev) => setDirection(prev, DIRECTIONS.RIGHT))}>{m.right}</button>
      </div>
    </div>
  );
}
