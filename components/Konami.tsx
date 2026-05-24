"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const COLORS = ["#3B82F6", "#14B8A6", "#F59E0B", "#EF4444", "#A855F7", "#22C55E"];

type Confetto = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  drift: number;
  size: number;
  delay: number;
};

export function Konami() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let buffer: string[] = [];
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = [...buffer, key].slice(-SEQUENCE.length);

      let matched = 0;
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === SEQUENCE[i]) matched++;
        else {
          matched = 0;
        }
      }
      setProgress(matched);

      if (buffer.length === SEQUENCE.length && buffer.every((k, i) => k === SEQUENCE[i])) {
        setActive(true);
        buffer = [];
        setProgress(0);
        setTimeout(() => setActive(false), 5200);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const confetti: Confetto[] = useMemo(() => {
    if (!active) return [];
    return new Array(80).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 30,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      drift: (Math.random() - 0.5) * 40,
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.6,
    }));
  }, [active]);

  return (
    <>
      {progress > 1 && progress < SEQUENCE.length && !active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-accent/40 bg-[var(--background)]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur"
        >
          {progress}/{SEQUENCE.length} ↑↑↓↓←→←→ba
        </motion.div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                initial={{
                  x: `${c.x}vw`,
                  y: `${c.y}vh`,
                  rotate: c.rotate,
                  opacity: 1,
                }}
                animate={{
                  y: "110vh",
                  x: `${c.x + c.drift}vw`,
                  rotate: c.rotate + 540,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3.8 + Math.random() * 1.2,
                  delay: c.delay,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  width: c.size,
                  height: c.size * 0.4,
                  backgroundColor: c.color,
                  borderRadius: 2,
                  boxShadow: `0 0 6px ${c.color}55`,
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent/40 bg-[var(--background)]/95 px-8 py-6 text-center shadow-2xl backdrop-blur"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                cheat code accepted
              </p>
              <p className="mt-2 font-heading text-2xl font-bold tracking-tight">
                You found it.
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Tell me at konderamzy30@gmail.com — I owe you a coffee.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
