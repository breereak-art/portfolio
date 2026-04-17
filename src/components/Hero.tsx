import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import AvatarEasterEgg from "./AvatarEasterEgg";
import { IconSparkle, IconWaveHand, IconRocket, IconArrowDown } from "./HandDrawnIcons";
import spaceDoodles from "@/assets/space-doodles.jpg";
import heroDoodles from "@/assets/hero-doodles.jpg";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - swaps based on theme */}
      <div className={`absolute inset-0 ${isDark ? "opacity-30" : "opacity-15"} transition-opacity duration-500`}>
        <img
          src={isDark ? spaceDoodles : heroDoodles}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </div>

      {/* Twinkling stars (dark mode only) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-crayon-yellow twinkle"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Avatar Easter Egg */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <AvatarEasterEgg />
        </div>

        {/* Main heading */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-foreground">Hey, I'm </span>
          <span className="sketchy-underline text-foreground">Bree Reak</span>
          <span className="text-crayon-pink">!</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-2xl md:text-3xl text-muted-foreground mb-8 font-hand transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          I build{" "}
          <span className="text-crayon-green font-bold">web experiences</span>{" "}
          that {isDark ? "are out of this " : "make people go "}
          <span className="text-crayon-pink font-bold italic inline-flex items-center gap-1">
            {isDark ? (
              <>world! <IconRocket className="text-crayon-orange inline-block" size={28} /></>
            ) : (
              '"woah!"'
            )}
          </span>
        </p>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a href="#projects" className="crayon-btn-primary inline-flex items-center gap-2">
            See my work <IconSparkle className="text-crayon-yellow" size={20} />
          </a>
          <a href="#contact" className="crayon-btn-accent inline-flex items-center gap-2">
            Say hello <IconWaveHand className="text-crayon-pink" size={20} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-16 transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`float-animation ${isDark ? "text-crayon-yellow" : "text-foreground"}`}>
            <IconArrowDown size={32} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
