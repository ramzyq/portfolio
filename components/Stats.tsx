"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { STATS, type StatType } from "@/data";

function StatItem({ stat, index }: { stat: StatType; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, stat.value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.1,
    });
    return controls.stop;
  }, [inView, count, stat.value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="flex flex-col items-center text-center"
    >
      <div className="flex items-baseline gap-1 justify-center">
        <motion.span className="font-heading text-6xl md:text-7xl font-black gradient-text tabular-nums">
          {rounded}
        </motion.span>
        {stat.suffix && (
          <span className="font-heading text-3xl md:text-5xl font-bold text-accent">
            {stat.suffix}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm md:text-base font-semibold text-foreground">
        {stat.label}
      </p>
      <p className="mt-1 text-xs md:text-sm text-muted max-w-xs">{stat.caption}</p>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section
      id="stats"
      aria-label="Stats"
      className="my-24 md:my-32"
    >
      {/* Dark ribbon background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-slate-900 to-slate-800 dark:from-[#0a0a0b] dark:to-slate-900 py-16 md:py-20"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-teal/5 pointer-events-none" />
        </div>

        <div className="container-px relative mx-auto max-w-content">
          <div className="grid grid-cols-2 gap-8 md:gap-12 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent via-teal to-green w-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ originX: 0 }}
        />
      </motion.div>
    </section>
  );
}
