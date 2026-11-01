"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { OWNER, PROJECTS, SKILL_GROUPS, SOCIAL_LINKS } from "@/data";
import { FLAGS, getFound, resetFlags, submitFlag } from "@/lib/ctf";
import { projectHref } from "@/lib/projects";
import { isSoundOn, play, setSoundOn } from "@/lib/sound";
import { toast } from "@/lib/toast";

export const TERMINAL_EVENT = "krg:terminal";

/** Open the terminal from anywhere, optionally running a command. */
export function openTerminal(command?: string) {
  window.dispatchEvent(new CustomEvent(TERMINAL_EVENT, { detail: command }));
}

type Line = { kind: "in" | "out" | "err" | "ok" | "dim"; text: string };

const PROMPT = "visitor@krg-os:~$";
const VAULT_KEY_B64 = "S1JHe2I0czNfNjRfMXNfbjB0XzNuY3J5cHQxMG59";

const ROUTES: Record<string, string> = {
  "~": "/",
  "/": "/",
  home: "/",
  about: "/about",
  built: "/built",
  projects: "/built",
  learn: "/learn",
  contact: "/contact",
  privacy: "/privacy",
  vault: "/vault",
};

const FILES: Record<string, () => string> = {
  "about.txt": () => OWNER.bioLong.join("\n\n"),
  "skills.json": () =>
    JSON.stringify(
      Object.fromEntries(SKILL_GROUPS.map((g) => [g.title, g.items])),
      null,
      2
    ),
  "contact.md": () =>
    [`# Say hi`, ``, `email: ${OWNER.email}`, ...SOCIAL_LINKS.map((s) => `${s.label.toLowerCase()}: ${s.href}`)].join("\n"),
  "readme.md": () =>
    [
      "# KRG-OS",
      "",
      "Welcome, visitor. This machine belongs to Ramzy.",
      "There are 6 flags hidden around this site, format KRG{...}.",
      "Find them, `submit` them here, and the vault opens.",
      "",
      "Stuck? Type `hint`.",
    ].join("\n"),
  ".vault_key": () => `${VAULT_KEY_B64}\n\n# hmm, that looks like base64. try: decode <text>`,
  "robots.txt": () => "User-agent: *\nDisallow: /vault",
};

const COMMANDS = [
  "help", "whoami", "ls", "cat", "cd", "open", "projects", "skills", "contact",
  "socials", "neofetch", "flags", "hint", "submit", "decode", "theme", "sound",
  "date", "echo", "ping", "ssh", "sudo", "history", "clear", "exit", "reset-flags",
];

const HELP = `available commands
  whoami              who is this guy?
  ls [-a]             list files
  cat <file>          print a file
  cd <page>           go to a page (about, built, learn, contact)
  projects            list projects        open <name>  open one
  skills | contact | socials | neofetch
  flags               your CTF progress    hint         get a nudge
  submit <KRG{...}>   submit a flag        decode <b64> base64 decode
  theme <dark|light>  sound <on|off>       clear | exit
  ...and a few that aren't listed. try sudo.`;

