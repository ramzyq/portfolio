import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/site/icons";
import { PageIntro } from "@/components/site/PageIntro";
import { OWNER } from "@/data";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main id="main" className="pt-10 md:pt-20">
      <PageIntro
        badge="Privacy"
        lead="What this site collects,"
        mute="and why."
        subtitle="A short note about the contact form."
      />

      <div className="mx-auto mt-16 w-full max-w-[520px] px-6">
        <div className="space-y-4 text-pretty text-sm leading-6 text-body">
          <p>
            If you send a note through the contact form, I receive your name,
            email address, subject, and message. I use them only to reply.
          </p>
          <p>
            Messages are delivered through Resend, which processes them on my
            behalf. I do not run analytics or advertising cookies on this site.
          </p>
          <p>
            I keep messages only as long as needed to continue the
            conversation. To ask for a copy or deletion, email{" "}
            <a
              href={`mailto:${OWNER.email}`}
              className="font-medium text-ink underline-offset-4 transition-opacity duration-300 ease-smooth hover:underline active:opacity-70"
            >
              {OWNER.email}
            </a>
            .
          </p>
          <p>Last updated October 2026.</p>
        </div>

        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-body underline-offset-4 transition-colors duration-300 ease-smooth hover:text-ink hover:underline active:opacity-70"
        >
          Back to contact
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
