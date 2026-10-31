"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      data-theme-mode={mounted ? resolvedTheme : "pending"}
      className="group inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition-colors duration-300 ease-smooth hover:bg-white/5 hover:text-white active:bg-white/10 focus-visible:outline-white/80"
    >
      {isDark ? (
        <Sun
          className="icon-pop h-4 w-4 transition-transform duration-500 ease-smooth group-hover:rotate-[24deg] group-hover:scale-110"
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="icon-pop h-4 w-4 transition-transform duration-500 ease-smooth group-hover:-rotate-12 group-hover:scale-110"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
