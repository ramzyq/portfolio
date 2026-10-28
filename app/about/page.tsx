import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { Timeline } from "@/components/site/Timeline";
import { OWNER, SKILL_GROUPS } from "@/data";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main id="main" className="pt-10 md:pt-20">
      <PageIntro lead={OWNER.aboutLead} mute={OWNER.aboutMute} />

      <Timeline />

      <p className="mx-auto mt-16 max-w-[520px] px-6 text-pretty text-sm leading-6 text-body">
        {OWNER.bioLong[0]} {OWNER.bioLong[1]} I work across four disciplines:
        mobile, design, security, and education.
      </p>

      <section className="mx-auto mt-16 w-full max-w-[520px] px-6">
        <p className="text-sm font-medium text-body">What I work with</p>
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} data-testid="skill-group">
              <p className="text-xs font-medium text-body">{group.title}</p>
              <p className="mt-1 text-pretty text-sm leading-6 text-ink">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-12 flex justify-center px-6">
        <Link
          href="/contact"
          data-testid="interwebs-link"
          className="text-sm font-medium text-body underline-offset-4 transition-colors duration-300 ease-smooth hover:text-ink hover:underline"
        >
          Ramzy on the interwebs ↗
        </Link>
      </div>
    </main>
  );
}
