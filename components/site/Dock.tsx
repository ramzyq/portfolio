"use client";

import { BookOpen, BriefcaseBusiness, House, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data";
import { cn } from "@/lib/utils";

const ICONS = {
  "/": House,
  "/about": UserRound,
  "/built": BriefcaseBusiness,
  "/learn": BookOpen,
  "/contact": Mail,
} as const;

export function Dock() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[96px] z-50 flex justify-center px-4 md:bottom-[46px]">
      <nav
        aria-label="Main navigation"
        data-testid="dock"
        className="pointer-events-auto w-[316px] max-w-[calc(100vw-32px)] rounded-[24px] bg-[#242424] p-[5px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.125),0_2px_6px_rgba(0,0,0,0.08)]"
      >
        <Link
          href="/contact"
          className="flex h-8 items-center justify-center rounded-t-[23px] border-b border-white/10 px-3.5 text-[11px] text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          Leave a note <span aria-hidden="true">↗</span>
        </Link>

        <ul className="flex items-center gap-[3px] px-[3px] pb-[3px] pt-2">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const Icon = ICONS[link.href as keyof typeof ICONS] ?? House;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.label}
                  aria-current={active ? "page" : undefined}
                  data-nav-item={link.href}
                  className={cn(
                    "inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full px-2 text-[13px] transition-colors",
                    active
                      ? "border border-white/[0.06] bg-[#3b3b3b] text-white"
                      : "text-white/55 hover:text-white/85"
                  )}
                >
                  <Icon className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden="true" />
                  {active && link.href !== "/" ? <span>{link.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
