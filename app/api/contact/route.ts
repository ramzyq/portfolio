import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isNonEmptyString(value: unknown, min = 1, max = 5000): value is string {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = payload;

  if (
    !isNonEmptyString(name, 2, 120) ||
    !isValidEmail(email) ||
    !isNonEmptyString(subject, 2, 160) ||
    !isNonEmptyString(message, 20, 5000)
  ) {
    return NextResponse.json(
      { error: "Please fill in every field correctly." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          "Email service is not configured. Set RESEND_API_KEY and TO_EMAIL in the environment.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeSubject = escapeHtml(subject.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email.trim(),
      subject: `[Portfolio] ${subject.trim()}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; color:#0a0a0b;">
          <h2 style="margin:0 0 16px;">New portfolio message</h2>
          <p style="margin:0 0 8px;"><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
          <p style="margin:0 0 16px;"><strong>Subject:</strong> ${safeSubject}</p>
          <div style="padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc;">
            ${safeMessage}
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}
