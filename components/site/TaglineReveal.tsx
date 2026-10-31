"use client";

import { Fragment, useEffect, useRef } from "react";
import { ArrowUpRight } from "./icons";

const LINES = [
  "I build things",
  "real people use,",
  "then teach what I learn",
  "along the way.",
];

export function TaglineReveal() {
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;

    const words = Array.from(
      copy.querySelectorAll<HTMLElement>("[data-word]")
    );
    if (words.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((word) => {
        word.dataset.active = "true";
      });
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const trigger = window.innerHeight * 0.8;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      for (const word of words) {
        if (word.dataset.active === "true") continue;
        if (atBottom || word.getBoundingClientRect().top < trigger) {
          word.dataset.active = "true";
        }
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      aria-labelledby="how-i-work"
      data-testid="tagline-reveal"
      className="mx-auto mt-24 w-full max-w-[680px] px-6"
    >
      <h2 id="how-i-work" className="text-sm font-medium text-body">
        How I work
      </h2>
      <p
        ref={copyRef}
        className="mt-4 text-balance text-4xl font-medium leading-tight text-ink md:text-5xl"
      >
        {LINES.map((line, lineIndex) => (
          <span key={line} className="block">
            {line.split(" ").map((word, wordIndex) => (
              <Fragment key={`${lineIndex}-${wordIndex}`}>
                <span
                  data-word
                  className="inline-block translate-y-0.5 opacity-30 blur-[1.5px] transition-[opacity,transform,filter] duration-500 ease-smooth motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 data-[active=true]:translate-y-0 data-[active=true]:opacity-100 data-[active=true]:blur-0"
                >
                  {word}
                </span>{" "}
              </Fragment>
            ))}
          </span>
        ))}
      </p>
      <a
        href="/contact"
        className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-ink underline-offset-4 transition-colors duration-300 ease-smooth hover:underline active:opacity-70"
      >
        Start a conversation
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}
