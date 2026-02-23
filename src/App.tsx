import { useMemo, useState } from "react";
import AdventureGame from "./components/AdventureGame";
import SnakeGame from "./components/SnakeGame";

type GameId = "snake" | "adventure";

const GAME_ITEMS = [
  {
    id: "snake" as const,
    kicker: "Arcade",
    title: "Snake",
    description: "Classic grid movement, score loop, game-over and instant restart.",
  },
  {
    id: "adventure" as const,
    kicker: "Story",
    title: "Leander's Abenteuer",
    description: "Scout quest in the woods and haunted house with inventory and dialogue.",
  },
];

export default function App() {
  const [selectedGame, setSelectedGame] = useState<GameId>("snake");

  const gameTitle = useMemo(
    () => GAME_ITEMS.find((item) => item.id === selectedGame)?.title ?? "",
    [selectedGame]
  );

  return (
    <div className="layout">
      <header className="hero">
        <p className="hero-tag">Leander's Playroom</p>
        <h1>Game Launcher</h1>
        <p>Built with React + TypeScript on Vite. Select a game from the list.</p>
      </header>

      <section className="launcher">
        <ul className="game-list" aria-label="Game list">
          {GAME_ITEMS.map((game) => (
            <li key={game.id}>
              <button
                type="button"
                className={`game-row ${selectedGame === game.id ? "active" : ""}`}
                onClick={() => setSelectedGame(game.id)}
              >
                <span className={`thumb thumb-${game.id}`} aria-hidden="true">
                  {game.id === "snake" ? (
                    <>
                      <span className="snake-dot d1" />
                      <span className="snake-dot d2" />
                      <span className="snake-dot d3" />
                      <span className="snake-food" />
                    </>
                  ) : (
                    <>
                      <span className="moon" />
                      <span className="house" />
                      <span className="tree left" />
                      <span className="tree right" />
                    </>
                  )}
                </span>
                <span className="row-text">
                  <span className="kicker">{game.kicker}</span>
                  <strong>{game.title}</strong>
                  <span>{game.description}</span>
                </span>
                <span className="row-cta">{selectedGame === game.id ? "Selected" : "Open"}</span>
              </button>
            </li>
          ))}
        </ul>

        <section className="game-shell" aria-label={`${gameTitle} container`}>
          {selectedGame === "snake" ? <SnakeGame /> : <AdventureGame />}
        </section>
      </section>
    </div>
  );
}
