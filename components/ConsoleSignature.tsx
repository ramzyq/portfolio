"use client";

import { useEffect } from "react";

export function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { __ramzySig?: boolean }).__ramzySig) return;
    (window as unknown as { __ramzySig?: boolean }).__ramzySig = true;

    const banner = `
██████   █████  ███    ███ ███████ ██    ██
██   ██ ██   ██ ████  ████    ███   ██  ██
██████  ███████ ██ ████ ██   ███     ████
██   ██ ██   ██ ██  ██  ██  ███       ██
██   ██ ██   ██ ██      ██ ███████    ██
`;

    const accent = "color:#3B82F6;font-weight:bold;font-size:13px;line-height:1.1;font-family:monospace";
    const muted = "color:#8b8d93;font-size:12px;line-height:1.5";
    const link = "color:#14B8A6;font-size:12px";

    console.log(`%c${banner}`, accent);
    console.log("%cBuilder. Designer. Educator.", muted);
    console.log("%cLike what you see? Try ⌘K (or Ctrl+K). Or the Konami code.", muted);
    console.log("%cSay hi → konderamzy30@gmail.com", link);
  }, []);

  return null;
}
