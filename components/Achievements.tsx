"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/data";
import { SectionHeading } from "./SectionHeading";

const GRADIENT_BACKGROUNDS = [
  "from-blue-500/10 to-blue-600/5",
  "from-teal-500/10 to-teal-600/5",
  "from-purple-500/10 to-purple-600/5",
];

export function Achievements() {
  return (
    <section
      id="achievements"
      className="section"
      aria-labelledby="achievements-heading"
    >
      <div className="container-px mx-auto max-w-content">
        <div id="achievements-heading" className="sr-only">
          Achievements
        </div>
        <SectionHeading
          eyebrow="Achievements"
          title="Wins from the robotics floor."
          description="A snapshot of competitions where our teams placed on the international stage."
        />

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACHIEVEMENTS.map((achievement, index) => {
            const Icon = achievement.icon;
            const bgGradient = GRADIENT_BACKGROUNDS[index % GRADIENT_BACKGROUNDS.length];

            return (
              <motion.li
                key={achievement.event}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br ${bgGradient} p-8 transition-all hover:border-accent/50`}
              >
                {/* Icon container with gradient circle */}
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-teal/10 text-accent">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="mt-6 font-heading text-base md:text-lg font-semibold tracking-tight leading-snug">
                  {achievement.title}
                </h3>
                <p className="mt-3 text-sm text-muted">
                  {achievement.event}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
