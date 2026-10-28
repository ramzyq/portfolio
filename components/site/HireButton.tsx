"use client";

import { useState } from "react";
import { OWNER } from "@/data";
import { cn } from "@/lib/utils";
import { Check, Copy } from "./icons";

export function HireButton({
  label = `Hire ${OWNER.shortName}`,
  size = "md",
}: {
  label?: string;
  size?: "md" | "sm";
}) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(OWNER.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${OWNER.email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copyEmail}
      aria-label={`${label}: copy email address`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-ink font-semibold text-white transition-[transform,background-color] duration-300 ease-smooth hover:scale-[1.02] hover:bg-ink/90 active:scale-[0.98]",
        size === "sm" ? "px-3 py-2 text-sm" : "px-3 py-2 text-base"
      )}
    >
      {copied ? "Email copied" : label}
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
