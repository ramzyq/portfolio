import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ProjectType } from "@/data";
import { ProjectCover } from "./ProjectCover";

export function WorkCard({ project }: { project: ProjectType }) {
  const href = project.github ?? project.demo ?? "/built";

  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group w-[260px] shrink-0 md:w-[300px]"
      aria-label={`${project.name}. ${project.tagline}`}
    >
      <ProjectCover project={project} />
      <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
        <div>
          <p className="text-[14px] font-medium tracking-[-0.01em] text-ink">
            {project.name}
          </p>
          <p className="mt-0.5 text-[13px] text-muted">{project.tagline}</p>
        </div>
        <ArrowUpRight
          className="mt-0.5 h-4 w-4 shrink-0 text-ink/0 transition-all group-hover:text-ink/70"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
