import { useMemo, useState } from "react";
import AdventureGame from "./components/AdventureGame";
import SnakeGame from "./components/SnakeGame";
import { MESSAGES, type Lang } from "./i18n";
import hauntedHouseThumb from "./images/haunted_house.png";

type GameId = "snake" | "adventure";

const GAME_ITEMS = [
  { id: "snake" as const },
  { id: "adventure" as const },
];

export default function App() {
  const [lang, setLang] = useState<Lang>("de");
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const m = MESSAGES[lang];

  const gameTitle = useMemo(
    () => (selectedGame === "snake" ? "Snake" : selectedGame === "adventure" ? m.adventure.title : ""),
    [m.adventure.title, selectedGame]
  );

  if (selectedGame !== null) {
    return (
      <div className="game-view">
        <header className="game-view-header">
          <button type="button" onClick={() => setSelectedGame(null)}>
            {m.app.backToLauncher}
          </button>
          <strong>{gameTitle}</strong>
        </header>
        <main className="game-view-main">
          {selectedGame === "snake" ? <SnakeGame lang={lang} /> : <AdventureGame lang={lang} />}
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <header className="hero">
        <p className="hero-tag">{m.app.tag}</p>
        <h1>{m.app.title}</h1>
        <p>{m.app.subtitle}</p>
        <div className="lang-row">
          <label htmlFor="lang">{m.app.languageLabel}</label>
          <select id="lang" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      <section className="launcher">
        <ul className="game-list" aria-label={m.app.gameListAria}>
          {GAME_ITEMS.map((game) => (
            <li key={game.id}>
              <button type="button" className="game-row" onClick={() => setSelectedGame(game.id)}>
                <span className={`thumb thumb-${game.id}`} aria-hidden="true">
                  {game.id === "snake" ? (
                    <>
                      <span className="snake-dot d1" />
                      <span className="snake-dot d2" />
                      <span className="snake-dot d3" />
                      <span className="snake-food" />
                    </>
                  ) : (
                    <img className="thumb-image" src={hauntedHouseThumb} alt="" />
                  )}
                </span>
                <span className="row-text">
                  <span className="kicker">
                    {game.id === "snake" ? m.app.snakeKicker : m.app.adventureKicker}
                  </span>
                  <strong>{game.id === "snake" ? "Snake" : m.adventure.title}</strong>
                  <span>
                    {game.id === "snake" ? m.app.snakeDescription : m.app.adventureDescription}
                  </span>
                </span>
                <span className="row-cta">{m.app.play}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
