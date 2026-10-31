"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
      return;
    }

    setShown(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown ? "true" : "false"}
      className={cn(
        "transition-[transform,opacity,filter] duration-700 ease-smooth motion-reduce:transition-none",
        shown
          ? "translate-y-0 scale-100 opacity-100 blur-0"
          : "translate-y-8 scale-[0.985] opacity-0 blur-[2px]",
        className
      )}
    >
      {children}
    </div>
  );
}
