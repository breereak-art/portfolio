import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

const defaults = (size?: number) => ({
  width: size ?? 24,
  height: size ?? 24,
  viewBox: "0 0 48 48",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

// ─── Stars & Sparkles ───

export const IconStar = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 4 C25 14, 26 15, 36 16 C26 17, 25 18, 24 28 C23 18, 22 17, 12 16 C22 15, 23 14, 24 4Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"
    />
  </svg>
);

export const IconSparkle = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 6 C25 18, 26 19, 38 20 C26 21, 25 22, 24 34 C23 22, 22 21, 10 20 C22 19, 23 18, 24 6Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"
    />
    <path
      d="M36 8 C37 12, 38 13, 42 14 C38 15, 37 16, 36 20 C35 16, 34 15, 30 14 C34 13, 35 12, 36 8Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.15"
    />
  </svg>
);

export const IconStarFilled = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 5 L27.5 17 C28 18.5, 29 19, 30.5 19 L42 19 L32 26 C31 26.8, 30.5 28, 31 29.5 L34 41 L25.5 33 C24.5 32.3, 23.5 32.3, 22.5 33 L14 41 L17 29.5 C17.5 28, 17 26.8, 16 26 L6 19 L17.5 19 C19 19, 20 18.5, 20.5 17 Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.3"
    />
  </svg>
);

// ─── Celestial ───

export const IconMoon = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M30 8 C20 10, 14 20, 16 30 C18 40, 28 44, 38 40 C30 42, 22 36, 20 26 C18 16, 22 10, 30 8Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"
    />
    <circle cx="34" cy="12" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="40" cy="18" r="1" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const IconSun = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 24 + Math.cos(rad) * 12;
      const y1 = 24 + Math.sin(rad) * 12;
      const x2 = 24 + Math.cos(rad) * (17 + (i % 2) * 2);
      const y2 = 24 + Math.sin(rad) * (17 + (i % 2) * 2);
      return (
        <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        />
      );
    })}
  </svg>
);

export const IconPlanet = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
    <ellipse cx="24" cy="24" rx="20" ry="6" stroke="currentColor" strokeWidth="2" fill="none"
      transform="rotate(-25 24 24)"
    />
    <circle cx="20" cy="20" r="2" fill="currentColor" fillOpacity="0.2" />
    <circle cx="27" cy="28" r="1.5" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const IconSatellite = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="18" y="18" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" transform="rotate(15 24 24)" />
    <line x1="14" y1="24" x2="6" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="34" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 20 L4 24 L8 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M40 20 L44 24 L40 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="36" cy="12" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <path d="M33 10 C35 8, 38 8, 40 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Objects ───

export const IconRocket = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 6 C20 14, 16 22, 16 30 C16 34, 18 36, 20 38 L24 34 L28 38 C30 36, 32 34, 32 30 C32 22, 28 14, 24 6Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"
    />
    <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M16 28 C12 30, 10 34, 12 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M32 28 C36 30, 38 34, 36 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M20 40 C22 42, 24 44, 24 44 C24 44, 26 42, 28 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const IconPencil = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M12 36 L8 42 L14 38 L38 14 C40 12, 40 9, 38 7 C36 5, 33 5, 31 7 Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"
    />
    <line x1="30" y1="10" x2="38" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="36" x2="14" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconHeart = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 40 C18 34, 6 26, 8 16 C10 8, 18 7, 24 14 C30 7, 38 8, 40 16 C42 26, 30 34, 24 40Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"
    />
  </svg>
);

export const IconEnvelope = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="6" y="12" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M6 14 L24 28 L42 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconCoffee = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M10 18 L14 40 L30 40 L34 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M34 22 C38 22, 42 24, 42 28 C42 32, 38 34, 34 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M16 12 C16 8, 18 8, 18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M22 10 C22 6, 24 6, 24 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M28 12 C28 8, 30 8, 30 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconDoor = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="12" y="6" width="24" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 6 L16 4 L40 4 L36 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="32" cy="26" r="2" fill="currentColor" fillOpacity="0.5" />
    <path d="M20 12 C22 12, 28 12, 30 12 L30 24 L20 24Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.05" />
  </svg>
);

