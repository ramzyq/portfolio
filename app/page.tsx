import { HireButton } from "@/components/site/HireButton";
import { ExplodedStack } from "@/components/site/ExplodedStack";
import { GalleryCard } from "@/components/site/GalleryCard";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageIntro } from "@/components/site/PageIntro";
import { ProjectCover, ArchiveCover } from "@/components/site/ProjectCover";
import { Reveal } from "@/components/site/Reveal";
import { TaglineReveal } from "@/components/site/TaglineReveal";
import { ARCHIVE, OWNER, PROJECTS } from "@/data";
import { projectHref } from "@/lib/projects";

export default function HomePage() {
  return (
    <main id="main" className="pt-10 md:pt-16">
      <PageIntro lead={OWNER.headlineLead} mute={OWNER.headlineMute}>
        <HireButton />
      </PageIntro>

      <ExplodedStack />

      <Reveal className="mt-16">
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
      </Reveal>

      <TaglineReveal />
    </main>
  );
}
