import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { EmailCard } from "@/components/site/EmailCard";
import { ArrowUpRight } from "@/components/site/icons";
import { LinkList } from "@/components/site/LinkList";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { OWNER, SOCIAL_LINKS } from "@/data";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main id="main" className="pt-10 md:pt-20">
      <PageIntro
        badge="Let’s talk"
        lead="Have something in mind?"
        mute="I’d love to hear it."
        subtitle="A product to shape, a problem to untangle, or an idea worth exploring. Tell me what you’re thinking."
      />

      <Reveal className="mt-16">
        <EmailCard />
      </Reveal>

      <Reveal>
        <div className="mx-auto mt-10 flex w-full max-w-[652px] items-center justify-between gap-4 border-t border-line px-6 pt-4 text-xs text-body">
          <span>Prefer a conversation?</span>
          <a
            href={`mailto:${OWNER.email}`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink underline-offset-4 transition-colors duration-300 ease-smooth hover:underline active:opacity-70"
          >
            Send a mail
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <Reveal>
        <section className="mx-auto mt-10 w-full max-w-[652px] px-6">
          <p className="text-xs font-medium text-body">Find me online</p>
          <div className="mt-3">
            <LinkList links={SOCIAL_LINKS} />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto mt-16 w-full max-w-[652px] px-6">
          <h2 className="text-xs font-medium text-body">Or send a note</h2>
          <ContactForm />
        </section>
      </Reveal>
    </main>
  );
}