export const IconCar = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M8 28 L12 18 C14 14, 16 12, 20 12 L28 12 C32 12, 34 14, 36 18 L40 28"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M6 28 L6 34 C6 36, 8 36, 10 36 L38 36 C40 36, 42 36, 42 34 L42 28 Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <circle cx="14" cy="36" r="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="34" cy="36" r="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
    <rect x="16" y="16" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
    <rect x="26" y="16" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export const IconHouse = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M8 24 L24 8 L40 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="12" y="24" width="24" height="18" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <rect x="20" y="30" width="8" height="12" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <rect x="15" y="26" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export const IconShop = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="8" y="18" width="32" height="24" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M6 18 L8 8 L40 8 L42 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <path d="M8 18 C8 14, 16 14, 16 18 C16 14, 24 14, 24 18 C24 14, 32 14, 32 18 C32 14, 40 14, 40 18"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <rect x="18" y="28" width="12" height="14" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export const IconConstruction = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M14 42 L20 14 L28 14 L34 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <line x1="16" y1="30" x2="32" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="36" x2="30" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 14 L18 8 L30 8 L30 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <line x1="38" y1="10" x2="42" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 6 L44 6 L44 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconPalette = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 6 C12 6, 4 14, 4 24 C4 34, 12 42, 22 42 C26 42, 28 40, 28 38 C28 36, 26 34, 28 32 C30 30, 34 30, 36 28 C42 22, 38 6, 24 6Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.1"
    />
    <circle cx="16" cy="18" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="24" cy="14" r="2.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="32" cy="18" r="2.5" fill="currentColor" fillOpacity="0.35" />
    <circle cx="14" cy="28" r="2.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const IconWarning = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 6 L42 40 L6 40Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"
    />
    <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="35" r="2" fill="currentColor" />
  </svg>
);

export const IconParty = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M10 42 L20 10 L30 42Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <path d="M14 30 C16 28, 20 28, 22 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M16 36 C18 34, 22 34, 24 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <circle cx="34" cy="12" r="2" fill="currentColor" fillOpacity="0.5" />
    <circle cx="38" cy="18" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="40" cy="8" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <path d="M32 16 L30 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M36 22 L34 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconCrystalBall = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="22" r="14" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M14 36 L10 42 L38 42 L34 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    <path d="M18 16 C20 14, 22 14, 24 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    <circle cx="20" cy="20" r="1.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="28" cy="24" r="1" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const IconFlask = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M18 6 L18 20 L8 38 C6 42, 10 44, 14 44 L34 44 C38 44, 42 42, 40 38 L30 20 L30 6"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <line x1="16" y1="6" x2="32" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 32 C18 28, 30 36, 36 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
    <circle cx="20" cy="36" r="2" fill="currentColor" fillOpacity="0.25" />
    <circle cx="28" cy="38" r="1.5" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const IconMusicNote = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <ellipse cx="16" cy="36" rx="6" ry="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" transform="rotate(-15 16 36)" />
    <line x1="22" y1="34" x2="22" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 8 C28 6, 34 8, 36 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Navigation / Arrows ───

export const IconArrowDown = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M24 6 C24 14, 24 26, 24 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M14 28 L24 40 L34 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconWaveHand = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M20 30 L20 16 C20 14, 22 12, 24 14 L24 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M24 22 L24 12 C24 10, 26 8, 28 10 L28 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M28 22 L28 14 C28 12, 30 10, 32 12 L32 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M32 24 L32 18 C32 16, 34 14, 36 16 L36 28 C36 36, 30 42, 22 42 C16 42, 12 38, 14 32 L16 30"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M20 30 C18 32, 16 30, 16 28 L16 22 C16 20, 18 18, 20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Motion lines */}
    <path d="M10 14 C8 12, 8 16, 6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M12 10 C10 8, 10 12, 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
  </svg>
);

export const IconWindPuff = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M6 18 C14 16, 22 20, 30 18 C34 17, 36 14, 34 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M10 24 C18 22, 26 26, 38 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M8 30 C14 28, 20 32, 28 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Social ───

