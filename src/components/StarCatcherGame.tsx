import { useState, useEffect, useRef, useCallback } from "react";
import {
  IconStarFilled,
  IconSparkle,
  IconParty,
  IconDiamond,
  IconTimer,
  IconCrown,
} from "./HandDrawnIcons";

interface StarCatcherProps {
  onUnlock: () => void;
}

interface FallingItem {
  id: number;
  type: "star" | "bomb";
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  caught: boolean;
  caughtAt?: number;
}

interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  elapsedMs: number;
  bombsHit: number;
  maxCombo: number;
  createdAt: string;
}

interface GameResult {
  score: number;
  elapsedMs: number;
  bombsHit: number;
  maxCombo: number;
}

const STARS_TO_CATCH = 12;
const GAME_DURATION = 25;
const CATCH_RADIUS = 46;
const BOMB_PENALTY = 4;
const BOMB_CHANCE = 0.36;
const LEADERBOARD_KEY = "bree-reak-star-catcher-leaderboard";
const STAR_COLORS = [
  "hsl(50 95% 60%)",
  "hsl(330 85% 62%)",
  "hsl(185 80% 55%)",
  "hsl(145 70% 50%)",
  "hsl(25 95% 60%)",
];

const IconBombDoodle = ({ color = "currentColor" }: { color?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-md">
    <path
      d="M18 18 C11 22, 9 31, 15 37 C21 43, 32 42, 37 35 C42 28, 38 20, 30 17 C26 15, 22 15, 18 18Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      opacity="0.9"
    />
    <path
      d="M28 17 C31 11, 36 8, 41 8"
      stroke="hsl(var(--crayon-orange))"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M39 6 L41 8 L44 7 M40 12 L41 8 L38 5"
      stroke="hsl(var(--crayon-yellow))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="22" cy="27" r="2" fill="hsl(var(--background))" opacity="0.5" />
  </svg>
);

const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

const scoreRun = (elapsedMs: number, bombsHit: number, maxCombo: number) => {
  const timeBonus = Math.max(0, GAME_DURATION * 1000 - elapsedMs) / 1000 * 120;
  const comboBonus = maxCombo * 35;
  const bombPenalty = bombsHit * 180;
  return Math.max(100, Math.round(1000 + timeBonus + comboBonus - bombPenalty));
};

const readLeaderboard = (): ScoreEntry[] => {
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const saveLeaderboard = (entries: ScoreEntry[]) => {
  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 5)));
  } catch {
    return;
  }
};

// Lightweight sound system using Web Audio API
const useSounds = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<ReturnType<typeof createSounds> | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      try { ctxRef.current = new AudioContext(); } catch { return null; }
    }
    return ctxRef.current;
  }, []);

  const createSounds = useCallback(() => {
    const playCatch = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } catch {
        return;
      }
    };

    const playCombo = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        [800, 1000, 1300].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.12);
        });
      } catch {
        return;
      }
    };

    const playBomb = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.28);
      } catch {
        return;
      }
    };

    const playWin = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.3);
        });
      } catch {
        return;
      }
    };

    const playLose = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch {
        return;
      }
    };

    const playTick = () => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      } catch {
        return;
      }
    };

    return { playCatch, playCombo, playBomb, playWin, playLose, playTick };
  }, [getCtx]);

  if (!soundsRef.current) {
    soundsRef.current = createSounds();
  }

  return soundsRef.current;
};

