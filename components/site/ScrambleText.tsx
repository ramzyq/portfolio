"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { BOOT_DONE_EVENT } from "@/lib/boot";

const UPPER = "ABCDEFGHKNOPRSTUVXYZ";
const LOWER = "abcdeghknopqsuvxyz";
const DIGIT = "0123456789";
const SYMBOL = "#%&*+=<>/";

function glyphFor(char: string) {
  const pool = /[A-Z]/.test(char)
    ? UPPER
    : /[a-z]/.test(char)
      ? LOWER
      : /[0-9]/.test(char)
        ? DIGIT
        : SYMBOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Decoder-style text reveal: characters cycle through random glyphs and lock
 * in left-to-right. Each word's width is pinned while it decodes so the line
 * never reflows. Screen readers (and textContent) always get the real text
 * through the sr-only copy; the animated copy is aria-hidden.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 900,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const words = text.split(" ");
  const [display, setDisplay] = useState<string[]>(words);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const source = text.split(" ");
    const total = text.length;
    let frame = 0;
    let timer = 0;
    let startedAt = 0;
    let lastSwap = 0;

    const pinWidths = () => {
      wordRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${el.getBoundingClientRect().width}px`;
        // Clip sideways only, so wider glyphs never spill into the next word.
        el.style.clipPath = "inset(-0.4em 0 -0.4em 0)";
      });
    };

    const unpinWidths = () => {
      wordRefs.current.forEach((el) => {
        el?.style.removeProperty("width");
        el?.style.removeProperty("clip-path");
      });
    };

    const scramble = (revealed: number) => {
      let offset = 0;
      return source.map((word) => {
        const next = Array.from(word, (char, index) =>
          offset + index < revealed || /\s/.test(char) ? char : glyphFor(char)
        ).join("");
        offset += word.length + 1;
        return next;
      });
    };

    const step = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      if (progress === 1) {
        setDisplay(source);
        unpinWidths();
        return;
      }
      // Re-roll unrevealed glyphs ~every 45ms so it reads as "decoding".
      if (now - lastSwap > 45) {
        lastSwap = now;
        setDisplay(scramble(Math.floor(progress * total)));
      }
      frame = window.requestAnimationFrame(step);
    };

    const begin = () => {
      timer = window.setTimeout(() => {
        frame = window.requestAnimationFrame(step);
      }, delay);
    };

    pinWidths();
    if (document.documentElement.dataset.boot) {
      setDisplay(scramble(0));
      window.addEventListener(BOOT_DONE_EVENT, begin, { once: true });
    } else {
      begin();
    }

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener(BOOT_DONE_EVENT, begin);
      unpinWidths();
      setDisplay(source);
    };
  }, [text, delay, duration]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-scramble>
        {display.map((word, index) => (
          <Fragment key={index}>
            {index > 0 ? " " : null}
            <span
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className="inline-block whitespace-nowrap"
            >
              {word}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
