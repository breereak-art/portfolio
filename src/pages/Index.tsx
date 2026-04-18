import { useState } from "react";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ScrollCompanion from "@/components/ScrollCompanion";
import SplashScreen from "@/components/SplashScreen";
import FloatingTaskbar from "@/components/FloatingTaskbar";
import VisitorPassport, { type PassportStamp } from "@/components/VisitorPassport";
import WinState from "@/components/WinState";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [passportStamps, setPassportStamps] = useState<Record<PassportStamp, boolean>>({
    arrived: false,
    starCatcher: false,
    missionSent: false,
  });
  const [showWin, setShowWin] = useState(false);

  const stampPassport = (stamp: PassportStamp) => {
    setPassportStamps((current) => {
      const next = { ...current, [stamp]: true };
      if (next.arrived && next.starCatcher && next.missionSent) {
        setTimeout(() => setShowWin(true), 600);
      }
      return next;
    });
  };

  const handleEnter = () => {
    setEntered(true);
    stampPassport("arrived");
  };

  return (
    <ThemeProvider>
      {showSplash && (
        <SplashScreen
          onEnter={handleEnter}
          onDone={() => setShowSplash(false)}
        />
      )}
      {showWin && <WinState onClose={() => setShowWin(false)} />}
      <div
        className={`min-h-screen bg-background transition-colors duration-500 ${
          !entered ? "overflow-hidden max-h-screen" : ""
        }`}
      >
        {/* Navbar removed */}
        <ScrollCompanion />
        <Hero />
        <About />
        <Projects onSecretUnlocked={() => stampPassport("starCatcher")} />
        <Contact onMissionSent={() => stampPassport("missionSent")} />
        {entered && <VisitorPassport stamps={passportStamps} />}
        {entered && <FloatingTaskbar />}
      </div>
    </ThemeProvider>
  );
};

export default Index;
