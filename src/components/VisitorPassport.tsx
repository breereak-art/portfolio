import { useState } from "react";
import { IconDoor, IconEnvelope, IconSparkle, IconStarFilled } from "./HandDrawnIcons";

export type PassportStamp = "arrived" | "starCatcher" | "missionSent";

interface VisitorPassportProps {
  stamps: Record<PassportStamp, boolean>;
}

const passportItems = [
  {
    id: "arrived" as const,
    label: "arrived",
    Icon: IconDoor,
    color: "text-crayon-green",
  },
  {
    id: "starCatcher" as const,
    label: "star catcher",
    Icon: IconStarFilled,
    color: "text-crayon-yellow",
  },
  {
    id: "missionSent" as const,
    label: "signal sent",
    Icon: IconEnvelope,
    color: "text-crayon-pink",
  },
];

const VisitorPassport = ({ stamps }: VisitorPassportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const stampedCount = passportItems.filter((item) => stamps[item.id]).length;

  return (
    <aside className="fixed top-3 right-3 md:top-5 md:right-5 z-50 pointer-events-none">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="pointer-events-auto bg-card/92 backdrop-blur-sm border-2 border-border px-3 py-2 font-heading text-sm text-foreground inline-flex items-center gap-2 rotate-1 transition-transform duration-200 hover:-rotate-2 hover:scale-105"
        aria-expanded={isOpen}
        aria-label="Open lil world passport"
        style={{
          borderRadius: "14px 5px 14px 5px / 5px 14px 5px 14px",
          boxShadow: "var(--shadow-sketchy)",
        }}
      >
        <IconSparkle className="text-crayon-yellow" size={16} />
        pass {stampedCount}/3
      </button>

      <div
        className={`pointer-events-auto absolute right-0 top-12 w-[min(92vw,260px)] bg-card/95 backdrop-blur-sm border-2 border-border px-3 py-3 origin-top-right transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 rotate-1"
            : "opacity-0 -translate-y-2 scale-95 rotate-1 pointer-events-none"
        }`}
        style={{
          borderRadius: "18px 5px 18px 5px / 5px 18px 5px 18px",
          boxShadow: "var(--shadow-sketchy)",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="font-heading text-lg text-foreground inline-flex items-center gap-1">
            lil world pass <IconSparkle className="text-crayon-yellow" size={16} />
          </p>
          <span className="font-mono text-xs text-muted-foreground">
            {stampedCount}/3
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {passportItems.map((item) => {
            const isStamped = stamps[item.id];
            return (
              <div
                key={item.id}
                className={`relative min-h-20 border-2 border-dashed px-1.5 py-2 text-center transition-all duration-300 ${
                  isStamped
                    ? "border-current bg-background/70 opacity-100"
                    : "border-border bg-muted/40 opacity-45"
                }`}
                style={{
                  borderRadius: "10px 4px 10px 4px / 4px 10px 4px 10px",
                  transform: isStamped ? "rotate(-3deg) scale(1)" : "rotate(1deg) scale(0.96)",
                }}
              >
                <item.Icon
                  className={`${item.color} mx-auto transition-transform duration-300 ${
                    isStamped ? "animate-bounce-in" : ""
                  }`}
                  size={24}
                />
                <p className="mt-1 font-hand text-xs leading-tight text-muted-foreground">
                  {item.label}
                </p>
                {isStamped && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-[-8deg] border-2 border-current bg-card px-1.5 py-0.5 font-heading text-[10px] text-crayon-pink">
                    stamped
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default VisitorPassport;
