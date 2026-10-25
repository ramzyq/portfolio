"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { OWNER } from "@/data";
import { cn } from "@/lib/utils";

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
        "inline-flex items-center gap-2 rounded-full bg-ink font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]",
        size === "sm" ? "px-4 py-2 text-[12px]" : "px-[18px] py-[11px] text-[13px]"
      )}
    >
      {copied ? "Email copied" : label}
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
