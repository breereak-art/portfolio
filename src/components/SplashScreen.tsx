import { useState, useEffect, useCallback } from "react";
import { IconSparkle, IconWarning, IconPalette, IconDoor, IconSmiley, IconSun, IconMoon } from "./HandDrawnIcons";
import { useTheme } from "./ThemeProvider";

interface SplashScreenProps {
  onEnter: () => void;
  onDone?: () => void;
}

// Hand-drawn SVG doodles
const DoodleStar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 2 L23 15 L36 15 L25 23 L29 36 L20 28 L11 36 L15 23 L4 15 L17 15 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
);

const DoodleSpiral = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 30 C30 25, 35 20, 30 15 C25 10, 15 15, 15 25 C15 35, 25 45, 35 45 C45 45, 50 35, 50 25 C50 10, 35 0, 20 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const DoodleHeart = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 35 C15 30, 3 22, 5 13 C7 5, 15 5, 20 12 C25 5, 33 5, 35 13 C37 22, 25 30, 20 35Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      opacity="0.2"
    />
  </svg>
);

const DoodleArrow = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 15 C15 14, 35 16, 50 15 M40 8 L52 15 L40 22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoodleCloud = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 30 C5 30, 2 22, 10 18 C8 10, 18 5, 28 10 C32 3, 48 3, 50 10 C60 6, 72 12, 68 22 C75 25, 72 32, 62 30 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      opacity="0.1"
    />
  </svg>
);

// Floating doodle elements
const floatingDoodles = [
  { Component: DoodleStar, x: "10%", y: "15%", size: 30, delay: 0, color: "text-crayon-yellow" },
  { Component: DoodleStar, x: "85%", y: "20%", size: 24, delay: 0.5, color: "text-crayon-pink" },
  { Component: DoodleStar, x: "70%", y: "10%", size: 20, delay: 1, color: "text-crayon-cyan" },
  { Component: DoodleSpiral, x: "5%", y: "60%", size: 50, delay: 0.3, color: "text-crayon-green" },
  { Component: DoodleSpiral, x: "90%", y: "55%", size: 40, delay: 0.8, color: "text-crayon-orange" },
  { Component: DoodleHeart, x: "20%", y: "80%", size: 28, delay: 0.2, color: "text-crayon-pink" },
  { Component: DoodleHeart, x: "75%", y: "75%", size: 22, delay: 0.7, color: "text-crayon-pink" },
  { Component: DoodleCloud, x: "30%", y: "8%", size: 70, delay: 0.4, color: "text-muted-foreground" },
  { Component: DoodleCloud, x: "60%", y: "85%", size: 60, delay: 0.9, color: "text-muted-foreground" },
  { Component: DoodleStar, x: "50%", y: "5%", size: 18, delay: 1.2, color: "text-crayon-yellow" },
  { Component: DoodleArrow, x: "15%", y: "45%", size: 50, delay: 0.6, color: "text-crayon-blue" },
  { Component: DoodleStar, x: "92%", y: "40%", size: 16, delay: 1.1, color: "text-crayon-green" },
];

// Swoosh sound using Web Audio API
const playSwoosh = () => {
  try {
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(800, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    bandpass.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.5);
  } catch {
    return;
  }
};

