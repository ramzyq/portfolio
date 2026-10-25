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
    <main id="main" className="pt-6 md:pt-[46px]">
      <PageIntro
        width="about"
        lead={OWNER.aboutLead}
        mute={OWNER.aboutMute}
      />

      <Timeline />

      <p className="mx-auto mt-14 max-w-[520px] px-5 text-center text-[14px] leading-[24px] text-body">
        {OWNER.bioLong[0]} {OWNER.bioLong[1]} I work across four disciplines:
        mobile, design, security, and education.
      </p>

      <section className="mx-auto mt-16 w-full max-w-[520px] px-5">
        <p className="text-[12px] text-body">What I work with</p>
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} data-testid="skill-group">
              <p className="text-[12px] text-body">{group.title}</p>
              <p className="mt-1 text-[14px] leading-[22px] text-ink">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-12 flex justify-center px-5">
        <Link
          href="/contact"
          data-testid="interwebs-link"
          className="text-[14px] text-body underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Ramzy on the interwebs ↗
        </Link>
      </div>
    </main>
  );
}
