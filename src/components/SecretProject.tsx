import { IconFlask } from "./HandDrawnIcons";

const SecretProject = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="sketchy-border-pink bg-card p-6 md:p-8 rotate-slight">
        <div className="flex items-center gap-3 mb-4">
          <IconFlask className="text-crayon-pink" size={32} />
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-crayon-pink">
            NULSPACE
          </h3>
          <span className="text-xs font-mono bg-crayon-pink text-background px-2 py-0.5 rounded-full">
            UNLOCKED
          </span>
        </div>

        <p className="text-lg text-muted-foreground mb-4 leading-relaxed font-hand">
          A private experiment board. Bree mixes code, drawing, sound, and interface ideas
          here before they graduate to live projects.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Generative Art", color: "text-crayon-yellow" },
            { label: "Audio Viz", color: "text-crayon-cyan" },
            { label: "Fractals", color: "text-crayon-green" },
            { label: "Color AI", color: "text-crayon-pink" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="sketchy-border px-3 py-2 text-center text-sm font-hand bg-muted wiggle-hover flex items-center justify-center gap-1"
            >
              <span className={`font-heading text-base ${feature.color}`}>*</span>
              {feature.label}
            </div>
          ))}
        </div>

        <div className="sketchy-border-yellow bg-accent/20 p-4 mb-6">
          <p className="font-heading text-2xl text-crayon-yellow mb-2">
            What this proves
          </p>
          <ul className="space-y-1.5">
            {[
              "An animated grid system that reacts to cursor proximity and keyboard input",
              "A canvas-style particle field layered with interactive DOM elements",
              "Experiments in spatial UI - portals, nested worlds, and depth-first navigation",
              "Sound-first interaction design - audio cues that make interfaces feel alive",
            ].map((item) => (
              <li
                key={item}
                className="font-hand text-muted-foreground text-sm leading-snug flex items-start gap-2"
              >
                <span className="text-crayon-yellow mt-0.5 shrink-0">-&gt;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            className="crayon-btn-secondary inline-flex items-center gap-2 justify-center"
          >
            Build with Bree <IconFlask className="text-crayon-green" size={20} />
          </a>
          <span className="crayon-btn text-foreground inline-flex justify-center">
            Prototype log coming soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecretProject;
