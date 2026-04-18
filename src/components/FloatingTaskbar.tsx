import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { IconRocket, IconMoon, IconSun, IconStar, IconEnvelope, IconPlanet } from "./HandDrawnIcons";

const sections = [
  { label: "Launch Pad", href: "#", Icon: IconRocket, color: "text-crayon-orange" },
  { label: "Planet Me", href: "#about", Icon: IconPlanet, color: "text-crayon-cyan" },
  { label: "Star Station", href: "#projects", Icon: IconStar, color: "text-crayon-yellow" },
  { label: "Mission Control", href: "#contact", Icon: IconEnvelope, color: "text-crayon-pink" },
];

const FloatingTaskbar = () => {
  const [time, setTime] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [themeSwitching, setThemeSwitching] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setThemeSwitching(true);
    if (navigator.vibrate) navigator.vibrate(15);
    toggle();
    setTimeout(() => setThemeSwitching(false), 500);
  }, [toggle]);

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100vw-1rem)] items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 bg-card/90 backdrop-blur-sm border-2 border-border"
      style={{
        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
        boxShadow: "var(--shadow-sketchy)",
      }}
    >
      {sections.map((s, i) => (
        <a
          key={s.label}
          href={s.href}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          className="relative flex flex-col items-center px-1.5 sm:px-2 py-1 transition-all duration-200 group"
          style={{
            transform: hoveredIdx === i ? "translateY(-6px) scale(1.15)" : "translateY(0) scale(1)",
          }}
        >
          <s.Icon
            className={`${s.color} transition-transform duration-200 ${hoveredIdx === i ? "animate-wiggle-once" : ""}`}
            size={24}
          />
          <span className={`text-[10px] font-hand text-muted-foreground whitespace-nowrap transition-all duration-200 ${
            hoveredIdx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
          } absolute -top-5`}>
            {s.label}
          </span>
        </a>
      ))}

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Theme toggle */}
      <button
        onClick={handleThemeToggle}
        className={`relative flex flex-col items-center px-1.5 sm:px-2 py-1 transition-all duration-200 ${themeSwitching ? "theme-switching" : ""}`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <IconSun className="text-crayon-yellow" size={22} />
        ) : (
          <IconMoon className="text-crayon-blue" size={22} />
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Clock */}
      <div className="flex flex-col items-center px-1.5 sm:px-2">
        <IconMoon className="text-crayon-yellow" size={16} />
        <span className="text-[10px] font-mono text-muted-foreground leading-none mt-0.5">{time}</span>
        <span className="text-[8px] font-hand text-muted-foreground leading-none">lil world time</span>
      </div>
    </div>
  );
};

export default FloatingTaskbar;
