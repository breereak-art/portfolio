import { useEffect, useRef, useState, useCallback } from "react";
import StarCatcherGame from "./StarCatcherGame";
import SecretProjectWindow from "./SecretProjectWindow";
import { IconStar } from "./HandDrawnIcons";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";

const projects = [
  {
    title: "Interactive Dashboard",
    description:
      "A data visualization playground with animated charts and real-time updates. Built with React and D3.",
    image: project1,
    tags: ["React", "D3.js", "WebSockets"],
    color: "text-crayon-green",
    borderClass: "sketchy-border-green",
    rotation: "-2deg",
  },
  {
    title: "Mobile Experience App",
    description:
      "A buttery-smooth mobile app with gesture-based navigation and playful micro-interactions.",
    image: project2,
    tags: ["React Native", "Reanimated", "TypeScript"],
    color: "text-crayon-pink",
    borderClass: "sketchy-border-pink",
    rotation: "1.5deg",
  },
  {
    title: "Creative Agency Site",
    description:
      "Award-winning agency website featuring scroll-driven animations and custom WebGL effects.",
    image: project3,
    tags: ["Next.js", "GSAP", "Three.js"],
    color: "text-crayon-cyan",
    borderClass: "sketchy-border-cyan",
    rotation: "-1deg",
  },
];

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleUnlock = useCallback(() => setSecretUnlocked(true), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={ref} className="py-20 px-6 space-texture">
      <div className="max-w-5xl mx-auto">
        <h2
          className={`text-4xl md:text-6xl font-heading font-bold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <IconStar className="text-crayon-yellow inline-block" size={36} /> My Work{" "}
          <IconStar className="text-crayon-yellow inline-block" size={36} />
        </h2>

        <div className="grid gap-16">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`group ${project.borderClass} bg-card p-6 md:p-8 transition-all duration-700 hover:shadow-[var(--shadow-sketchy-hover)] cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transform: isVisible ? `rotate(${project.rotation})` : "translateY(48px)",
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Image */}
                <div className={`overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    width={640}
                    height={512}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                  />
                </div>

                {/* Info */}
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <h3 className={`text-3xl md:text-4xl font-heading font-bold ${project.color} mb-3`}>
                    {project.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="sketchy-border px-3 py-1 text-sm font-mono bg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="mt-6 crayon-btn-primary">
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Star Catcher Mini-Game */}
        <div className="mt-16">
          <StarCatcherGame onUnlock={handleUnlock} />
        </div>

        {/* Secret Project Window */}
        {secretUnlocked && (
          <SecretProjectWindow onClose={() => setSecretUnlocked(false)} />
        )}
      </div>
    </section>
  );
};

export default Projects;
