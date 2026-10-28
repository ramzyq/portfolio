import Link from "next/link";
import { ArrowUpRight } from "@/components/site/icons";
import { PageIntro } from "@/components/site/PageIntro";

export default function NotFound() {
  return (
    <main id="main" className="pt-10 md:pt-20">
      <PageIntro
        badge="404"
        lead="This page isn’t here."
        mute="Let’s get you back."
        subtitle="The link may be old, or the page may have moved."
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-base font-semibold text-background transition-[transform,background-color] duration-300 ease-smooth hover:scale-[1.02] hover:bg-ink/90 active:scale-[0.98]"
        >
          Back home
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </PageIntro>
    </main>
  );
}
