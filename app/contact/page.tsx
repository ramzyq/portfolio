import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { EmailCard } from "@/components/site/EmailCard";
import { LinkList } from "@/components/site/LinkList";
import { PageIntro } from "@/components/site/PageIntro";
import { OWNER, SOCIAL_LINKS } from "@/data";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main id="main" className="pt-8 md:pt-[72px]">
      <PageIntro
        width="inner"
        badge="Let’s talk"
        lead="Have something in mind?"
        mute="I’d love to hear it."
        subtitle="A product to shape, a problem to untangle, or an idea worth exploring. Tell me what you’re thinking."
      />

      <div className="mt-12">
        <EmailCard />
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-[652px] items-center justify-between gap-4 border-t border-line px-5 pt-4 text-[12px] text-body">
        <span>Prefer a conversation?</span>
        <a
          href={`mailto:${OWNER.email}`}
          className="shrink-0 text-[14px] text-ink underline-offset-4 transition-colors hover:underline"
        >
          Send a mail ↗
        </a>
      </div>

      <section className="mx-auto mt-10 w-full max-w-[652px] px-5">
        <p className="text-[12px] text-body">Find me online</p>
        <div className="mt-3">
          <LinkList links={SOCIAL_LINKS} />
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[652px] px-5">
        <h2 className="text-[12px] text-body">Or send a note</h2>
        <ContactForm />
      </section>
    </main>
  );
}
