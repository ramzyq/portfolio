import { ArrowUpRight } from "lucide-react";

export function GalleryCard({
  href,
  name,
  caption,
  external = false,
  children,
}: {
  href: string;
  name: string;
  caption: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={`${name}. ${caption}`}
      data-testid="gallery-card"
      className="group block"
    >
      <div
        data-cover
        aria-hidden="true"
        className="relative aspect-[1.15/1] overflow-hidden rounded-[18px] bg-surface"
      >
        <div className="h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.015] motion-reduce:group-hover:scale-100">
          {children}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4 px-0.5">
        <div>
          <p className="text-[15px] font-medium leading-[20px] text-ink">{name}</p>
          <p className="mt-0.5 text-[14px] leading-[20px] text-body">{caption}</p>
        </div>
        <ArrowUpRight
          className="mt-0.5 h-4 w-4 shrink-0 text-[#bbb] transition-colors group-hover:text-ink"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
