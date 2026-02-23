export type Lang = "de" | "en";

type Messages = {
  app: {
    tag: string;
    title: string;
    subtitle: string;
    backToLauncher: string;
    play: string;
    gameListAria: string;
    languageLabel: string;
    snakeKicker: string;
    adventureKicker: string;
    snakeDescription: string;
    adventureDescription: string;
  };
  snake: {
    title: string;
    score: string;
    running: string;
    paused: string;
    gameOver: string;
    pause: string;
    resume: string;
    restart: string;
    up: string;
    left: string;
    down: string;
    right: string;
  };
  adventure: {
    title: string;
    statusActiveScout: string;
    statusQuestComplete: string;
    scouts: string;
    objective: string;
    verbsActions: string;
    inventory: string;
    restart: string;
    noItems: string;
    look: string;
    talk: string;
    take: string;
    use: string;
  };
};

export const MESSAGES: Record<Lang, Messages> = {
  de: {
    app: {
      tag: "Leanders Spielplatz",
      title: "Spiele-Auswahl",
      subtitle: "Wähle ein Spiel aus der Liste und starte es im Vollbild-Modus.",
      backToLauncher: "Zurück zur Auswahl",
      play: "Starten",
      gameListAria: "Spieleliste",
      languageLabel: "Sprache",
      snakeKicker: "Arcade",
      adventureKicker: "Story",
      snakeDescription: "Klassisches Grid-Gameplay mit Score, Game Over und Neustart.",
      adventureDescription: "Scout-Quest im Wald und im Geisterhaus mit Inventar und Dialogen.",
    },
    snake: {
      title: "Snake",
      score: "Punkte",
      running: "Läuft",
      paused: "Pausiert",
      gameOver: "Game Over",
      pause: "Pause",
      resume: "Weiter",
      restart: "Neu starten",
      up: "Hoch",
      left: "Links",
      down: "Runter",
      right: "Rechts",
    },
    adventure: {
      title: "Leanders Abenteuer",
      statusActiveScout: "Aktiver Scout",
      statusQuestComplete: "Quest abgeschlossen. Der Wald ist wieder sicher.",
      scouts: "Scouts",
      objective: "Ziel",
      verbsActions: "Verben + Aktionen",
      inventory: "Inventar",
      restart: "Abenteuer neu starten",
      noItems: "Noch keine Gegenstände.",
      look: "ANSEHEN",
      talk: "REDEN",
      take: "NEHMEN",
      use: "BENUTZEN",
    },
  },
  en: {
    app: {
      tag: "Leander's Playroom",
      title: "Game Launcher",
      subtitle: "Pick a game from the list and launch it in full-screen mode.",
      backToLauncher: "Back To Launcher",
      play: "Play",
      gameListAria: "Game list",
      languageLabel: "Language",
      snakeKicker: "Arcade",
      adventureKicker: "Story",
      snakeDescription: "Classic grid gameplay with score, game-over and restart.",
      adventureDescription: "Scout quest in woods and haunted house with inventory and dialogues.",
    },
    snake: {
      title: "Snake",
      score: "Score",
      running: "Running",
      paused: "Paused",
      gameOver: "Game Over",
      pause: "Pause",
      resume: "Resume",
      restart: "Restart",
      up: "Up",
      left: "Left",
      down: "Down",
      right: "Right",
    },
    adventure: {
      title: "Leander's Adventure",
      statusActiveScout: "Active scout",
      statusQuestComplete: "Quest complete. The woods are safe.",
      scouts: "Scouts",
      objective: "Objective",
      verbsActions: "Verbs + Actions",
      inventory: "Inventory",
      restart: "Restart Adventure",
      noItems: "No items yet.",
      look: "LOOK",
      talk: "TALK",
      take: "TAKE",
      use: "USE",
    },
  },
};
