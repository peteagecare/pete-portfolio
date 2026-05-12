"use client";

import { useState } from "react";

const OPPORTUNITY_OPTIONS = [
  { value: "full-time", label: "Full-time role" },
  { value: "freelance", label: "Freelance project" },
  { value: "collab", label: "Collaboration" },
  { value: "other", label: "Other" },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      opportunity: String(fd.get("opportunity") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong.");
      }
      setStatus("sent");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-[var(--color-line)] py-12 px-8 text-center">
        <p className="font-serif italic text-2xl mb-2">Thanks — got it.</p>
        <p className="text-[var(--color-ink-soft)]">
          I&apos;ll get back to you within a couple of working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <Field label="Name" htmlFor="name">
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className={inputCls}
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputCls}
        />
      </Field>

      <Field label="Type of opportunity" htmlFor="opportunity">
        <select
          id="opportunity"
          name="opportunity"
          defaultValue=""
          required
          className={`${inputCls} appearance-none pr-10 cursor-pointer`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {OPPORTUNITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`${inputCls} resize-y`}
        />
      </Field>

      {errorMessage ? (
        <p className="text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start mt-2 inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-ink)] text-[var(--color-bg)] text-[0.7rem] tracking-[0.22em] uppercase hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-[var(--color-line)] focus:border-[var(--color-ink)] outline-none py-3 text-base text-[var(--color-ink)] transition-colors";
