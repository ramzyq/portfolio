"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OWNER, ROLE_ROTATION, SOCIAL_LINKS } from "@/data";
import { XIcon } from "./icons/XIcon";
import { MagneticLink } from "./MagneticButton";
import { Particles } from "./Particles";

const SOCIAL_ICON_MAP = {
  GitHub: Github,
  LinkedIn: Linkedin,
  X: XIcon,
  Email: Mail,
} as const;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLE_ROTATION.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[var(--background)]"
    >
      {/* Animated spotlight glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 rounded-full blur-3xl"
        style={{
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)`,
          top: "-10%",
          right: "-5%",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* Particles Canvas Layer */}
      <div className="absolute inset-0 -z-20">
        <Particles />
      </div>

      {/* Main content container */}
      <div className="container-px relative z-10 w-full max-w-5xl">

        {/* Centered content */}
        <div className="text-center">
          {/* Role indicator with animation */}
          <motion.div
            className="mb-12 min-h-[2.5rem] flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-accent to-teal" />
                <span className="text-lg md:text-xl font-semibold tracking-wide text-accent">
                  {ROLE_ROTATION[roleIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Large staggered name */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter">
              {OWNER.fullName.split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + idx * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {char === " " ? " " : char}
                </motion.span>
              ))}
            </h1>

            {/* Animated accent line */}
            <motion.div
              className="mt-6 h-1.5 w-24 mx-auto bg-gradient-to-r from-accent via-teal to-green rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{ originX: 0.5 }}
            />
          </motion.div>

          {/* Tagline with gradient */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-semibold gradient-text mb-14 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {OWNER.tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <MagneticLink href="#projects">
              <button className="btn-primary px-8 py-3 text-base md:text-lg">
                View My Work
              </button>
            </MagneticLink>
            <MagneticLink href="#contact">
              <button className="btn-secondary px-8 py-3 text-base md:text-lg">
                Get In Touch
              </button>
            </MagneticLink>
          </motion.div>

          {/* Social icons */}
          <motion.ul
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            aria-label="Social links"
          >
            {SOCIAL_LINKS.map((social, idx) => {
              const Icon = SOCIAL_ICON_MAP[social.label as keyof typeof SOCIAL_ICON_MAP];
              return (
                <motion.li
                  key={social.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + idx * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
