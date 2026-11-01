"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";

const CELLS = 16;
const ROUND_MS = 20000;
const MAX_BREACHES = 5;
const BEST_KEY = "krg-firewall-best";

type Phase = "ready" | "playing" | "over";

/** Whack-a-packet: block intruders before they breach the firewall. */
export function FirewallGame() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [active, setActive] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [breaches, setBreaches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [best, setBest] = useState(0);
  const timers = useRef<number[]>([]);
  const endsAt = useRef(0);
  const breachRef = useRef(0);
  const activeRef = useRef<Record<number, number>>({});

  const syncActive = (next: Record<number, number>) => {
    activeRef.current = next;
    setActive(next);
  };

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {}
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const finish = useCallback((final: number) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    activeRef.current = {};
    setActive({});
    setPhase("over");
    play(final > 0 ? "ok" : "error");
    let prevBest = 0;
    try {
      prevBest = Number(localStorage.getItem(BEST_KEY)) || 0;
      localStorage.setItem(BEST_KEY, String(Math.max(prevBest, final)));
    } catch {}
    setBest(Math.max(prevBest, final));
  }, []);

  const scoreRef = useRef(0);

  const spawn = useCallback(() => {
    const remaining = endsAt.current - Date.now();
    if (remaining <= 0) return;
    const cell = Math.floor(Math.random() * CELLS);
    const id = Date.now() + cell;
    const lifetime = 1300 - Math.min(700, (ROUND_MS - remaining) / 25);
    if (!activeRef.current[cell]) {
      syncActive({ ...activeRef.current, [cell]: id });
      timers.current.push(
        window.setTimeout(() => {
          if (activeRef.current[cell] !== id) return;
          const next = { ...activeRef.current };
          delete next[cell];
          syncActive(next);
          breachRef.current += 1;
          setBreaches(breachRef.current);
          play("error");
          if (breachRef.current >= MAX_BREACHES) finish(scoreRef.current);
        }, lifetime)
      );
    }
    const gap = Math.max(260, 750 - (ROUND_MS - remaining) / 30);
    timers.current.push(window.setTimeout(spawn, gap));
  }, [finish]);

  const start = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    scoreRef.current = 0;
    breachRef.current = 0;
    setScore(0);
    setBreaches(0);
    syncActive({});
    setPhase("playing");
    endsAt.current = Date.now() + ROUND_MS;
    setTimeLeft(ROUND_MS);
    play("boot");
    spawn();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = window.setInterval(() => {
      const left = Math.max(0, endsAt.current - Date.now());
      setTimeLeft(left);
      if (left === 0) finish(scoreRef.current);
    }, 100);
    return () => window.clearInterval(interval);
  }, [phase, finish]);

  const hit = (cell: number) => {
    if (phase !== "playing" || !activeRef.current[cell]) return;
    play("key");
    const next = { ...activeRef.current };
    delete next[cell];
    syncActive(next);
    scoreRef.current += 1;
    setScore(scoreRef.current);
  };

  return (
    <section className="firewall" aria-labelledby="firewall-title" data-testid="firewall-game">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="xs-mono text-soft">WHILE YOU&apos;RE HERE</p>
          <h2 id="firewall-title" className="mt-1 text-lg font-semibold text-ink">
            Patch the breach
          </h2>
        </div>
        <div className="xs-mono text-right text-soft">
          <div>
            BLOCKED <span className="text-ink">{score}</span> · BEST{" "}
            <span className="text-ink">{best}</span>
          </div>
          <div>
            BREACHES{" "}
            <span className={breaches ? "text-red-500" : "text-ink"}>
              {breaches}/{MAX_BREACHES}
            </span>{" "}
            · {(timeLeft / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      <div className="firewall__grid" data-phase={phase}>
        {Array.from({ length: CELLS }, (_, cell) => (
          <button
            key={cell}
            type="button"
            className="firewall__cell"
            data-hot={active[cell] ? "true" : "false"}
            onClick={() => hit(cell)}
            aria-label={active[cell] ? `Intruder at node ${cell + 1}, block it` : `Node ${cell + 1}`}
            disabled={phase !== "playing"}
          >
            <span aria-hidden="true">{active[cell] ? "☠" : "·"}</span>
          </button>
        ))}
        {phase !== "playing" ? (
          <div className="firewall__overlay">
            {phase === "over" ? (
              <p className="text-ink">
                {breaches >= MAX_BREACHES ? "Firewall breached." : "Time's up."} You blocked{" "}
                <b>{score}</b> intruders.
              </p>
            ) : (
              <p className="text-body">Intruders will appear. Click them before they get through.</p>
            )}
            <button type="button" className="xs-btn" onClick={start}>
              {phase === "over" ? "Play again" : "Start"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
