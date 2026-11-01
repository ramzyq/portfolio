"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OWNER } from "@/data";
import { FLAG_EVENT, FLAGS, getFound, type FlagId } from "@/lib/ctf";
import { openTerminal } from "./Terminal";

const NAME_KEY = "krg-vault-name";

export function Vault() {
  const [found, setFound] = useState<FlagId[] | null>(null);
  const [name, setName] = useState("");
  const [issued, setIssued] = useState("");

  useEffect(() => {
    setFound(getFound());
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {}
    setIssued(
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    const onFlag = () => setFound(getFound());
    window.addEventListener(FLAG_EVENT, onFlag);
    return () => window.removeEventListener(FLAG_EVENT, onFlag);
  }, []);

  if (found === null) {
    return <p className="xs-mono text-center text-soft">verifying clearance…</p>;
  }

  if (found.length < FLAGS.length) {
    return (
      <section className="mx-auto max-w-[560px] px-6 text-center" data-testid="vault-locked">
        <p className="xs-mono text-soft">/VAULT · CLEARANCE CHECK</p>
        <h1 className="glitch mt-4 text-5xl font-semibold text-ink" data-text="ACCESS DENIED">
          ACCESS DENIED
        </h1>
        <p className="mt-4 text-body">
          You have <span className="font-semibold text-ink">{found.length}</span> of{" "}
          {FLAGS.length} flags. The vault opens when you find them all.
        </p>
        <ul className="xs-mono mx-auto mt-6 inline-grid gap-1 text-left text-soft">
          {FLAGS.map((flag) => (
            <li key={flag.id} className={found.includes(flag.id) ? "text-ink" : undefined}>
              [{found.includes(flag.id) ? "x" : " "}] {flag.title}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center gap-2">
          <button type="button" className="xs-btn" onClick={() => openTerminal("hint")}>
            Get a hint
          </button>
          <Link href="/" className="xs-btn">
            Back home
          </Link>
        </div>
      </section>
    );
  }

  const display = name.trim() || "Anonymous Hacker";
  const shareText = encodeURIComponent(
    `I cracked all ${FLAGS.length} flags on ${OWNER.shortName}'s portfolio and got into the vault. 🔓`
  );

  return (
    <section className="mx-auto max-w-[760px] px-4 md:px-6" data-testid="vault-open">
      <div className="text-center">
        <p className="xs-mono text-soft">/VAULT · ACCESS GRANTED</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">You made it in.</h1>
        <p className="mx-auto mt-3 max-w-[520px] text-body">
          Six flags, one vault. Most people never open the console, let alone decode
          base64. Put your name on it.
        </p>
        <label className="mx-auto mt-6 flex max-w-[360px] flex-col gap-2 text-left">
          <span className="xs-mono text-soft">NAME ON CERTIFICATE</span>
          <input
            value={name}
            maxLength={40}
            onChange={(event) => {
              setName(event.target.value);
              try {
                localStorage.setItem(NAME_KEY, event.target.value);
              } catch {}
            }}
            placeholder="Your name"
            className="rounded-xl border border-line bg-background/80 px-4 py-2.5 text-ink outline-none focus:border-ink/50"
          />
        </label>
      </div>

      <div className="certificate mt-10" data-testid="certificate">
        <div className="certificate__inner">
          <div className="flex items-start justify-between gap-4">
            <p className="xs-mono">KRG-OS · CERTIFICATE OF ENTRY</p>
            <p className="xs-mono text-right">No. {String(FLAGS.length).padStart(3, "0")}-{display.length.toString(16).toUpperCase()}</p>
          </div>
          <p className="mt-10 text-sm text-body">This certifies that</p>
          <p className="certificate__name">{display}</p>
          <p className="mx-auto mt-3 max-w-[460px] text-sm text-body">
            found all {FLAGS.length} hidden flags on {OWNER.fullName}&apos;s portfolio and
            earned the rank of
          </p>
          <p className="mt-2 text-lg font-semibold uppercase tracking-[0.2em] text-ink">
            Certified Explorer
          </p>
          <ul className="xs-mono mt-8 grid grid-cols-2 gap-x-6 gap-y-1 text-left text-soft sm:grid-cols-3">
            {FLAGS.map((flag) => (
              <li key={flag.id}>⚑ {flag.title}</li>
            ))}
          </ul>
          <div className="mt-10 flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="certificate__sig">{OWNER.shortName}</p>
              <p className="xs-mono border-t border-ink/30 pt-1">{OWNER.fullName}</p>
            </div>
            <div className="certificate__stamp" aria-hidden="true">
              <span>KRG</span>
              <span className="xs-mono">VERIFIED</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink">{issued}</p>
              <p className="xs-mono border-t border-ink/30 pt-1">Issued</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2 print:hidden">
        <a
          className="xs-btn"
          href={`https://x.com/intent/post?text=${shareText}`}
          target="_blank"
          rel="noreferrer"
        >
          Share on X
        </a>
        <button type="button" className="xs-btn" onClick={() => window.print()}>
          Print / save PDF
        </button>
        <Link href="/contact" className="xs-btn">
          Say hi to Ramzy
        </Link>
      </div>
    </section>
  );
}
