"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { useRef } from "react";
import { EXPERIENCE, type ExperienceType } from "@/data";
import { SectionHeading } from "./SectionHeading";

function TimelineItem({
  item,
  index,
}: {
  item: ExperienceType;
  index: number;
}) {
  const Icon = item.kind === "education" ? GraduationCap : Briefcase;
  const borderColor = item.kind === "education" ? "border-l-teal" : "border-l-accent";

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      className="relative pl-8 md:pl-12"
    >
      {/* Left border indicator */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor} rounded-full`}
        aria-hidden="true"
      />

      {/* Timeline dot */}
      <motion.span
        className="absolute left-0 top-0 -translate-x-1/4 h-4 w-4 rounded-full border-2 border-[var(--background)] bg-accent"
        aria-hidden="true"
        whileInView={{ scale: [0, 1.3, 1] }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: index * 0.07 + 0.15 }}
      />

      {/* Content card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="card-elevated group/exp"
      >
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted mb-2">
          <Icon className="h-4 w-4 transition-transform group-hover/exp:rotate-6" aria-hidden="true" />
          {item.period}
        </div>

        <h3 className="font-heading text-lg font-semibold transition-colors group-hover/exp:text-accent">
          {item.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-foreground/80">
          {item.organization}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {item.description}
        </p>
      </motion.div>
    </motion.li>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

        {/* Timeline container */}
        <div ref={containerRef} className="relative mt-16 max-w-2xl">
          {/* Background rail */}
          <div
            className="absolute left-1.5 top-0 h-full w-0.5 bg-[var(--border)]"
            aria-hidden="true"
          />

          {/* Animated line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-1.5 top-0 w-0.5 bg-gradient-to-b from-accent via-accent to-teal"
            aria-hidden="true"
          />

          {/* Items */}
          <ul className="relative space-y-10">
            {EXPERIENCE.map((item, index) => (
              <TimelineItem
                key={`${item.organization}-${item.title}`}
                item={item}
                index={index}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
