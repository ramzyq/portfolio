"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input
          className="field"
          {...register("name", { required: "Please enter your name." })}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          className="field"
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
        className="inline-flex rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send a note"}
      </button>
      {status ? <p className="text-[13px] text-body">{status}</p> : null}
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
      <span className="mb-1.5 block text-[12px] text-body">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-[12px] text-red-500">{error}</span> : null}
    </label>
  );
}
