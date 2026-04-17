import { IconCrystalBall, IconSparkle, IconMusicNote, IconSpiral, IconPalette, IconFlask } from "./HandDrawnIcons";

const SecretProject = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="sketchy-border-pink bg-card p-6 md:p-8 rotate-slight">
        <div className="flex items-center gap-3 mb-4">
          <IconCrystalBall className="text-crayon-pink" size={32} />
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-crayon-pink">
            Secret Project
          </h3>
          <span className="text-xs font-mono bg-crayon-pink text-background px-2 py-0.5 rounded-full">
            UNLOCKED
          </span>
        </div>

        <p className="text-lg text-muted-foreground mb-4 leading-relaxed font-hand">
          You found my hidden project! This is a sneak peek at something I've been
          working on in secret - an experimental creative coding playground where
          art meets algorithms.
        </p>

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

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="crayon-btn-secondary inline-flex items-center gap-2">
            Explore the Lab <IconFlask className="text-crayon-green" size={20} />
          </button>
          <button className="crayon-btn text-foreground">
            Coming Soon...
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretProject;
