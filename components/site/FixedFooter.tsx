import { OWNER } from "@/data";
import { Clock } from "./Clock";

export function FixedFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="fixed inset-x-0 bottom-0 z-40 flex min-h-[64px] items-end bg-white px-[22px] pb-[10px] pt-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-black/65 shadow-[0_-10px_24px_12px_#fff] sm:text-[12px]"
    >
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-[35px]">
          <p>{OWNER.fullName}</p>
          <p>{OWNER.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-[35px]">
          <p>{OWNER.location}</p>
          <Clock />
          <p>{year}</p>
        </div>
      </div>
    </footer>
  );
}
