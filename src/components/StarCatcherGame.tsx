import { useState, useEffect, useRef, useCallback } from "react";
import { IconStarFilled, IconSparkle, IconParty, IconDiamond, IconTimer } from "./HandDrawnIcons";

interface StarCatcherProps {
  onUnlock: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  caught: boolean;
  caughtAt?: number;
}

const STARS_TO_CATCH = 15;
const GAME_DURATION = 20;
const STAR_COLORS = [
  "hsl(50 95% 60%)",
  "hsl(330 85% 62%)",
  "hsl(185 80% 55%)",
  "hsl(145 70% 50%)",
  "hsl(25 95% 60%)",
];

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

    return { playCatch, playCombo, playWin, playLose, playTick };
  }, [getCtx]);

  if (!soundsRef.current) {
    soundsRef.current = createSounds();
  }

  return soundsRef.current;
};

const StarCatcherGame = ({ onUnlock }: StarCatcherProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [stars, setStars] = useState<Star[]>([]);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [lastCatchPos, setLastCatchPos] = useState<{ x: number; y: number } | null>(null);
  const [showCombo, setShowCombo] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const starIdRef = useRef(0);
  const animFrameRef = useRef<number>();
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const lastCatchRef = useRef(0);
  const sounds = useSounds();

  const spawnStar = useCallback(() => {
    const canvasWidth = canvasRef.current?.offsetWidth ?? 300;
    const newStar: Star = {
      id: starIdRef.current++,
      x: Math.random() * (canvasWidth - 40) + 20,
      y: -30,
      size: 24 + Math.random() * 18,
      speed: 1.5 + Math.random() * 2.5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      caught: false,
    };
    setStars((prev) => [...prev.slice(-30), newStar]);
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setCaught(0);
    setTimeLeft(GAME_DURATION);
    setStars([]);
    setCombo(0);
    starIdRef.current = 0;
    lastCatchRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const update = () => {
      const canvasHeight = canvasRef.current?.offsetHeight ?? 400;
      setStars((prev) =>
        prev
          .map((s) => (s.caught ? s : { ...s, y: s.y + s.speed }))
          .filter((s) => {
            if (s.caught && s.caughtAt && Date.now() - s.caughtAt > 600) return false;
            return s.y < canvasHeight + 40 || s.caught;
          })
      );
      animFrameRef.current = requestAnimationFrame(update);
    };
    animFrameRef.current = requestAnimationFrame(update);

    spawnIntervalRef.current = setInterval(spawnStar, 500);

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
  }, [gameState, spawnStar]);

  // Time warning tick
  useEffect(() => {
    if (gameState === "playing" && timeLeft <= 5 && timeLeft > 0) {
      sounds.playTick();
    }
  }, [timeLeft, gameState, sounds]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (caught >= STARS_TO_CATCH) {
      setGameState("won");
      sounds.playWin();
      onUnlock();
    } else if (timeLeft <= 0) {
      setGameState("lost");
      sounds.playLose();
    }
  }, [caught, timeLeft, gameState, onUnlock, sounds]);

  const catchStar = useCallback((id: number, x: number, y: number) => {
    const now = Date.now();
    const isCombo = now - lastCatchRef.current < 800;
    lastCatchRef.current = now;

    setStars((prev) =>
      prev.map((s) => (s.id === id && !s.caught ? { ...s, caught: true, caughtAt: now } : s))
    );
    setCaught((c) => c + 1);
    setLastCatchPos({ x, y });

    if (isCombo) {
      setCombo((c) => c + 1);
      setShowCombo(true);
      sounds.playCombo();
      setTimeout(() => setShowCombo(false), 600);
    } else {
      setCombo(0);
      sounds.playCatch();
    }

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(isCombo ? [30, 20, 30] : 20);
    }

    // Screen shake for combos
    if (isCombo) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 150);
    }
  }, [sounds]);

  return (
    <div className="sketchy-border-yellow bg-card p-4 md:p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-heading font-bold text-crayon-yellow text-center mb-2 flex items-center justify-center gap-2">
        <IconStarFilled className="text-crayon-yellow" size={24} /> Star Catcher <IconStarFilled className="text-crayon-yellow" size={24} />
      </h3>

      {gameState === "idle" && (
        <div className="text-center">
          <p className="font-hand text-lg text-muted-foreground mb-4">
            Catch <span className="text-crayon-yellow font-bold">{STARS_TO_CATCH} falling stars</span> in {GAME_DURATION} seconds to unlock a secret project!
          </p>
          <button onClick={startGame} className="crayon-btn-primary text-lg inline-flex items-center gap-2 active:scale-95 transition-transform">
            Start Game <IconStarFilled className="text-crayon-yellow" size={20} />
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between items-center mb-3 font-hand text-lg">
            <span className="text-crayon-green font-bold inline-flex items-center gap-1">
              <IconStarFilled className="text-crayon-yellow" size={18} /> {caught}/{STARS_TO_CATCH}
            </span>
            <span className={`font-bold inline-flex items-center gap-1 transition-all ${
              timeLeft <= 5 ? "text-crayon-pink animate-pulse scale-110" : "text-crayon-cyan"
            }`}>
              <IconTimer size={18} /> {timeLeft}s
            </span>
          </div>

          {/* Progress bar with glow */}
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
            className={`relative w-full h-64 md:h-80 bg-background rounded-lg overflow-hidden select-none transition-transform duration-100 ${
              screenShake ? "translate-x-[2px]" : ""
            }`}
            style={{
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              border: "2px solid hsl(var(--border))",
              touchAction: "manipulation",
            }}
          >
            {/* Background dots */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`bg-${i}`}
                className="absolute rounded-full bg-crayon-yellow/20"
                style={{
                  width: 2, height: 2,
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 53 + 17) % 100}%`,
                }}
              />
            ))}

            {/* Combo indicator */}
            {showCombo && lastCatchPos && (
              <div
                className="absolute pointer-events-none animate-bounce-in z-10"
                style={{
                  left: lastCatchPos.x - 20,
                  top: lastCatchPos.y - 30,
                }}
              >
                <span className="text-crayon-pink font-heading font-bold text-lg drop-shadow-md">
                  {combo >= 3 ? "COMBO!" : `x${combo + 1}!`}
                </span>
              </div>
            )}

            {stars.map((star) =>
              star.caught ? (
                <div
                  key={star.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: star.x - star.size / 2,
                    top: star.y - star.size / 2,
                    animation: "star-catch 0.5s ease-out forwards",
                  }}
                >
                  <IconSparkle size={star.size * 0.8} className="text-crayon-yellow" />
                </div>
              ) : (
                <button
                  key={star.id}
                  className="absolute transition-none hover:scale-125 active:scale-75 focus:outline-none"
                  style={{
                    left: star.x - star.size / 2,
                    top: star.y - star.size / 2,
                    width: star.size + 8,
                    height: star.size + 8,
                    padding: 4,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onClick={() => catchStar(star.id, star.x, star.y)}
                >
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-sm">
                    <path
                      d="M20 2 L23 15 L36 15 L25 23 L29 36 L20 28 L11 36 L15 23 L4 15 L17 15 Z"
                      fill={star.color}
                      stroke={star.color}
                      strokeWidth="1"
                    />
                  </svg>
                </button>
              )
            )}
          </div>
        </>
      )}

      {gameState === "won" && (
        <div className="text-center py-4">
          <IconParty className="text-crayon-yellow mx-auto mb-3" size={42} />
          <p className="text-2xl font-heading font-bold text-crayon-green mb-2">
            You did it!
          </p>
          <p className="font-hand text-lg text-muted-foreground">
            You caught {caught} stars! Secret project unlocked below.
          </p>
        </div>
      )}

      {gameState === "lost" && (
        <div className="text-center py-4">
          <IconDiamond className="text-crayon-cyan mx-auto mb-3" size={42} />
          <p className="text-2xl font-heading font-bold text-crayon-pink mb-2">
            Time's up!
          </p>
          <p className="font-hand text-lg text-muted-foreground mb-4">
            You caught {caught}/{STARS_TO_CATCH} stars. So close!
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
