"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/data";
import { SectionHeading } from "./SectionHeading";

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

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.li
                key={achievement.event}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all hover:-translate-y-1 hover:border-accent"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent to-teal"
                  aria-hidden="true"
                />

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-6 font-heading text-lg font-semibold tracking-tight">
                  {achievement.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {achievement.event}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
