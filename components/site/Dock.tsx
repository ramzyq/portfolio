"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data";
import { cn } from "@/lib/utils";
import { BookOpen, Briefcase, Envelope, House, User } from "./icons";

const ICONS = {
  "/": House,
  "/about": User,
  "/built": Briefcase,
  "/learn": BookOpen,
  "/contact": Envelope,
} as const;

export function Dock() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-12">
      <nav
        aria-label="Main navigation"
        data-testid="dock"
        className="pointer-events-auto w-80 max-w-[calc(100vw-32px)] rounded-3xl bg-ink/90 p-1 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.125),0_2px_6px_rgba(0,0,0,0.08)] backdrop-blur-md"
      >
        <Link
          href="/contact"
          className="flex h-8 items-center justify-center rounded-t-2xl border-b border-white/10 px-3 text-xs text-white/85 transition-colors duration-300 ease-smooth hover:bg-white/5 hover:text-white"
        >
          Leave a note <span aria-hidden="true">↗</span>
        </Link>

        <ul className="flex items-center gap-1 px-1 pb-1 pt-2">
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
                    "inline-flex h-10 items-center justify-center gap-2 rounded-full px-2 text-sm transition duration-300 ease-smooth active:scale-[0.98]",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
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
