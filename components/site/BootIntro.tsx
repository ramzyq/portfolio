"use client";

import { useEffect, useState } from "react";
import { BOOT_DONE_EVENT, BOOT_STORAGE_KEY } from "@/lib/boot";

const LINES: { text: string; status?: string }[] = [
  { text: "KRG-OS v26.11 · cold boot" },
  { text: "mounting /projects", status: "ok" },
  { text: "loading flutter.runtime", status: "ok" },
  { text: "hardening firewall", status: "ok" },
  { text: "compiling curiosity", status: "ok" },
  { text: "welcome, visitor" },
];

const LINE_INTERVAL = 210;
const HOLD_AFTER = 420;
const FADE_OUT = 450;

export function BootIntro() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.boot !== "on") return;

    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach((id) => window.clearTimeout(id));
      try {
        sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
      } catch {}
      root.dataset.boot = "out";
      window.setTimeout(() => {
        root.removeAttribute("data-boot");
        window.dispatchEvent(new Event(BOOT_DONE_EVENT));
      }, FADE_OUT);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };

    LINES.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => setVisibleLines(index + 1),
          120 + index * LINE_INTERVAL
        )
      );
    });
    timers.push(
      window.setTimeout(finish, 120 + LINES.length * LINE_INTERVAL + HOLD_AFTER)
    );

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  return (
    <div aria-hidden="true" className="boot-screen" data-testid="boot-screen">
      <div className="boot-screen__panel">
        {LINES.slice(0, visibleLines).map((line, index) => (
          <div key={line.text} className="boot-screen__line">
            <span className="boot-screen__prompt">&gt;</span>
            <span className="boot-screen__text">{line.text}</span>
            {line.status ? (
              <span className="boot-screen__status">[ {line.status} ]</span>
            ) : index === LINES.length - 1 ? (
              <span className="boot-screen__caret" />
            ) : null}
          </div>
        ))}
        <div className="boot-screen__hint">press any key to skip</div>
      </div>
    </div>
  );
}
