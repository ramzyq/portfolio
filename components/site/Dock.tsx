"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BookOpen, Briefcase, Envelope, House, User } from "./icons";
import { SoundToggle, TerminalButton } from "./DockExtras";
import { ThemeToggle } from "./ThemeToggle";

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
        className="dock-enter pointer-events-auto w-80 max-w-[calc(100vw-32px)] rounded-3xl border border-white/10 bg-dock/75 p-1 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_50px_rgba(0,0,0,0.22),0_2px_6px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="flex items-center gap-1 rounded-t-2xl border-b border-white/10 pl-1 pr-0.5">
          <TerminalButton />
          <Link
            href="/contact"
            className="group flex h-8 flex-1 items-center justify-center gap-1 rounded-t-2xl px-3 text-xs text-white/85 transition-colors duration-300 ease-smooth hover:bg-white/5 hover:text-white active:bg-white/10 focus-visible:outline-white/80"
          >
            Leave a note
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <SoundToggle />
          <ThemeToggle />
        </div>

        <ul className="flex items-center justify-around gap-1 px-1 pb-1 pt-2">
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
                    "group inline-flex h-10 items-center justify-center gap-2 rounded-full px-2 text-sm transition-[transform,background-color,color] duration-300 ease-smooth focus-visible:outline-white/80 active:scale-[0.98]",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:scale-110",
                      active && "icon-pop"
                    )}
                    aria-hidden="true"
                  />
                  {active ? <span className="label-pop">{link.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