const SplashScreen = ({ onEnter, onDone }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"intro" | "entering" | "reveal" | "done">("intro");
  const [textVisible, setTextVisible] = useState(false);
  const [warningsVisible, setWarningsVisible] = useState([false, false, false]);
  const [buttonVisible, setButtonVisible] = useState(false);
  const { theme, toggle } = useTheme();
  const [themeFlash, setThemeFlash] = useState(false);
  const isEntering = phase !== "intro";

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
    setThemeFlash(true);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => setThemeFlash(false), 600);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 300);
    const t2 = setTimeout(() => setWarningsVisible([true, false, false]), 800);
    const t3 = setTimeout(() => setWarningsVisible([true, true, false]), 1200);
    const t4 = setTimeout(() => setWarningsVisible([true, true, true]), 1600);
    const t5 = setTimeout(() => setButtonVisible(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  const handleEnter = useCallback(() => {
    playSwoosh();
    if (navigator.vibrate) navigator.vibrate(30);
    onEnter();
    setPhase("entering");
    setTimeout(() => {
      setPhase("reveal");
    }, 1080);
    setTimeout(() => {
      setPhase("done");
      onDone?.();
    }, 1580);
  }, [onDone, onEnter]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-700`}
      style={{
        background: phase === "reveal" ? "transparent" : "hsl(var(--background))",
      }}
    >
      {/* Floating doodles */}
      {floatingDoodles.map((doodle, i) => (
        <doodle.Component
          key={i}
          className={`absolute ${doodle.color} ${themeFlash ? "theme-flash-doodle" : ""}`}
          style={{
            left: doodle.x,
            top: doodle.y,
            width: doodle.size,
            height: doodle.size,
            opacity: isEntering ? 0 : 0.6,
            animation: phase === "intro" ? `splash-float ${3 + i * 0.3}s ease-in-out infinite ${doodle.delay}s` : "none",
            transform: isEntering ? "scale(0.92) rotate(8deg)" : "none",
            transition: "opacity 220ms ease, transform 520ms ease",
            filter: themeFlash ? `hue-rotate(${90 + i * 30}deg)` : "none",
          }}
        />
      ))}

      {/* Portal tunnel effect */}
      {isEntering && phase !== "done" && (
        <div
          className={`portal-layer ${phase === "reveal" ? "portal-layer-reveal" : ""}`}
        >
          <div className="portal-wash" />
          <div className="portal-vortex" />

          {[
            "hsl(var(--crayon-pink) / 0.58)",
            "hsl(var(--crayon-yellow) / 0.55)",
            "hsl(var(--crayon-cyan) / 0.5)",
            "hsl(var(--crayon-green) / 0.45)",
            "hsl(var(--crayon-orange) / 0.4)",
            "hsl(var(--crayon-blue) / 0.34)",
          ].map((color, i) => (
            <span
              key={i}
              className="portal-ring"
              style={
                {
                  "--ring-color": color,
                  "--ring-delay": `${i * 70}ms`,
                  "--ring-rotate": `${i * 18}deg`,
                } as React.CSSProperties
              }
            />
          ))}

          <div className="portal-center" />
          <div className="portal-flash" />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-10 text-center px-6 max-w-lg mx-auto transition-all duration-700 ${
          isEntering
            ? "scale-50 opacity-0 rotate-[8deg] blur-sm"
            : ""
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
        }}
      >
        {/* Title */}
        <h1
          className={`text-4xl md:text-6xl font-heading font-bold mb-6 transition-all duration-700 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-foreground">welcome to my</span>
          <br />
          <span className="text-crayon-pink">lil world</span>
          <IconSparkle className="text-crayon-yellow inline-block ml-2" size={32} />
        </h1>

        {/* Warnings */}
        <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
          <p
            className={`font-hand text-lg text-muted-foreground transition-all duration-500 flex items-start gap-2 ${
              warningsVisible[0] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <IconWarning className="text-crayon-yellow shrink-0 mt-0.5" size={22} />
            <span>the website you are about to enter may contain{" "}
            <span className="text-crayon-cyan font-bold">JavaScript</span>,{" "}
            <span className="text-crayon-pink font-bold">bright colours</span>,
            and excessive <span className="text-crayon-yellow font-bold">cuteness</span></span>
          </p>

          <p
            className={`font-hand text-lg text-muted-foreground transition-all duration-500 flex items-start gap-2 ${
              warningsVisible[1] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <IconPalette className="text-crayon-pink shrink-0 mt-0.5" size={22} />
            <span className="inline-flex items-center gap-2 flex-wrap">
              switch theme if too bright - your eyes will thank you
              <button
                onClick={handleThemeToggle}
                className="inline-flex items-center gap-1 px-3 py-1 font-heading font-bold text-base wiggle-hover"
                style={{
                  background: theme === "dark" ? "hsl(var(--crayon-yellow) / 0.2)" : "hsl(var(--crayon-navy) / 0.8)",
                  color: "hsl(var(--crayon-yellow))",
                  border: `2px solid ${theme === "dark" ? "hsl(var(--crayon-yellow) / 0.4)" : "hsl(var(--crayon-navy))"}`,
                  borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
              >
                {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
                {theme === "dark" ? "light" : "dark"}
              </button>
            </span>
          </p>

          <p
            className={`font-hand text-lg text-muted-foreground transition-all duration-500 flex items-start gap-2 ${
              warningsVisible[2] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <IconDoor className="text-crayon-green shrink-0 mt-0.5" size={22} />
            <span>by clicking this door, you agree to enter my land of{" "}
            <span className="text-crayon-green font-bold">fun</span> and{" "}
            <span className="text-crayon-pink font-bold">doodles</span></span>
          </p>
        </div>

        {/* Enter button */}
        <div className="inline-flex flex-col items-center">
          <button
            onClick={handleEnter}
            className={`group relative text-2xl font-heading font-bold px-10 py-5 transition-all duration-500 ${
              buttonVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-90"
            }`}
            style={{
              background: "hsl(var(--crayon-green))",
              color: "hsl(var(--primary-foreground))",
              border: "3px solid hsl(var(--crayon-green))",
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              boxShadow: "var(--shadow-sketchy)",
            }}
          >
            <span className="group-hover:scale-110 inline-flex items-center gap-2 transition-transform duration-200">
              <IconDoor size={28} /> open the door
            </span>

            <DoodleArrow
              className="absolute -right-16 top-1/2 -translate-y-1/2 w-14 text-crayon-yellow hidden md:block"
              style={{ transform: "translateY(-50%) rotate(-5deg)" }}
            />
          </button>

          <p
            className={`mt-3 max-w-[16rem] text-center text-sm font-hand text-muted-foreground transition-all duration-500 delay-300 inline-flex items-center justify-center gap-1 ${
              buttonVisible ? "opacity-70" : "opacity-0"
            }`}
          >
            <span>(don't worry, it's safe... mostly)</span>
            <IconSmiley className="text-crayon-yellow shrink-0" size={16} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
