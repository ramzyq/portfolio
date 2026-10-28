"use client";

import { useEffect, useRef } from "react";

export function GalleryGrid({ children }: { children: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const reset = (card: HTMLElement) => {
      card.removeAttribute("data-tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--glare-x");
      card.style.removeProperty("--glare-y");
    };

    const paint = () => {
      frame = 0;
      if (!active) return;

      const rect = active.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = (pointerX - rect.left) / rect.width - 0.5;
      const y = (pointerY - rect.top) / rect.height - 0.5;

      active.dataset.tilting = "true";
      active.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      active.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
      active.style.setProperty("--glare-x", `${pointerX - rect.left}px`);
      active.style.setProperty("--glare-y", `${pointerY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const card = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-tilt="true"]'
      );
      const next = card && grid.contains(card) ? card : null;

      if (active && active !== next) reset(active);
      active = next;

      if (!active) return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    grid.addEventListener("pointermove", onMove, { passive: true });
    grid.addEventListener("pointerleave", onLeave);
    grid.addEventListener("pointercancel", onLeave);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (active) reset(active);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      grid.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      data-testid="gallery-grid"
      className="gallery-stagger mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-6 gap-y-8 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8"
    >
      {children}
    </div>
  );
}
