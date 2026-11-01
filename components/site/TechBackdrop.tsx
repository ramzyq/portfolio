"use client";

import { useEffect, useRef } from "react";
import { MATRIX_EVENT } from "./EasterEggs";

/**
 * Fixed, non-interactive tech backdrop:
 *  - blueprint grid + slow scanline sweep (pure CSS, see .tech-grid / .tech-scan)
 *  - network constellation + sparse code rain (one shared canvas)
 *
 * Colours come from the theme's --ink token so it follows light/dark mode.
 * Reduced motion: one static constellation frame, no rain, no sweep.
 */

const GLYPHS = "01{}[]<>/\\=+*#$%&;:ABCDEF0123456789";

type Node = { x: number; y: number; vx: number; vy: number };
type Drop = {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function readInk(): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--ink")
    .trim();
  const parts = raw.split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => Number.isFinite(n))
    ? parts.join(",")
    : "36,36,36";
}

export function TechBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let ink = readInk();
    let dark = document.documentElement.classList.contains("dark");
    let nodes: Node[] = [];
    let drops: Drop[] = [];
    let frame = 0;
    let last = 0;
    let baseDrops = 0;
    let matrixUntil = 0;
    const FONT_SIZE = 13;
    const LINK_DISTANCE = coarse ? 110 : 140;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const nodeCount = Math.max(
        18,
        Math.min(coarse ? 34 : 70, Math.round(area / 22000))
      );
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));

      const columnGap = FONT_SIZE * 2.2;
      const columns = Math.floor(width / columnGap);
      const dropCount = Math.round(columns * (coarse ? 0.12 : 0.2));
      baseDrops = dropCount;
      drops = Array.from({ length: dropCount }, () => makeDrop(columnGap, true));
    };

    const makeDrop = (columnGap: number, scatter: boolean): Drop => {
      const length = 6 + Math.floor(Math.random() * 12);
      return {
        x: Math.floor(Math.random() * (width / columnGap)) * columnGap + 6,
        y: scatter
          ? Math.random() * height
          : -length * FONT_SIZE - Math.random() * height * 0.5,
        speed: 22 + Math.random() * 46,
        length,
        chars: Array.from({ length }, randomGlyph),
      };
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const lineAlpha = dark ? 0.16 : 0.1;
      const dotAlpha = dark ? 0.4 : 0.28;
      const matrix = performance.now() < matrixUntil;
      const rainAlpha = matrix ? (dark ? 0.7 : 0.55) : dark ? 0.22 : 0.13;
      const rainInk = matrix ? (dark ? "74,222,128" : "22,163,74") : ink;

      // Constellation
      for (const node of nodes) {
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgba(${ink},${(1 - dist / LINK_DISTANCE) * lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${ink},${dotAlpha})`;
      for (const node of nodes) {
        ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
      }

      // Code rain
      if (dt === 0) return;
      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
      const columnGap = FONT_SIZE * 2.2;
      for (let d = 0; d < drops.length; d++) {
        const drop = drops[d];
        drop.y += (drop.speed * dt) / 60;
        if (Math.random() < 0.04) {
          drop.chars[Math.floor(Math.random() * drop.length)] = randomGlyph();
        }
        for (let k = 0; k < drop.length; k++) {
          const y = drop.y - k * FONT_SIZE;
          if (y < -FONT_SIZE || y > height) continue;
          const fade = 1 - k / drop.length;
          const alpha = k === 0 ? rainAlpha * 2.2 : rainAlpha * fade;
          ctx.fillStyle = `rgba(${rainInk},${Math.min(alpha, 1)})`;
          ctx.fillText(drop.chars[k], drop.x, y);
        }
        if (drop.y - drop.length * FONT_SIZE > height) {
          if (!matrix && drops.length > baseDrops) {
            drops.splice(d, 1);
            d--;
          } else {
            drops[d] = makeDrop(columnGap, false);
          }
        }
      }
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      // dt in "60fps frames", clamped so tab switches don't teleport things.
      const dt = last ? Math.min((now - last) / 16.67, 3) : 1;
      last = now;
      draw(dt);
    };

    const start = () => {
      stop();
      if (reduced.matches) {
        draw(0);
        return;
      }
      last = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onResize = () => {
      seed();
      if (reduced.matches) draw(0);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMatrix = () => {
      if (reduced.matches) return;
      matrixUntil = performance.now() + 6500;
      const columnGap = FONT_SIZE * 2.2;
      const extra = Math.floor(width / columnGap) * 1.2;
      for (let i = 0; i < extra; i++) {
        const drop = makeDrop(columnGap, false);
        drop.speed *= 2.4;
        drops.push(drop);
      }
    };

    const themeObserver = new MutationObserver(() => {
      ink = readInk();
      dark = document.documentElement.classList.contains("dark");
      if (reduced.matches) draw(0);
    });

    seed();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);
    window.addEventListener(MATRIX_EVENT, onMatrix);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
      window.removeEventListener(MATRIX_EVENT, onMatrix);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-testid="tech-backdrop"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="tech-grid" />
      <canvas ref={canvasRef} className="tech-canvas" />
      <div className="tech-scan" />
    </div>
  );
}
