import Link from "next/link";
import { OWNER } from "@/data";
import { Clock } from "./Clock";

export function FixedFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="fixed inset-x-0 bottom-0 z-40 flex min-h-16 items-end bg-background px-6 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-foreground/60 shadow-[0_-10px_24px_12px_rgb(var(--background))]"
    >
      <div className="grid w-full grid-cols-[1fr_auto] gap-x-6 gap-y-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8">
          <p>{OWNER.fullName}</p>
          <p>{OWNER.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-8">
          <p>{OWNER.location}</p>
          <Clock />
          <div className="flex items-center gap-3">
            <p>{year}</p>
            <Link
              href="/privacy"
              className="underline-offset-4 transition-colors duration-300 ease-smooth hover:text-ink hover:underline active:opacity-70"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
