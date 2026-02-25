import { useEffect, useMemo, useRef, useState } from "react";
import { MESSAGES, type Lang } from "../i18n";
import leanderAvatar from "../images/Leander_Avatar.png";
import noemiAvatar from "../images/Noemi_Avatar.png";
import hauntedHouseBackground from "../images/Spukhaus_Außen.png";
import leanderSpriteSheet from "../images/Walking_Leander_10x10.png";
import noemiSpriteSheet from "../images/Walking_Noemi_10x10_2.png";

type Verb = "look" | "talk" | "take" | "use";
type Scout = "leander" | "noemi";
type SceneId = "forest" | "oak" | "gate" | "foyer" | "attic";

type Scene = {
  title: string;
  description: string;
  palette: { sky: string; ground: string; detail: string };
  hotspots: string[];
  travel: SceneId[];
};

type Hotspot = {
  label: string;
  rect: { x: number; y: number; w: number; h: number };
};

type State = {
  activeScout: Scout;
  scoutPositions: Record<Scout, { x: number; y: number }>;
  scoutTargets: Record<Scout, { x: number; y: number } | null>;
  scoutRows: Record<Scout, number>;
  walkFrame: number;
  scene: SceneId;
  selectedVerb: Verb;
  inventory: string[];
  flags: {
    hasBerries: boolean;
    hasLantern: boolean;
    crowDistracted: boolean;
    hasKey: boolean;
    gateUnlocked: boolean;
    ghostCalmed: boolean;
    hasCompass: boolean;
    questComplete: boolean;
  };
  log: string[];
};

const VERBS: Verb[] = ["look", "talk", "take", "use"];
const SPRITE_COLS = 12;
const SPRITE_ROWS = 8;
const COLOR_KEY = { r: 0x18, g: 0xfd, b: 0xfe };
const COLOR_TOLERANCE = 28;

function makeColorKeyCanvas(image: HTMLImageElement): HTMLCanvasElement {
  const offscreen = document.createElement("canvas");
  offscreen.width = image.naturalWidth;
  offscreen.height = image.naturalHeight;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return offscreen;

  offCtx.drawImage(image, 0, 0);
  const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const pixels = imageData.data;
  const toleranceSq = COLOR_TOLERANCE * COLOR_TOLERANCE;

  for (let i = 0; i < pixels.length; i += 4) {
    const dr = pixels[i] - COLOR_KEY.r;
    const dg = pixels[i + 1] - COLOR_KEY.g;
    const db = pixels[i + 2] - COLOR_KEY.b;
    const distanceSq = dr * dr + dg * dg + db * db;
    if (distanceSq <= toleranceSq) {
      pixels[i + 3] = 0;
    }
  }

  offCtx.putImageData(imageData, 0, 0);
  return offscreen;
}

function getRowForDirection(scout: Scout, dx: number, dy: number): number {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const diagonal = absX > 0.5 && absY > 0.5;

  if (scout === "leander") {
    if (diagonal && dy > 0 && dx > 0) return 4; // rechts-vorn
    if (diagonal && dy > 0 && dx < 0) return 5; // links-vorn
    if (absX >= absY) return dx >= 0 ? 0 : 1; // rechts / links
    return dy < 0 ? 2 : 3; // hinten / vorn
  }

  // Noemi
  if (diagonal && dy > 0 && dx < 0) return 4; // links-vorn
  if (diagonal && dy > 0 && dx > 0) return 5; // rechts-vorn
  if (diagonal && dy < 0 && dx < 0) return 6; // links-hinten
  if (diagonal && dy < 0 && dx > 0) return 7; // rechts-hinten
  if (absX >= absY) return dx >= 0 ? 0 : 1; // rechts / links
  return dy < 0 ? 2 : 3; // hinten / vorn
}

