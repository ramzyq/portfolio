import { OWNER } from "@/data";
import { Clock } from "./Clock";

export function FixedFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="fixed inset-x-0 bottom-0 z-40 flex min-h-16 items-end bg-white px-6 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-black/65 shadow-[0_-10px_24px_12px_#fff]"
    >
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8">
          <p>{OWNER.fullName}</p>
          <p>{OWNER.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-8">
          <p>{OWNER.location}</p>
          <Clock />
          <p>{year}</p>
        </div>
      </div>
    </footer>
  );
}
