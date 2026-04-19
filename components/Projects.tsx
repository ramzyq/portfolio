"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
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
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full flex-col justify-between gap-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_16px_40px_-24px_rgba(59,130,246,0.45)]",
        featured && "md:p-10"
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={project.status} />
          {featured && (
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Featured
            </span>
          )}
        </div>

        <h3
          className={cn(
            "mt-5 font-heading font-semibold tracking-tight",
            featured ? "text-3xl md:text-4xl" : "text-xl"
          )}
        >
          {project.name}
        </h3>

        <p
          className={cn(
            "mt-3 leading-relaxed text-[var(--muted)]",
            featured ? "max-w-2xl text-base md:text-lg" : "text-sm"
          )}
        >
          {project.description}
        </p>

        {project.collaborators && (
          <p className="mt-3 text-xs text-[var(--muted)]">{project.collaborators}</p>
        )}
      </div>

      <div>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.github && (
            <Link
              href={project.github}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
              aria-label={`${project.name} GitHub repository`}
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Code
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-600"
              aria-label={`${project.name} live demo`}
            >
              Live Demo
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

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

        <div className="mt-14 space-y-6">
          {featured && <ProjectCard project={featured} featured index={0} />}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
