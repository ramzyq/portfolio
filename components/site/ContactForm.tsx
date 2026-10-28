"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(data.error ?? "Something went wrong. Try email instead.");
        return;
      }
      setStatus("Message sent. I’ll get back to you soon.");
      reset();
    } catch {
      setStatus("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input
          className="field"
          autoComplete="name"
          {...register("name", { required: "Please enter your name." })}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          className="field"
          autoComplete="email"
          {...register("email", {
            required: "Please enter your email.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email.",
            },
          })}
        />
      </Field>
      <Field label="Subject" error={errors.subject?.message}>
        <input
          className="field"
          autoComplete="off"
          {...register("subject", { required: "Please enter a subject." })}
        />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          rows={5}
          className="field resize-y"
          {...register("message", {
            required: "Please write a message.",
            minLength: { value: 20, message: "A little more detail helps." },
          })}
        />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-base font-semibold text-background transition-[transform,background-color,box-shadow] duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <span>{isSubmitting ? "Sending…" : "Send a note"}</span>
        {isSubmitting ? (
          <span
            aria-hidden="true"
            className="form-spinner h-4 w-4 rounded-full border-2 border-background/35 border-t-background"
          />
        ) : (
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </button>
      {status ? (
        <p
          key={status}
          role="status"
          aria-live="polite"
          className={cn(
            "status-pop text-sm",
            status.startsWith("Message sent")
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-body"
          )}
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-body">{label}</span>
      {children}
      {error ? (
        <span
          role="alert"
          className="field-error mt-1 block text-xs text-red-500"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
