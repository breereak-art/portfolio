import { useEffect, useRef, useState } from "react";
import { IconMoon, IconStar, IconRocket, IconPencil } from "./HandDrawnIcons";

const skills = [
  { name: "React", color: "text-crayon-cyan" },
  { name: "TypeScript", color: "text-crayon-blue" },
  { name: "Three.js", color: "text-crayon-green" },
  { name: "CSS/Animations", color: "text-crayon-pink" },
  { name: "Node.js", color: "text-crayon-orange" },
  { name: "Figma", color: "text-crayon-yellow" },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-4xl md:text-6xl font-heading font-bold text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <IconMoon className="text-crayon-yellow inline-block" size={36} /> About Me{" "}
          <IconStar className="text-crayon-yellow inline-block" size={36} />
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div
            className={`sketchy-border p-6 md:p-8 bg-card rotate-slight transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <h3 className="text-2xl font-heading font-bold text-crayon-pink mb-4 flex items-center gap-2">
              My Mission <IconRocket className="text-crayon-orange" size={24} />
            </h3>
            <p className="text-lg leading-relaxed">
              I'm a third-year Computer Science student and creative web
              designer who loves turning wild ideas into delightful
              experiences. I believe the internet should be fun, surprising,
              and full of little moments that make you smile.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              When I'm not coding, you'll find me stargazing, doodling,
              or collecting weird vintage fonts.
            </p>
          </div>

          {/* Skills */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h3 className="text-2xl font-heading font-bold text-crayon-cyan mb-6 flex items-center gap-2">
              Things I'm good at <IconPencil className="text-crayon-orange" size={24} />
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={skill.name}
                  className="sketchy-border px-4 py-2 text-lg font-hand bg-card wiggle-hover cursor-default"
                  style={{
                    transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg)`,
                  }}
                >
                  <span className={`${skill.color} font-bold`}>
                    {skill.name}
                  </span>
                </span>
              ))}
            </div>

            {/* Fun quote */}
            <div className="mt-8 sketchy-border-pink p-5 bg-card rotate-slight-reverse">
              <p className="text-lg italic text-muted-foreground">
                "Code is just spicy poetry"
              </p>
              <p className="text-sm text-crayon-pink mt-2">- me, probably</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
