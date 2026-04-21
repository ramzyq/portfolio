"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { OWNER, SOCIAL_LINKS } from "@/data";
import { cn } from "@/lib/utils";
import { XIcon } from "./icons/XIcon";
import { SectionHeading } from "./SectionHeading";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ToastState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setToast({
          type: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setToast({
        type: "success",
        message: "Message sent. I'll get back to you soon.",
      });
      reset();
    } catch {
      setToast({
        type: "error",
        message: "Network error. Please try again in a moment.",
      });
    }
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container-px mx-auto max-w-content">
        <div id="contact-heading" className="sr-only">
          Contact
        </div>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something."
              description="I'm always open to interesting projects, collaborations, or just a good conversation about tech."
            />

            <div className="mt-10 space-y-4">
              <ContactDetail
                icon={Mail}
                label="Email"
                value={OWNER.email}
                href={`mailto:${OWNER.email}`}
              />
              <ContactDetail
                icon={Github}
                label="GitHub"
                value={stripProtocol(getSocialHref("GitHub"))}
                href={getSocialHref("GitHub")}
                external
              />
              <ContactDetail
                icon={Linkedin}
                label="LinkedIn"
                value={stripProtocol(getSocialHref("LinkedIn"))}
                href={getSocialHref("LinkedIn")}
                external
              />
              <ContactDetail
                icon={XIcon}
                label="X"
                value={stripProtocol(getSocialHref("X"))}
                href={getSocialHref("X")}
                external
              />
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="card space-y-5 p-7 md:p-8"
            aria-label="Contact form"
          >
            <FormField
              id="name"
              label="Name"
              error={errors.name?.message}
            >
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                className={inputClasses(Boolean(errors.name))}
                {...register("name", {
                  required: "Please enter your name.",
                  minLength: { value: 2, message: "Name is too short." },
                  maxLength: { value: 120, message: "Name is too long." },
                })}
              />
            </FormField>

            <FormField
              id="email"
              label="Email"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className={inputClasses(Boolean(errors.email))}
                {...register("email", {
                  required: "Please enter your email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />
            </FormField>

            <FormField
              id="subject"
              label="Subject"
              error={errors.subject?.message}
            >
              <input
                id="subject"
                type="text"
                placeholder="What's this about?"
                aria-invalid={Boolean(errors.subject)}
                className={inputClasses(Boolean(errors.subject))}
                {...register("subject", {
                  required: "Please enter a subject.",
                  minLength: { value: 2, message: "Subject is too short." },
                  maxLength: { value: 160, message: "Subject is too long." },
                })}
              />
            </FormField>

            <FormField
              id="message"
              label="Message"
              error={errors.message?.message}
            >
              <textarea
                id="message"
                rows={5}
                placeholder="Tell me a little about what you have in mind…"
                aria-invalid={Boolean(errors.message)}
                className={cn(inputClasses(Boolean(errors.message)), "resize-y")}
                {...register("message", {
                  required: "Please write a message.",
                  minLength: {
                    value: 20,
                    message: "Your message should be at least 20 characters.",
                  },
                  maxLength: { value: 5000, message: "That's a long one — trim it a bit." },
                })}
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>Send message</>
              )}
            </button>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-live="polite"
            className={cn(
              "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border px-5 py-3 text-sm shadow-lg backdrop-blur",
              toast.type === "success"
                ? "border-teal/40 bg-teal/10 text-teal-500"
                : "border-red-500/40 bg-red-500/10 text-red-500"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-accent"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          {label}
        </p>
        <p className="text-sm font-medium text-[var(--foreground)]">{value}</p>
      </div>
    </Link>
  );
}

function getSocialHref(label: string) {
  return SOCIAL_LINKS.find((s) => s.label === label)?.href ?? "#";
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[var(--background)]",
    hasError
      ? "border-red-500/60 focus:border-red-500"
      : "border-[var(--border)] focus:border-accent"
  );
}
