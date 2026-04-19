import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { OWNER, SOCIAL_LINKS } from "@/data";
import { XIcon } from "./icons/XIcon";

const SOCIAL_ICON_MAP = {
  GitHub: Github,
  LinkedIn: Linkedin,
  X: XIcon,
  Email: Mail,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container-px mx-auto flex max-w-content flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
          <span className="font-heading font-semibold text-[var(--foreground)]">
            {OWNER.fullName}
          </span>
          <span aria-hidden="true">·</span>
          <span>{OWNER.location}</span>
          <span aria-hidden="true">·</span>
          <span>{year}</span>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Built with{" "}
          <Link
            href="https://nextjs.org"
            className="link-underline font-medium text-[var(--foreground)]"
          >
            Next.js
          </Link>{" "}
          &{" "}
          <Link
            href="https://tailwindcss.com"
            className="link-underline font-medium text-[var(--foreground)]"
          >
            Tailwind CSS
          </Link>
        </p>

        <ul className="flex items-center gap-2" aria-label="Social links">
          {SOCIAL_LINKS.map((social) => {
            const Icon = SOCIAL_ICON_MAP[social.label as keyof typeof SOCIAL_ICON_MAP];
            return (
              <li key={social.label}>
                <Link
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
