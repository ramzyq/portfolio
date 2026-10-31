"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.3;

    const paint = () => {
      frame = 0;
      glow.style.setProperty("--cursor-x", `${x}px`);
      glow.style.setProperty("--cursor-y", `${y}px`);
      glow.dataset.active = "true";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const hide = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      glow.dataset.active = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", hide);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      data-testid="cursor-glow"
      aria-hidden="true"
      className="cursor-glow"
    >
      <span className="cursor-glow__blob" />
      <span className="cursor-glow__blob cursor-glow__blob-b" />
    </div>
  );
}
