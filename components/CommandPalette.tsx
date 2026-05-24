"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Copy,
  CornerDownLeft,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NAV_LINKS, OWNER, PROJECTS, SOCIAL_LINKS } from "@/data";
import { cn } from "@/lib/utils";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  perform: () => void;
};

const NAV_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  about: User,
  projects: FolderGit2,
  experience: Briefcase,
  contact: Mail,
};

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  X: ArrowRight,
  Email: Mail,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [emailToast, setEmailToast] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const goTo = useCallback(
    (hash: string) => {
      close();
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [close]
  );

  const actions: Action[] = useMemo(() => {
    const navActions: Action[] = NAV_LINKS.map((link) => ({
      id: `nav-${link.href}`,
      label: `Go to ${link.label}`,
      hint: "Section",
      group: "Navigate",
      icon: NAV_ICON_MAP[link.href.replace("#", "")] ?? ArrowRight,
      perform: () => goTo(link.href),
    }));

    const projectActions: Action[] = PROJECTS.map((p) => ({
      id: `project-${p.slug}`,
      label: p.name,
      hint: p.status,
      group: "Projects",
      icon: FolderGit2,
      perform: () => {
        if (p.demo) window.open(p.demo, "_blank", "noopener,noreferrer");
        else if (p.github) window.open(p.github, "_blank", "noopener,noreferrer");
        else goTo("#projects");
        close();
      },
    }));

    const socialActions: Action[] = SOCIAL_LINKS.map((s) => ({
      id: `social-${s.label}`,
      label: `Open ${s.label}`,
      hint: s.label === "Email" ? OWNER.email : new URL(s.href).host,
      group: "Links",
      icon: SOCIAL_ICON_MAP[s.label] ?? ArrowRight,
      perform: () => {
        if (s.href.startsWith("mailto:")) {
          window.location.href = s.href;
        } else {
          window.open(s.href, "_blank", "noopener,noreferrer");
        }
        close();
      },
    }));

    const utilityActions: Action[] = [
      {
        id: "copy-email",
        label: "Copy email address",
        hint: OWNER.email,
        group: "Quick actions",
        icon: Copy,
        perform: async () => {
          try {
            await navigator.clipboard.writeText(OWNER.email);
            setEmailToast(true);
            setTimeout(() => setEmailToast(false), 2000);
          } catch {
            window.location.href = `mailto:${OWNER.email}`;
          }
          close();
        },
      },
      {
        id: "toggle-theme",
        label: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        hint: "Theme",
        group: "Quick actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        perform: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
    ];

    return [...navActions, ...projectActions, ...socialActions, ...utilityActions];
  }, [resolvedTheme, setTheme, goTo, close]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        (a.hint?.toLowerCase().includes(q) ?? false)
    );
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.perform();
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Action[]>();
    filtered.forEach((a) => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  let runningIndex = -1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[16vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              role="presentation"
              onClick={close}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type to search — projects, sections, links…"
                  className="flex-1 bg-transparent py-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <kbd className="hidden rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)] sm:inline-block">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {grouped.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                    No matches for &ldquo;{query}&rdquo;.
                  </p>
                )}
                {grouped.map(([group, items]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {group}
                    </p>
                    <ul>
                      {items.map((action) => {
                        runningIndex += 1;
                        const isActive = runningIndex === activeIndex;
                        const Icon = action.icon;
                        return (
                          <li key={action.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(runningIndex)}
                              onClick={() => action.perform()}
                              className={cn(
                                "group/cmd flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                isActive
                                  ? "bg-accent/10 text-[var(--foreground)]"
                                  : "text-[var(--foreground)]/85 hover:bg-[var(--surface)]"
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                                  isActive
                                    ? "border-accent/60 bg-accent/20 text-accent"
                                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                              <span className="flex-1 truncate">{action.label}</span>
                              {action.hint && (
                                <span className="hidden truncate text-xs text-[var(--muted)] sm:inline">
                                  {action.hint}
                                </span>
                              )}
                              {isActive && (
                                <CornerDownLeft className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)]/50 px-4 py-2 text-[11px] text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>↵</Kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>esc</Kbd>
                  <span>close</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emailToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-teal/40 bg-[var(--background)]/90 px-4 py-2 text-xs text-teal-500 shadow-lg backdrop-blur"
            role="status"
          >
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[20px] items-center justify-center rounded border border-[var(--border)] bg-[var(--background)] px-1 py-0.5 font-mono text-[10px] text-[var(--foreground)]">
      {children}
    </kbd>
  );
}
