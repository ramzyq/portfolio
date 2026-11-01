"use client";

import { useEffect, useRef, useState } from "react";
import { award } from "@/lib/ctf";
import { play } from "@/lib/sound";

type Mode = "walk" | "pause" | "sleep" | "alarm" | "wave";

const CHATTER = [
  "beep boop. I'm KRG-01.",
  "I was built in a robotics class. probably.",
  "Ramzy coaches FLL and WRO teams. I'm the mascot.",
  "please stop poking me. (don't.)",
];

const SLEEP_AFTER = 20000;

/**
 * A tiny line-drawn robot that patrols the bottom-left corner on desktop.
 * Sleeps when you're idle, panics on fast scrolls, waves at the headline,
 * and gives up a flag if you poke it enough.
 */
export function Robot() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("walk");
  const [bubble, setBubble] = useState<string | null>(null);
  const modeRef = useRef<Mode>("walk");
  const pokes = useRef(0);
  const bubbleTimer = useRef(0);

  const say = (text: string, ms = 2600) => {
    window.clearTimeout(bubbleTimer.current);
    setBubble(text);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };

  const setModeBoth = (next: Mode) => {
    modeRef.current = next;
    setMode(next);
  };

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 40;
    let dir = 1;
    let frame = 0;
    let last = 0;
    let pauseUntil = 0;
    let modeUntil = 0;
    let lastActivity = performance.now();
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();

    const bounds = () => ({ min: 24, max: Math.max(120, window.innerWidth / 2 - 240) });

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 16.67, 3) : 1;
      last = now;
      const current = modeRef.current;

      if ((current === "alarm" || current === "wave") && now > modeUntil) {
        setModeBoth("walk");
      }
      if (current !== "sleep" && now - lastActivity > SLEEP_AFTER) {
        setModeBoth("sleep");
      }

      if (modeRef.current === "walk" && !reduced) {
        if (now < pauseUntil) return;
        const { min, max } = bounds();
        x += dir * 0.55 * dt;
        if (x > max) {
          x = max;
          dir = -1;
        } else if (x < min) {
          x = min;
          dir = 1;
        }
        if (Math.random() < 0.002) pauseUntil = now + 1200 + Math.random() * 2000;
        root.style.setProperty("--robot-x", `${x.toFixed(1)}px`);
        root.dataset.facing = dir > 0 ? "right" : "left";
        root.dataset.moving = now < pauseUntil ? "false" : "true";
      } else {
        root.dataset.moving = "false";
      }
    };

    const wake = () => {
      lastActivity = performance.now();
      if (modeRef.current === "sleep") {
        setModeBoth("walk");
        say("huh? I'm awake. I'm awake.", 1800);
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const velocity = Math.abs(window.scrollY - lastScrollY) / Math.max(now - lastScrollT, 1);
      lastScrollY = window.scrollY;
      lastScrollT = now;
      wake();
      if (velocity > 4 && modeRef.current !== "alarm") {
        setModeBoth("alarm");
        modeUntil = now + 1400;
        say("whoa! slow down!", 1400);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("h1") || modeRef.current === "wave") return;
      setModeBoth("wave");
      modeUntil = performance.now() + 1800;
      say("hey, that's my human! 👋", 1800);
    };

    root.style.setProperty("--robot-x", `${x}px`);
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("keydown", wake);
    document.addEventListener("pointerover", onOver);
    const hello = window.setTimeout(() => say("hi! I'm KRG-01. click me."), 2500);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hello);
      window.clearTimeout(bubbleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
      document.removeEventListener("pointerover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  const poke = () => {
    play("beep");
    pokes.current += 1;
    if (modeRef.current === "sleep") setModeBoth("walk");
    if (pokes.current === 5) {
      say("ok ok! you win. here's a flag ⚑", 3200);
      award("robot");
      return;
    }
    say(CHATTER[(pokes.current - 1) % CHATTER.length]);
  };

  return (
    <div
      ref={rootRef}
      className="robot"
      data-mode={mode}
      data-facing="right"
      data-moving="true"
      data-testid="robot"
    >
      {bubble ? (
        <span className="robot__bubble" role="status">
          {bubble}
        </span>
      ) : null}
      {mode === "sleep" ? (
        <span className="robot__zzz" aria-hidden="true">
          z<span>z</span>
          <span>z</span>
        </span>
      ) : null}
      <button type="button" className="robot__body" onClick={poke} aria-label="KRG-01, a tiny robot. Poke it.">
        <svg
          viewBox="0 0 40 52"
          width="40"
          height="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <g className="robot__bob">
            <path d="M20 8 V3" />
            <circle className="robot__antenna" cx="20" cy="2.6" r="1.8" />
            <rect x="6" y="8" width="28" height="18" rx="5" className="robot__fill" />
            {mode === "sleep" ? (
              <path d="M11.5 17 h5 M23.5 17 h5" />
            ) : (
              <>
                <circle className="robot__eye" cx="14" cy="17" r={mode === "alarm" ? 3.2 : 2.2} />
                <circle className="robot__eye" cx="26" cy="17" r={mode === "alarm" ? 3.2 : 2.2} />
              </>
            )}
            {mode === "alarm" ? <path d="M17 22.5 h6" /> : <path d="M16 22 q4 2.5 8 0" />}
            <rect x="9" y="28" width="22" height="14" rx="3" className="robot__fill" />
            <circle className="robot__light" cx="20" cy="34" r="2" />
            <path className="robot__arm-l" d="M9 31 L4 38" />
            <path className="robot__arm-r" d="M31 31 L36 38" />
          </g>
          <rect className="robot__leg robot__leg-l robot__fill" x="13" y="42" width="5" height="8" rx="1.5" />
          <rect className="robot__leg robot__leg-r robot__fill" x="22" y="42" width="5" height="8" rx="1.5" />
        </svg>
      </button>
    </div>
  );
}
