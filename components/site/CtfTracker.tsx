"use client";

import { useEffect, useState } from "react";
import { FLAG_EVENT, FLAGS, getFound } from "@/lib/ctf";
import { openTerminal } from "./Terminal";

/** Small flag counter that appears once the visitor captures their first flag. */
export function CtfTracker() {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    setCount(getFound().length);
    const onFlag = (event: Event) => {
      const found = (event as CustomEvent<string[]>).detail;
      setCount(found.length);
      setBump((value) => value + 1);
    };
    window.addEventListener(FLAG_EVENT, onFlag);
    return () => window.removeEventListener(FLAG_EVENT, onFlag);
  }, []);

  if (count === 0) return null;

  const done = count === FLAGS.length;

  return (
    <button
      key={bump}
      type="button"
      data-testid="ctf-tracker"
      className="ctf-tracker"
      data-done={done ? "true" : "false"}
      onClick={() => openTerminal(done ? "cd /vault" : "flags")}
      aria-label={`Capture the flag: ${count} of ${FLAGS.length} found. Open terminal.`}
    >
      <span aria-hidden="true">⚑</span>
      <span>
        {count}/{FLAGS.length}
      </span>
      <span className="ctf-tracker__label">{done ? "vault open" : "flags"}</span>
    </button>
  );
}
