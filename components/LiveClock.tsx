"use client";

import { useEffect, useState } from "react";

function formatAccraTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Africa/Accra",
  }).format(date);
}

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatAccraTime(new Date()));
    const id = setInterval(() => {
      setTime(formatAccraTime(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[11px] tabular-nums text-[var(--muted)] md:inline-flex"
      aria-label="Current time in Accra"
      title="Accra, GMT"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
      </span>
      <span className="text-[var(--foreground)]/80">ACC</span>
      <span suppressHydrationWarning>{time ?? "00:00:00"}</span>
    </span>
  );
}
