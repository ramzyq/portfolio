"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { OWNER, SKILL_GROUPS } from "@/data";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container-px mx-auto max-w-content">
        <div id="about-heading" className="sr-only">
          About
        </div>
        <SectionHeading
          eyebrow="About"
          title="Designer, developer, and relentless builder."
          description="A quick look at who I am, how I think, and the tools I reach for."
        />

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[320px,1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center lg:sticky lg:top-28"
          >
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-full border border-accent/40"
                aria-hidden="true"
              />
              <div
                className="absolute -inset-5 rounded-full border border-dashed border-teal/40"
                aria-hidden="true"
              />
              <div className="relative h-56 w-56 overflow-hidden rounded-full bg-gradient-to-br from-accent/15 to-teal/15">
                {imageFailed ? (
                  <div
                    role="img"
                    aria-label={`${OWNER.fullName} avatar`}
                    className="flex h-full w-full items-center justify-center font-heading text-6xl font-bold tracking-tight text-[var(--foreground)]"
                  >
                    {OWNER.initials}
                  </div>
                ) : (
                  <Image
                    src="/og-image.jpg"
                    alt={`${OWNER.fullName} portrait`}
                    fill
                    sizes="672px"
                    quality={100}
                    priority
                    className="scale-125 object-cover"
                    style={{ objectPosition: "center 20%" }}
                    onError={() => setImageFailed(true)}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="font-heading text-lg font-semibold">{OWNER.shortName}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{OWNER.role}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{OWNER.location}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="space-y-5 text-base leading-relaxed text-[var(--foreground)]/85 md:text-lg">
              {OWNER.bioLong.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="font-heading text-lg font-semibold">Skills & tools</h3>
              <div className="mt-6 space-y-6">
                {SKILL_GROUPS.map((group, groupIndex) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.45,
                      delay: groupIndex * 0.06,
                      ease: "easeOut",
                    }}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                      {group.title}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
