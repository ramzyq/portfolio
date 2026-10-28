"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      bar.style.transform = `scaleX(${progress})`;
      bar.style.opacity = progress > 0.004 ? "1" : "0";
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="scroll-progress">
      <div
        ref={barRef}
        data-testid="scroll-progress"
        className="scroll-progress__bar"
      >
        <span className="bg-emerald-400" />
        <span className="bg-sky-400" />
        <span className="bg-violet-400" />
      </div>
    </div>
  );
}
