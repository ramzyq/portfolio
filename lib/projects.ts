import type { ProjectType } from "@/data";

export function projectHref(project: ProjectType): string {
  return project.github ?? project.demo ?? "/built";
}
