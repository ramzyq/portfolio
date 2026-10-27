import { OWNER } from "@/data";

export function CurrentlyAt({ label = "Currently at" }: { label?: string }) {
  return (
    <div className="pill mx-auto">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
        <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-ink text-[8px] font-semibold text-white">
          {OWNER.currentlyAtShort}
        </span>
        {OWNER.currentlyAt}
      </span>
    </div>
  );
}
