"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { award } from "@/lib/ctf";
import { play } from "@/lib/sound";

const PLAINTEXT = "TEACH TO LEARN";
const SECRET_SHIFT = 7;

function shift(text: string, by: number) {
  return text.replace(/[A-Z]/g, (char) =>
    String.fromCharCode(((char.charCodeAt(0) - 65 + by + 26 * 4) % 26) + 65)
  );
}

/**
 * Caesar-cipher lock on the secure enclave. Turn the dial until the message
 * reads as English, then hit unlock. Wrong guesses get denied.
 */
export function EnclavePuzzle({ onClose }: { onClose: () => void }) {
  const cipher = useMemo(() => shift(PLAINTEXT, SECRET_SHIFT), []);
  const [dial, setDial] = useState(0);
  const [state, setState] = useState<"idle" | "denied" | "open">("idle");
  const [attempts, setAttempts] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const decoded = shift(cipher, -dial);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        turn(1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        turn(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const turn = (by: number) => {
    play("key");
    setState((value) => (value === "open" ? value : "idle"));
    setDial((value) => (value + by + 26) % 26);
  };

  const unlock = () => {
    if (decoded === PLAINTEXT) {
      setState("open");
      play("ok");
      award("enclave");
    } else {
      setState("denied");
      setAttempts((value) => value + 1);
      play("error");
    }
  };

  return (
    <div className="puzzle" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="puzzle-title"
        className="puzzle__card"
        data-state={state}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="xs-mono text-soft">SECURE ENCLAVE · LOCK 01</p>
        <h3 id="puzzle-title" className="mt-1 text-lg font-semibold text-ink">
          {state === "open" ? "Enclave unlocked" : "Crack the enclave"}
        </h3>

        {state === "open" ? (
          <div className="mt-4 space-y-3 text-sm text-body">
            <p className="puzzle__readout" data-ok="true">
              {PLAINTEXT}
            </p>
            <p>
              That&apos;s a Caesar cipher, the same idea Julius Caesar used 2,000 years ago.
              Every letter was shifted by {SECRET_SHIFT}. It&apos;s also the first thing I
              teach students about encryption, because it&apos;s easy to break.
            </p>
            <p className="text-ink">Teaching is how I learn. Flag captured. ⚑</p>
            <button type="button" className="xs-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-body">
              Each letter has been shifted along the alphabet. Turn the dial until the
              message makes sense, then unlock.
            </p>
            <p className="xs-mono mt-4 text-soft">CIPHERTEXT</p>
            <p className="puzzle__readout">{cipher}</p>
            <p className="xs-mono mt-3 text-soft">DECODED · SHIFT −{dial}</p>
            <p className="puzzle__readout" aria-live="polite">
              {decoded}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="xs-btn" onClick={() => turn(-1)} aria-label="Shift back">
                ◀
              </button>
              <span className="puzzle__dial" aria-hidden="true">
                {String(dial).padStart(2, "0")}
              </span>
              <button type="button" className="xs-btn" onClick={() => turn(1)} aria-label="Shift forward">
                ▶
              </button>
              <button type="button" className="xs-btn puzzle__unlock" onClick={unlock}>
                Unlock
              </button>
            </div>
            <p className="xs-mono mt-3 min-h-4 text-soft">
              {state === "denied"
                ? attempts > 2
                  ? "ACCESS DENIED · hint: it's advice about learning"
                  : "ACCESS DENIED"
                : "use ← → keys or the buttons"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
