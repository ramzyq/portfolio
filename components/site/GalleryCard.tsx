import { ArrowUpRight } from "./icons";

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
      className="group block rounded-2xl transition-transform duration-300 ease-smooth active:scale-[0.995]"
    >
      <div
        data-cover
        aria-hidden="true"
        className="relative aspect-[1.15/1] overflow-hidden rounded-2xl bg-surface"
      >
        <div className="h-full w-full transition-transform duration-500 ease-smooth motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100">
          {children}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4 px-0.5">
        <div>
          <p className="text-sm font-medium leading-5 text-ink">{name}</p>
          <p className="mt-0.5 text-pretty text-sm leading-5 text-body">
            {caption}
          </p>
        </div>
        <ArrowUpRight
          className="mt-0.5 h-4 w-4 shrink-0 text-soft transition-colors duration-300 ease-smooth group-hover:text-ink"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
