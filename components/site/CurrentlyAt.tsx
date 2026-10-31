import { OWNER } from "@/data";

export function CurrentlyAt({ label = "Currently at" }: { label?: string }) {
  return (
    <div className="pill mx-auto">
      <span>{label}</span>
      <span className="inline-flex items-center gap-2 font-medium text-ink">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ink text-xs font-semibold text-background">
          {OWNER.currentlyAtShort}
        </span>
        {OWNER.currentlyAt}
      </span>
    </div>
  );
}
