// components/public/EnquiryForm.tsx — client component. Posts to /api/enquiries
// (docs/API.md §2) and shows a success/error state. Used on product detail and
// contact pages.

"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";

type Props = {
  productId?: number;
  productName?: string;
};

type FormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message: string;
};

const emptyForm: FormState = { customerName: "", customerPhone: "", customerEmail: "", message: "" };

export default function EnquiryForm({ productId, productName }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      await apiFetch("/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          customerEmail: form.customerEmail || null,
          productId: productId ?? null,
        }),
      });
      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-brand-success/30 bg-brand-success/10 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-success text-text-on-primary">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="mt-3 text-lg font-semibold text-brand-success">Enquiry sent</p>
        <p className="mt-1 text-sm text-text-secondary">
          Thanks for reaching out{productName ? ` about "${productName}"` : ""}. We'll contact you
          within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {productName ? (
        <div className="rounded-lg bg-brand-cream-dark px-4 py-3 text-sm text-text-secondary">
          Enquiring about: <span className="font-semibold text-text-primary">{productName}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-text-primary">
          Your name *
        </label>
        <input
          id="customerName"
          type="text"
          required
          value={form.customerName}
          onChange={update("customerName")}
          placeholder="e.g. Ramesh Kumar"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="mb-1 block text-sm font-medium text-text-primary">
          Phone number *
        </label>
        <input
          id="customerPhone"
          type="tel"
          required
          value={form.customerPhone}
          onChange={update("customerPhone")}
          placeholder="e.g. +91 98765 43210"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="customerEmail" className="mb-1 block text-sm font-medium text-text-primary">
          Email <span className="text-text-secondary">(optional)</span>
        </label>
        <input
          id="customerEmail"
          type="email"
          value={form.customerEmail}
          onChange={update("customerEmail")}
          placeholder="you@example.com"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-text-primary">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us what you're looking for — size, wood type, budget…"
          className="field w-full"
        />
      </div>

      {status === "error" ? (
        <p className="rounded-md bg-brand-error/10 px-3 py-2 text-sm text-brand-error">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}