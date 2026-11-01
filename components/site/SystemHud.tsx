"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient corner readout: session uptime, scroll depth as "% decrypted",
 * and a ping figure seeded from the real navigation timing.
 * Updates the DOM directly so it never re-renders React.
 */
export function SystemHud() {
  const sessionRef = useRef<HTMLSpanElement>(null);
  const decryptRef = useRef<HTMLSpanElement>(null);
  const pingRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = Date.now();
    try {
      const saved = Number(sessionStorage.getItem("krg-session-start"));
      if (saved) start = saved;
      else sessionStorage.setItem("krg-session-start", String(start));
    } catch {}

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const basePing = nav
      ? Math.max(8, Math.round(nav.responseStart - nav.requestStart))
      : 24;

    const pad = (n: number) => String(n).padStart(2, "0");

    const tickClock = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      if (sessionRef.current) {
        sessionRef.current.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
      }
    };

    const tickPing = () => {
      if (pingRef.current) {
        const jitter = Math.round((Math.random() - 0.5) * 6);
        pingRef.current.textContent = `${Math.max(4, basePing + jitter)}ms`;
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100;
        if (decryptRef.current) decryptRef.current.textContent = `${String(pct).padStart(3, " ")}%`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      });
    };

    tickClock();
    tickPing();
    onScroll();
    const clock = window.setInterval(tickClock, 1000);
    const ping = window.setInterval(tickPing, 2800);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(ping);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="hud" aria-hidden="true" data-testid="system-hud">
      <div className="hud__row">
        <span className="hud__dot" />
        <span>SESSION</span>
        <span ref={sessionRef} className="hud__val">
          00:00
        </span>
      </div>
      <div className="hud__row">
        <span>DECRYPTED</span>
        <span ref={decryptRef} className="hud__val">
          0%
        </span>
      </div>
      <span className="hud__bar">
        <span ref={barRef} />
      </span>
      <div className="hud__row">
        <span>PING ACC</span>
        <span ref={pingRef} className="hud__val">
          --
        </span>
      </div>
    </div>
  );
}
