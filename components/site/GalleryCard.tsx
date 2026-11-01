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
    <div data-gallery-item>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        aria-label={`${name}. ${caption}`}
        data-testid="gallery-card"
        data-tilt="true"
        className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div
          data-cover
          aria-hidden="true"
          className="relative aspect-[1.15/1] overflow-hidden rounded-2xl bg-surface"
        >
          <div className="h-full w-full transition-transform duration-700 ease-smooth motion-reduce:transition-none group-hover:scale-[1.035] motion-reduce:group-hover:scale-100">
            {children}
          </div>
          <span className="cover-glare" />
          <span className="cover-shine" />
          <span className="decrypt">
            <span className="decrypt__label">
              <span className="decrypt__a">
                decrypting {name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.enc
              </span>
              <span className="decrypt__b">access granted ✓</span>
            </span>
            <span className="decrypt__bar">
              <i />
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4 px-0.5">
          <div>
            <p className="text-sm font-medium leading-5 text-ink">{name}</p>
            <p className="mt-0.5 text-pretty text-sm leading-5 text-body">
              {caption}
            </p>
          </div>
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-soft transition-[transform,color] duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-6 group-hover:text-ink"
            aria-hidden="true"
          />
        </div>
      </a>
    </div>
  );
}
