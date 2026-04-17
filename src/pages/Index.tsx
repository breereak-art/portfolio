import { useState } from "react";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ScrollCompanion from "@/components/ScrollCompanion";
import SplashScreen from "@/components/SplashScreen";
import FloatingTaskbar from "@/components/FloatingTaskbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [entered, setEntered] = useState(false);

  return (
    <ThemeProvider>
      {!entered && <SplashScreen onEnter={() => setEntered(true)} />}
      <div
        className={`min-h-screen bg-background transition-colors duration-500 ${
          !entered ? "overflow-hidden max-h-screen" : ""
        }`}
      >
        {/* Navbar removed */}
        <ScrollCompanion />
        <Hero />
        <About />
        <Projects />
        <Contact />
        {entered && <FloatingTaskbar />}
      </div>
    </ThemeProvider>
  );
};

export default Index;
