"use client";

import { useEffect, useState } from "react";

function formatAccraTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Accra",
  }).format(date);
}

export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatAccraTime(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time suppressHydrationWarning aria-label="Current time in Accra">
      {time ?? "--:--"}
    </time>
  );
}
