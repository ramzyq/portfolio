import type { Metadata } from "next";
import {
  CalendarDays,
  GraduationCap,
  type IconComponent,
} from "@/components/site/icons";
import { ListRow } from "@/components/site/ListRow";
import { ListSection } from "@/components/site/ListSection";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { ACHIEVEMENTS, EXPERIENCE, STATS } from "@/data";

export const metadata: Metadata = {
  title: "Learn",
};

type LibraryItem = {
  title: string;
  caption: string;
  meta?: string;
  icon: IconComponent;
  cover: { from: string; to: string };
};

const studentsMentored = STATS.find((stat) => stat.label === "Students mentored");
const roboticsEvents = STATS.find((stat) => stat.label === "Robotics events");

const LIBRARY: LibraryItem[] = [
  ...ACHIEVEMENTS.map((item) => ({
    title: item.title,
    caption: item.event,
    meta: item.caption,
    icon: item.icon,
    cover: item.cover,
  })),
  {
    title: "STEM workshops",
    caption: `${studentsMentored?.value ?? ""}${studentsMentored?.suffix ?? ""} students mentored`,
    icon: GraduationCap,
    cover: { from: "#d9f99d", to: "#f7fee7" },
  },
  {
    title: "Robotics competitions",
    caption: `${roboticsEvents?.value ?? ""}${roboticsEvents?.suffix ?? ""} events coached or judged`,
    icon: CalendarDays,
    cover: { from: "#fbcfe8", to: "#fdf2f8" },
  },
];

export default function LearnPage() {
  return (
    <main id="main" className="pt-10 md:pt-20">
      <PageIntro
        badge="Learn with Ramzy"
        lead="Things I’ve learned, shared with you."
        subtitle="Competitions, classrooms, and what the work taught me."
      />

      <Reveal className="mt-16">
        <ListSection
          label="The library"
          count={`${LIBRARY.length} entries`}
          section="library"
        >
          {LIBRARY.map((item) => (
            <ListRow
              key={item.title}
              title={item.title}
              caption={item.caption}
              meta={item.meta}
              arrow={false}
              thumbnail={
                <span
                  className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: item.cover.from }}
                >
                  <item.icon
                    className="h-4 w-4 text-[#242424]/70"
                    aria-hidden="true"
                  />
                </span>
              }
            />
          ))}
        </ListSection>
      </Reveal>

      <Reveal className="mt-20">
        <ListSection
          label="Where I spent the time"
          count={`${EXPERIENCE.length} entries`}
          section="experience"
        >
          {EXPERIENCE.map((item) => (
            <ListRow
              key={`${item.organization}-${item.title}`}
              title={item.organization}
              caption={`${item.title} · ${item.period}`}
              description={item.description}
              arrow={false}
            />
          ))}
        </ListSection>
      </Reveal>
    </main>
  );
}
