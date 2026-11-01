"use client";

import { useEffect } from "react";
import { award } from "@/lib/ctf";
import { toast } from "@/lib/toast";

export const MATRIX_EVENT = "krg:matrix";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Global easter eggs: console note (with a flag), Konami code (matrix mode +
 * flag), and the night-owl greeting.
 */
export function EasterEggs() {
  // Marks the shell as hydrated (used by the UI tests to avoid racing React).
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  // Console signature
  useEffect(() => {
    const w = window as unknown as { __krgSig?: boolean };
    if (w.__krgSig) return;
    w.__krgSig = true;
    const big = "font:700 14px/1.2 ui-monospace,monospace;color:#22c55e";
    const dim = "font:12px/1.6 ui-monospace,monospace;color:#8e8e93";
    const flag = "font:700 12px/1.6 ui-monospace,monospace;color:#60a5fa";
    console.log(
      "%c\n  ┌─────────────────────────────┐\n  │  KRG-OS · you found the     │\n  │  console. respect.          │\n  └─────────────────────────────┘",
      big
    );
    console.log("%cThere are 6 flags hidden on this site. Here's one for free:", dim);
    console.log("%cKRG{d3vt00ls_4r3_0p3n}", flag);
    console.log("%cSubmit it in the terminal: press ` then type  submit <flag>", dim);
  }, []);

  // Konami code
  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      buffer = [...buffer, key].slice(-KONAMI.length);
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        buffer = [];
        window.dispatchEvent(new Event(MATRIX_EVENT));
        document.documentElement.dataset.matrix = "on";
        window.setTimeout(() => delete document.documentElement.dataset.matrix, 6500);
        if (!award("konami")) {
          toast({ title: "Matrix mode", body: "You already know the code. Respect." });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5) return;
    try {
      if (sessionStorage.getItem("krg-owl")) return;
      sessionStorage.setItem("krg-owl", "1");
    } catch {}
    const timer = window.setTimeout(
      () =>
        toast({
          title: "Burning the midnight oil too? 🦉",
          body: `It's ${new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })} where you are. Respect the grind, then sleep.`,
        }),
      3500
    );
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
