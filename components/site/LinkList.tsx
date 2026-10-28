import type { SocialLinkType } from "@/data";
import { ArrowUpRight } from "./icons";

export function LinkList({ links }: { links: SocialLinkType[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-8">
      {links.map((link) => {
        const external = link.href.startsWith("http");

        return (
          <li key={link.label} className="border-t border-line">
            <a
              data-testid="social-link"
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group flex items-center justify-between py-4 text-sm text-ink transition-opacity duration-300 ease-smooth active:opacity-70"
            >
              {link.label}
              <ArrowUpRight
                className="h-4 w-4 text-soft transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
