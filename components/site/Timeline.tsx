import { EXPERIENCE, TIMELINE_YEARS } from "@/data";
import { cn } from "@/lib/utils";

const YEAR_START = TIMELINE_YEARS[0];
const YEAR_SPAN = TIMELINE_YEARS[TIMELINE_YEARS.length - 1] - YEAR_START;

function leftPct(year: number) {
  return ((year - YEAR_START) / YEAR_SPAN) * 100;
}

function widthPct(start: number, end: number) {
  return ((end - start) / YEAR_SPAN) * 100;
}

export function Timeline() {
  const primaryCurrent = EXPERIENCE.find((item) => item.current)?.organization;

  return (
    <section
      aria-label="Career timeline"
      className="mx-auto mt-16 w-full max-w-[780px] px-5"
    >
      <div className="relative">
        <div
          dir="rtl"
          role="group"
          tabIndex={0}
          className="hide-scrollbar overflow-x-auto pb-2"
          aria-label="Scrollable timeline; scroll left for earlier roles"
        >
          <div dir="ltr" className="min-w-[640px] sm:min-w-[740px]">
            <div className="relative h-[15px]">
              {TIMELINE_YEARS.map((year) => {
                const isLastYear =
                  year === TIMELINE_YEARS[TIMELINE_YEARS.length - 1];
                return (
                  <span
                    key={year}
                    className="absolute text-[11px] text-body"
                    style={
                      isLastYear
                        ? { right: "0%" }
                        : { left: `${leftPct(year)}%` }
                    }
                  >
                    {year}
                  </span>
                );
              })}
            </div>

            <div className="mt-4 border-t border-line" />

            <div className="relative mt-6 space-y-2.5">
              {EXPERIENCE.map((item) => {
                const left = leftPct(item.start);
                const width = Math.min(
                  Math.max(widthPct(item.start, item.end), 30),
                  100 - left
                );
                const isPrimaryCurrent = item.organization === primaryCurrent;

                return (
                  <div key={item.organization} className="relative h-[44px]">
                    <div
                      data-testid="timeline-bar"
                      data-current={isPrimaryCurrent ? "true" : undefined}
                      className={cn(
                        "absolute flex h-[44px] items-center justify-between gap-2 overflow-hidden rounded-full px-3.5",
                        isPrimaryCurrent
                          ? "bg-ink text-white"
                          : "bg-[#f1f1f2] text-ink/70"
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] font-medium leading-[15px]">
                          {item.organization}
                        </span>
                        <span
                          className={cn(
                            "block truncate text-[10px] leading-[13px]",
                            isPrimaryCurrent ? "text-white/60" : "text-ink/50"
                          )}
                        >
                          {item.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-[10px]",
                          isPrimaryCurrent ? "text-white/70" : "text-ink/50"
                        )}
                      >
                        {item.current ? "Now" : `${item.start}–${item.end}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:hidden"
        />
      </div>
    </section>
  );
}
