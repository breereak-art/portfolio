import { useEffect, useRef, useState } from "react";
import { IconMoon, IconEnvelope, IconOctopus, IconBird, IconBriefcase, IconBasketball, IconHeart, IconCoffee, IconStar } from "./HandDrawnIcons";
import ContactFormModal from "./ContactFormModal";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [bubbleFor, setBubbleFor] = useState<string | null>(null);
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

  const socials = [
    { name: "GitHub", Icon: IconOctopus, url: "https://github.com/breereak-art", hoverBg: "bg-foreground text-background", wip: false },
    { name: "Twitter", Icon: IconBird, url: "https://x.com/breereak?s=21", hoverBg: "bg-crayon-cyan text-background", wip: false },
    { name: "LinkedIn", Icon: IconBriefcase, url: "#", hoverBg: "bg-crayon-blue text-background", wip: true },
    { name: "Dribbble", Icon: IconBasketball, url: "#", hoverBg: "bg-crayon-pink text-background", wip: true },
  ];

  const handleSocialClick = (e: React.MouseEvent, social: typeof socials[0]) => {
    if (social.wip) {
      e.preventDefault();
      setBubbleFor(social.name);
      setTimeout(() => setBubbleFor(null), 2000);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className={`text-4xl md:text-6xl font-heading font-bold mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Let's make something{" "}
          <span className="text-crayon-pink sketchy-underline">awesome</span>{" "}
          together! <IconMoon className="text-crayon-yellow inline-block" size={36} />
        </h2>

        <p
          className={`text-xl text-muted-foreground mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Got an idea? A project? Just want to say hi? I'd love to hear from you.
        </p>

        {/* Email CTA */}
        <div
          className={`inline-block transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <button
            onClick={() => setFormOpen(true)}
            className="sketchy-border-yellow inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground text-xl md:text-2xl font-heading font-bold wiggle-hover"
            style={{ boxShadow: "var(--shadow-sketchy)" }}
          >
            <IconEnvelope className="text-crayon-yellow" size={32} />
            Send me a message!
          </button>
        </div>

        {/* Socials */}
        <div
          className={`mt-12 flex justify-center gap-4 flex-wrap transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {socials.map((social, i) => (
            <div key={social.name} className="relative">
              <a
                href={social.wip ? "#" : social.url}
                target={social.wip ? undefined : "_blank"}
                rel={social.wip ? undefined : "noopener noreferrer"}
                onClick={(e) => handleSocialClick(e, social)}
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
                className={`sketchy-border px-5 py-3 text-lg font-hand transition-all duration-200 inline-flex items-center gap-2 ${
                  hoveredSocial === social.name
                    ? `${social.hoverBg} scale-110 -rotate-3`
                    : "bg-card"
                }`}
                style={{
                  transform: hoveredSocial === social.name
                    ? "scale(1.1) rotate(-3deg)"
                    : `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)`,
                }}
              >
                <social.Icon size={22} />
                {social.name}
              </a>
              {/* "Working on it" bubble */}
              {bubbleFor === social.name && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-card border-2 border-border text-sm font-hand text-foreground whitespace-nowrap animate-fade-in z-10"
                  style={{
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    boxShadow: "var(--shadow-sketchy)",
                  }}
                >
                  working on it (soon)
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r-2 border-b-2 border-border rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`mt-20 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-muted-foreground font-mono text-sm inline-flex items-center gap-1">
            {"<"}/{">"} with <IconHeart className="text-crayon-pink" size={16} /> and lots of <IconCoffee className="text-crayon-orange" size={16} />
          </p>
          <p className="text-muted-foreground font-mono text-xs mt-2 inline-flex items-center gap-1">
            (c) {new Date().getFullYear()} - made by Bree, pixel by pixel <IconStar className="text-crayon-yellow" size={14} />
          </p>
        </div>
      </div>

      <ContactFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
};

export default Contact;
