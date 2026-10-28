import Link from "next/link";
import { ArrowUpRight } from "./icons";

export function ListRow({
  href,
  title,
  caption,
  description,
  meta,
  thumbnail,
  arrow = Boolean(href),
}: {
  href?: string;
  title: string;
  caption: string;
  description?: string;
  meta?: string;
  thumbnail?: React.ReactNode;
  arrow?: boolean;
}) {
  const external = href?.startsWith("http");

  const content = (
    <div className="flex min-h-20 items-center gap-4 py-4">
      {thumbnail ? (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl transition-transform duration-500 ease-smooth group-hover:-rotate-3 group-hover:scale-105">
          {thumbnail}
        </div>
      ) : null}
      <div className="min-w-0 flex-1 transition-transform duration-500 ease-smooth group-hover:translate-x-0.5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate text-sm font-medium leading-5 text-ink">
            {title}
          </p>
          {meta ? (
            <span className="shrink-0 text-xs text-body transition-colors duration-500 group-hover:text-ink">
              {meta}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-pretty text-sm leading-5 text-body">
          {caption}
        </p>
        {description ? (
          <p className="mt-2 line-clamp-3 text-pretty text-sm leading-6 text-body">
            {description}
          </p>
        ) : null}
      </div>
      {arrow ? (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-soft transition-[transform,color] duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  return (
    <li data-testid="list-row" className="border-b border-line">
      {href ? (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          aria-label={`${title}. ${caption}`}
          className="group -mx-3 block rounded-xl px-3 transition-[transform,background-color] duration-500 ease-smooth hover:-translate-y-px hover:bg-surface/70 active:translate-y-0 active:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
