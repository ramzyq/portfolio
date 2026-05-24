"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PROJECTS, type ProjectStatus, type ProjectType } from "@/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Shipped: "bg-teal/15 text-teal-500 border-teal/30",
  Prototype: "bg-accent/15 text-accent border-accent/30",
  "In Progress": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  Done: "bg-teal/15 text-teal-500 border-teal/30",
  Ongoing: "bg-accent/15 text-accent border-accent/30",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      {status}
    </span>
  );
}

function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: ProjectType;
  featured?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <div
        className={cn(
          "card-elevated h-full flex flex-col justify-between gap-8",
          featured && "md:col-span-2 lg:col-span-2 md:p-8 lg:p-10"
        )}
      >
        <article className="flex h-full flex-col justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <StatusBadge status={project.status} />
              {featured && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Featured
                </span>
              )}
            </div>

            <h3
              className={cn(
                "font-heading font-semibold tracking-tight",
                featured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
              )}
            >
              {project.name}
            </h3>

            <p
              className={cn(
                "mt-3 leading-relaxed text-foreground/70",
                featured ? "text-base md:text-lg max-w-2xl" : "text-sm"
              )}
            >
              {project.description}
            </p>

            {project.collaborators && (
              <p className="mt-3 text-xs text-muted italic">{project.collaborators}</p>
            )}
          </div>

          <div>
            {/* Stack chips - monospace font for technical feel */}
            <ul className="flex flex-wrap gap-2 mb-6">
              {project.stack.map((tech, i) => (
                <motion.li
                  key={tech}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--foreground)] transition-all hover:border-accent hover:bg-accent/10 hover:text-accent font-mono"
                >
                  {tech}
                </motion.li>
              ))}
            </ul>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-xs font-medium transition-all hover:-translate-y-1 hover:border-accent hover:text-accent"
                  aria-label={`${project.name} GitHub repository`}
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  Code
                </Link>
              )}
              {project.demo && (
                <Link
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-all hover:-translate-y-1 hover:bg-accent-600"
                  aria-label={`${project.name} live demo`}
                >
                  Live
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
}

const FILTERS = ["All", "Shipped", "In Progress"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(project: ProjectType, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Shipped")
    return project.status === "Shipped" || project.status === "Done";
  if (filter === "In Progress")
    return project.status === "In Progress" || project.status === "Ongoing" || project.status === "Prototype";
  return true;
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = PROJECTS.filter((p) => matchesFilter(p, filter));
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container-px mx-auto max-w-content">
        <div id="projects-heading" className="sr-only">
          Projects
        </div>
        <SectionHeading
          eyebrow="Projects"
          title="A few things I've built."
          description="Hackathon builds, class work, robotics kits, and side projects — each one solving a specific problem."
        />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter projects"
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
                  active
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-active"
                    className="absolute inset-0 -z-10 rounded-full border border-accent/40 bg-accent/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f}
              </button>
            );
          })}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 space-y-6"
        >
          {/* Featured project full width */}
          {featured && (
            <div>
              <ProjectCard project={featured} featured index={0} />
            </div>
          )}

          {/* Other projects - 2 col grid */}
          {rest.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i + 1}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-sm text-muted"
            >
              Nothing here yet. Try a different filter.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
