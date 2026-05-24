"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { OWNER, SKILL_GROUPS } from "@/data";

export function About() {
  const [imageFailed, setImageFailed] = useState(false);

  const pullQuote = "Thoughtful execution across mobile, design, and education.";

  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container-px mx-auto max-w-content">
        <div id="about-heading" className="sr-only">
          About
        </div>

        {/* Magazine-style pull quote and avatar row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 grid gap-12 md:gap-16 lg:grid-cols-[55%,45%] items-center"
        >
          {/* Pull Quote */}
          <div>
            <motion.p
              className="text-4xl sm:text-5xl md:text-6xl font-black italic leading-[1.1] text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {pullQuote}
            </motion.p>
            <motion.div
              className="mt-6 h-1 w-16 bg-gradient-to-r from-accent to-teal rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ originX: 0 }}
            />
          </div>

          {/* Avatar with Badge */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              {/* Clean avatar circle */}
              <div className="relative h-48 w-48 md:h-56 md:w-56 overflow-hidden rounded-full border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-teal/10">
                {imageFailed ? (
                  <div
                    role="img"
                    aria-label={`${OWNER.fullName} avatar`}
                    className="flex h-full w-full items-center justify-center font-heading text-5xl md:text-6xl font-bold text-accent/40"
                  >
                    {OWNER.initials}
                  </div>
                ) : (
                  <Image
                    src="/og-image.jpg"
                    alt={`${OWNER.fullName} portrait`}
                    fill
                    sizes="448px"
                    quality={100}
                    priority
                    className="scale-125 object-cover transition-transform duration-500 hover:scale-[1.32]"
                    style={{ objectPosition: "center 20%" }}
                    onError={() => setImageFailed(true)}
                  />
                )}
              </div>

              {/* Open to work badge */}
              <motion.span
                className="absolute -bottom-2 right-0 inline-flex items-center gap-1.5 rounded-full border border-green/40 bg-[var(--background)] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-green shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.3 }}
              >
                <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                Available
              </motion.span>
            </motion.div>

            {/* Info below avatar */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-heading text-lg font-semibold">{OWNER.shortName}</p>
              <p className="mt-1 text-sm text-muted">{OWNER.role}</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bio and skills row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-12 lg:grid-cols-[2fr,1fr]"
        >
          {/* Bio paragraphs */}
          <div className="space-y-5 text-base leading-relaxed text-foreground/80 md:text-lg">
            {OWNER.bioLong.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Skills section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {SKILL_GROUPS.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.45,
                    delay: 0.3 + groupIndex * 0.06,
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
                    {group.title}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item, itemIndex) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                          duration: 0.35,
                          delay: 0.3 + groupIndex * 0.05 + itemIndex * 0.03,
                        }}
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="chip text-xs cursor-default transition-all hover:border-accent hover:bg-accent/10 hover:text-accent"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
