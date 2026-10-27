import { HireButton } from "@/components/site/HireButton";
import { GalleryCard } from "@/components/site/GalleryCard";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageIntro } from "@/components/site/PageIntro";
import { ProjectCover, ArchiveCover } from "@/components/site/ProjectCover";
import { ARCHIVE, OWNER, PROJECTS } from "@/data";
import { projectHref } from "@/lib/projects";

export default function HomePage() {
  return (
    <main id="main" className="pt-6 md:pt-[46px]">
      <PageIntro lead={OWNER.headlineLead} mute={OWNER.headlineMute}>
        <HireButton />
      </PageIntro>

      <div className="mt-11">
        <GalleryGrid>
          {PROJECTS.map((project) => (
            <GalleryCard
              key={project.slug}
              href={projectHref(project)}
              name={project.name}
              caption={project.tagline}
              external={Boolean(project.github ?? project.demo)}
            >
              <ProjectCover project={project} />
            </GalleryCard>
          ))}
          {ARCHIVE.map((item) => (
            <GalleryCard
              key={item.kind}
              href={item.href}
              name={item.name}
              caption={item.caption}
            >
              <ArchiveCover kind={item.kind} />
            </GalleryCard>
          ))}
        </GalleryGrid>
      </div>
    </main>
  );
}
