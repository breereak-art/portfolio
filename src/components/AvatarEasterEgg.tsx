import { useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import {
  IconEyes, IconLaughing, IconCrazy, IconParty,
  IconTopHat, IconCrown, IconMask, IconCowboy, IconUnicorn,
  IconSparkle, IconStarFilled, IconDiamond
} from "./HandDrawnIcons";
import avatarSpace from "@/assets/avatar-doodle-space.png";
import avatarLight from "@/assets/avatar-doodle.png";

const reactions = [
  { clicks: 3, Icon: IconEyes, message: "Hey, that tickles!" },
  { clicks: 7, Icon: IconLaughing, message: "Okay okay I see you!" },
  { clicks: 12, Icon: IconCrazy, message: "You really like clicking huh" },
  { clicks: 20, Icon: IconParty, message: "SECRET UNLOCKED: You're awesome!" },
];

const costumeIcons = [
  null, // default - no costume
  IconTopHat,
  IconCrown,
  IconMask,
  IconCowboy,
  IconUnicorn,
];

const confettiIcons = [IconSparkle, IconStarFilled, IconDiamond, IconParty];
type HandDrawnIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number }>;

const AvatarEasterEgg = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [clicks, setClicks] = useState(0);
  const [currentReaction, setCurrentReaction] = useState<{ Icon: HandDrawnIcon; message: string } | null>(null);
  const [costumeIndex, setCostumeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; IconComp: HandDrawnIcon }[]>([]);

  const handleClick = useCallback(() => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    const reaction = reactions.find((r) => r.clicks === newClicks);
    if (reaction) {
      setCurrentReaction(reaction);
      setTimeout(() => setCurrentReaction(null), 2500);
    }

    if (newClicks % 5 === 0) {
      setCostumeIndex((prev) => (prev + 1) % costumeIcons.length);
    }

    if (newClicks === 20) {
      const newConfetti = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: -(Math.random() * 150 + 50),
        IconComp: confettiIcons[Math.floor(Math.random() * confettiIcons.length)],
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 2000);
    }
  }, [clicks]);

  const CostumeIcon = costumeIcons[costumeIndex];

  return (
    <div className="relative inline-block">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            animation: "confetti-burst 1.5s ease-out forwards",
            "--confetti-x": `${c.x}px`,
            "--confetti-y": `${c.y}px`,
          } as React.CSSProperties}
        >
          <c.IconComp size={20} className="text-crayon-yellow" />
        </div>
      ))}

      {/* Costume overlay */}
      {CostumeIcon && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-bounce-in">
          <CostumeIcon size={36} className="text-crayon-yellow" />
        </div>
      )}

      {/* Avatar */}
      <button
        onClick={handleClick}
        className={`relative cursor-pointer transition-all duration-200 outline-none focus:outline-none ${
          isSpinning ? "animate-[wiggle_0.5s_ease-in-out]" : ""
        }`}
        style={{
          transform: isSpinning ? "scale(1.1)" : "scale(1)",
        }}
        aria-label="Click me for a surprise!"
      >
        <img
          src={isDark ? avatarSpace : avatarLight}
          alt="Hand-drawn avatar"
          width={160}
          height={160}
          className="mx-auto w-32 h-32 md:w-40 md:h-40 float-animation"
        />

        {clicks > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-crayon-pink text-secondary-foreground text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full animate-bounce-in"
          >
            {clicks}
          </span>
        )}
      </button>

      {/* Reaction speech bubble */}
      {currentReaction && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce-in z-20"
        >
          <div
            className="px-4 py-2 bg-card text-foreground font-hand text-lg inline-flex items-center gap-2"
            style={{
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              border: "3px solid hsl(var(--crayon-pink))",
              boxShadow: "var(--shadow-sketchy)",
            }}
          >
            <currentReaction.Icon size={20} className="text-crayon-pink" />
            {currentReaction.message}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-card">v</div>
        </div>
      )}
    </div>
  );
};

export default AvatarEasterEgg;
