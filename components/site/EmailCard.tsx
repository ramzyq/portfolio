import { OWNER } from "@/data";
import { HireButton } from "./HireButton";

export function EmailCard() {
  return (
    <section
      data-testid="email-card"
      className="mx-auto w-full max-w-[652px] px-6"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink">{OWNER.email}</p>
        <HireButton size="sm" label="Copy email" />
      </div>
    </section>
  );
}
