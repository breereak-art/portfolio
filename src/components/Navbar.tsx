import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { IconMoon, IconPencil, IconSun, IconPlanet, IconStar, IconEnvelope } from "./HandDrawnIcons";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeSwitching, setThemeSwitching] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setThemeSwitching(true);
    if (navigator.vibrate) navigator.vibrate(15);
    toggle();
    setTimeout(() => setThemeSwitching(false), 500);
  }, [toggle]);

  const links = [
    { label: "Planet Me", href: "#about", Icon: IconPlanet, color: "text-crayon-cyan" },
    { label: "Star Station", href: "#projects", Icon: IconStar, color: "text-crayon-yellow" },
    { label: "Mission Control", href: "#contact", Icon: IconEnvelope, color: "text-crayon-pink" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-sm shadow-[var(--shadow-sketchy)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="text-2xl md:text-3xl font-heading font-bold text-foreground wiggle-hover flex items-center gap-1"
        >
          {theme === "dark" ? (
            <IconMoon className="text-crayon-yellow inline-block" size={28} />
          ) : (
            <IconPencil className="text-crayon-orange inline-block" size={28} />
          )}{" "}
          <span className="text-crayon-cyan">Bree</span>
          <span className="text-crayon-pink">Reak</span>
        </a>

        {/* Desktop links + toggle */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg font-hand text-foreground sketchy-underline transition-colors inline-flex items-center gap-1.5 wiggle-hover"
            >
              <link.Icon className={link.color} size={20} />
              {link.label}
            </a>
          ))}
          <button
            onClick={handleThemeToggle}
            className={`wiggle-hover transition-transform duration-200 ${themeSwitching ? "theme-switching" : ""}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <IconSun className="text-crayon-yellow" size={28} />
            ) : (
              <IconMoon className="text-crayon-blue" size={28} />
            )}
          </button>
        </div>

        {/* Mobile: toggle + menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            className={`wiggle-hover ${themeSwitching ? "theme-switching" : ""}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <IconSun className="text-crayon-yellow" size={26} />
            ) : (
              <IconMoon className="text-crayon-blue" size={26} />
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl wiggle-hover text-foreground active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t-2 border-border px-6 py-4 space-y-3 animate-fade-in">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-xl font-hand text-foreground py-2 sketchy-underline active:scale-95 transition-transform flex items-center gap-2"
            >
              <link.Icon className={link.color} size={22} />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
