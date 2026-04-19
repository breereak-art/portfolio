import { useEffect, useRef, useState, useCallback } from "react";
import StarCatcherGame from "./StarCatcherGame";
import SecretProjectWindow from "./SecretProjectWindow";
import { IconStar } from "./HandDrawnIcons";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";
import spaceDoodles from "@/assets/space-doodles.jpg";

type Project = {
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
  image: string;
  imageAlt: string;
  tags: string[];
  highlights: string[];
  caseNotes: string[];
  color: string;
  borderClass: string;
  rotation: string;
  liveUrl?: string;
  liveLabel?: string;
  status?: string;
};

const projects: Project[] = [
  {
    eyebrow: "Portfolio experience",
    title: "This Little Web World",
    description:
      "A tiny interactive portfolio world with a door-opening splash, theme-shifting hero, avatar easter egg, floating taskbar, and visitor passport.",
    outcome:
      "This is the live proof: Bree can turn a plain portfolio brief into a playful product with story, motion, and personality.",
    image: project3,
    imageAlt: "Hand-drawn browser window filled with colorful crayon interface blocks",
    tags: ["React", "TypeScript", "Tailwind", "Motion"],
    highlights: ["Doorway splash transition", "Light and space themes", "Passport stamp system"],
    caseNotes: [
      "Built the visit around entering a little world, not scanning a resume.",
      "Used small UI rituals like the taskbar and passport to make the site feel alive.",
      "Kept the structure ready for real projects as they become public.",
    ],
    color: "text-crayon-cyan",
    borderClass: "sketchy-border-green",
    rotation: "-2deg",
    liveUrl: "#",
    liveLabel: "Explore",
    status: "Live here",
  },
  {
    eyebrow: "Playable interaction",
    title: "Star Catcher + Secret Lab",
    description:
      "A laptop-friendly mini-game with falling stars, doodle bombs, Web Audio sound effects, local leaderboard, and a hidden lab unlock.",
    outcome:
      "A tiny proof-of-work tucked into the portfolio: visitors play, win, unlock a narrative payoff, and earn a passport stamp.",
    image: project1,
    imageAlt: "Hand-drawn laptop with a colorful crayon screen",
    tags: ["React", "Web Audio", "localStorage", "Game UX"],
    highlights: ["Pointer-sweep catching", "Bomb penalties and combo scoring", "Secret case-study unlock"],
    caseNotes: [
      "Designed as a fast mini-game visitors can understand without instructions.",
      "Added sound, combo scoring, bombs, leaderboard storage, and a secret unlock payoff.",
      "Uses play as portfolio evidence instead of relying on a public GitHub link.",
    ],
    color: "text-crayon-pink",
    borderClass: "sketchy-border-pink",
    rotation: "1.5deg",
    liveUrl: "#projects",
    liveLabel: "Play",
    status: "Playable",
  },
  {
    eyebrow: "Private WIP",
    title: "Dazzling Data Playground",
    description:
      "A private dashboard experiment with two interface moods: a playful doodle mode and a cleaner Aura mode for polished product-style data.",
    outcome:
      "This is the range piece: Bree can make handmade, expressive interfaces and still switch into clean, readable dashboard UI when clarity matters.",
    image: project2,
    imageAlt: "Hand-drawn phone surrounded by bright crayons",
    tags: ["React", "Recharts", "Supabase", "Theme Systems", "WIP"],
    highlights: ["Doodle + Aura modes", "Live data feel", "Private repo"],
    caseNotes: [
      "This stays honest: it is in progress, private, and not pretending to be client work.",
      "The build explores whether the same dashboard can feel playful in one mode and professional in another.",
      "It can be shown with screenshots or a short walkthrough later without exposing the code, repo, or live URL.",
    ],
    color: "text-crayon-yellow",
    borderClass: "sketchy-border-yellow",
    rotation: "-1deg",
    status: "Range piece",
  },
  {
    eyebrow: "Zo workflow",
    title: "Mission Control",
    description:
      "A contact flow that turns visitor messages into structured mission briefs sent through Supabase and Resend for Bree's Zo/Gmail workflow.",
    outcome:
      "Zo becomes part of the story: visitors send a mission, the brief lands in Bree's inbox, and her workflow can sort the lead into a next step.",
    image: spaceDoodles,
    imageAlt: "Hand-drawn space doodles on a bright background",
    tags: ["Supabase", "Edge Functions", "Resend", "Zo"],
    highlights: ["Lead context fields", "Zo-ready brief", "Follow-up workflow"],
    caseNotes: [
      "The form captures name, email, project type, timeline, and message.",
      "The Supabase Edge Function sends a Resend email with instructions for Zo to summarize, classify, draft a reply, and suggest a follow-up.",
      "The visible success state shows the mission being delivered so judges understand the Zo use quickly.",
    ],
    color: "text-crayon-green",
    borderClass: "sketchy-border-cyan",
    rotation: "1deg",
    liveUrl: "#contact",
    liveLabel: "Send mission",
    status: "Zo-ready",
  },
];

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

