"use client";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { contactSchema } from "@/lib/validation/contact";

type Status = "idle" | "sending" | "success" | "error" | "fallback";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const fieldClass =
  "mt-1 block w-full rounded-md border-2 border-moss/60 bg-cream px-3 py-2.5 text-base text-ink focus:border-forest";

export function ContactForm() {
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });

  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Hello from ${values.name || "your portfolio"}`)}&body=${encodeURIComponent(values.message)}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ ...values, startedAt });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], email: f.email?.[0], message: f.message?.[0] });
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "", website: "" });
      } else if (res.status === 503) {
        setStatus("fallback"); // email service not configured
      } else {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setServerMessage(body.message ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setServerMessage("I couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg border-2 border-forest bg-cream p-6">
        <p className="font-serif text-2xl text-forest">Thank you!</p>
        <p className="mt-2">Your message is on its way. I&apos;ll write back soon.</p>
      </div>
    );
  }

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border-2 border-moss/50 bg-cream/80 p-6">
      <div>
        <label htmlFor="cf-name" className="font-medium text-forest">Your name</label>
        <input id="cf-name" name="name" autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} className={fieldClass} />
        {errors.name && <p id="cf-name-err" className="mt-1 text-sm text-midnight underline decoration-rose">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="cf-email" className="font-medium text-forest">Your email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} className={fieldClass} />
        {errors.email && <p id="cf-email-err" className="mt-1 text-sm text-midnight underline decoration-rose">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="cf-message" className="font-medium text-forest">Message</label>
        <textarea id="cf-message" name="message" rows={5} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-err" : undefined} className={fieldClass} />
        {errors.message && <p id="cf-message-err" className="mt-1 text-sm text-midnight underline decoration-rose">{errors.message}</p>}
      </div>

      {/* Honeypot: invisible to people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="cf-website">Leave this empty</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      {status === "error" && <p role="alert" className="rounded bg-paper p-3 text-midnight">{serverMessage}</p>}
      {status === "fallback" && (
        <p role="alert" className="rounded bg-paper p-3 text-midnight">
          The contact form isn&apos;t connected to an email service yet, so nothing was sent.{" "}
          <a href={mailto} className="font-semibold underline">Open your email app instead</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-12 rounded-full border-2 border-forest bg-forest px-7 text-base font-semibold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
