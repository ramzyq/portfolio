"use client";

import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { BackToTop } from "@/components/BackToTop";
import { CommandPalette } from "@/components/CommandPalette";
import { ConsoleSignature } from "@/components/ConsoleSignature";
import { Contact } from "@/components/Contact";
import { CursorGlow } from "@/components/CursorGlow";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Konami } from "@/components/Konami";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Stats } from "@/components/Stats";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <CommandPalette />
      <Konami />
      <ConsoleSignature />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
