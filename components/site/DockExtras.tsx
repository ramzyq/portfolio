"use client";

import { useEffect, useState } from "react";
import { isSoundOn, setSoundOn, SOUND_EVENT } from "@/lib/sound";
import { openTerminal } from "./Terminal";

const btn =
  "group inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition-colors duration-300 ease-smooth hover:bg-white/5 hover:text-white active:bg-white/10 focus-visible:outline-white/80";

export function TerminalButton() {
  return (
    <button
      type="button"
      onClick={() => openTerminal()}
      aria-label="Open terminal (press `)"
      title="Terminal ( ` )"
      data-testid="terminal-button"
      className={btn}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-500 ease-smooth group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 7l5 5-5 5" />
        <path d="M12 17h7" />
      </svg>
    </button>
  );
}

export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isSoundOn());
    const sync = (event: Event) => setOn(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(SOUND_EVENT, sync);
    return () => window.removeEventListener(SOUND_EVENT, sync);
  }, []);

  const label = on ? "Mute sound effects" : "Turn on sound effects";

  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      aria-label={label}
      aria-pressed={on}
      title={label}
      data-testid="sound-toggle"
      className={btn}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-500 ease-smooth group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 10v4h4l5 4V6L8 10H4z" />
        {on ? (
          <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />
        ) : (
          <path d="M17 9.5l5 5M22 9.5l-5 5" />
        )}
      </svg>
    </button>
  );
}
