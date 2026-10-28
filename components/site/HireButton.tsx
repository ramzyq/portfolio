"use client";

import { useState } from "react";
import { OWNER } from "@/data";
import { cn } from "@/lib/utils";
import { Check, Copy } from "./icons";
import { Confetti } from "./Confetti";

export function HireButton({
  label = `Hire ${OWNER.shortName}`,
  size = "md",
}: {
  label?: string;
  size?: "md" | "sm";
}) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(OWNER.email);
      setCopied(true);
      setBurst((value) => value + 1);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${OWNER.email}`;
    }
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copyEmail}
        aria-label={`${label}: copy email address`}
        className={cn(
          "btn-shine group inline-flex items-center gap-2 rounded-full bg-ink font-semibold text-background transition-[transform,background-color,box-shadow] duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98]",
          size === "sm" ? "px-3 py-2 text-sm" : "px-3 py-2 text-base"
        )}
      >
        <span>{copied ? "Email copied" : label}</span>
        {copied ? (
          <Check className="icon-pop h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="copy-icon h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? "Email address copied" : ""}
        </span>
      </button>
      {copied ? <Confetti key={burst} burst={burst} /> : null}
    </span>
  );
}
