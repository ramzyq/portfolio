import { OWNER } from "@/data";
import { HireButton } from "./HireButton";

export function EmailCard() {
  return (
    <section
      data-testid="email-card"
      className="mx-auto w-full max-w-[652px] px-5"
    >
      <div className="flex flex-col items-center gap-4 rounded-[18px] bg-surface px-6 py-10 text-center">
        <p className="text-[15px] text-ink">{OWNER.email}</p>
        <HireButton size="sm" label="Copy email" />
      </div>
    </section>
  );
}
