import { HireButton } from "@/components/site/HireButton";
import { GalleryCard } from "@/components/site/GalleryCard";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageIntro } from "@/components/site/PageIntro";
import { ProjectCover } from "@/components/site/ProjectCover";
import type { ArchiveKind } from "@/data";
import { ARCHIVE, OWNER, PROJECTS } from "@/data";
import { projectHref } from "@/lib/projects";

const ARCHIVE_ART: Record<
  ArchiveKind,
  { from: string; to: string; ink: string; stat: string; label: string }
> = {
  fll: { from: "#fde68a", to: "#fef3c7", ink: "#7c2d12", stat: "3rd", label: "FLL Nationals" },
  robofest: { from: "#ddd6fe", to: "#ede9fe", ink: "#4c1d95", stat: "8th", label: "RoboFest" },
  wro: { from: "#bae6fd", to: "#e0f2fe", ink: "#075985", stat: "9th", label: "WRO" },
  stem: { from: "#d9f99d", to: "#f7fee7", ink: "#3f6212", stat: "100+", label: "students mentored" },
  events: { from: "#fbcfe8", to: "#fdf2f8", ink: "#9d174d", stat: "12+", label: "robotics events" },
};

function ArchiveCover({ kind }: { kind: ArchiveKind }) {
  const art = ARCHIVE_ART[kind];

  return (
    <div
      className="flex h-full w-full flex-col justify-between p-[8%]"
      style={{ background: `linear-gradient(160deg, ${art.from} 0%, ${art.to} 100%)` }}
    >
      <p className="text-[clamp(12px,2.6vw,15px)] font-medium" style={{ color: art.ink }}>
        {art.label}
      </p>
      <p
        className="text-[clamp(40px,9vw,76px)] font-medium leading-none tracking-[-0.05em]"
        style={{ color: art.ink }}
      >
        {art.stat}
      </p>
    </div>
  );
}

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