export function Terminal() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // React 18 doesn't know `inert`, so toggle it directly.
  useEffect(() => {
    rootRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  const print = useCallback((...next: Line[]) => {
    setLines((prev) => [...prev, ...next].slice(-300));
  }, []);

  const out = (text: string, kind: Line["kind"] = "out") => print({ kind, text });

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      print({ kind: "in", text: input });
      if (!input) return;
      history.current = [input, ...history.current].slice(0, 50);
      historyIndex.current = -1;
      play("enter");

      const [cmd, ...args] = input.split(/\s+/);
      const arg = args.join(" ");
      const lower = cmd.toLowerCase();

      switch (lower) {
        case "help":
        case "?":
          out(HELP);
          break;
        case "whoami":
          out(
            `${OWNER.fullName}\n${OWNER.role}\n${OWNER.tagline}\n\n...and you're visitor #${
              1000 + Math.floor(Math.random() * 9000)
            }. hi.`
          );
          break;
        case "ls": {
          const all = args.includes("-a") || args.includes("-la") || args.includes("-al");
          const target = args.find((a) => !a.startsWith("-"));
          if (target && /^projects\/?$/.test(target)) {
            out(PROJECTS.map((p) => `${p.slug}/`).join("   "));
            break;
          }
          const names = Object.keys(FILES).filter(
            (name) => all || !name.startsWith(".")
          );
          out([all ? ".  .." : "", "projects/", ...names].filter(Boolean).join("   "));
          break;
        }
        case "cat": {
          if (!arg) return out("cat: missing file operand", "err");
          const file = FILES[arg.replace(/^\.\//, "")];
          if (file) out(file());
          else if (arg.startsWith("projects/")) {
            const p = PROJECTS.find((x) => arg.includes(x.slug));
            if (p) out(`${p.name} · ${p.status}\n${p.description}\nstack: ${p.stack.join(", ")}`);
            else out(`cat: ${arg}: no such file`, "err");
          } else out(`cat: ${arg}: no such file or directory`, "err");
          break;
        }
        case "cd": {
          const key = (arg || "~").replace(/^\/|\/$/g, "") || "/";
          const route = ROUTES[key];
          if (!route) return out(`cd: ${arg}: no such directory`, "err");
          if (route === "/vault" && getFound().length < FLAGS.length) {
            play("error");
            out(
              `cd: /vault: permission denied (${getFound().length}/${FLAGS.length} flags). type \`flags\``,
              "err"
            );
            break;
          }
          out(`→ ${route}`, "dim");
          router.push(route);
          setOpen(false);
          break;
        }
        case "projects":
          out(
            PROJECTS.map(
              (p) => `${p.slug.padEnd(22)} ${p.status.padEnd(10)} ${p.tagline}`
            ).join("\n") + "\n\nopen <name> to view one"
          );
          break;
        case "open": {
          const p = PROJECTS.find(
            (x) =>
              x.slug === arg.toLowerCase() ||
              x.name.toLowerCase() === arg.toLowerCase()
          );
          if (!p) return out(`open: ${arg || "?"}: unknown project. try \`projects\``, "err");
          const href = projectHref(p);
          out(`opening ${p.name}...`, "ok");
          if (/^https?:/.test(href)) window.open(href, "_blank", "noopener");
          else router.push(href);
          break;
        }
        case "skills":
          out(SKILL_GROUPS.map((g) => `${g.title.padEnd(20)} ${g.items.join(", ")}`).join("\n"));
          break;
        case "contact":
        case "email":
          out(FILES["contact.md"]());
          break;
        case "socials":
          out(SOCIAL_LINKS.map((s) => `${s.label.padEnd(10)} ${s.href}`).join("\n"));
          break;
        case "neofetch":
          out(
            [
              "   ▄▀▀▀▀▀▄      visitor@krg-os",
              "  █  ▄ ▄  █     ---------------",
              "  █   ▀   █     OS      KRG-OS v26.11 (Accra build)",
              "   ▀▄▄▄▄▄▀      Host    University of Ghana",
              "    ▄█ █▄       Kernel  curiosity-6.1",
              "   █ █▀█ █      Shell   flutter / dart / python",
              "     ▀ ▀        Uptime  since 2021",
              `                Flags   ${getFound().length}/${FLAGS.length}`,
              "                Theme   builder · designer · educator",
            ].join("\n")
          );
          break;
        case "flags": {
          const found = getFound();
          out(
            FLAGS.map(
              (f, i) =>
                `[${found.includes(f.id) ? "x" : " "}] ${String(i + 1).padStart(2, "0")} ${f.title}`
            ).join("\n") +
              `\n\n${found.length}/${FLAGS.length} captured.` +
              (found.length === FLAGS.length
                ? " the vault is open → cd /vault"
                : " type `hint` for a nudge.")
          );
          break;
        }
        case "hint": {
          const found = getFound();
          const next = FLAGS.find((f) => !found.includes(f.id));
          out(next ? `hint: ${next.hint}` : "no hints left. you found everything. cd /vault", "dim");
          break;
        }
        case "submit": {
          if (!arg) return out("usage: submit KRG{...}", "err");
          const result = submitFlag(arg);
          if (!result) {
            play("error");
            out("✗ invalid flag. close though? flags look like KRG{...}", "err");
          } else if (!result.fresh) {
            out(`already captured: ${result.flag.title}`, "dim");
          } else {
            out(`✓ flag accepted: ${result.flag.title} (${getFound().length}/${FLAGS.length})`, "ok");
          }
          break;
        }
        case "decode":
        case "base64": {
          const text = args.filter((a) => a !== "-d" && a !== "--decode").join("");
          if (!text) return out("usage: decode <base64>", "err");
          try {
            out(atob(text), "ok");
          } catch {
            out("decode: invalid base64", "err");
          }
          break;
        }
        case "theme":
          if (arg !== "dark" && arg !== "light") return out("usage: theme <dark|light>", "err");
          setTheme(arg);
          out(`theme → ${arg}`, "ok");
          break;
        case "sound":
          if (arg !== "on" && arg !== "off")
            return out(`sound is ${isSoundOn() ? "on" : "off"}. usage: sound <on|off>`);
          setSoundOn(arg === "on");
          out(`sound → ${arg}`, "ok");
          break;
        case "date":
          out(new Date().toString());
          break;
        case "echo":
          out(arg);
          break;
        case "ping": {
          const host = arg || "ramzy";
          out(
            [1, 2, 3]
              .map(
                (seq) =>
                  `64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${(12 + Math.random() * 20).toFixed(1)} ms`
              )
              .join("\n") + `\n--- ${host} is alive and probably building something ---`
          );
          break;
        }
        case "ssh":
          out(`ssh: connect to ${arg || "host"} port 22: nice try 😏`, "err");
          break;
        case "sudo": {
          if (/hire\s+ramzy/i.test(arg)) {
            play("ok");
            out("[sudo] password for visitor: ********\npermission granted. great decision.", "ok");
            toast({ title: "Great choice.", body: "Taking you to the contact page..." });
            window.setTimeout(() => {
              setOpen(false);
              router.push("/contact");
            }, 1100);
          } else if (/rm\s+-rf/.test(arg)) {
            play("error");
            out("nice try. this incident will be reported. (it won't.)", "err");
          } else {
            out(`visitor is not in the sudoers file. this incident will be reported.\n(psst: try \`sudo hire ramzy\`)`, "err");
          }
          break;
        }
        case "rm":
          out("rm: permission denied. the portfolio stays.", "err");
          break;
        case "history":
          out(
            [...history.current]
              .reverse()
              .map((h, i) => `${String(i + 1).padStart(4)}  ${h}`)
              .join("\n")
          );
          break;
        case "clear":
          setLines([]);
          break;
        case "exit":
        case "quit":
          setOpen(false);
          break;
        case "reset-flags":
          resetFlags();
          out("flags reset. the hunt begins again.", "dim");
          break;
        case "hack":
        case "hack.exe":
          out(
            "ACCESS GRANTED\n...just kidding. real hacking is reading docs for 6 hours.\ntry the CTF instead: `cat readme.md`",
            "ok"
          );
          break;
        case "coffee":
          out("☕ brewing... error 418: I'm a teapot", "err");
          break;
        default:
          play("error");
          out(`command not found: ${cmd}. type \`help\``, "err");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [print, router, setTheme]
  );

  // Open/close wiring: ` or Ctrl/Cmd+K toggles, Esc closes, custom event opens.
  useEffect(() => {
    const isTyping = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return (
        !!el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      );
    };

    const onKey = (event: KeyboardEvent) => {
      const combo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (combo || (event.key === "`" && !isTyping(event.target))) {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onOpen = (event: Event) => {
      const command = (event as CustomEvent<string | undefined>).detail;
      setOpen(true);
      if (command) window.setTimeout(() => run(command), 60);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_EVENT, onOpen);
    };
  }, [run]);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      if (!greeted.current) {
        greeted.current = true;
        print(
          { kind: "dim", text: `KRG-OS v26.11 · ${new Date().toDateString()}` },
          {
            kind: "out",
            text: "welcome to ramzy's machine. type `help` to look around,\nor `cat readme.md` if you like puzzles.",
          }
        );
      }
      window.setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open, print]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      run(value);
      setValue("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex.current + 1, history.current.length - 1);
      if (next >= 0) {
        historyIndex.current = next;
        setValue(history.current[next]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex.current - 1;
      historyIndex.current = Math.max(next, -1);
      setValue(next >= 0 ? history.current[next] : "");
    } else if (event.key === "Tab") {
      event.preventDefault();
      const [head, ...rest] = value.split(" ");
      if (rest.length === 0) {
        const match = COMMANDS.filter((c) => c.startsWith(head));
        if (match.length === 1) setValue(`${match[0]} `);
        else if (match.length > 1) print({ kind: "dim", text: match.join("   ") });
      } else {
        const partial = rest.join(" ");
        const pool = [...Object.keys(FILES), ...PROJECTS.map((p) => p.slug), ...Object.keys(ROUTES)];
        const match = pool.filter((c) => c.startsWith(partial));
        if (match.length === 1) setValue(`${head} ${match[0]}`);
      }
    } else if (event.key.length === 1) {
      play("key");
    }
  };

  return (
    <div
      className="terminal"
      data-open={open ? "true" : "false"}
      data-testid="terminal"
      aria-hidden={!open}
      ref={rootRef}
    >
      <div className="terminal__backdrop" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="terminal__window"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal__bar">
          <span className="terminal__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>visitor@krg-os — zsh</span>
          <button
            type="button"
            className="terminal__close"
            aria-label="Close terminal"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}
          >
            esc
          </button>
        </div>
        <div ref={scrollRef} className="terminal__body" aria-live="polite">
          {lines.map((line, index) => (
            <div key={index} className="terminal__line" data-kind={line.kind}>
              {line.kind === "in" ? (
                <>
                  <span className="terminal__prompt">{PROMPT}</span> {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
          <label className="terminal__input-row">
            <span className="terminal__prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal command"
              className="terminal__input"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
