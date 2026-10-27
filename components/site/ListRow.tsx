import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
    <div className="flex min-h-[84px] items-center gap-4 py-4">
      {thumbnail ? (
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[12px]">
          {thumbnail}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate text-[15px] font-medium leading-[20px] text-ink">
            {title}
          </p>
          {meta ? (
            <span className="shrink-0 text-[12px] text-body">{meta}</span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[19px] text-body">
          {caption}
        </p>
        {description ? (
          <p className="mt-2 line-clamp-3 text-[14px] leading-[22px] text-body">
            {description}
          </p>
        ) : null}
      </div>
      {arrow ? (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-[#bbb] transition-all duration-200 motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:text-ink"
          strokeWidth={1.6}
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
          className="group block"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
