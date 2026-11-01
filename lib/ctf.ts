import { play } from "./sound";
import { toast } from "./toast";

/**
 * Site-wide capture-the-flag hunt. Progress lives in localStorage.
 *
 * Text flags (KRG{...}) are verified against FNV-1a hashes so the answers are
 * not sitting in plain sight in this file; each one is hidden somewhere on the
 * site instead. Interactive flags are awarded directly by the component.
 */

export type FlagId = "source" | "console" | "terminal" | "enclave" | "konami" | "robot";

export type FlagDef = {
  id: FlagId;
  title: string;
  hint: string;
  hash?: string;
};

export const FLAGS: FlagDef[] = [
  {
    id: "source",
    title: "Source reader",
    hint: "Real hackers read the page source. Look for a comment.",
    hash: "d9289f3d",
  },
  {
    id: "console",
    title: "Console sleuth",
    hint: "Developers leave notes in the browser console (F12).",
    hash: "b556df2f",
  },
  {
    id: "terminal",
    title: "Hidden file",
    hint: "Some files only show with `ls -a`. Not everything is encrypted.",
    hash: "12ef5f57",
  },
  {
    id: "enclave",
    title: "Enclave cracker",
    hint: "Take the phone apart. The secure enclave has a lock.",
  },
  {
    id: "konami",
    title: "Old-school gamer",
    hint: "↑ ↑ ↓ ↓ ← → ← → B A",
  },
  {
    id: "robot",
    title: "Robot whisperer",
    hint: "The little robot gets chatty if you keep poking it.",
  },
];

export const FLAG_EVENT = "krg:flag";
const STORAGE_KEY = "krg-flags";

export function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function getFound(): FlagId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((id): id is FlagId => FLAGS.some((f) => f.id === id))
      : [];
  } catch {
    return [];
  }
}

export function award(id: FlagId): boolean {
  const found = getFound();
  if (found.includes(id)) return false;
  const next = [...found, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  const flag = FLAGS.find((f) => f.id === id)!;
  play("flag");
  toast({
    tone: "flag",
    title: `Flag captured · ${flag.title}`,
    body:
      next.length === FLAGS.length
        ? "All flags found. The vault is open: type `cd /vault` in the terminal."
        : `${next.length}/${FLAGS.length} found. Press \` to open the terminal.`,
  });
  window.dispatchEvent(new CustomEvent(FLAG_EVENT, { detail: next }));
  return true;
}

/** Returns the flag matched by a submitted string, or null. */
export function submitFlag(input: string): { flag: FlagDef; fresh: boolean } | null {
  const hash = fnv1a(input.trim());
  const flag = FLAGS.find((f) => f.hash === hash);
  if (!flag) return null;
  return { flag, fresh: award(flag.id) };
}

export function resetFlags() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(FLAG_EVENT, { detail: [] }));
}
