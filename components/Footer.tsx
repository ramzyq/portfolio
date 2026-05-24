import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { OWNER, SOCIAL_LINKS, NAV_LINKS } from "@/data";
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
    <footer className="relative border-t border-[var(--border)]">
      {/* Gradient separator line */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-gradient-to-r from-accent via-teal to-green w-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ originX: 0 }}
      />

      <div className="container-px mx-auto max-w-content py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 md:items-start mb-12">
          {/* Left: Branding and tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-heading font-semibold text-foreground">
              {OWNER.fullName}
            </p>
            <p className="mt-2 text-sm text-muted">
              Built to ship
            </p>
            <p className="mt-4 text-xs text-muted/70 leading-relaxed max-w-xs">
              Builder. Designer. Educator. Shipped from Accra, Ghana 🇬🇭
            </p>
          </motion.div>

          {/* Center: Quick nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-accent mb-4">
              Quick Links
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-accent mb-4">
              Connect
            </p>
            <ul className="flex items-center gap-3" aria-label="Social links">
              {SOCIAL_LINKS.map((social, idx) => {
                const Icon = SOCIAL_ICON_MAP[social.label as keyof typeof SOCIAL_ICON_MAP];
                return (
                  <motion.li
                    key={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.08 }}
                  >
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Bottom: Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-[var(--border)] text-center md:text-left"
        >
          <p className="text-xs text-muted">
            © {year} Konde Ramzy Gbati. Built by me • Deployed with passion
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
