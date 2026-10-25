import type { Metadata } from "next";
import { ListRow } from "@/components/site/ListRow";
import { ListSection } from "@/components/site/ListSection";
import { PageIntro } from "@/components/site/PageIntro";
import { PROJECTS } from "@/data";
import { projectHref } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Built",
};

export default function BuiltPage() {
  return (
    <main id="main" className="pt-8 md:pt-[72px]">
      <PageIntro
        width="inner"
        badge="Built by me"
        lead="Ideas I couldn’t leave as ideas."
        subtitle="Apps, experiments, and work with students."
      />

      <div className="mt-16">
        <ListSection
          label="Out in the world"
          count={`${PROJECTS.length} projects`}
          section="projects"
        >
          {PROJECTS.map((project) => (
            <ListRow
              key={project.slug}
              href={projectHref(project)}
              title={project.name}
              caption={project.tagline}
              meta={project.status}
              thumbnail={
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background: `linear-gradient(145deg, ${project.cover.from}, ${project.cover.to})`,
                  }}
                >
                  <span
                    className="text-[14px] font-semibold"
                    style={{ color: project.cover.ink }}
                    aria-hidden="true"
                  >
                    {project.name.charAt(0)}
                  </span>
                </div>
              }
            />
          ))}
        </ListSection>
      </div>
    </main>
  );
}