const SCENES: Record<SceneId, Scene> = {
  forest: {
    title: "Whispering Woods",
    description: "Fog drifts through old pines.",
    palette: { sky: "#8fd4ff", ground: "#3f7f4e", detail: "#255b2f" },
    hotspots: ["berries", "signpost", "campfire"],
    travel: ["oak", "gate"],
  },
  oak: {
    title: "Ancient Oak Glade",
    description: "A giant oak guards a ranger cache.",
    palette: { sky: "#b4dd8f", ground: "#5f8f46", detail: "#3d5d2f" },
    hotspots: ["ranger-cache", "oak-spirit"],
    travel: ["forest", "gate"],
  },
  gate: {
    title: "Haunted House Gate",
    description: "An iron gate blocks the hill path.",
    palette: { sky: "#9ba7cc", ground: "#61707d", detail: "#39444f" },
    hotspots: ["crow", "gate-lock"],
    travel: ["forest", "oak", "foyer"],
  },
  foyer: {
    title: "Haunted Foyer",
    description: "A lonely ghost circles a cracked chandelier.",
    palette: { sky: "#7b6e96", ground: "#5d4f71", detail: "#3f3551" },
    hotspots: ["ghost", "staircase"],
    travel: ["gate", "attic"],
  },
  attic: {
    title: "Attic Observatory",
    description: "Moonlight hits an explorer chest.",
    palette: { sky: "#6d6d7f", ground: "#767282", detail: "#494757" },
    hotspots: ["explorer-chest", "window"],
    travel: ["foyer", "forest"],
  },
};

const HOTSPOTS: Record<string, Hotspot> = {
  berries: { label: "Berry Bush", rect: { x: 70, y: 180, w: 80, h: 70 } },
  signpost: { label: "Trail Signpost", rect: { x: 250, y: 120, w: 60, h: 120 } },
  campfire: { label: "Cold Campfire", rect: { x: 370, y: 190, w: 70, h: 55 } },
  "ranger-cache": { label: "Ranger Cache", rect: { x: 300, y: 160, w: 100, h: 70 } },
  "oak-spirit": { label: "Oak Spirit", rect: { x: 90, y: 60, w: 120, h: 170 } },
  crow: { label: "Crow on Lantern", rect: { x: 320, y: 60, w: 120, h: 90 } },
  "gate-lock": { label: "Iron Gate Lock", rect: { x: 200, y: 100, w: 90, h: 140 } },
  ghost: { label: "Restless Ghost", rect: { x: 210, y: 80, w: 90, h: 130 } },
  staircase: { label: "Staircase", rect: { x: 370, y: 70, w: 90, h: 170 } },
  "explorer-chest": { label: "Explorer Chest", rect: { x: 180, y: 165, w: 140, h: 75 } },
  window: { label: "Attic Window", rect: { x: 360, y: 35, w: 100, h: 120 } },
};

function createInitialState(): State {
  return {
    activeScout: "leander",
    scoutPositions: {
      leander: { x: 90, y: 232 },
      noemi: { x: 130, y: 232 },
    },
    scoutTargets: {
      leander: null,
      noemi: null,
    },
    scoutRows: {
      leander: 0,
      noemi: 0,
    },
    walkFrame: 0,
    scene: "forest",
    selectedVerb: "look",
    inventory: [],
    flags: {
      hasBerries: false,
      hasLantern: false,
      crowDistracted: false,
      hasKey: false,
      gateUnlocked: false,
      ghostCalmed: false,
      hasCompass: false,
      questComplete: false,
    },
    log: [
      "Leander: We should map the woods before sunset.",
      "Noemi: And solve the haunted house mystery.",
    ],
  };
}

function addLog(prev: State, line: string): State {
  return { ...prev, log: [...prev.log, line].slice(-8) };
}

