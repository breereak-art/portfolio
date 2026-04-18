import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { IconRocket, IconPlanet, IconStarFilled, IconSatellite, IconHouse, IconShop, IconConstruction, IconCoffee, IconCar, IconWindPuff } from "./HandDrawnIcons";

const sections = [
  { id: "hero", darkLabel: "Launch Pad", lightLabel: "Home" },
  { id: "about", darkLabel: "Planet Me", lightLabel: "About Town" },
  { id: "projects", darkLabel: "Star Station", lightLabel: "Project Ave" },
  { id: "contact", darkLabel: "Mission Control", lightLabel: "Contact Cafe" },
];

const darkIcons = [IconRocket, IconPlanet, IconStarFilled, IconSatellite];
const lightIcons = [IconHouse, IconShop, IconConstruction, IconCoffee];

const ScrollCompanion = () => {
  const { theme } = useTheme();
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const isDark = theme === "dark";
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const lastSoundTime = useRef(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playScrollSound = useCallback(() => {
    const now = Date.now();
    if (now - lastSoundTime.current < 800) return;
    lastSoundTime.current = now;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);

      if (isDark) {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
      } else {
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(420, ctx.currentTime);
        oscillator.frequency.setValueAtTime(380, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Audio not supported
    }
  }, [isDark]);

  useEffect(() => {
    let ticking = false;
    let prevSection = 0;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sectionEls = sections.map((s) =>
            s.id === "hero" ? document.querySelector("section") : document.getElementById(s.id)
          );

          const scrollTop = window.scrollY;
          const viewportH = window.innerHeight;

          let active = 0;
          let progress = 0;

          for (let i = 0; i < sectionEls.length; i++) {
            const el = sectionEls[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportH / 2) {
                active = i;
              }
            }
          }

          if (active < sectionEls.length - 1) {
            const currentEl = sectionEls[active];
            const nextEl = sectionEls[active + 1];
            if (currentEl && nextEl) {
              const currentTop = currentEl.getBoundingClientRect().top + scrollTop;
              const nextTop = nextEl.getBoundingClientRect().top + scrollTop;
              const sectionSpan = nextTop - currentTop;
              if (sectionSpan > 0) {
                progress = Math.max(0, Math.min(1, (scrollTop - currentTop + viewportH / 2) / sectionSpan));
              }
            }
          } else {
            progress = 1;
          }

          setCurrentSection(active);
          setSectionProgress(progress);

          if (active !== prevSection) {
            // playScrollSound();
            prevSection = active;
          }

          setIsMoving(true);
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => setIsMoving(false), 150);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [playScrollSound]);

  const railTop = 100;
  const railHeight = typeof window !== "undefined" ? window.innerHeight - 200 : 500;

  const stops = sections.map((_, i) => ({
    y: railTop + (i / (sections.length - 1)) * railHeight,
  }));

  const currentStopY = stops[currentSection]?.y ?? railTop;
  const nextStopY = stops[Math.min(currentSection + 1, sections.length - 1)]?.y ?? currentStopY;
  const companionY = currentStopY + (nextStopY - currentStopY) * sectionProgress;

  const trailParticles = isDark && isMoving
    ? Array.from({ length: 8 }).map((_, i) => ({
        offsetY: 10 + i * 6,
        offsetX: Math.sin(i * 1.5) * 4,
        size: 4 - i * 0.4,
        opacity: 1 - i * 0.12,
      }))
    : [];

  return (
    <div className="fixed left-3 md:left-6 top-0 bottom-0 z-40 pointer-events-none hidden md:block">
      {/* Road / Trail line */}
      <svg
        className="absolute left-4 top-0 h-full w-2"
        style={{ overflow: "visible" }}
      >
        {isDark ? (
          <line
            x1="4" y1={railTop} x2="4" y2={railTop + railHeight}
            stroke="hsl(50 95% 60% / 0.2)" strokeWidth="2" strokeDasharray="4 8"
          />
        ) : (
          <>
            <line
              x1="4" y1={railTop} x2="4" y2={railTop + railHeight}
              stroke="hsl(220 15% 25% / 0.3)" strokeWidth="6" strokeLinecap="round"
            />
            <line
              x1="4" y1={railTop} x2="4" y2={railTop + railHeight}
              stroke="hsl(50 95% 55% / 0.6)" strokeWidth="1.5" strokeDasharray="8 12"
            />
          </>
        )}
      </svg>

      {/* Section stops */}
      {stops.map((stop, i) => {
        const StopIcon = isDark ? darkIcons[i] : lightIcons[i];
        return (
          <div
            key={i}
            className="absolute left-0 transition-all duration-300"
            style={{ top: stop.y - 6 }}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                currentSection === i
                  ? isDark
                    ? "bg-crayon-yellow text-background scale-110"
                    : "bg-crayon-green text-primary-foreground scale-110"
                  : isDark
                  ? "bg-muted text-muted-foreground"
                  : "bg-card text-muted-foreground border-2 border-border"
              }`}
              style={{
                boxShadow: currentSection === i ? "var(--shadow-sketchy)" : "none",
              }}
            >
              <StopIcon size={18} />
            </div>

            <div
              className={`absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-hand transition-all duration-300 ${
                currentSection === i
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              <span
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-card text-crayon-yellow" : "bg-card text-foreground"
                }`}
                style={{
                  borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                  border: `2px solid ${isDark ? "hsl(50 95% 60% / 0.4)" : "hsl(220 15% 25% / 0.2)"}`,
                }}
              >
                {isDark ? sections[i].darkLabel : sections[i].lightLabel}
              </span>
            </div>
          </div>
        );
      })}

      {/* The companion */}
      <div
        className="absolute left-0 transition-all ease-out"
        style={{
          top: companionY - 12,
          transitionDuration: isMoving ? "80ms" : "400ms",
        }}
      >
        {isDark ? (
          <div className="relative">
            <div
              className={`transition-transform duration-200 ${isMoving ? "animate-pulse" : ""}`}
              style={{ filter: "drop-shadow(0 0 6px hsl(50 95% 60% / 0.5))" }}
            >
              <IconRocket className="text-crayon-yellow" size={28} />
            </div>
            {trailParticles.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.size, height: p.size,
                  top: p.offsetY, left: 10 + p.offsetX,
                  opacity: p.opacity,
                  background: i % 2 === 0 ? "hsl(25 95% 60%)" : "hsl(50 95% 60%)",
                  animation: `twinkle ${0.3 + i * 0.1}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              className="transition-transform duration-300"
              style={{
                filter: "drop-shadow(2px 2px 0 hsl(220 15% 25% / 0.2))",
                transform: isMoving ? "scale(1)" : "scale(1.1)",
              }}
            >
              <IconCar className="text-crayon-green" size={28} />
            </div>
            {isMoving && (
              <div className="absolute -bottom-1 -left-4">
                <IconWindPuff className="text-muted-foreground opacity-50" size={16} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollCompanion;