interface ProjectsProps {
  onSecretUnlocked?: () => void;
}

const Projects = ({ onSecretUnlocked }: ProjectsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleUnlock = useCallback(() => {
    setSecretUnlocked(true);
    onSecretUnlocked?.();
  }, [onSecretUnlocked]);

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
          <IconStar className="text-crayon-yellow inline-block" size={36} /> Case Files{" "}
          <IconStar className="text-crayon-yellow inline-block" size={36} />
        </h2>

        <p
          className={`mx-auto -mt-10 mb-14 max-w-2xl text-center text-xl text-muted-foreground font-hand transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Some things are live, some are private, and some are still messy in the best way.
          Here is what Bree is building and how each piece works.
        </p>

        <div className="grid gap-16">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`project-card group ${project.borderClass} bg-card p-6 md:p-8 transition-all duration-700 hover:shadow-[var(--shadow-sketchy-hover)] ${
                isVisible ? "project-card-visible opacity-100" : "opacity-0 translate-y-12"
              }`}
              style={
                {
                  "--project-rotation": project.rotation,
                  transitionDelay: `${i * 200}ms`,
                } as React.CSSProperties
              }
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className={`overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                    width={640}
                    height={512}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                  />
                </div>

                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase text-muted-foreground">
                      {project.eyebrow}
                    </span>
                    {project.status && (
                      <span className="sketchy-border px-2 py-0.5 text-xs font-mono bg-background/70 text-foreground">
                        {project.status}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-3xl md:text-4xl font-heading font-bold ${project.color} mb-3`}>
                    {project.title}
                  </h3>

                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="sketchy-border-yellow bg-accent/15 p-4 mb-4">
                    <p className="font-heading text-xl text-crayon-yellow mb-1">
                      Why it works
                    </p>
                    <p className="font-hand text-muted-foreground leading-snug">
                      {project.outcome}
                    </p>
                  </div>

                  <ul className="grid sm:grid-cols-3 gap-2 mb-4">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="sketchy-border bg-background/60 px-3 py-2 text-sm font-hand text-muted-foreground"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="sketchy-border px-3 py-1 text-sm font-mono bg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="crayon-btn-primary inline-flex"
                    >
                      Read Case File
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target={isExternalUrl(project.liveUrl) ? "_blank" : undefined}
                        rel={isExternalUrl(project.liveUrl) ? "noopener noreferrer" : undefined}
                        className="crayon-btn-secondary inline-flex"
                      >
                        {project.liveLabel ?? "View"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <StarCatcherGame onUnlock={handleUnlock} />
        </div>

        {secretUnlocked && (
          <SecretProjectWindow onClose={() => setSecretUnlocked(false)} />
        )}

        {selectedProject && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-file-title"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className={`${selectedProject.borderClass} bg-card max-h-[88vh] w-full max-w-2xl overflow-y-auto p-5 md:p-7`}
              onClick={(event) => event.stopPropagation()}
              style={{ boxShadow: "var(--shadow-sketchy-hover)" }}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    {selectedProject.eyebrow}
                  </p>
                  <h3
                    id="case-file-title"
                    className={`text-3xl md:text-4xl font-heading font-bold ${selectedProject.color}`}
                  >
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="sketchy-border bg-background px-3 py-1 font-heading text-lg wiggle-hover"
                  aria-label="Close case file"
                >
                  x
                </button>
              </div>

              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                {selectedProject.outcome}
              </p>

              <div className="mb-5 grid gap-3">
                {selectedProject.caseNotes.map((note) => (
                  <div key={note} className="sketchy-border bg-background/60 p-3">
                    <p className="font-hand text-muted-foreground leading-snug">
                      {note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="sketchy-border px-3 py-1 text-sm font-mono bg-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
