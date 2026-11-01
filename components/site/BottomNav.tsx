"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, OWNER } from "@/data";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-center px-4 pb-5 md:pb-8">
      <nav aria-label="Main navigation" className="dock pointer-events-auto max-w-full">
        <ul className="flex items-center gap-0.5 overflow-x-auto px-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex whitespace-nowrap rounded-full px-3 py-2 transition-colors md:px-3.5",
                    active ? "text-white" : "text-white/45 hover:text-white/80"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/about"
          className="ml-2 hidden whitespace-nowrap rounded-full px-4 py-2 text-white/90 sm:inline-flex"
        >
          {OWNER.fullName}
        </Link>
      </nav>
    </div>
  );
}
