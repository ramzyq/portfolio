import { ArrowUpRight } from "lucide-react";
import type { SocialLinkType } from "@/data";

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
              className="group flex items-center justify-between py-3.5 text-[14px] text-ink"
            >
              {link.label}
              <ArrowUpRight
                className="h-4 w-4 text-[#bbb] transition-all duration-200 motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:text-ink"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
