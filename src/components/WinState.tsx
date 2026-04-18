import { useState, useEffect, useCallback } from "react";
import { IconStarFilled, IconSparkle } from "./HandDrawnIcons";

const FUN_MESSAGES = [
  "you absolute legend!",
  "you found all the secrets!",
  "world domination starts now",
  "official doodle genius 🏆",
  "stamp master unlocked",
  "you're officially cool",
  "bree would be proud",
  "top tier explorer vibes",
  "you did that!!",
  "that was kinda iconic tbh",
  "you've unlocked good karma",
  "gold star for you! ⭐",
  "the stamp gods are pleased",
  "legend says you're still smiling",
];

interface WinStateProps {
  onClose: () => void;
}

const DoodleConfetti = () => {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.2 + Math.random() * 0.8,
    size: 8 + Math.random() * 16,
    color: ["crayon-yellow", "crayon-pink", "crayon-green", "crayon-blue"][
      Math.floor(Math.random() * 4)
    ],
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 60,
  }));

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute text-${p.color} pointer-events-none`}
          style={{
            left: `${p.x}%`,
            top: "-20px",
            fontSize: `${p.size}px`,
            animationName: "confettiFall",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "ease-out",
            animationFillMode: "both",
            transform: `rotate(${p.rotation}deg)`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        >
          {[IconStarFilled, IconSparkle].map((Icon, ii) =>
            ii === p.id % 2 ? <Icon key={ii} size={p.size} /> : null
          )}
        </div>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) translateX(var(--drift)) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default function WinState({ onClose }: WinStateProps) {
  const [msg] = useState(
    () => FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)]
  );
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setLeaving(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-300 ${
        visible && !leaving ? "bg-foreground/70 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleSkip}
    >
      <DoodleConfetti />

      <div
        className={`relative transition-all duration-300 ${
          visible && !leaving
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 rotate-[-8deg]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-card border-[3px] border-foreground px-8 py-8 md:px-12 md:py-10 text-center max-w-xs mx-auto relative"
          style={{
            borderRadius: "22px 8px 22px 8px / 8px 22px 8px 22px",
            boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
          }}
        >
          <div className="text-4xl mb-2 animate-bounce">
            <IconStarFilled className="text-crayon-yellow inline-block" size={52} />
          </div>
          <p
            className="font-heading text-2xl md:text-3xl text-foreground mb-1 capitalize"
            style={{ transform: "rotate(-2deg)" }}
          >
            all stamps collected!
          </p>
          <p
            className="font-hand text-xl text-crayon-pink capitalize"
            style={{ transform: "rotate(1deg)" }}
          >
            {msg}
          </p>
          <button
            onClick={handleSkip}
            className="mt-6 bg-crayon-green text-foreground font-heading text-base px-5 py-2 border-2 border-foreground transition-transform hover:rotate-[-3deg] hover:scale-105 active:scale-95"
            style={{
              borderRadius: "8px 3px 8px 3px / 3px 8px 3px 8px",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.15)",
            }}
          >
            keep exploring →
          </button>
        </div>
      </div>
    </div>
  );
}
