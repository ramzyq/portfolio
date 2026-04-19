"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OWNER, ROLE_ROTATION, SOCIAL_LINKS } from "@/data";
import { XIcon } from "./icons/XIcon";

const SOCIAL_ICON_MAP = {
  GitHub: Github,
  LinkedIn: Linkedin,
  X: XIcon,
  Email: Mail,
} as const;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLE_ROTATION.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <div className="pointer-events-none absolute inset-0 dot-grid mask-fade" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute left-[8%] top-[18%] h-24 w-24 rounded-3xl border border-accent/30"
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[24%] h-16 w-16 rounded-full border border-teal/40"
          animate={{ y: [0, 14, 0], x: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[18%] left-[14%] h-20 w-20 rotate-45 border border-accent/20"
          animate={{ rotate: [45, 55, 45], y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[22%] right-[18%] h-12 w-12 rounded-full bg-accent/10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-px relative mx-auto w-full max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="eyebrow mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {OWNER.location} · Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
          className="heading-xl max-w-4xl"
        >
          {OWNER.fullName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl font-medium text-[var(--foreground)]/80 md:text-3xl"
        >
          <span className="text-[var(--muted)]">I'm a</span>
          <span className="relative inline-flex h-[1.3em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLE_ROTATION[roleIndex]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block font-heading font-semibold text-accent"
              >
                {ROLE_ROTATION[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg"
        >
          {OWNER.bioShort}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link href="#projects" className="btn-primary">
            View My Work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="#contact" className="btn-secondary">
            Get In Touch
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex items-center gap-2"
          aria-label="Social links"
        >
          {SOCIAL_LINKS.map((social) => {
            const Icon = SOCIAL_ICON_MAP[social.label as keyof typeof SOCIAL_ICON_MAP];
            return (
              <li key={social.label}>
                <Link
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
