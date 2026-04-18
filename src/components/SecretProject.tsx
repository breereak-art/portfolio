import { IconCrystalBall, IconSparkle, IconMusicNote, IconSpiral, IconPalette, IconFlask } from "./HandDrawnIcons";

const SecretProject = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="sketchy-border-pink bg-card p-6 md:p-8 rotate-slight">
        <div className="flex items-center gap-3 mb-4">
          <IconCrystalBall className="text-crayon-pink" size={32} />
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-crayon-pink">
            Bree's Secret Lab
          </h3>
          <span className="text-xs font-mono bg-crayon-pink text-background px-2 py-0.5 rounded-full">
            UNLOCKED
          </span>
        </div>

        <p className="text-lg text-muted-foreground mb-4 leading-relaxed font-hand">
          You found the hidden room. This is the tiny experiment board where Bree
          mixes code, drawing, sound, and weird little interface ideas before they
          become full projects.
        </p>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {[
            { label: "The spark", value: "Make a web toy feel handmade, not machine-made." },
            { label: "The build", value: "React, canvas-style motion, tiny sounds, and doodle UI states." },
            { label: "The payoff", value: "Visitors unlock a playful proof that Bree can ship interactive details." },
          ].map((item) => (
            <div key={item.label} className="sketchy-border bg-background/60 p-3">
              <p className="font-heading text-xl text-crayon-cyan mb-1">{item.label}</p>
              <p className="font-hand text-sm text-muted-foreground leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { Icon: IconSparkle, label: "Generative Art", color: "text-crayon-yellow" },
            { Icon: IconMusicNote, label: "Audio Viz", color: "text-crayon-cyan" },
            { Icon: IconSpiral, label: "Fractals", color: "text-crayon-green" },
            { Icon: IconPalette, label: "Color AI", color: "text-crayon-pink" },
          ].map(
            (feature) => (
              <div
                key={feature.label}
                className="sketchy-border px-3 py-2 text-center text-sm font-hand bg-muted wiggle-hover flex items-center justify-center gap-1"
              >
                <feature.Icon className={feature.color} size={18} />
                {feature.label}
              </div>
            )
          )}
        </div>

        <div className="mb-6 sketchy-border-yellow bg-accent/20 p-4">
          <p className="font-heading text-2xl text-crayon-yellow mb-1">
            Case-study seed
          </p>
          <p className="font-hand text-muted-foreground leading-relaxed">
            The secret lab turns a portfolio section into a tiny narrative loop:
            enter the world, catch stars, dodge bombs, unlock the lab, and leave
            with a passport stamp. It is small, but it tells judges this site was
            designed as an experience, not just a page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#contact" className="crayon-btn-secondary inline-flex items-center gap-2 justify-center">
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
