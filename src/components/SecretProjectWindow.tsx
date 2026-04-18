import { useState, useRef, useEffect, useCallback } from "react";
import SecretProject from "./SecretProject";

interface SecretProjectWindowProps {
  onClose: () => void;
}

const SecretProjectWindow = ({ onClose }: SecretProjectWindowProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Center on mount
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPosition({ x: Math.max(16, (w - Math.min(w - 32, 700)) / 2), y: Math.max(60, h * 0.1) });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
  }, [dragging]);

  const handlePointerUp = useCallback(() => setDragging(false), []);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />

      {/* Window */}
      <div
        ref={windowRef}
        className="absolute pointer-events-auto animate-bounce-in"
        style={{
          left: position.x,
          top: position.y,
          width: "min(calc(100vw - 32px), 700px)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2 bg-crayon-pink cursor-grab active:cursor-grabbing select-none"
          style={{
            borderRadius: "12px 12px 0 0",
            border: "2px solid hsl(var(--border))",
            borderBottom: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="flex items-center gap-2">
            {/* Traffic lights */}
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 border border-red-600/30 transition-colors"
            />
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-600/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-green-400 border border-green-600/30" />
          </div>
          <span className="text-sm font-heading font-bold text-background">
            secret_lab.exe
          </span>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div
          className="bg-card overflow-y-auto max-h-[60vh] p-2"
          style={{
            border: "2px solid hsl(var(--border))",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <SecretProject />
        </div>
      </div>
    </div>
  );
};

export default SecretProjectWindow;
