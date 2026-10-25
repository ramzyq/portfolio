import Link from "next/link";
import { HireButton } from "@/components/site/HireButton";
import { PageIntro } from "@/components/site/PageIntro";
import { Rail } from "@/components/site/Rail";
import { WorkCard } from "@/components/site/WorkCard";
import { ACHIEVEMENTS, OWNER, PROJECTS } from "@/data";

export default function HomePage() {
  return (
    <main id="main" className="pt-6 md:pt-[46px]">
      <PageIntro lead={OWNER.headlineLead} mute={OWNER.headlineMute}>
        <HireButton />
      </PageIntro>

      <section aria-label="Selected projects" className="pb-10">
        <Rail>
          {PROJECTS.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </Rail>
      </section>

      <section aria-label="Highlights" className="pb-8">
        <Rail>
          {ACHIEVEMENTS.map((item) => (
            <article key={item.title} className="w-[260px] shrink-0 md:w-[300px]">
              <div
                className="relative aspect-[1.05/1] overflow-hidden rounded-[1.65rem] p-6"
                style={{
                  background: `linear-gradient(165deg, ${item.cover.from}, ${item.cover.to})`,
                }}
              >
                <item.icon className="h-5 w-5 text-ink/50" aria-hidden="true" />
                <p className="mt-16 text-3xl font-medium tracking-[-0.04em] text-ink">
                  {item.caption}
                </p>
                <p className="mt-2 max-w-[12rem] text-sm text-ink/60">{item.event}</p>
              </div>
              <div className="mt-3 px-0.5">
                <p className="text-[14px] font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">From the competition archive</p>
              </div>
            </article>
          ))}
          <Link href="/learn" className="w-[260px] shrink-0 md:w-[300px]">
            <div className="relative flex aspect-[1.05/1] flex-col justify-between overflow-hidden rounded-[1.65rem] bg-[#f3f0ea] p-6">
              <p className="text-sm text-muted">100+ students</p>
              <p className="text-[1.65rem] font-medium leading-tight tracking-[-0.04em] text-ink">
                Mentoring teams until the idea clicks.
              </p>
            </div>
            <div className="mt-3 px-0.5">
              <p className="text-[14px] font-medium text-ink">STEM education</p>
              <p className="mt-0.5 text-[13px] text-muted">Workshops, camps, and clubs</p>
            </div>
          </Link>
        </Rail>
      </section>

      <div className="page-shell pt-0">
        <div className="flex justify-end">
          <Link
            href="/contact"
            className="text-[13px] text-muted transition-colors hover:text-ink"
          >
            Leave a note ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