export const IconOctopus = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <ellipse cx="24" cy="18" rx="12" ry="10" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="20" cy="16" r="2" fill="currentColor" fillOpacity="0.5" />
    <circle cx="28" cy="16" r="2" fill="currentColor" fillOpacity="0.5" />
    <path d="M8 26 C6 34, 10 38, 12 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M14 28 C12 36, 14 40, 18 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M24 28 C24 36, 22 40, 26 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M34 28 C36 36, 34 40, 30 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M40 26 C42 34, 38 38, 36 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconBird = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M10 22 C6 18, 6 12, 12 10 C14 10, 16 12, 18 14 L28 14 C34 14, 40 18, 40 24 C40 30, 34 34, 28 34 L18 34 C12 34, 8 30, 10 24Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.15" />
    <circle cx="32" cy="22" r="2" fill="currentColor" fillOpacity="0.5" />
    <path d="M40 22 L46 20 L44 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M14 30 C12 34, 14 38, 18 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconBriefcase = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="6" y="16" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M16 16 L16 10 C16 8, 18 6, 20 6 L28 6 C30 6, 32 8, 32 10 L32 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <line x1="6" y1="26" x2="42" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="20" y="23" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const IconBasketball = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M8 24 L40 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 8 L24 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 10 C20 18, 20 30, 12 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M36 10 C28 18, 28 30, 36 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Faces / Costumes (for AvatarEasterEgg) ───

export const IconEyes = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <ellipse cx="16" cy="24" rx="6" ry="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <ellipse cx="32" cy="24" rx="6" ry="8" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <circle cx="18" cy="24" r="3" fill="currentColor" fillOpacity="0.5" />
    <circle cx="34" cy="24" r="3" fill="currentColor" fillOpacity="0.5" />
  </svg>
);

export const IconLaughing = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M16 18 C16 16, 18 14, 20 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M28 18 C28 16, 30 14, 32 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M14 28 C18 34, 30 34, 34 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconCrazy = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <circle cx="18" cy="20" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <circle cx="30" cy="18" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <circle cx="19" cy="20" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="31" cy="18" r="2.5" fill="currentColor" fillOpacity="0.4" />
    <path d="M16 32 C20 28, 28 36, 32 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M34 30 L38 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconTopHat = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <rect x="14" y="10" width="20" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
    <path d="M8 32 L40 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 34 L42 34 C42 36, 40 38, 38 38 L10 38 C8 38, 6 36, 6 34Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const IconCrown = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M6 36 L10 14 L18 24 L24 8 L30 24 L38 14 L42 36Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
    <circle cx="10" cy="14" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="24" cy="8" r="2" fill="currentColor" fillOpacity="0.4" />
    <circle cx="38" cy="14" r="2" fill="currentColor" fillOpacity="0.4" />
    <line x1="6" y1="36" x2="42" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconMask = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M8 18 C8 10, 16 6, 24 6 C32 6, 40 10, 40 18 L40 26 C40 32, 32 36, 24 36 C16 36, 8 32, 8 26Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.15" />
    <ellipse cx="16" cy="20" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
    <ellipse cx="32" cy="20" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
    <path d="M4 18 L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 18 L40 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconCowboy = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M4 30 C8 26, 14 24, 18 24 L30 24 C34 24, 40 26, 44 30"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.15" />
    <path d="M14 24 L16 10 C18 8, 22 6, 24 6 C26 6, 30 8, 32 10 L34 24"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
    <line x1="4" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconUnicorn = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M16 42 C14 34, 12 28, 14 22 C16 16, 22 12, 28 14 C34 16, 36 22, 34 28 L32 34"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M26 14 L28 4 L30 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.25" />
    <circle cx="22" cy="24" r="2" fill="currentColor" fillOpacity="0.5" />
    <path d="M26 30 C24 32, 22 32, 20 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M32 18 C36 16, 40 18, 42 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M34 20 C38 20, 42 22, 44 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const IconTimer = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="26" r="14" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <line x1="24" y1="26" x2="24" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="26" x2="32" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="8" x2="28" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="8" x2="24" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="14" x2="38" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconSmiley = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
    <circle cx="18" cy="20" r="2" fill="currentColor" fillOpacity="0.5" />
    <circle cx="30" cy="20" r="2" fill="currentColor" fillOpacity="0.5" />
    <path d="M16 30 C20 34, 28 34, 32 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Misc decorative ───

export const IconSpiral = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path
      d="M24 24 C24 20, 28 18, 30 20 C34 24, 30 30, 24 30 C16 30, 12 22, 16 16 C20 10, 32 8, 36 16 C40 24, 34 36, 24 38"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
    />
  </svg>
);

export const IconDiamond = ({ className, style, size }: IconProps) => (
  <svg {...defaults(size)} className={className} style={style}>
    <path d="M24 4 L40 20 L24 44 L8 20Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M8 20 L40 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 4 L14 20 L24 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
    <path d="M30 4 L34 20 L24 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
  </svg>
);