const StarCatcherGame = ({ onUnlock }: StarCatcherProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [items, setItems] = useState<FallingItem[]>([]);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bombsHit, setBombsHit] = useState(0);
  const [lastCatchPos, setLastCatchPos] = useState<{ x: number; y: number } | null>(null);
  const [floatingNotice, setFloatingNotice] = useState("");
  const [showCombo, setShowCombo] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);
  const caughtItemIdsRef = useRef(new Set<number>());
  const animFrameRef = useRef<number>();
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const lastCatchRef = useRef(0);
  const startedAtRef = useRef(0);
  const sounds = useSounds();

  useEffect(() => {
    setLeaderboard(readLeaderboard());
  }, []);

  const spawnItem = useCallback(() => {
    const canvasWidth = canvasRef.current?.offsetWidth ?? 300;
    const shouldSpawnBomb = itemIdRef.current > 2 && Math.random() < BOMB_CHANCE;
    const itemType = shouldSpawnBomb ? "bomb" : "star";
    const newItem: FallingItem = {
      id: itemIdRef.current++,
      type: itemType,
      x: Math.random() * (canvasWidth - 48) + 24,
      y: -36,
      size: itemType === "bomb" ? 34 + Math.random() * 12 : 30 + Math.random() * 18,
      speed: itemType === "bomb" ? 1.1 + Math.random() * 1.7 : 0.9 + Math.random() * 1.6,
      color:
        itemType === "bomb"
          ? "hsl(var(--foreground))"
          : STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      caught: false,
    };
    setItems((prev) => [...prev.slice(-32), newItem]);
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setCaught(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setCombo(0);
    setMaxCombo(0);
    setBombsHit(0);
    setResult(null);
    setIsNewHighScore(false);
    setFloatingNotice("");
    itemIdRef.current = 0;
    caughtItemIdsRef.current.clear();
    lastCatchRef.current = 0;
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const update = () => {
      const canvasHeight = canvasRef.current?.offsetHeight ?? 400;
      setItems((prev) =>
        prev
          .map((item) => (item.caught ? item : { ...item, y: item.y + item.speed }))
          .filter((item) => {
            if (item.caught && item.caughtAt && Date.now() - item.caughtAt > 600) return false;
            return item.y < canvasHeight + 44 || item.caught;
          })
      );
      animFrameRef.current = requestAnimationFrame(update);
    };
    animFrameRef.current = requestAnimationFrame(update);

    spawnIntervalRef.current = setInterval(spawnItem, 540);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, spawnItem]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft <= 5 && timeLeft > 0) {
      sounds.playTick();
    }
  }, [timeLeft, gameState, sounds]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (caught >= STARS_TO_CATCH) {
      const elapsedMs = Date.now() - startedAtRef.current;
      const finalResult = {
        score: scoreRun(elapsedMs, bombsHit, maxCombo),
        elapsedMs,
        bombsHit,
        maxCombo,
      };
      const nextEntry: ScoreEntry = {
        id: `${Date.now()}`,
        name: "visitor",
        createdAt: new Date().toISOString(),
        ...finalResult,
      };
      const nextLeaderboard = [...leaderboard, nextEntry]
        .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs)
        .slice(0, 5);

      setResult(finalResult);
      setLeaderboard(nextLeaderboard);
      saveLeaderboard(nextLeaderboard);
      setIsNewHighScore(nextLeaderboard[0]?.id === nextEntry.id);
      setGameState("won");
      sounds.playWin();
      onUnlock();
    } else if (timeLeft <= 0) {
      setGameState("lost");
      sounds.playLose();
    }
  }, [caught, timeLeft, gameState, onUnlock, sounds, bombsHit, maxCombo, leaderboard]);

  const catchStar = useCallback((item: FallingItem) => {
    if (caughtItemIdsRef.current.has(item.id)) return;

    const now = Date.now();
    const isCombo = now - lastCatchRef.current < 800;
    caughtItemIdsRef.current.add(item.id);
    lastCatchRef.current = now;

    setItems((prev) =>
      prev.map((current) =>
        current.id === item.id && !current.caught
          ? { ...current, caught: true, caughtAt: now }
          : current
      )
    );
    setCaught((c) => Math.min(c + 1, STARS_TO_CATCH));
    setLastCatchPos({ x: item.x, y: item.y });
    setFloatingNotice("");

    if (isCombo) {
      setCombo((c) => {
        const nextCombo = c + 1;
        setMaxCombo((m) => Math.max(m, nextCombo + 1));
        return nextCombo;
      });
      setShowCombo(true);
      sounds.playCombo();
      setTimeout(() => setShowCombo(false), 600);
    } else {
      setCombo(0);
      setMaxCombo((m) => Math.max(m, 1));
      sounds.playCatch();
    }

    if (navigator.vibrate) {
      navigator.vibrate(isCombo ? [30, 20, 30] : 20);
    }
  }, [sounds]);

  const hitBomb = useCallback((item: FallingItem) => {
    if (caughtItemIdsRef.current.has(item.id)) return;

    const now = Date.now();
    caughtItemIdsRef.current.add(item.id);
    setItems((prev) =>
      prev.map((current) =>
        current.id === item.id && !current.caught
          ? { ...current, caught: true, caughtAt: now }
          : current
      )
    );
    setCaught((c) => Math.max(0, c - BOMB_PENALTY));
    setCombo(0);
    setBombsHit((b) => b + 1);
    setLastCatchPos({ x: item.x, y: item.y });
    setFloatingNotice(`-${BOMB_PENALTY} stars!`);
    sounds.playBomb();
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 220);
    setTimeout(() => setFloatingNotice(""), 700);

    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }, [sounds]);

  const catchItemAtPoint = useCallback((x: number, y: number) => {
    if (gameState !== "playing") return;

    const target = items
      .filter((item) => !item.caught && !caughtItemIdsRef.current.has(item.id))
      .map((item) => ({
        item,
        distance: Math.hypot(item.x - x, item.y - y),
        radius: item.type === "bomb" ? Math.max(36, item.size * 0.95) : Math.max(CATCH_RADIUS, item.size * 1.2),
      }))
      .filter(({ distance, radius }) => distance <= radius)
      .sort((a, b) => a.distance - b.distance)[0]?.item;

    if (!target) return;
    if (target.type === "bomb") hitBomb(target);
    else catchStar(target);
  }, [catchStar, gameState, hitBomb, items]);

  const handlePointerCatch = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    catchItemAtPoint(e.clientX - rect.left, e.clientY - rect.top);
  }, [catchItemAtPoint]);

  return (
    <div className="sketchy-border-yellow bg-card p-4 md:p-6 max-w-2xl md:max-w-3xl mx-auto">
      <h3 className="text-2xl font-heading font-bold text-crayon-yellow text-center mb-2 flex items-center justify-center gap-2">
        <IconStarFilled className="text-crayon-yellow" size={24} /> Star Catcher <IconStarFilled className="text-crayon-yellow" size={24} />
      </h3>

      {gameState === "idle" && (
        <div className="text-center">
          <p className="font-hand text-lg text-muted-foreground mb-4">
            Catch <span className="text-crayon-yellow font-bold">{STARS_TO_CATCH} falling stars</span> before the timer ends.
            Dodge the doodle bombs or lose <span className="text-crayon-pink font-bold">{BOMB_PENALTY} stars</span>.
          </p>
          <button onClick={startGame} className="crayon-btn-primary text-lg inline-flex items-center gap-2 active:scale-95 transition-transform">
            Start Game <IconStarFilled className="text-crayon-yellow" size={20} />
          </button>

          {leaderboard.length > 0 && (
            <div className="mt-6 text-left max-w-sm mx-auto sketchy-border bg-background/60 p-4">
              <p className="font-heading text-xl text-crayon-pink flex items-center gap-2 mb-2">
                <IconCrown className="text-crayon-yellow" size={22} /> Local leaderboard
              </p>
              <ol className="space-y-1 font-mono text-sm text-muted-foreground">
                {leaderboard.map((entry, index) => (
                  <li key={entry.id} className="flex justify-between gap-3">
                    <span>{index + 1}. {entry.name}</span>
                    <span>{entry.score} pts</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="grid grid-cols-3 items-center gap-2 mb-3 font-hand text-lg">
            <span className="text-crayon-green font-bold inline-flex items-center gap-1">
              <IconStarFilled className="text-crayon-yellow" size={18} /> {caught}/{STARS_TO_CATCH}
            </span>
            <span className={`justify-self-center font-bold inline-flex items-center gap-1 transition-all ${
              timeLeft <= 5 ? "text-crayon-pink animate-pulse scale-110" : "text-crayon-cyan"
            }`}>
              <IconTimer size={18} /> {timeLeft}s
            </span>
            <span className="justify-self-end text-crayon-pink font-bold">
              bombs: {bombsHit}
            </span>
          </div>

          <div className="w-full h-3 bg-muted rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-crayon-yellow rounded-full transition-all duration-300"
              style={{
                width: `${(caught / STARS_TO_CATCH) * 100}%`,
                boxShadow: caught > 0 ? "0 0 10px hsl(50 95% 60% / 0.6)" : "none",
              }}
            />
          </div>

          <div
            ref={canvasRef}
            onPointerDown={handlePointerCatch}
            onPointerMove={handlePointerCatch}
            className={`relative w-full h-72 md:h-96 bg-background rounded-lg overflow-hidden select-none cursor-crosshair transition-transform duration-100 ${
              screenShake ? "translate-x-[4px] -rotate-1" : ""
            }`}
            style={{
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              border: "2px solid hsl(var(--border))",
              touchAction: "none",
            }}
            aria-label="Move through falling stars to catch them and avoid bombs"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`bg-${i}`}
                className="absolute rounded-full bg-crayon-yellow/20"
                style={{
                  width: 2,
                  height: 2,
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 53 + 17) % 100}%`,
                }}
              />
            ))}

            {(showCombo || floatingNotice) && lastCatchPos && (
              <div
                className="absolute pointer-events-none animate-bounce-in z-10"
                style={{
                  left: lastCatchPos.x - 28,
                  top: lastCatchPos.y - 34,
                }}
              >
                <span className={`font-heading font-bold text-lg drop-shadow-md ${floatingNotice ? "text-crayon-pink" : "text-crayon-green"}`}>
                  {floatingNotice || (combo >= 3 ? "COMBO!" : `x${combo + 1}!`)}
                </span>
              </div>
            )}

            {items.map((item) =>
              item.caught ? (
                <div
                  key={item.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: item.x - item.size / 2,
                    top: item.y - item.size / 2,
                    animation: "star-catch 0.5s ease-out forwards",
                  }}
                >
                  {item.type === "bomb" ? (
                    <IconSparkle size={item.size * 0.9} className="text-crayon-pink" />
                  ) : (
                    <IconSparkle size={item.size * 0.8} className="text-crayon-yellow" />
                  )}
                </div>
              ) : (
                <div
                  key={item.id}
                  className={`absolute pointer-events-none transition-none ${item.type === "bomb" ? "animate-pulse" : ""}`}
                  style={{
                    left: item.x - item.size / 2,
                    top: item.y - item.size / 2,
                    width: item.size,
                    height: item.size,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {item.type === "bomb" ? (
                    <IconBombDoodle color={item.color} />
                  ) : (
                    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-sm">
                      <path
                        d="M20 2 L23 15 L36 15 L25 23 L29 36 L20 28 L11 36 L15 23 L4 15 L17 15 Z"
                        fill={item.color}
                        stroke={item.color}
                        strokeWidth="1"
                      />
                    </svg>
                  )}
                </div>
              )
            )}
          </div>
        </>
      )}

      {gameState === "won" && (
        <div className="relative text-center py-4 overflow-hidden">
          {isNewHighScore && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-crayon-yellow"
                  style={{
                    left: "50%",
                    top: "35%",
                    animation: "confetti-burst 900ms ease-out forwards",
                    animationDelay: `${i * 35}ms`,
                    ["--confetti-x" as string]: `${Math.cos(i) * (90 + i * 7)}px`,
                    ["--confetti-y" as string]: `${Math.sin(i * 1.7) * (70 + i * 5)}px`,
                  }}
                >
                  *
                </span>
              ))}
            </div>
          )}
          <IconParty className="text-crayon-yellow mx-auto mb-3" size={42} />
          <p className="text-2xl font-heading font-bold text-crayon-green mb-2">
            {isNewHighScore ? "New high score!" : "You did it!"}
          </p>
          <p className="font-hand text-lg text-muted-foreground">
            {result
              ? `${result.score} points in ${formatTime(result.elapsedMs)} with ${result.bombsHit} bomb hits.`
              : `You caught ${caught} stars!`}
          </p>
          {isNewHighScore && (
            <p className="mt-2 text-crayon-pink font-heading text-xl animate-bounce-in">
              the doodle crown is yours
            </p>
          )}
          <div className="mt-5 max-w-sm mx-auto text-left sketchy-border bg-background/60 p-4">
            <p className="font-heading text-xl text-crayon-pink flex items-center gap-2 mb-2">
              <IconCrown className="text-crayon-yellow" size={22} /> Local leaderboard
            </p>
            <ol className="space-y-1 font-mono text-sm text-muted-foreground">
              {leaderboard.map((entry, index) => (
                <li key={entry.id} className="flex justify-between gap-3">
                  <span>{index + 1}. {entry.name}</span>
                  <span>{entry.score} pts</span>
                </li>
              ))}
            </ol>
          </div>
          <button onClick={startGame} className="mt-5 crayon-btn-accent text-lg inline-flex items-center gap-2 active:scale-95 transition-transform">
            Play again <IconStarFilled className="text-crayon-yellow" size={20} />
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="text-center py-4">
          <IconDiamond className="text-crayon-cyan mx-auto mb-3" size={42} />
          <p className="text-2xl font-heading font-bold text-crayon-pink mb-2">
            Time's up!
          </p>
          <p className="font-hand text-lg text-muted-foreground mb-4">
            You caught {caught}/{STARS_TO_CATCH} stars and bumped {bombsHit} bombs.
          </p>
          <button onClick={startGame} className="crayon-btn-accent text-lg inline-flex items-center gap-2 active:scale-95 transition-transform">
            Try again <IconStarFilled className="text-crayon-yellow" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default StarCatcherGame;