function updateInteraction(prev: State, hotspotId: string): State {
  const actor = prev.activeScout === "leander" ? "Leander" : "Noemi";
  const verb = prev.selectedVerb;
  const next: State = {
    ...prev,
    inventory: [...prev.inventory],
    flags: { ...prev.flags },
    log: [...prev.log],
  };

  const push = (line: string) => {
    next.log = [...next.log, line].slice(-8);
  };
  const hasItem = (item: string) => next.inventory.includes(item);
  const addItem = (item: string) => {
    if (!hasItem(item)) next.inventory.push(item);
  };
  const removeItem = (item: string) => {
    next.inventory = next.inventory.filter((x) => x !== item);
  };

  if (hotspotId === "berries") {
    if (verb === "take") {
      if (next.flags.hasBerries) push(`${actor}: We already collected berries.`);
      else {
        next.flags.hasBerries = true;
        addItem("berries");
        push(`${actor}: Berries collected.`);
      }
    } else push(`${actor}: Fresh berries near the path.`);
    return next;
  }

  if (hotspotId === "ranger-cache") {
    if (verb === "take" || verb === "use") {
      if (next.flags.hasLantern) push(`${actor}: Lantern already secured.`);
      else {
        next.flags.hasLantern = true;
        addItem("lantern");
        push(`${actor}: Found an old lantern.`);
      }
    } else push(`${actor}: The ranger cache might hide useful gear.`);
    return next;
  }

  if (hotspotId === "crow") {
    if (verb === "use") {
      if (next.flags.hasBerries && !next.flags.crowDistracted) {
        next.flags.crowDistracted = true;
        next.flags.hasBerries = false;
        removeItem("berries");
        push(`${actor}: Crow distracted. A silver key drops.`);
      } else push(`${actor}: The crow wants food.`);
    } else if (verb === "take") {
      if (next.flags.crowDistracted && !next.flags.hasKey) {
        next.flags.hasKey = true;
        addItem("silver key");
        push(`${actor}: Silver key acquired.`);
      } else push(`${actor}: Too risky while the crow watches.`);
    } else push(`${actor}: The crow guards something shiny.`);
    return next;
  }

  if (hotspotId === "gate-lock") {
    if (verb === "use") {
      if (next.flags.hasKey && !next.flags.gateUnlocked) {
        next.flags.gateUnlocked = true;
        removeItem("silver key");
        push(`${actor}: Gate unlocked.`);
      } else push(`${actor}: The lock needs a key.`);
    } else push(`${actor}: Heavy iron lock.`);
    return next;
  }

  if (hotspotId === "ghost") {
    if (verb === "talk") {
      if (next.flags.hasLantern && !next.flags.ghostCalmed) {
        next.flags.ghostCalmed = true;
        addItem("moon amulet");
        push("Ghost: Thank you for the light. Take this moon amulet.");
      } else if (!next.flags.hasLantern) {
        push("Ghost: Bring me light.");
      } else {
        push("Ghost: The attic chest holds what you seek.");
      }
    } else push(`${actor}: The ghost is restless.`);
    return next;
  }

  if (hotspotId === "staircase") {
    if (verb === "use") {
      if (next.flags.ghostCalmed) {
        next.scene = "attic";
        push(`${actor}: Heading to the attic.`);
      } else push(`${actor}: The ghost blocks the stairs.`);
    } else push(`${actor}: Old staircase to the attic.`);
    return next;
  }

  if (hotspotId === "explorer-chest") {
    if (verb === "take" || verb === "use") {
      if (!next.flags.hasCompass) {
        next.flags.hasCompass = true;
        addItem("compass");
        push(`${actor}: Compass recovered.`);
      } else push(`${actor}: Nothing else in the chest.`);
    } else push(`${actor}: Explorer chest with scout markings.`);
    return next;
  }

  if (hotspotId === "signpost") return addLog(next, `${actor}: Sign says 'House Hill -> Beware at night.'`);
  if (hotspotId === "campfire") return addLog(next, `${actor}: Cold campfire, no wood left.`);
  if (hotspotId === "oak-spirit") return addLog(next, "Oak Spirit: Feed the crow and the gate will open.");
  if (hotspotId === "window") return addLog(next, `${actor}: The woods look calmer from here.`);

  return next;
}

function canTravel(state: State, nextScene: SceneId): boolean {
  if (nextScene === "foyer" && !state.flags.gateUnlocked) return false;
  if (nextScene === "attic" && !state.flags.ghostCalmed) return false;
  return true;
}

function currentObjective(state: State, lang: Lang): string {
  if (lang === "de") {
    if (!state.flags.hasLantern) return "Finde eine Laterne in der Eichenlichtung.";
    if (!state.flags.hasKey) return "Lenke die Krähe ab und hol den silbernen Schlüssel.";
    if (!state.flags.gateUnlocked) return "Öffne das Tor zum Geisterhaus.";
    if (!state.flags.ghostCalmed) return "Beruhige den Geist mit der Laterne.";
    if (!state.flags.hasCompass) return "Finde den Kompass in der Dachkammer.";
    if (!state.flags.questComplete) return "Kehre mit Mondamulett und Kompass in den Wald zurück.";
    return "Quest abgeschlossen.";
  }

  if (!state.flags.hasLantern) return "Find a lantern at the Ancient Oak Glade.";
  if (!state.flags.hasKey) return "Distract the crow and get the silver key.";
  if (!state.flags.gateUnlocked) return "Unlock the haunted gate.";
  if (!state.flags.ghostCalmed) return "Calm the ghost with a lantern conversation.";
  if (!state.flags.hasCompass) return "Recover the compass from the attic chest.";
  if (!state.flags.questComplete) return "Return to the forest with moon amulet and compass.";
  return "Quest complete.";
}

type AdventureGameProps = {
  lang: Lang;
};

