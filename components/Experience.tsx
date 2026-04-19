"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { EXPERIENCE, type ExperienceType } from "@/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

function TimelineItem({
  item,
  index,
}: {
  item: ExperienceType;
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const Icon = item.kind === "education" ? GraduationCap : Briefcase;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      className="relative md:grid md:grid-cols-2 md:gap-10"
    >
      <div
        className={cn(
          "relative pl-10 md:pl-0",
          isLeft ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
        )}
      >
        <div className="card transition-colors hover:border-accent/60">
          <div
            className={cn(
              "flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent",
              isLeft ? "md:justify-end" : ""
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {item.period}
          </div>
          <h3 className="mt-3 font-heading text-lg font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm font-medium text-[var(--foreground)]/80">
            {item.organization}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {item.description}
          </p>
        </div>
      </div>

      <span
        className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-[var(--background)] md:left-1/2"
        aria-hidden="true"
      />
    </motion.li>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container-px mx-auto max-w-content">
        <div id="experience-heading" className="sr-only">
          Experience and education
        </div>
        <SectionHeading
          eyebrow="Experience & Education"
          title="The path, in order."
          description="Work and study that shaped the way I build and teach."
        />

        <div className="relative mt-16">
          <span
            className="absolute left-4 top-0 h-full w-px bg-[var(--border)] md:left-1/2"
            aria-hidden="true"
          />

          <ul className="space-y-12">
            {EXPERIENCE.map((item, index) => (
              <TimelineItem key={`${item.organization}-${item.title}`} item={item} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
