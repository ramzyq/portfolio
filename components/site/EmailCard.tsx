import { OWNER } from "@/data";
import { HireButton } from "./HireButton";

export function EmailCard() {
  return (
    <section
      data-testid="email-card"
      className="mx-auto w-full max-w-[652px] px-6"
    >
      <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center transition-transform duration-500 ease-smooth hover:-translate-y-1">
        <p className="text-sm font-medium text-ink">{OWNER.email}</p>
        <HireButton size="sm" label="Copy email" />
      </div>
    </section>
  );
}