export default function AdventureGame({ lang }: AdventureGameProps) {
  const [state, setState] = useState<State>(() => createInitialState());
  const [avatarLoaded, setAvatarLoaded] = useState({ leander: false, noemi: false });
  const [hoverHotspot, setHoverHotspot] = useState<string | null>(null);
  const [cameraX, setCameraX] = useState(0);
  const [spriteLayers, setSpriteLayers] = useState<{
    leander: HTMLCanvasElement | null;
    noemi: HTMLCanvasElement | null;
  }>({
    leander: null,
    noemi: null,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldWidthRef = useRef(512);
  const maxCameraRef = useRef(0);

  const scene = SCENES[state.scene];
  const questDone = state.flags.hasCompass && state.inventory.includes("moon amulet") && state.scene === "forest";
  const m = MESSAGES[lang].adventure;
  const backgroundImage = useMemo(() => {
    const img = new Image();
    img.src = hauntedHouseBackground;
    return img;
  }, []);
  const leanderSpriteImage = useMemo(() => {
    const img = new Image();
    img.src = leanderSpriteSheet;
    return img;
  }, []);
  const noemiSpriteImage = useMemo(() => {
    const img = new Image();
    img.src = noemiSpriteSheet;
    return img;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const ensureKeyed = (
      img: HTMLImageElement,
      setKey: (canvas: HTMLCanvasElement) => void
    ) => {
      const apply = () => {
        if (cancelled || img.naturalWidth <= 0) return;
        const keyed = makeColorKeyCanvas(img);
        if (!cancelled) setKey(keyed);
      };

      if (img.complete && img.naturalWidth > 0) {
        apply();
      } else {
        img.addEventListener("load", apply, { once: true });
      }
    };

    ensureKeyed(leanderSpriteImage, (canvas) =>
      setSpriteLayers((prev) => ({ ...prev, leander: canvas }))
    );
    ensureKeyed(noemiSpriteImage, (canvas) =>
      setSpriteLayers((prev) => ({ ...prev, noemi: canvas }))
    );

    return () => {
      cancelled = true;
    };
  }, [leanderSpriteImage, noemiSpriteImage]);

  useEffect(() => {
    if (questDone && !state.flags.questComplete) {
      setState((prev) => {
        const next = { ...prev, flags: { ...prev.flags, questComplete: true } };
        return addLog(next, "Leander & Noemi: The haunted house mystery is solved.");
      });
    }
  }, [questDone, state.flags.questComplete]);

  useEffect(() => {
    if (state.scoutTargets.leander === null && state.scoutTargets.noemi === null) return;

    let animationFrame = 0;
    const tick = () => {
      setState((prev) => {
        const scouts: Scout[] = ["leander", "noemi"];
        const next: State = {
          ...prev,
          walkFrame: (prev.walkFrame + 1) % 120,
          scoutPositions: { ...prev.scoutPositions },
          scoutTargets: { ...prev.scoutTargets },
          scoutRows: { ...prev.scoutRows },
        };
        let changed = false;

        scouts.forEach((scout) => {
          const target = prev.scoutTargets[scout];
          if (!target) return;

          const pos = prev.scoutPositions[scout];
          const dx = target.x - pos.x;
          const dy = target.y - pos.y;
          const distance = Math.hypot(dx, dy);
          const speed = 2.2;

          if (distance <= speed) {
            next.scoutPositions[scout] = { ...target };
            next.scoutTargets[scout] = null;
            changed = true;
            return;
          }

          next.scoutPositions[scout] = {
            x: pos.x + (dx / distance) * speed,
            y: pos.y + (dy / distance) * speed,
          };
          next.scoutRows[scout] = getRowForDirection(scout, dx, dy);
          changed = true;
        });

        return changed ? next : prev;
      });

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [state.scoutTargets.leander, state.scoutTargets.noemi]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const active = state.scoutPositions[state.activeScout];
    const leftThreshold = canvas.width * 0.2;
    const rightThreshold = canvas.width * 0.8;
    const activeScreenX = active.x - cameraX;

    if (activeScreenX > rightThreshold) {
      const desired = active.x - rightThreshold;
      setCameraX(Math.min(maxCameraRef.current, Math.max(0, desired)));
      return;
    }

    if (activeScreenX < leftThreshold) {
      const desired = active.x - leftThreshold;
      setCameraX(Math.min(maxCameraRef.current, Math.max(0, desired)));
    }
  }, [cameraX, state.activeScout, state.scoutPositions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      const scale = canvas.height / backgroundImage.naturalHeight;
      const worldWidth = backgroundImage.naturalWidth * scale;
      worldWidthRef.current = worldWidth;
      maxCameraRef.current = Math.max(0, worldWidth - canvas.width);

      const clampedCameraX = Math.min(maxCameraRef.current, Math.max(0, cameraX));
      if (clampedCameraX !== cameraX) {
        setCameraX(clampedCameraX);
        return;
      }

      // Slight overscan so the scene visually overlaps the previous frame boundary.
      ctx.drawImage(
        backgroundImage,
        -cameraX - 16,
        -10,
        worldWidth + 32,
        canvas.height + 20
      );
    } else {
      ctx.fillStyle = scene.palette.sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);
      ctx.fillStyle = scene.palette.ground;
      ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);
    }

    scene.hotspots.forEach((id) => {
      if (id !== hoverHotspot) return;
      const h = HOTSPOTS[id];
      const labelX = h.rect.x - cameraX + 4;
      const labelY = h.rect.y - 8;
      ctx.fillStyle = "rgba(15, 20, 33, 0.78)";
      ctx.fillRect(labelX - 4, labelY - 12, Math.max(74, h.label.length * 7), 16);
      ctx.fillStyle = "#f6fbff";
      ctx.font = "12px sans-serif";
      ctx.fillText(h.label, labelX, labelY);
    });

    const drawScout = (scout: Scout, color: string) => {
      const pos = state.scoutPositions[scout];
      const moving = state.scoutTargets[scout] !== null;
      const legShift = moving && state.walkFrame % 16 < 8 ? 2 : -2;
      const spriteImage = scout === "leander" ? spriteLayers.leander : spriteLayers.noemi;

      if (spriteImage) {
        const frameW = spriteImage.width / SPRITE_COLS;
        const frameH = spriteImage.height / SPRITE_ROWS;
        const frame = moving ? Math.floor(state.walkFrame / 6) % SPRITE_COLS : 0;
        const row = state.scoutRows[scout] % SPRITE_ROWS;
        ctx.drawImage(
          spriteImage,
          frame * frameW,
          row * frameH,
          frameW,
          frameH,
          pos.x - cameraX - 4,
          pos.y - 18,
          32,
          50
        );
        return;
      }

      ctx.fillStyle = color;
      ctx.fillRect(pos.x - cameraX, pos.y, 20, 22);
      ctx.fillRect(pos.x - cameraX + 2, pos.y + 22, 6, 10 + legShift);
      ctx.fillRect(pos.x - cameraX + 12, pos.y + 22, 6, 10 - legShift);
      ctx.fillStyle = "#f5d1b0";
      ctx.fillRect(pos.x - cameraX + 3, pos.y - 9, 14, 9);
    };

    drawScout("leander", "#2f66d2");
    drawScout("noemi", "#de4f85");
  }, [
    backgroundImage,
    cameraX,
    hoverHotspot,
    scene,
    state.activeScout,
    state.scoutPositions,
    state.scoutRows,
    state.scoutTargets,
    state.walkFrame,
    spriteLayers,
  ]);

  const status = useMemo(() => {
    if (state.flags.questComplete) return m.statusQuestComplete;
    return `${m.statusActiveScout}: ${state.activeScout === "leander" ? "Leander" : "Noemi"}`;
  }, [m.statusActiveScout, m.statusQuestComplete, state.activeScout, state.flags.questComplete]);
  const shortLog = useMemo(() => state.log.slice(-4), [state.log]);

  return (
    <div className="game-panel adventure-panel fullscreen-panel">
      <div className="adventure-header">
        <h2>{m.title}</h2>
        <p className="muted">{status}</p>
      </div>

      <div className="adventure-grid compact">
        <div className="scene-panel compact">
          <canvas
            ref={canvasRef}
            width={512}
            height={288}
            className="adventure-canvas"
            onClick={(event) => {
              const canvas = event.currentTarget;
              const canvasWidth = canvas.width;
              const canvasHeight = canvas.height;
              const rect = canvas.getBoundingClientRect();
              const x = ((event.clientX - rect.left) * canvasWidth) / rect.width;
              const y = ((event.clientY - rect.top) * canvasHeight) / rect.height;
              const worldX = x + cameraX;
              const hit = scene.hotspots.find((id) => {
                const r = HOTSPOTS[id].rect;
                return worldX >= r.x && worldX <= r.x + r.w && y >= r.y && y <= r.y + r.h;
              });
              setState((prev) => {
                const nextPos = {
                  x: Math.max(0, Math.min(worldWidthRef.current - 20, Math.round(worldX - 10))),
                  y: Math.max(16, Math.min(canvasHeight - 32, Math.round(y - 16))),
                };
                let next: State = {
                  ...prev,
                  scoutTargets: {
                    ...prev.scoutTargets,
                    [prev.activeScout]: nextPos,
                  },
                };
                if (hit) next = updateInteraction(next, hit);
                return next;
              });
            }}
            onMouseMove={(event) => {
              const canvas = event.currentTarget;
              const rect = canvas.getBoundingClientRect();
              const x = ((event.clientX - rect.left) * canvas.width) / rect.width;
              const y = ((event.clientY - rect.top) * canvas.height) / rect.height;
              const worldX = x + cameraX;
              const hit = scene.hotspots.find((id) => {
                const r = HOTSPOTS[id].rect;
                return worldX >= r.x && worldX <= r.x + r.w && y >= r.y && y <= r.y + r.h;
              });
              setHoverHotspot(hit ?? null);
            }}
            onMouseLeave={() => setHoverHotspot(null)}
          />
          <p>
            {scene.title}: {scene.description}
          </p>
          <ul className="log">
            {shortLog.map((line, idx) => (
              <li key={`${line}-${idx}`}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="side-panel compact">
          <section className="panel-box">
            <h3>{m.scouts}</h3>
            <div className="scout-row">
              <button
                type="button"
                className={state.activeScout === "leander" ? "active" : ""}
                onClick={() => setState((prev) => addLog({ ...prev, activeScout: "leander" }, "Leander takes point."))}
              >
                <img
                  src={leanderAvatar}
                  alt="Leander avatar"
                  onLoad={() => setAvatarLoaded((prev) => ({ ...prev, leander: true }))}
                  onError={() => setAvatarLoaded((prev) => ({ ...prev, leander: false }))}
                />
                {!avatarLoaded.leander && <span className="avatar-fallback">L</span>}
                <span>Leander</span>
              </button>
              <button
                type="button"
                className={state.activeScout === "noemi" ? "active" : ""}
                onClick={() => setState((prev) => addLog({ ...prev, activeScout: "noemi" }, "Noemi takes point."))}
              >
                <img
                  src={noemiAvatar}
                  alt="Noemi avatar"
                  onLoad={() => setAvatarLoaded((prev) => ({ ...prev, noemi: true }))}
                  onError={() => setAvatarLoaded((prev) => ({ ...prev, noemi: false }))}
                />
                {!avatarLoaded.noemi && <span className="avatar-fallback">N</span>}
                <span>Noemi</span>
              </button>
            </div>
          </section>

          <section className="panel-box">
            <h3>{m.objective}</h3>
            <p>{currentObjective(state, lang)}</p>
          </section>

          <section className="panel-box">
            <h3>{m.verbsActions}</h3>
            <div className="chips">
              {VERBS.map((verb) => (
                <button
                  key={verb}
                  type="button"
                  className={state.selectedVerb === verb ? "active" : ""}
                  onClick={() => setState((prev) => ({ ...prev, selectedVerb: verb }))}
                >
                  {verb === "look" && m.look}
                  {verb === "talk" && m.talk}
                  {verb === "take" && m.take}
                  {verb === "use" && m.use}
                </button>
              ))}
              {scene.hotspots.map((id) => (
                <button key={id} type="button" onClick={() => setState((prev) => updateInteraction(prev, id))}>
                  {HOTSPOTS[id].label}
                </button>
              ))}
              {scene.travel.map((target) => (
                <button
                  key={target}
                  type="button"
                  disabled={!canTravel(state, target)}
                  onClick={() =>
                    setState((prev) => {
                      if (!canTravel(prev, target)) return addLog(prev, "Path blocked.");
                      return addLog({ ...prev, scene: target }, `Traveling to ${SCENES[target].title}.`);
                    })
                  }
                >
                  {SCENES[target].title}
                </button>
              ))}
            </div>
          </section>

          <section className="panel-box">
            <h3>{m.inventory}</h3>
            <div className="chips">
              {state.inventory.length === 0 ? (
                <span className="empty">{m.noItems}</span>
              ) : (
                state.inventory.map((item) => <span key={item} className="pill">{item}</span>)
              )}
            </div>
          </section>

          <button type="button" onClick={() => setState(createInitialState())}>{m.restart}</button>
        </div>
      </div>
    </div>
  );
}
